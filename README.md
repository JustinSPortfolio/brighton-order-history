# brighton-order-history
A Node.js based order history service for Brighton.com that unifies online Shopify orders and offline Retail POS purchases into a single customer-facing experience. Built with Express, PostgreSQL, Prisma, and supports Shopify webhooks, POS synchronization, secure customer-scoped access, and near-real-time order updates.

<br>
<br>

## Architecture
```mermaid
flowchart TD
    subgraph Channels ["Customer & Sales Channels"]
        Storefront["Brighton.com Storefront<br/>(Customer Order History UI)"]
        Shopify["Shopify Online Store"]
        POS["Retail POS System"]
    end

    subgraph Service ["order-history-app (Node.js / Express)"]
        Proxy["App Proxy & Auth Middleware<br/>(Customer-Scoped Access)"]
        API["Order History API"]
        WebhookHandler["Shopify Webhook Listener"]
        POSSync["POS Synchronization Worker"]
        Prisma["Prisma ORM"]
    end

    DB[("PostgreSQL Database")]

    Storefront -->|"Authenticated Requests"| Proxy
    Proxy --> API
    Shopify -->|"Order Webhooks"| WebhookHandler
    POS -->|"Offline Purchase Sync"| POSSync

    API <--> Prisma
    WebhookHandler --> Prisma
    POSSync --> Prisma
    Prisma <--> DB
```

