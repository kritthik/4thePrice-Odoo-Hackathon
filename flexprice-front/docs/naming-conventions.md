# FlexPrice Frontend Naming Conventions

This document outlines the naming conventions for the FlexPrice frontend codebase. Following these conventions ensures consistency, predictability, and maintainability across the project.

## Function Naming Patterns

### 1. Formatter Functions

Format functions transform data for display purposes.

```typescript
formatDateToDisplay(); // Date to human-readable format
formatBillingPeriodToText(); // Billing period enum to display text
formatAmountToCurrency(); // Number to currency string
formatStatusToChip(); // Status to UI chip text
```

### 2. Getter Functions

Getter functions retrieve or compute values.

```typescript
getCurrencySymbol(); // Get currency symbol from code
getUserPreferences(); // Get user preferences
getFeatureConfig(); // Get feature configuration
```

### 3. Parser Functions

Parser functions transform data between different formats.

```typescript
parseStringToDate(); // String to Date object
parseAmountToNumber(); // String amount to number
parseQueryToFilters(); // URL query to filter object
```

### 4. Converter Functions

Converter functions transform values between different units or formats.

```typescript
convertCentsToDollars(); // Convert cents to dollars
convertDailyToMonthly(); // Convert daily rate to monthly
convertBytesToSize(); // Convert bytes to human-readable size
```

### 5. Validator Functions

Validator functions check if data meets specific criteria.

```typescript
validateEmail(); // Check if email is valid
validatePhoneNumber(); // Check if phone number is valid
validatePassword(); // Check if password meets requirements
```

### 6. Check Functions

Check functions return boolean based on conditions.

```typescript
isValidDate(); // Check if date is valid
hasPermission(); // Check if user has permission
isFeatureEnabled(); // Check if feature is enabled
```

### 7. Calculator Functions

Calculator functions compute values.

```typescript
calculateTotalPrice(); // Calculate total price
calculateDiscountedAmount(); // Calculate discounted amount
calculateUsageMetrics(); // Calculate usage metrics
```

### 8. Normalizer Functions

Normalizer functions standardize data structures.

```typescript
normalizePlanData(); // Normalize plan data
normalizeUserInput(); // Normalize user input
normalizeApiResponse(); // Normalize API response
```

## Type and Interface Naming

### 1. Base Types and Interfaces

```typescript
interface BaseEntity {
	// Base interface for all entities
	id: string;
	status: EntityStatus;
	created_at: string;
	updated_at: string;
}

interface BaseResponse {
	// Base interface for API responses
	data: unknown;
	metadata: ResponseMetadata;
}
```

### 2. Entity Types

```typescript
interface Feature extends BaseEntity {
	name: string;
	description: string;
}

interface Plan extends BaseEntity {
	name: string;
	features: Feature[];
}
```

### 3. Request/Response Types

```typescript
interface CreateFeatureRequest {
	name: string;
	type: FeatureType;
}

interface FeatureResponse extends BaseResponse {
	data: Feature;
}
```

### 4. Props Types

```typescript
interface FeatureCardProps {
	feature: Feature;
	onEdit?: (id: string) => void;
}

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}
```

## Enum Naming

### 1. Status Enums

```typescript
export enum EntityStatus {
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
	ARCHIVED = 'ARCHIVED',
	DELETED = 'DELETED',
}

export const ENTITY_STATUS_DISPLAY = {
	[EntityStatus.ACTIVE]: 'Active',
	[EntityStatus.INACTIVE]: 'Inactive',
	[EntityStatus.ARCHIVED]: 'Archived',
	[EntityStatus.DELETED]: 'Deleted',
} as const;
```

### 2. Feature-specific Enums

```typescript
export enum BillingPeriod {
	DAILY = 'DAILY',
	WEEKLY = 'WEEKLY',
	MONTHLY = 'MONTHLY',
	QUARTERLY = 'QUARTERLY',
	ANNUAL = 'ANNUAL',
}

export enum FeatureType {
	METERED = 'METERED',
	STATIC = 'STATIC',
	BOOLEAN = 'BOOLEAN',
}
```

## Constants Naming

### 1. API Constants

```typescript
export const API_ENDPOINTS = {
	USERS: '/api/users',
	FEATURES: '/api/features',
	BILLING: '/api/billing',
} as const;

export const API_METHODS = {
	GET: 'GET',
	POST: 'POST',
	PUT: 'PUT',
	DELETE: 'DELETE',
} as const;
```

### 2. Configuration Constants

```typescript
export const DEFAULT_CURRENCY = 'USD';
export const MAX_RETRY_ATTEMPTS = 3;
export const DEFAULT_PAGE_SIZE = 10;
```

### 3. UI Constants

```typescript
export const THEME = {
	COLORS: {
		PRIMARY: '#007AFF',
		SECONDARY: '#5856D6',
		SUCCESS: '#34C759',
	},
	SPACING: {
		SMALL: '8px',
		MEDIUM: '16px',
		LARGE: '24px',
	},
} as const;
```

## File Organization

### 1. Formatter Files

```
src/utils/formatters/
  ├── date-formatter.ts      # Date formatting functions
  ├── currency-formatter.ts  # Currency formatting functions
  ├── text-formatter.ts      # Text formatting functions
  └── status-formatter.ts    # Status formatting functions
```

### 2. Type Files

```
src/types/
  ├── common/
  │   ├── entity-types.ts    # Common entity types
  │   ├── api-types.ts       # API-related types
  │   └── ui-types.ts        # UI-related types
  └── features/
      ├── billing-types.ts   # Billing-specific types
      └── user-types.ts      # User-specific types
```

### 3. Constant Files

```
src/constants/
  ├── api-constants.ts       # API-related constants
  ├── ui-constants.ts        # UI-related constants
  └── business-constants.ts  # Business logic constants
```

## Best Practices

1. **Be Consistent**

   - Follow established patterns
   - Use similar naming across related functions
   - Keep similar structures for similar purposes

2. **Be Descriptive**

   - Use clear, meaningful names
   - Avoid abbreviations unless very common
   - Include purpose in the name

3. **Be Organized**

   - Group related functions together
   - Keep similar utilities in the same file
   - Use appropriate directory structure

4. **Be Typed**
   - Always use TypeScript types
   - Create interfaces for complex objects
   - Use enums for fixed values

Remember: These conventions are guidelines to help maintain consistency and clarity in the codebase. Use judgment when applying them and document any deviations when necessary.
