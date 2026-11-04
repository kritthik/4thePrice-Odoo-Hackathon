# 4 The Price

**Flexible, developer-first billing infrastructure for modern SaaS and
AI-native products.**

4thePrice is a flexible pricing, usage metering, credits, and billing
platform designed to help SaaS teams manage how customers consume and
pay for their products. It supports subscription-based, usage-based,
credit-based, and hybrid pricing models through an open, composable
architecture.

> **Project status:** Update this section with the current development
> status, supported integrations, and deployment maturity of your
> 4thePrice implementation.

------------------------------------------------------------------------

## Table of Contents

-   [Overview](#overview)
-   [Why 4thePrice?](#why-4theprice)
-   [Core Features](#core-features)
-   [How It Works](#how-it-works)
-   [Supported Pricing Models](#supported-pricing-models)
-   [Architecture](#architecture)
-   [Technology Requirements](#technology-requirements)
-   [Getting Started](#getting-started)
-   [Configuration](#configuration)
-   [Useful Development Commands](#useful-development-commands)
-   [Integrations](#integrations)
-   [Contributing](#contributing)
-   [Community and Support](#community-and-support)
-   [License](#license)

------------------------------------------------------------------------

## Overview

Traditional billing systems are often designed around fixed
subscriptions. Modern products, especially AI applications and API-first
SaaS platforms, need more flexible ways to charge customers.

A product may bill by the number of API requests, tokens consumed,
compute time, active seats, storage, or a combination of these. Building
the metering, credit accounting, pricing rules, usage limits, and
invoice calculations for these models can take significant engineering
effort.

**4thePrice aims to centralize these billing building blocks.**

Your application sends usage events to 4thePrice. The platform processes
those events, evaluates the customer's pricing plan, applies available
credits, calculates billable usage, and makes usage and billing
information available through APIs and reporting.

The architecture is intended to complement an application's existing
payment, CRM, and accounting tools rather than force a complete
replacement of its stack.

## Why 4thePrice?

Billing becomes a developer problem when existing tools cannot represent
the way a product is actually used.

### Flexible pricing requirements

Fixed subscription tools may not cover usage metering, prepaid credits,
feature entitlements, custom limits, or hybrid pricing. Teams end up
maintaining custom billing logic.

### Complex usage metering

Reliable metering requires collecting events, validating them,
aggregating usage, handling billing periods, and accounting for edge
cases. These responsibilities become more difficult as event volume
grows.

### Vendor lock-in

Closed billing systems can make it difficult to inspect, customize, or
migrate billing logic. An open and composable design gives teams more
control over their data and infrastructure.

### Delayed monetization

Building billing infrastructure internally takes time away from product
development. A reusable billing platform can help teams introduce and
adjust pricing models with less custom engineering.

## Core Features

### 1. Usage Metering

Track product usage through events such as:

-   API requests
-   AI tokens consumed
-   Compute time
-   Database queries
-   Storage consumed
-   Workflow executions
-   Custom application events

Define meters around the events that matter to your product and use
aggregated usage to calculate charges.

### 2. Credit Management

Support prepaid and promotional credit workflows, including:

-   One-time credit grants
-   Promotional credits
-   Credit balances
-   Credit expiry
-   Usage-based credit deduction
-   Optional automatic top-ups

Credit rules should make it clear how credits are granted, consumed, and
expired.

### 3. Flexible Pricing Plans

Create pricing plans for different customer segments and product
requirements.

Potential pricing structures include:

-   Flat recurring subscriptions
-   Per-seat pricing
-   Pay-as-you-go pricing
-   Tiered and volume-based pricing
-   Prepaid credit bundles
-   Free tiers with paid overages
-   Hybrid pricing combining fixed fees and metered usage

Plan configuration should be adaptable as a product's pricing strategy
changes.

### 4. Feature Entitlements and Limits

Associate product capabilities and usage limits with plans or individual
customers.

Examples include:

-   Enable or disable premium features
-   Set monthly API request limits
-   Configure maximum team members
-   Define storage limits
-   Set usage quotas
-   Apply customer-specific overrides

Applications can check entitlements before allowing a customer to access
a feature or consume more usage.

### 5. Subscriptions and Invoicing

Manage subscription billing and calculate charges from plans, usage, and
credits.

Billing workflows may include:

-   Billing-cycle management
-   Usage-based invoice line items
-   Credit application
-   Overage calculations
-   Proration support
-   Invoice generation
-   Payment-provider synchronization

Invoices should make charges understandable by linking them to the
relevant plan, usage, or credit activity.

### 6. Usage Reporting and Analytics

Give product, engineering, and finance teams visibility into consumption
and billing.

Useful reporting includes:

-   Usage by customer
-   Usage by meter or event type
-   Credit balance and consumption
-   Subscription status
-   Estimated charges
-   Invoice summaries
-   Usage trends over time

### 7. Developer-first APIs

Expose billing capabilities through APIs and SDKs so applications can
integrate metering and billing into their existing workflows.

The goal is to keep integration straightforward while allowing teams to
retain control over their product experience.

------------------------------------------------------------------------

## How It Works

A typical usage-based billing flow looks like this:

1.  **Configure pricing:** Create products, plans, meters, credit
    grants, and feature entitlements.
2.  **Identify the customer:** Associate usage with the correct customer
    and subscription.
3.  **Send usage events:** Your application reports events to the
    metering API or an integrated data pipeline.
4.  **Process usage:** 4thePrice validates and aggregates the incoming
    usage.
5.  **Apply billing rules:** The platform evaluates plan pricing,
    included limits, overages, and available credits.
6.  **Generate billing data:** Usage and calculated charges become
    available for reporting and invoicing.
7.  **Connect external systems:** Send relevant billing information to
    payment processors, CRM, or accounting tools.

``` text
Your Application
       |
       | Usage events
       v
   4thePrice API
       |
       v
 Usage Metering
       |
       v
 Pricing + Credits + Entitlements
       |
       v
 Billing and Invoices
       |
       +------> Payment Provider
       |
       +------> CRM / Accounting
       |
       +------> Usage Reports
```

## Supported Pricing Models

4thePrice is intended for products that need one or more of the
following pricing models:

  -----------------------------------------------------------------------
  Pricing model           Description             Example
  ----------------------- ----------------------- -----------------------
  Subscription            Fixed recurring charge  ₹999 per month

  Seat-based              Charge per user or seat ₹200 per active seat

  Usage-based             Charge according to     ₹0.10 per API request
                          consumption             

  Tiered                  Different rates at      First 1,000 requests
                          usage thresholds        included

  Credit-based            Customers consume       10,000 AI credits
                          prepaid credits         

  Hybrid                  Combine recurring fees  Monthly fee plus token
                          and usage charges       usage
  -----------------------------------------------------------------------

Actual availability depends on the features implemented and configured
in your deployment.

## Architecture

4thePrice follows an open and composable architecture.

Applications can send usage events directly through APIs or feed data
from analytics pipelines and data warehouses. The billing platform
processes usage and pricing rules, then exposes the resulting
information to connected systems.

A deployment may contain the following logical components:

-   **API service:** Receives customer, plan, subscription, and usage
    requests.
-   **Metering service:** Validates and aggregates usage events.
-   **Pricing engine:** Calculates charges according to configured
    pricing rules.
-   **Credit service:** Manages credit grants, balances, deductions, and
    expiry.
-   **Entitlements service:** Evaluates feature access and usage limits.
-   **Billing service:** Produces billing records and invoice data.
-   **Background workers:** Handle asynchronous processing and scheduled
    tasks.
-   **Reporting layer:** Provides usage and billing summaries.

The exact services and infrastructure depend on the implementation and
deployment configuration.

## Technology Requirements

For local development from source, prepare the following tools:

-   [Go](https://go.dev/dl/)
-   [Docker](https://docs.docker.com/get-docker/)
-   [Docker Compose](https://docs.docker.com/compose/)
-   Git
-   A supported Linux, macOS, or Windows environment using WSL

The development infrastructure described for the source setup includes:

-   PostgreSQL
-   Kafka
-   ClickHouse
-   Redis
-   Temporal
-   Temporal UI

Check the repository's current configuration and contribution
documentation for exact version requirements.

## Getting Started

### Quick setup with Docker Compose

The following commands describe the source-based development workflow:

``` bash
# Clone the repository
git clone <YOUR_4THEPRICE_REPOSITORY_URL>

# Move into the project directory
cd 4thePrice

# Set up the development environment
make dev-setup
```

The development setup is expected to prepare the required
infrastructure, build the application image, run database migrations,
initialize the event-streaming infrastructure, and start the application
services.

Once the services are running, the local endpoints may include:

  Service                     Local URL
  --------------------------- -----------------------
  4thePrice API               http://localhost:8080
  Temporal UI                 http://localhost:8088
  Kafka UI                    http://localhost:8084
  ClickHouse HTTP interface   http://localhost:8123

These ports are based on the described development setup. Confirm the
active ports in your Docker Compose configuration.

### Running without the full application container

If the repository supports running the Go application directly, start
the required infrastructure first:

``` bash
docker compose up -d postgres kafka clickhouse redis temporal temporal-ui
```

Then run the server:

``` bash
go run cmd/server/main.go
```

Keep the infrastructure services running while developing and testing
the application.

## Configuration

Review the repository's environment-variable examples and configuration
files before starting the application.

Typical configuration may include:

-   Database connection details
-   Kafka broker settings
-   ClickHouse connection settings
-   Redis connection details
-   Temporal service address
-   API server port
-   Authentication and application secrets
-   External payment-provider credentials

Do not commit real credentials, API keys, passwords, or production
environment files to Git. Use a local environment file and provide safe
placeholder values in any example configuration.

## Useful Development Commands

``` bash
# Restart the application services
make restart-flexprice

# Stop services
make down

# Clean and start from scratch
make clean-start

# Build the application image
make build-image

# Start the application services
make start-flexprice
```

Run commands from the repository root. Check the project's Makefile for
the current command names and behavior before using them.

## Integrations

A billing platform can connect with the tools already used by a SaaS
business.

Potential integration categories include:

-   **Payment providers:** Process customer payments and invoice
    collections.
-   **CRM platforms:** Synchronize customer and subscription
    information.
-   **Accounting systems:** Share invoice and revenue data.
-   **Data warehouses:** Import usage events and analytical data.
-   **Analytics pipelines:** Stream product activity into metering
    workflows.
-   **Application backends:** Send usage events and check entitlements.

Integration availability depends on the connectors implemented in the
project.

## Contributing

Contributions, bug reports, feature suggestions, and documentation
improvements are welcome.

A suggested contribution workflow:

1.  Fork the repository.
2.  Create a feature branch.
3.  Make a focused change.
4.  Add or update tests where appropriate.
5.  Run the relevant tests and checks.
6.  Submit a pull request with a clear description.

Before contributing, review the repository's contribution guidelines and
code of conduct, if available.

## Community and Support

Add the official project links here:

-   **Documentation:** `<ADD_DOCUMENTATION_URL>`
-   **Demo:** `<ADD_DEMO_URL>`
-   **Website:** `<ADD_WEBSITE_URL>`
-   **LinkedIn:** `<ADD_LINKEDIN_URL>`
-   **X:** `<ADD_X_URL>`
-   **Community:** `<ADD_SLACK_OR_COMMUNITY_URL>`
-   **Issues:** Use the repository's GitHub Issues page.

## License

Add the license used by this repository here. If this project is based
on or incorporates another open-source project, retain its required
copyright notices, license terms, and attribution.

------------------------------------------------------------------------

**4thePrice --- Make every unit of usage count.**
# Odoo-Hackathon
