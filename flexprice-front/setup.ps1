# Function to create .env file
function Create-EnvFile {
    @"
VITE_API_URL=https://api-dev.cloud.flexprice.io/v1
VITE_ENVIRONMENT=self-hosted
"@ | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "Created .env file with required configuration"
}

# Function to build and run Docker
function Docker-BuildAndRun {
    Write-Host "Building Docker image..."
    docker build -t flexprice-front .

    Write-Host "Running Docker container..."
    docker run -d -p 3000:3000 flexprice-front
}

# Main execution
Write-Host "Starting FlexPrice Frontend Setup..."

# Create .env file
Create-EnvFile

# Check if Docker is installed
if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "Docker is not installed. Please install Docker first."
    exit 1
}

# Build and run Docker
Docker-BuildAndRun

Write-Host "Setup completed! The application should be running at http://localhost:3000" 