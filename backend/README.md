# Supply Chain Management Backend

A comprehensive NestJS backend API for supply chain management system with authentication, CRUD operations, event-driven architecture, and reporting capabilities.

## Features

- 🔐 **JWT Authentication** - Secure user authentication and authorization
- 📦 **Product Management** - Complete CRUD operations for products
- 🏢 **Supplier Management** - Supplier information and relationship management
- 📋 **Order Management** - Purchase orders and sales orders handling
- 🏪 **Warehouse Management** - Inventory tracking and stock movements
- 🚚 **Shipment Tracking** - Shipment management and status updates
- 📊 **Reporting & Analytics** - Comprehensive reporting system
- 🔔 **Event-Driven Notifications** - Real-time notifications for business events
- 📚 **API Documentation** - Swagger/OpenAPI documentation
- 🛡️ **Security** - Input validation, error handling, and security best practices

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with Passport
- **Validation**: Class Validator & Class Transformer
- **Documentation**: Swagger/OpenAPI
- **Events**: Event Emitter for event-driven architecture
- **Scheduling**: NestJS Schedule for background jobs

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

4. **Database Setup**
   ```bash
   # Create database
   createdb supply_chain_db
   
   # Run migrations (if any)
   npm run migration:run
   ```

5. **Start the application**
   ```bash
   # Development
   npm run start:dev
   
   # Production
   npm run build
   npm run start:prod
   ```

## API Documentation

Once the application is running, you can access the API documentation at:
- **Swagger UI**: http://localhost:3001/api/docs
- **API Base URL**: http://localhost:3001/api

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token

### Products
- `GET /api/products` - Get all products (with pagination)
- `POST /api/products` - Create new product
- `GET /api/products/:id` - Get product by ID
- `PATCH /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `PATCH /api/products/:id/stock` - Update stock quantity

### Suppliers
- `GET /api/suppliers` - Get all suppliers (with pagination)
- `POST /api/suppliers` - Create new supplier
- `GET /api/suppliers/:id` - Get supplier by ID
- `PATCH /api/suppliers/:id` - Update supplier
- `DELETE /api/suppliers/:id` - Delete supplier

### Reports
- `GET /api/reporting/overview` - Dashboard overview metrics
- `GET /api/reporting/inventory` - Inventory report
- `GET /api/reporting/sales` - Sales report
- `GET /api/reporting/purchase` - Purchase report
- `GET /api/reporting/supplier-performance` - Supplier performance report

## Event-Driven Architecture

The system uses events for decoupled communication:

### Events Emitted
- `product.created` - When a new product is created
- `product.updated` - When a product is updated
- `stock.updated` - When stock levels change
- `stock.low` - When stock falls below threshold
- `purchase-order.created` - When a purchase order is created
- `sales-order.created` - When a sales order is created
- `shipment.status.updated` - When shipment status changes

### Event Listeners
- **Email Notifications** - Automatic email notifications for business events
- **Stock Alerts** - Low stock level alerts
- **Order Notifications** - Purchase and sales order notifications

## Database Schema

### Core Entities
- **Users** - System users with authentication
- **Products** - Product catalog with inventory
- **Suppliers** - Supplier information and contacts
- **Purchase Orders** - Purchase order management
- **Sales Orders** - Sales order management
- **Inventory Items** - Warehouse inventory tracking
- **Stock Movements** - Inventory movement history
- **Shipments** - Shipment tracking and status

## Security Features

- **JWT Authentication** - Secure token-based authentication
- **Input Validation** - Comprehensive request validation
- **Error Handling** - Structured error responses
- **CORS Configuration** - Cross-origin resource sharing setup
- **Rate Limiting** - API rate limiting (can be added)
- **Helmet** - Security headers (can be added)

## Development

### Available Scripts

```bash
# Development
npm run start:dev          # Start in development mode with hot reload
npm run start:debug        # Start in debug mode

# Building
npm run build              # Build the application
npm run start:prod         # Start in production mode

# Testing
npm run test               # Run unit tests
npm run test:watch         # Run tests in watch mode
npm run test:cov           # Run tests with coverage
npm run test:e2e           # Run end-to-end tests

# Database
npm run migration:generate # Generate new migration
npm run migration:run      # Run migrations
npm run migration:revert   # Revert last migration

# Code Quality
npm run lint               # Run ESLint
npm run format             # Format code with Prettier
```

### Project Structure

```
src/
├── common/                 # Shared utilities and decorators
│   ├── decorators/        # Custom decorators
│   ├── dto/               # Common DTOs
│   ├── filters/           # Exception filters
│   ├── guards/            # Authentication guards
│   └── interceptors/      # Response interceptors
├── config/                # Configuration files
├── database/              # Database configuration and migrations
├── modules/               # Feature modules
│   ├── auth/              # Authentication module
│   ├── users/             # User management
│   ├── products/          # Product management
│   ├── suppliers/         # Supplier management
│   ├── purchase-orders/   # Purchase order management
│   ├── sales-orders/      # Sales order management
│   ├── warehouse/         # Warehouse management
│   ├── shipments/         # Shipment management
│   ├── reports/           # Reporting module
│   └── notifications/     # Notification system
├── app.module.ts          # Root application module
└── main.ts                # Application entry point
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.