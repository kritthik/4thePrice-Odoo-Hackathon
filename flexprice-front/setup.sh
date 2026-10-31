#!/bin/bash

# Exit on any error
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to log errors
log_error() {
    echo -e "${RED}❌ ERROR: $1${NC}" >&2
}

# Function to log success
log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Function to log warning
log_warning() {
    echo -e "${YELLOW}⚠️  WARNING: $1${NC}"
}

# Function to check if a port is in use
check_port() {
    local port=$1
    if command -v lsof &> /dev/null; then
        if lsof -i ":$port" &> /dev/null; then
            echo "$(lsof -i ":$port" | grep LISTEN)"
            return 1
        fi
    elif command -v netstat &> /dev/null; then
        if netstat -tuln | grep ":$port" &> /dev/null; then
            echo "$(netstat -tuln | grep ":$port")"
            return 1
        fi
    fi
    return 0
}

# Function to check Docker status
check_docker_status() {
    # Check if Docker daemon is running and responsive
    if ! docker info &> /dev/null; then
        log_error "Docker daemon is not running or not responding"
        log_error "Please ensure Docker is running with: 'docker info'"
        return 1
    fi

    # Check Docker version
    local docker_version=$(docker version --format '{{.Server.Version}}' 2>/dev/null)
    if [ $? -ne 0 ]; then
        log_error "Failed to get Docker version"
        return 1
    fi
    log_success "Docker version: $docker_version"

    # Check available disk space
    local available_space=$(df -h . | awk 'NR==2 {print $4}')
    if [[ $(df . | awk 'NR==2 {print $4}') -lt 1048576 ]]; then  # Less than 1GB
        log_warning "Low disk space available: $available_space. This might cause issues during build."
    fi

    return 0
}

