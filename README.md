# ☕ CoffeeTracker

A beautiful web application for managing your home coffee inventory and tracking coffee machine usage. Built with modern technologies and featuring a warm, coffee-themed design.

## Features

### 🌟 Coffee Inventory Management
- Add, edit, and delete coffee entries
- Track coffee details: brand, roast level, origin, shop/provider
- Monitor current quantity and purchase history
- Manage prices and notes

### 📊 Usage Tracking
- Record manual coffee usage with timestamps
- View usage history per coffee
- Track total consumption statistics

### 🔧 Coffee Machine Management
- Configure your coffee machine details
- Create custom recipes with volume specifications
- Track preparation counter for each recipe
- Quick brew feature for fast logging

### 📈 Advanced Statistics
- Overall inventory and usage statistics
- Machine-specific analytics
- Recipe popularity breakdown
- Visual progress bars and metrics

### 🌍 Multi-Language Support
- English
- Hebrew (עברית) - with RTL support
- Russian (Русский)

## Technology Stack

### Backend
- **Node.js** + **Express** - REST API server
- **TypeScript** - Type-safe backend code
- **Prisma** - Modern ORM for database operations
- **SQLite** - Lightweight embedded database

### Frontend
- **React** + **TypeScript** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **i18next** - Internationalization framework
- **Axios** - HTTP client
- **date-fns** - Date formatting library

## Design

The application features a warm, coffee-themed design inspired by modern coffee shop aesthetics:

- 🎨 **Color Palette**: Rich browns, creams, and beiges
- 🔤 **Typography**: Elegant serif headings with clean sans-serif body text
- 📱 **Responsive**: Works beautifully on desktop, tablet, and mobile
- ✨ **UI Components**: Cards, badges, rounded buttons, and smooth transitions

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Generate Prisma client:
```bash
npx prisma generate
```

4. Create the database and run migrations:
```bash
npx prisma db push
```

5. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## API Endpoints

### Coffee Management
- `GET /api/coffees` - List all coffees
- `GET /api/coffees/:id` - Get single coffee
- `POST /api/coffees` - Create new coffee
- `PUT /api/coffees/:id` - Update coffee
- `DELETE /api/coffees/:id` - Delete coffee

### Usage Tracking
- `GET /api/usage` - Get all usage logs
- `GET /api/usage/coffee/:coffeeId` - Get usage for specific coffee
- `POST /api/usage` - Record coffee usage
- `DELETE /api/usage/:id` - Delete usage log

### Coffee Machine
- `GET /api/machines` - List all machines
- `POST /api/machines` - Create new machine
- `PUT /api/machines/:id` - Update machine
- `DELETE /api/machines/:id` - Delete machine

### Recipes
- `GET /api/recipes` - List all recipes
- `GET /api/recipes/machine/:machineId` - Get recipes for specific machine
- `POST /api/recipes` - Create new recipe
- `PUT /api/recipes/:id` - Update recipe
- `DELETE /api/recipes/:id` - Delete recipe

### Machine Usage
- `GET /api/machine-usage` - Get all machine usage logs
- `POST /api/machine-usage` - Record machine usage
- `DELETE /api/machine-usage/:id` - Delete usage log

### Statistics
- `GET /api/stats` - Get overall statistics
- `GET /api/stats/machine/:machineId` - Get machine-specific stats
- `GET /api/stats/recipe/:recipeId` - Get recipe-specific stats

## Database Schema

### Coffee Table
- Coffee name, brand, roast level
- Origin and shop/provider information
- Purchase date and pricing
- Initial and current quantity tracking
- Custom notes

### UsageLog Table
- Links to specific coffee
- Amount used and timestamp
- Optional notes

### CoffeeMachine Table
- Machine name, brand, and model
- Custom notes

### Recipe Table
- Recipe name and description
- Volume in milliliters
- Active/inactive status
- Links to coffee machine

### MachineUsageLog Table
- Links to recipe and machine
- Actual volume prepared
- Usage timestamp
- Optional notes

## Development Scripts

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npx prisma studio` - Open Prisma Studio (database GUI)

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## License

MIT

## Author

Created with ☕ by CoffeeTracker Team
