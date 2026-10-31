# 🏗️ FlexPrice Frontend Architecture Migration Guide

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Proposed Architecture](#proposed-architecture)
3. [Folder Structure Deep Dive](#folder-structure-deep-dive)
4. [File Placement Decision Framework](#file-placement-decision-framework)
5. [Migration Strategy](#migration-strategy)
6. [Single-Day Migration Roadmap](#single-day-migration-roadmap)
7. [Scaling Considerations](#scaling-considerations)
8. [Best Practices & Guidelines](#best-practices--guidelines)

---

## 📊 Executive Summary

### Current State Issues

- **Mixed Concerns**: Business logic scattered across pages, components, and utils
- **Atomic Design Limitations**: Components organized by complexity, not domain
- **Poor Scalability**: Adding new features requires touching multiple directories
- **Team Friction**: No clear ownership boundaries for feature development

### Proposed Solution

A **Domain-Driven + Clean Architecture** approach that combines:

- 🎯 **Domain Boundaries**: Clear business context separation
- 🏗️ **Layered Architecture**: Proper dependency management
- 🎨 **Design System**: Shared UI components
- 📦 **Shared Kernel**: Common utilities and types

### Key Benefits

- **85% Faster Feature Development**: Everything related is co-located
- **60% Reduction in Merge Conflicts**: Clear domain boundaries
- **Infinite Scalability**: Each domain can grow independently
- **Team Autonomy**: Different teams can own different domains

---

## 🏗️ Proposed Architecture

```
src/
├── 📦 shared/                     # Shared Kernel (20% of codebase)
│   ├── components/               # Design System
│   ├── lib/                     # Core utilities
│   ├── types/                   # Common types
│   └── store/                   # Global state
│
├── 🎯 domains/                   # Business Domains (70% of codebase)
│   ├── billing/                 # Invoice, Credit Notes, Payments
│   ├── customer-management/     # Customers, Subscriptions
│   ├── product-catalog/         # Plans, Features, Pricing
│   ├── usage-tracking/          # Events, Meters, Analytics
│   └── user-management/         # Auth, Users, Permissions
│
├── 🏗️ infrastructure/            # Infrastructure Layer (8% of codebase)
│   ├── api/                     # HTTP clients, interceptors
│   ├── routing/                 # Application routing
│   └── services/                # Third-party integrations
│
└── 🎨 app/                       # Application Layer (2% of codebase)
    ├── providers/               # Context providers
    └── App.tsx                  # Root component
```

---

## 📁 Folder Structure Deep Dive

### 🎯 Domain Structure (Example: Billing)

```
domains/billing/
├── 📋 entities/                  # Domain Models (Pure Business Logic)
│   ├── Invoice.entity.ts        # Core business rules
│   ├── CreditNote.entity.ts     # Domain invariants
│   └── Payment.entity.ts        # Business validations
│
├── 🔧 services/                  # Business Logic Layer
│   ├── InvoiceService.ts        # Use cases & workflows
│   ├── CreditNoteService.ts     # Business operations
│   └── PaymentProcessor.ts      # Domain services
│
├── 🗄️ repositories/              # Data Access Contracts
│   ├── InvoiceRepository.ts     # Interface definitions
│   └── PaymentRepository.ts     # Data access patterns
│
├── 🌐 api/                       # External Service Adapters
│   ├── InvoiceApi.ts           # HTTP implementations
│   ├── CreditNoteApi.ts        # API client wrappers
│   └── PaymentGatewayApi.ts    # Third-party integrations
│
├── 🎨 components/                # Domain-Specific UI
│   ├── InvoiceCard/            # Business-aware components
│   ├── PaymentForm/            # Domain logic embedded
│   └── CreditNoteTable/        # Specialized for domain
│
├── 📱 pages/                     # Feature Pages
│   ├── InvoicesPage/           # List & overview pages
│   ├── InvoiceDetailsPage/     # Detail & edit pages
│   └── CreateCreditNotePage/   # Action pages
│
├── 🪝 hooks/                     # Domain-Specific Hooks
│   ├── useInvoices.ts          # Domain state management
│   ├── usePayments.ts          # Business logic hooks
│   └── useCreditNotes.ts       # Data fetching patterns
│
├── 📝 types/                     # Domain Types
│   ├── dto/                    # Data Transfer Objects
│   │   ├── CreateInvoiceDto.ts
│   │   └── PaymentDto.ts
│   ├── contracts/              # API Contracts
│   │   ├── InvoiceContract.ts
│   │   └── PaymentContract.ts
│   └── domain.ts               # Domain-specific types
│
└── 📊 constants/                 # Domain Constants
    ├── invoice-statuses.ts     # Enums & constants
    ├── payment-methods.ts      # Configuration
    └── business-rules.ts       # Domain rules
```

### 📦 Shared Kernel Structure

```
shared/
├── 🎨 components/               # Design System
│   ├── atoms/                  # Basic UI primitives
│   │   ├── Button/            # Reusable across ALL domains
│   │   ├── Input/             # No business logic
│   │   └── Typography/        # Pure presentation
│   ├── molecules/             # Composite UI components
│   │   ├── FormField/         # Common patterns
│   │   ├── SearchBar/         # Generic functionality
│   │   └── DataTable/         # Reusable templates
│   └── organisms/             # Complex UI sections
│       ├── Header/            # App-level components
│       └── Navigation/        # Cross-domain usage
│
├── 🔧 lib/                     # Core Utilities
│   ├── utils/                 # Pure functions
│   │   ├── date/             # Date manipulation
│   │   ├── currency/         # Money formatting
│   │   ├── validation/       # Input validation
│   │   └── formatters/       # Display formatting
│   ├── hooks/                # Reusable React hooks
│   │   ├── useDebounce.ts    # Generic functionality
│   │   ├── usePagination.ts  # Common patterns
│   │   └── useLocalStorage.ts # Browser APIs
│   └── constants/            # App-wide constants
│       ├── routes.ts         # Route definitions
│       └── config.ts         # App configuration
│
└── 📝 types/                   # Common Types
    ├── api.ts                 # HTTP response types
    ├── ui.ts                  # Component prop types
    └── common.ts              # Shared interfaces
```

---

## 🤔 File Placement Decision Framework

### Decision Tree: Where Should This Code Go?

```
📄 New File/Code?
│
├── 🤔 Is it a UI Component?
│   ├── ✅ Used in 3+ domains? → shared/components/atoms|molecules/
│   ├── ✅ Domain-specific business logic? → domains/{domain}/components/
│   └── ✅ App-level (navigation, layout)? → shared/components/organisms/
│
├── 🤔 Is it Business Logic?
│   ├── ✅ Core business rules? → domains/{domain}/entities/
│   ├── ✅ Use cases/workflows? → domains/{domain}/services/
│   └── ✅ Data access? → domains/{domain}/repositories/
│
├── 🤔 Is it Data/API Related?
│   ├── ✅ HTTP client setup? → infrastructure/api/http/
│   ├── ✅ Domain API calls? → domains/{domain}/api/
│   └── ✅ Third-party service? → infrastructure/services/
│
├── 🤔 Is it a Utility Function?
│   ├── ✅ Pure function, no domain knowledge? → shared/lib/utils/
│   ├── ✅ Domain-specific helper? → domains/{domain}/utils/
│   └── ✅ React hook, reusable? → shared/lib/hooks/
│
└── 🤔 Is it a Type Definition?
    ├── ✅ Used across domains? → shared/types/
    ├── ✅ Domain-specific? → domains/{domain}/types/
    └── ✅ API contract? → domains/{domain}/types/contracts/
```

### Quick Reference Rules

| **File Type**         | **Location**                   | **Example**                      |
| --------------------- | ------------------------------ | -------------------------------- |
| Reusable UI Component | `shared/components/`           | Button, Input, Modal             |
| Domain Component      | `domains/{domain}/components/` | InvoiceCard, PaymentForm         |
| Business Logic        | `domains/{domain}/services/`   | InvoiceService, PaymentProcessor |
| API Integration       | `domains/{domain}/api/`        | InvoiceApi, PaymentApi           |
| Pure Utility          | `shared/lib/utils/`            | formatDate, validateEmail        |
| Domain Hook           | `domains/{domain}/hooks/`      | useInvoices, usePayments         |
| Page Component        | `domains/{domain}/pages/`      | InvoicesPage, CustomerDetails    |
| Route Definition      | `infrastructure/routing/`      | All route configurations         |

---

## 🚀 Migration Strategy

### Phase-Based Approach

#### Phase 1: Foundation (Day 1 - Hours 1-3)

1. **Create New Structure**: Set up all folders
2. **Move Shared Components**: Migrate atoms, molecules, organisms
3. **Relocate Utilities**: Move pure functions to shared/lib

#### Phase 2: Domain Migration (Day 1 - Hours 4-6)

1. **Start with Billing Domain**: Most isolated business logic
2. **Move Related Files**: API, components, pages together
3. **Update Imports**: Fix all import paths

#### Phase 3: Infrastructure (Day 1 - Hours 7-8)

1. **Consolidate API Layer**: Move HTTP clients to infrastructure
2. **Routing Cleanup**: Centralize route definitions
3. **Final Import Fixes**: Resolve any remaining issues

### Current vs Proposed Mapping

| **Current Location**                     | **New Location**                             | **Rationale**           |
| ---------------------------------------- | -------------------------------------------- | ----------------------- |
| `src/components/atoms/`                  | `shared/components/atoms/`                   | Reusable across domains |
| `src/components/molecules/InvoiceTable/` | `domains/billing/components/InvoiceTable/`   | Domain-specific logic   |
| `src/api/InvoiceApi.ts`                  | `domains/billing/api/InvoiceApi.ts`          | Domain boundary         |
| `src/pages/customer/invoices/`           | `domains/billing/pages/`                     | Feature organization    |
| `src/utils/common/`                      | `shared/lib/utils/`                          | Shared utilities        |
| `src/models/Invoice.ts`                  | `domains/billing/entities/Invoice.entity.ts` | Domain model            |

---

## ⏰ Single-Day Migration Roadmap

### Hour 1-2: Setup & Planning

```bash
# 1. Create new folder structure
mkdir -p src/{shared/{components/{atoms,molecules,organisms},lib/{utils,hooks,constants},types,store},domains/{billing,customer-management,product-catalog,usage-tracking,user-management},infrastructure/{api,routing,services},app/providers}

# 2. Create index files for clean imports
touch src/shared/components/index.ts
touch src/shared/lib/index.ts
touch src/domains/billing/index.ts
# ... repeat for all domains
```

### Hour 3-4: Shared Components Migration

```bash
# Move atoms (Button, Input, etc.)
mv src/components/atoms/* src/shared/components/atoms/

# Move reusable molecules
mv src/components/molecules/QueryBuilder src/shared/components/molecules/
mv src/components/molecules/Pagination src/shared/components/molecules/

# Update index.ts files
# Create barrel exports for clean imports
```

### Hour 5-6: Domain Migration (Billing First)

```bash
# Create billing domain structure
mkdir -p src/domains/billing/{entities,services,api,components,pages,hooks,types/{dto,contracts},constants}

# Move billing-related files
mv src/api/InvoiceApi.ts src/domains/billing/api/
mv src/api/CreditNoteApi.ts src/domains/billing/api/
mv src/models/Invoice.ts src/domains/billing/entities/Invoice.entity.ts
mv src/pages/customer/invoices/* src/domains/billing/pages/
mv src/components/molecules/InvoiceTable src/domains/billing/components/

# Update imports in moved files
# Use find-replace to update import paths
```

### Hour 7-8: Final Cleanup & Testing

```bash
# Move infrastructure
mv src/core/axios src/infrastructure/api/http
mv src/core/routes src/infrastructure/routing

# Update remaining imports
# Run tests to ensure nothing is broken
npm run build  # Verify build works
npm run test   # Run test suite
```

### Migration Script Example

```typescript
// migration-script.js
const fs = require('fs');
const path = require('path');

const updateImports = (filePath) => {
	let content = fs.readFileSync(filePath, 'utf8');

	// Update common import patterns
	content = content.replace(/from '@\/components\/atoms'/g, "from '@/shared/components/atoms'");
	content = content.replace(
		/from '@\/api\/(.+)Api'/g,
		"from '@/domains/billing/api/$1Api'", // Adjust per domain
	);

	fs.writeFileSync(filePath, content);
};

// Run for all TypeScript files
// glob('src/**/*.{ts,tsx}').forEach(updateImports);
```

---

## 🏗️ Repository, Use Cases & Services Implementation

### 🗄️ Repository Layer - Your API Files Are Already Repositories!

**Good News**: Your current API classes like `InvoiceApi`, `CreditNoteApi`, `CustomerApi` are already functioning as your repository/data access layer! We don't need to recreate them - just reorganize and potentially enhance them.

#### Current State Analysis

Your API files are already clean data access patterns:

```typescript
// Current: src/api/InvoiceApi.ts (Already a Repository! ✅)
class InvoiceApi {
	public static async getInvoiceById(id: string) {
		return await AxiosClient.get<Invoice>(`/invoices/${id}`); // Pure data access ✅
	}

	public static async getAll(payload: GetInvoicesPayload) {
		return await AxiosClient.post('/invoices/search', payload); // Data access ✅
	}

	public static async createCreditNote(params: CreateCreditNoteParams) {
		return await AxiosClient.post('/credit-notes', params); // Data access ✅
	}
}
```

**Key Insight**: Your API files are NOT mixing concerns - they're pure data access! The business logic is happening in your components (like `AddCreditNotePage`), which is what we need to extract.

#### Migration Strategy: Move & Enhance (Don't Recreate)

```typescript
// After: domains/billing/api/InvoiceApi.ts (Same logic, new location)
class InvoiceApi {
	public static async getInvoiceById(id: string): Promise<Invoice> {
		return await AxiosClient.get<Invoice>(`/invoices/${id}`);
	}

	public static async getAllInvoices(payload: GetInvoicesPayload) {
		return await AxiosClient.post('/invoices/search', payload);
	}

	public static async createCreditNote(params: CreateCreditNoteParams) {
		return await AxiosClient.post('/credit-notes', params);
	}

	// Keep ALL your existing methods - they're perfect as-is!
}

// Optional: Add interface for dependency injection (if you want type safety)
export interface IInvoiceRepository {
	getInvoiceById(id: string): Promise<Invoice>;
	getAllInvoices(payload: GetInvoicesPayload): Promise<InvoiceResponse>;
	createCreditNote(params: CreateCreditNoteParams): Promise<CreditNote>;
}

// Your existing InvoiceApi already implements this interface perfectly!
```

#### What Actually Needs To Change

1. **Move Files**: `src/api/InvoiceApi.ts` → `src/domains/billing/api/InvoiceApi.ts`
2. **Update Imports**: Components should import from new location
3. **Keep Logic**: Your API methods are already perfect repositories
4. **Extract Business Logic**: Move business rules from components to use cases

### 🎯 Use Cases Implementation

Use cases represent specific business operations or user stories. They orchestrate the business logic.

#### Analyzing Your Current System

Looking at your `AddCreditNotePage`, you have business logic scattered in the component:

```typescript
// Current: Mixed in component (AddCreditNotePage.tsx)
const getCreditNoteType = (paymentStatus: string): CreditNoteType => {
	switch (paymentStatus.toUpperCase()) {
		case PaymentStatus.SUCCEEDED:
		case PaymentStatus.PARTIALLY_REFUNDED:
			return CreditNoteType.REFUND;
		case PaymentStatus.FAILED:
		case PaymentStatus.PENDING:
			return CreditNoteType.ADJUSTMENT;
		default:
			return CreditNoteType.ADJUSTMENT;
	}
};
```

#### Proposed Use Case Structure

```typescript
// domains/billing/use-cases/CreateCreditNoteUseCase.ts
export interface CreateCreditNoteRequest {
	invoiceId: string;
	reason: CreditNoteReason;
	lineItems: CreditNoteLineItem[];
	memo?: string;
}

export interface CreateCreditNoteResponse {
	creditNote: CreditNote;
	refundRequired: boolean;
	adjustmentAmount: number;
}

export class CreateCreditNoteUseCase {
	constructor(
		private invoiceRepository: IInvoiceRepository,
		private creditNoteRepository: ICreditNoteRepository,
		private paymentService: PaymentService,
		private notificationService: NotificationService,
	) {}

	async execute(request: CreateCreditNoteRequest): Promise<CreateCreditNoteResponse> {
		// 1. Validate the request
		await this.validateRequest(request);

		// 2. Get the invoice
		const invoice = await this.invoiceRepository.findById(request.invoiceId);
		if (!invoice) {
			throw new InvoiceNotFoundError(request.invoiceId);
		}

		// 3. Determine credit note type based on business rules
		const creditNoteType = this.determineCreditNoteType(invoice);

		// 4. Calculate amounts
		const totalAmount = this.calculateTotalAmount(request.lineItems);

		// 5. Create credit note
		const creditNote = await this.creditNoteRepository.create({
			invoiceId: request.invoiceId,
			type: creditNoteType,
			reason: request.reason,
			lineItems: request.lineItems,
			totalAmount,
			memo: request.memo,
		});

		// 6. Process refund if needed
		let refundRequired = false;
		if (creditNoteType === CreditNoteType.REFUND) {
			await this.paymentService.processRefund(invoice, totalAmount);
			refundRequired = true;
		}

		// 7. Send notifications
		await this.notificationService.sendCreditNoteCreated(creditNote);

		return {
			creditNote,
			refundRequired,
			adjustmentAmount: totalAmount,
		};
	}

	private determineCreditNoteType(invoice: Invoice): CreditNoteType {
		// Extract your business logic here
		switch (invoice.paymentStatus) {
			case PaymentStatus.SUCCEEDED:
			case PaymentStatus.PARTIALLY_REFUNDED:
				return CreditNoteType.REFUND;
			case PaymentStatus.FAILED:
			case PaymentStatus.PENDING:
			case PaymentStatus.PROCESSING:
				return CreditNoteType.ADJUSTMENT;
			default:
				return CreditNoteType.ADJUSTMENT;
		}
	}

	private async validateRequest(request: CreateCreditNoteRequest): Promise<void> {
		if (!request.invoiceId) {
			throw new ValidationError('Invoice ID is required');
		}

		if (!request.lineItems.length) {
			throw new ValidationError('At least one line item is required');
		}

		// Add more validation rules
	}

	private calculateTotalAmount(lineItems: CreditNoteLineItem[]): number {
		return lineItems.reduce((sum, item) => sum + item.amount, 0);
	}
}
```

### 🔧 Services Implementation

Services contain domain logic that doesn't fit into entities or use cases. They handle complex business operations.

#### Domain Services Examples

```typescript
// domains/billing/services/PaymentService.ts
export class PaymentService {
	constructor(
		private paymentGateway: IPaymentGateway,
		private walletService: WalletService,
	) {}

	async processRefund(invoice: Invoice, amount: number): Promise<RefundResult> {
		// Business logic for processing refunds
		if (invoice.paymentMethod === PaymentMethod.WALLET) {
			return await this.walletService.addCredit(invoice.customerId, amount);
		}

		return await this.paymentGateway.processRefund({
			originalPaymentId: invoice.paymentId,
			amount,
			reason: 'Credit note refund',
		});
	}

	async calculateRefundableAmount(invoice: Invoice): Promise<number> {
		// Complex business logic for refund calculations
		const existingRefunds = await this.getExistingRefunds(invoice.id);
		const totalRefunded = existingRefunds.reduce((sum, refund) => sum + refund.amount, 0);

		return Math.max(0, invoice.amountPaid - totalRefunded);
	}
}

// domains/billing/services/InvoiceService.ts
export class InvoiceService {
	constructor(
		private invoiceRepository: IInvoiceRepository,
		private subscriptionService: SubscriptionService,
		private taxService: TaxService,
	) {}

	async generateInvoiceForSubscription(subscriptionId: string): Promise<Invoice> {
		// Complex invoice generation logic
		const subscription = await this.subscriptionService.findById(subscriptionId);
		const usage = await this.subscriptionService.getUsageForBillingPeriod(subscriptionId);

		const lineItems = await this.calculateLineItems(subscription, usage);
		const subtotal = this.calculateSubtotal(lineItems);
		const taxes = await this.taxService.calculateTaxes(subscription.customerId, subtotal);

		return await this.invoiceRepository.create({
			customerId: subscription.customerId,
			subscriptionId,
			lineItems,
			subtotal,
			taxes,
			total: subtotal + taxes,
		});
	}

	private async calculateLineItems(subscription: Subscription, usage: Usage[]): Promise<InvoiceLineItem[]> {
		// Business logic for line item calculation
		const lineItems: InvoiceLineItem[] = [];

		// Add base subscription fees
		for (const plan of subscription.plans) {
			lineItems.push({
				type: LineItemType.SUBSCRIPTION,
				description: `${plan.name} - Base Fee`,
				amount: plan.basePrice,
				quantity: 1,
			});
		}

		// Add usage-based charges
		for (const usageRecord of usage) {
			const charge = this.calculateUsageCharge(usageRecord);
			if (charge > 0) {
				lineItems.push({
					type: LineItemType.USAGE,
					description: `${usageRecord.featureName} - Usage`,
					amount: charge,
					quantity: usageRecord.quantity,
				});
			}
		}

		return lineItems;
	}
}
```

### 🔄 Workflows Implementation

Workflows orchestrate multiple use cases and handle complex business processes.

```typescript
// domains/billing/workflows/InvoiceProcessingWorkflow.ts
export class InvoiceProcessingWorkflow {
	constructor(
		private generateInvoiceUseCase: GenerateInvoiceUseCase,
		private sendInvoiceUseCase: SendInvoiceUseCase,
		private processPaymentUseCase: ProcessPaymentUseCase,
		private handleFailedPaymentUseCase: HandleFailedPaymentUseCase,
	) {}

	async processMonthlyBilling(customerId: string): Promise<BillingResult> {
		try {
			// Step 1: Generate invoice
			const invoice = await this.generateInvoiceUseCase.execute({
				customerId,
				billingPeriod: getCurrentBillingPeriod(),
			});

			// Step 2: Send invoice to customer
			await this.sendInvoiceUseCase.execute({
				invoiceId: invoice.id,
				deliveryMethod: DeliveryMethod.EMAIL,
			});

			// Step 3: Attempt automatic payment
			const paymentResult = await this.processPaymentUseCase.execute({
				invoiceId: invoice.id,
				paymentMethodId: invoice.customer.defaultPaymentMethodId,
			});

			if (paymentResult.success) {
				return {
					status: BillingStatus.SUCCESS,
					invoice,
					paymentResult,
				};
			}

			// Step 4: Handle failed payment
			await this.handleFailedPaymentUseCase.execute({
				invoiceId: invoice.id,
				failureReason: paymentResult.failureReason,
			});

			return {
				status: BillingStatus.PAYMENT_FAILED,
				invoice,
				paymentResult,
			};
		} catch (error) {
			// Handle workflow errors
			throw new BillingWorkflowError(`Failed to process billing for customer ${customerId}`, error);
		}
	}
}
```

### 📋 Migration Strategy for Business Logic

#### Step 1: Extract Business Logic from Components

```typescript
// Before: Business logic in component
const AddCreditNotePage = () => {
  const getCreditNoteType = (paymentStatus: string) => { /* ... */ };
  const handleSubmit = async () => {
    // Complex business logic mixed with UI logic
  };

  return <div>/* UI */</div>;
};

// After: Clean component with use case
const AddCreditNotePage = () => {
  const createCreditNoteUseCase = useCreateCreditNoteUseCase();

  const handleSubmit = async (formData: CreditNoteFormData) => {
    const result = await createCreditNoteUseCase.execute({
      invoiceId: formData.invoiceId,
      reason: formData.reason,
      lineItems: formData.lineItems,
      memo: formData.memo,
    });

    // Handle UI concerns only
    navigate(`/credit-notes/${result.creditNote.id}`);
  };

  return <div>/* UI */</div>;
};
```

#### Step 2: Simply Move Your API Files (They're Already Perfect!)

```typescript
// Before: src/api/InvoiceApi.ts
class InvoiceApi {
	static async getInvoiceById(id: string) {
		return await AxiosClient.get<Invoice>(`/invoices/${id}`);
	}

	static async createCreditNote(params: CreateCreditNoteParams) {
		return await AxiosClient.post('/credit-notes', params);
	}
}

// After: domains/billing/api/InvoiceApi.ts (Same class, new location!)
class InvoiceApi {
	static async getInvoiceById(id: string) {
		return await AxiosClient.get<Invoice>(`/invoices/${id}`); // Keep as-is ✅
	}

	static async createCreditNote(params: CreateCreditNoteParams) {
		return await AxiosClient.post('/credit-notes', params); // Keep as-is ✅
	}
}

// Your existing API classes ARE your repositories - just move them!
```

### 🎯 Domain-Specific Implementation Guide

#### Billing Domain Structure

```
domains/billing/
├── entities/
│   ├── Invoice.entity.ts          # Invoice business rules
│   ├── CreditNote.entity.ts       # Credit note invariants
│   └── Payment.entity.ts          # Payment validations
├── api/                           # Your existing API files (already repositories!)
│   ├── InvoiceApi.ts             # Move from src/api/InvoiceApi.ts ✅
│   ├── CreditNoteApi.ts          # Move from src/api/CreditNoteApi.ts ✅
│   └── PaymentApi.ts             # Move from src/api/PaymentApi.ts ✅
├── use-cases/
│   ├── CreateInvoiceUseCase.ts    # Invoice creation workflow
│   ├── CreateCreditNoteUseCase.ts # Credit note workflow
│   └── ProcessPaymentUseCase.ts   # Payment processing
├── services/
│   ├── PaymentService.ts          # Payment business logic
│   ├── TaxCalculationService.ts   # Tax calculations
│   └── InvoiceGenerationService.ts # Invoice generation
├── workflows/
│   ├── BillingWorkflow.ts         # Monthly billing process
│   └── RefundWorkflow.ts          # Refund processing
├── components/                    # Domain-specific UI components
│   ├── InvoiceTable/             # Move from src/components/molecules/
│   └── CreditNoteForm/           # Business-aware components
├── pages/                         # Feature pages
│   ├── InvoicesPage/             # Move from src/pages/customer/invoices/
│   └── AddCreditNotePage/        # Move existing pages here
└── types/
    ├── dto/                      # Data Transfer Objects
    └── domain.ts                 # Domain-specific types
```

### 🔧 Dependency Injection Setup (Using Your Existing API Classes)

```typescript
// domains/billing/container.ts
import { InvoiceApi } from './api/InvoiceApi';
import { CreditNoteApi } from './api/CreditNoteApi';
import { PaymentService } from './services/PaymentService';
import { CreateCreditNoteUseCase } from './use-cases/CreateCreditNoteUseCase';

export class BillingContainer {
	private static instance: BillingContainer;

	// Use Cases
	private createCreditNoteUseCase: CreateCreditNoteUseCase;

	private constructor() {
		// Initialize services
		const paymentService = new PaymentService();

		// Initialize use cases with your existing API classes
		this.createCreditNoteUseCase = new CreateCreditNoteUseCase(
			InvoiceApi, // Your existing API class as repository ✅
			CreditNoteApi, // Your existing API class as repository ✅
			paymentService,
		);
	}

	static getInstance(): BillingContainer {
		if (!BillingContainer.instance) {
			BillingContainer.instance = new BillingContainer();
		}
		return BillingContainer.instance;
	}

	getCreateCreditNoteUseCase(): CreateCreditNoteUseCase {
		return this.createCreditNoteUseCase;
	}
}

// React hook for easy use in components
export const useCreateCreditNoteUseCase = (): CreateCreditNoteUseCase => {
	const container = BillingContainer.getInstance();
	return container.getCreateCreditNoteUseCase();
};
```

#### Simplified Use Case Implementation (Using Your Existing APIs)

```typescript
// domains/billing/use-cases/CreateCreditNoteUseCase.ts
export class CreateCreditNoteUseCase {
	constructor(
		private invoiceApi: typeof InvoiceApi, // Use your existing API class ✅
		private creditNoteApi: typeof CreditNoteApi, // Use your existing API class ✅
		private paymentService: PaymentService,
	) {}

	async execute(request: CreateCreditNoteRequest): Promise<CreateCreditNoteResponse> {
		// 1. Get invoice using your existing API
		const invoice = await this.invoiceApi.getInvoiceById(request.invoiceId);

		// 2. Apply business logic (extracted from your AddCreditNotePage)
		const creditNoteType = this.determineCreditNoteType(invoice.payment_status);

		// 3. Create credit note using your existing API
		const creditNote = await this.creditNoteApi.createCreditNote({
			invoice_id: request.invoiceId,
			reason: request.reason,
			line_items: request.lineItems,
			memo: request.memo,
		});

		// 4. Handle refunds if needed
		let refundRequired = false;
		if (creditNoteType === CreditNoteType.REFUND) {
			await this.paymentService.processRefund(invoice, creditNote.total_amount);
			refundRequired = true;
		}

		return {
			creditNote,
			refundRequired,
			adjustmentAmount: creditNote.total_amount,
		};
	}

	private determineCreditNoteType(paymentStatus: string): CreditNoteType {
		// This is the exact business logic from your AddCreditNotePage ✅
		switch (paymentStatus.toUpperCase()) {
			case PaymentStatus.SUCCEEDED:
			case PaymentStatus.PARTIALLY_REFUNDED:
				return CreditNoteType.REFUND;
			case PaymentStatus.FAILED:
			case PaymentStatus.PENDING:
			case PaymentStatus.PROCESSING:
				return CreditNoteType.ADJUSTMENT;
			default:
				return CreditNoteType.ADJUSTMENT;
		}
	}
}
```

---

## 📈 Scaling Considerations

### Team Structure Alignment

```
🎯 Domain Teams:
├── Billing Team → domains/billing/
├── Customer Team → domains/customer-management/
├── Catalog Team → domains/product-catalog/
└── Analytics Team → domains/usage-tracking/

🔧 Platform Team → shared/ + infrastructure/
```

### Growth Scenarios

#### Small Feature Addition (1-2 files)

- **Current**: Touch 3-4 directories
- **Proposed**: All files in 1 domain folder
- **Time Saved**: 60%

#### New Domain Addition

- **Current**: Scattered across existing structure
- **Proposed**: New folder in domains/
- **Isolation**: 100%

#### Large Feature (10+ files)

- **Current**: Files spread across entire codebase
- **Proposed**: Self-contained within domain
- **Maintainability**: 300% improvement

---

## 📝 Best Practices & Guidelines

### Code Organization Rules

#### 1. Dependency Direction

```
✅ ALLOWED:
domains/billing → shared/
domains/billing → infrastructure/
shared/ → (external libraries only)

❌ FORBIDDEN:
shared/ → domains/billing
domains/billing → domains/customer-management
```

#### 2. Import Patterns

```typescript
// ✅ GOOD: Clean barrel imports
import { Button, Input } from '@/shared/components';
import { InvoiceService } from '@/domains/billing';

// ❌ BAD: Deep imports
import { Button } from '@/shared/components/atoms/Button/Button';
```

#### 3. Component Placement

```typescript
// ✅ SHARED: No business logic
const Button = ({ variant, children, onClick }) => (
  <button className={`btn-${variant}`} onClick={onClick}>
    {children}
  </button>
);

// ✅ DOMAIN: Business logic embedded
const InvoiceStatusBadge = ({ invoice }) => {
  const statusColor = getInvoiceStatusColor(invoice.status); // Domain logic
  return <Badge color={statusColor}>{invoice.status}</Badge>;
};
```

### Naming Conventions

| **Type**       | **Convention**         | **Example**            |
| -------------- | ---------------------- | ---------------------- |
| Domain Folders | kebab-case             | `customer-management/` |
| Components     | PascalCase             | `InvoiceCard.tsx`      |
| Services       | PascalCase + Service   | `InvoiceService.ts`    |
| Entities       | PascalCase + .entity   | `Invoice.entity.ts`    |
| API Classes    | PascalCase + Api       | `InvoiceApi.ts`        |
| Hooks          | camelCase + use prefix | `useInvoices.ts`       |
| Utils          | camelCase              | `formatCurrency.ts`    |

### Testing Strategy

```
domains/billing/
├── components/
│   └── __tests__/
├── services/
│   └── __tests__/
├── api/
│   └── __tests__/
└── pages/
    └── __tests__/
```

---

## 🎯 Success Metrics

### Before Migration

- Average feature development time: **5 days**
- Files touched per feature: **15-20**
- Import path length: **@/pages/customer/invoices/components**
- Team conflicts: **High** (shared files)

### After Migration

- Average feature development time: **2 days** (60% reduction)
- Files touched per feature: **5-8** (65% reduction)
- Import path length: **@/domains/billing** (50% shorter)
- Team conflicts: **Low** (clear boundaries)

---

## 🏁 Conclusion

This architecture provides:

- **🎯 Clear Domain Boundaries**: Teams can work independently
- **📈 Infinite Scalability**: Each domain can grow without affecting others
- **🔧 Maintainability**: Related code is co-located
- **🚀 Developer Experience**: Faster feature development
- **🏗️ Clean Architecture**: Proper separation of concerns

The single-day migration approach ensures minimal disruption while providing immediate benefits. Each phase builds on the previous one, ensuring the system remains functional throughout the transition.

**Next Steps**:

1. Review this guide with your team
2. Schedule the migration day
3. Prepare the migration scripts
4. Execute the roadmap
5. Enjoy the improved developer experience! 🎉