# Function to check essential requirements
check_requirements() {
    echo "🔍 Checking system requirements..."

    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        log_error "Visit https://docs.docker.com/get-docker/ for installation instructions."
        return 1
    fi

    # Check Docker status
    if ! check_docker_status; then
        return 1
    fi

    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed. Please install Docker Compose first."
        log_error "Visit https://docs.docker.com/compose/install/ for installation instructions."
        return 1
    fi

    # Check Docker Compose version
    local compose_version=$(docker-compose version --short 2>/dev/null)
    if [ $? -ne 0 ]; then
        log_error "Failed to get Docker Compose version"
        return 1
    fi
    log_success "Docker Compose version: $compose_version"

    # Check if required files exist
    local required_files=("docker-compose.yml" "Dockerfile" "package.json")
    local missing_files=()
    
    for file in "${required_files[@]}"; do
        if [ ! -f "$file" ]; then
            missing_files+=("$file")
        fi
    done

    if [ ${#missing_files[@]} -ne 0 ]; then
        log_error "Missing required files:"
        for file in "${missing_files[@]}"; do
            log_error "  - $file"
        done
        return 1
    fi

    # Check required ports
    local required_ports=(3000)
    local ports_in_use=()
    
    for port in "${required_ports[@]}"; do
        if ! check_port "$port"; then
            ports_in_use+=("$port")
        fi
    done

    if [ ${#ports_in_use[@]} -ne 0 ]; then
        log_error "Required ports are in use:"
        for port in "${ports_in_use[@]}"; do
            log_error "  - Port $port is already in use"
            log_error "    $(check_port "$port")"
        done
        log_error "Please free up port 3000 and try again"
        return 1
    fi

    # Check memory availability
    if command -v free &> /dev/null; then
        # Linux systems
        local available_memory=$(free -m | awk 'NR==2 {print $7}')
        if [ "$available_memory" -lt 1024 ]; then  # Less than 1GB
            log_warning "Low memory available: ${available_memory}MB. This might affect performance."
        fi
    else
        # macOS systems
        local available_memory=$(vm_stat | awk '/Pages free/ {free=$3} /Pages inactive/ {inactive=$3} END {print (free+inactive)*4096/1048576}' | cut -d. -f1)
        if [ "$available_memory" -lt 1024 ]; then  # Less than 1GB
            log_warning "Low memory available: ${available_memory}MB. This might affect performance."
        fi
    fi

    # Warn if package-lock.json is missing
    if [ ! -f "package-lock.json" ]; then
        log_warning "package-lock.json not found. This might cause inconsistent builds."
    fi

    log_success "All system requirements checked successfully!"
    return 0
}

# Function to validate environment configuration
validate_env_config() {
    local env_file=".env"
    local required_vars=("VITE_API_URL" "VITE_ENVIRONMENT")
    local missing_vars=()

    if [ -f "$env_file" ]; then
        for var in "${required_vars[@]}"; do
            if ! grep -q "^${var}=" "$env_file"; then
                missing_vars+=("$var")
            fi
        done
    else
        log_error "Environment file (.env) not found"
        return 1
    fi

    if [ ${#missing_vars[@]} -ne 0 ]; then
        log_error "Missing required environment variables in .env:"
        for var in "${missing_vars[@]}"; do
            log_error "  - $var"
        done
        return 1
    fi

    # Validate API URL format
    local api_url=$(grep "^VITE_API_URL=" "$env_file" | cut -d '=' -f2)
    if ! [[ "$api_url" =~ ^https?:// ]]; then
        log_error "Invalid API URL format in .env: $api_url"
        log_error "API URL should start with http:// or https://"
        return 1
    fi

    return 0
}

# Function to create .env file if it doesn't exist
setup_env() {
    if [ ! -f .env ]; then
        echo "Creating .env file..."
        cat > .env << EOL
# API Configuration
VITE_API_URL=http://localhost:8088/v1
VITE_ENVIRONMENT=self-hosted


# No Supabase configuration needed in self-hosted mode
# If you need to use Supabase, uncomment and fill these:
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_key
EOL
        log_success "Created .env file"
    else
        # Check if VITE_ENVIRONMENT is set in existing .env
        if ! grep -q "VITE_ENVIRONMENT=" .env; then
            log_warning "Adding VITE_ENVIRONMENT=self-hosted to existing .env file"
            echo "VITE_ENVIRONMENT=self-hosted" >> .env
        fi
        log_success "Using existing .env file"
    fi

    # Validate environment configuration
    if ! validate_env_config; then
        return 1
    fi
}

# Function to clean up existing containers
cleanup() {
    echo "🧹 Cleaning up existing containers..."
    docker-compose down --remove-orphans &> /dev/null || true
    # Remove any existing container with the same name
    if docker ps -a | grep -q flexprice-front; then
        docker rm -f flexprice-front &> /dev/null || true
    fi
}

# Function to build and start services
start_services() {
    echo "🔨 Building and starting services..."
    
    # Clean up first
    cleanup

    # Check if docker-compose.yml exists and is valid
    if ! docker-compose config &> /dev/null; then
        log_error "Invalid docker-compose.yml configuration"
        docker-compose config
        return 1
    fi
    
    # Build services with detailed output
    echo "📦 Building Docker image..."
    if ! docker-compose build --no-cache --progress=plain app; then
        log_error "Failed to build service. Check the error messages above."
        echo "Common issues:"
        echo "1. Missing dependencies in package.json"
        echo "2. Network connectivity issues"
        echo "3. Insufficient disk space"
        echo "4. Invalid Dockerfile configuration"
        return 1
    fi
    log_success "Build completed successfully"
    
    # Start services
    echo "🚀 Starting services..."
    if ! docker-compose up -d; then
        log_error "Failed to start services"
        echo "Checking container status..."
        docker-compose ps
        echo "Checking container logs..."
        docker-compose logs
        return 1
    fi
    
    # Verify container is running
    if ! docker-compose ps | grep -q "Up"; then
        log_error "Container failed to start properly"
        docker-compose logs
        return 1
    fi
    
    log_success "Services started successfully"
    
    # Show container status
    echo "📊 Container Status:"
    docker-compose ps
}

# Function to verify the application is running
verify_app() {
    echo "🔍 Verifying application..."
    local max_attempts=15
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        echo "Checking application status (attempt $attempt/$max_attempts)..."
        if curl -s http://localhost:3000 &> /dev/null; then
            log_success "Application is running at http://localhost:3000"
            return 0
        fi
        sleep 2
        attempt=$((attempt + 1))
    done

    log_error "Application failed to start. Showing logs:"
    docker-compose logs
    return 1
}

# Trap cleanup on script exit
trap cleanup EXIT

# Main execution
echo "🚀 Starting FlexPrice Frontend Setup..."

# Check requirements first
check_requirements || {
    log_error "System requirements check failed. Please fix the above issues and try again."
    exit 1
}

# Setup and validate environment
setup_env || {
    log_error "Environment setup failed. Please fix the above issues and try again."
    exit 1
}

# Start services
start_services || {
    log_error "Failed to start services. Check the logs above for details."
    cleanup
    exit 1
}

# Verify application
verify_app || {
    log_error "Application verification failed. Try:"
    echo "1. Check logs: docker-compose logs"
    echo "2. Check containers: docker-compose ps"
    echo "3. Check container health: docker inspect flexprice-front"
    echo "4. Check port availability: lsof -i :3000"
    cleanup
    exit 1
}

log_success "Setup completed successfully! 🎉"
echo -e "
📝 ${GREEN}Quick Commands:${NC}
- View logs: docker-compose logs
- Stop services: docker-compose down
- Restart services: docker-compose restart
- Check container health: docker inspect flexprice-front
" 