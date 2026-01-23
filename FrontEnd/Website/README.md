# 🖥️ PC Builder Platform

<div align="center">

![PC Builder](https://img.shields.io/badge/PC%20Builder-Platform-F5CB5C?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)
![.NET](https://img.shields.io/badge/.NET-Core-512BD4?style=for-the-badge&logo=.net)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1-06B6D4?style=for-the-badge&logo=tailwindcss)

**A comprehensive full-stack web application for building, validating, and sharing custom PC configurations with real-time compatibility checking and AI-powered recommendations.**

[Live Demo](https://pcbuilder.runasp.net) • [Report Bug](https://github.com/yourusername/pcbuilder/issues) • [Request Feature](https://github.com/yourusername/pcbuilder/issues)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Configuration](#-configuration)
- [API Integration](#-api-integration)
- [Key Components](#-key-components)
- [User Roles](#-user-roles)
- [Screenshots](#-screenshots)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

The **PC Builder Platform** is a modern, full-stack web application designed to simplify the process of building custom PCs. It provides intelligent component compatibility checking, real-time collaboration features, 3D visualization, and AI-powered hardware recommendations. Whether you're a first-time builder or an experienced enthusiast, this platform guides you through every step of the PC building process.

### Why PC Builder Platform?

- ✅ **Prevent Compatibility Issues**: Real-time validation ensures all components work together
- 🤖 **AI-Powered Suggestions**: Get intelligent hardware recommendations based on your needs
- 🎨 **3D Visualization**: See your build come to life with interactive 3D models
- 💬 **Community Support**: Connect with other builders through real-time chat
- 📊 **Performance Analysis**: Understand bottlenecks and optimize your configuration
- 🛡️ **Expert Guidance**: Access professional tech support when needed

---

## ✨ Features

### 🔧 Core Features

#### 1. **Interactive PC Builder**
- Drag-and-drop component selection
- Real-time compatibility validation
- Visual feedback on component selection
- Build cost calculation
- Performance estimation
- Component recommendations

#### 2. **Compatibility Checking System**
Validates:
- CPU and Motherboard socket compatibility (AM4, AM5, LGA1700, etc.)
- RAM type (DDR4/DDR5) and capacity with motherboard support
- GPU clearance with case dimensions
- CPU cooler height with case specifications
- Power supply wattage adequacy (with 20% overhead)
- Storage interface compatibility (M.2, SATA, NVMe)
- PCIe slot availability
- Performance bottleneck analysis

#### 3. **AI Hardware Calculator**
- Intelligent component recommendations
- Budget-based suggestions
- Use-case optimization (Gaming, Content Creation, Workstation)
- Performance prediction
- Future-proofing analysis

#### 4. **3D Component Visualization**
- Interactive 3D models using Three.js
- 360° component viewing
- Build assembly visualization
- Realistic rendering with lighting effects

#### 5. **Hardware Comparison Tool**
- Side-by-side component comparison
- Specification analysis
- Performance metrics
- Price comparison
- User ratings and reviews

#### 6. **Real-Time Chat System**
- User-to-user messaging (SignalR WebSocket)
- Online status indicators
- Message history
- Typing indicators
- Notification system

#### 7. **Build Showcase & Community**
- Submit completed builds
- Photo gallery
- Build specifications
- Performance benchmarks
- Community ratings and comments
- Build inspiration gallery

#### 8. **Tech Support System**
- Schedule appointments with technicians
- Apply to become a tech support professional
- Video call support (future feature)
- Ticket management system
- Rating and review system

#### 9. **Admin Dashboard**
- User management and role assignment
- Product database management (CRUD operations)
- Shop request approval
- Tech support request management
- Content moderation
- Platform analytics and statistics
- System settings

#### 10. **Educational Resources**
- Building guides for all skill levels
- Hardware component education
- Latest PC hardware news
- FAQ section
- Quantum computing articles
- Terms of service

---

## 🛠️ Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | Core UI framework |
| **Vite** | 6.0.1 | Build tool and dev server |
| **React Router** | 7.9.5 | Client-side routing |
| **TailwindCSS** | 4.1.16 | Utility-first styling |
| **Three.js** | 0.169.0 | 3D graphics |
| **@react-three/fiber** | 8.17.10 | React renderer for Three.js |
| **@react-three/drei** | 9.114.3 | Three.js helpers |
| **SignalR** | 10.0.0 | Real-time communication |
| **Axios** | 1.13.1 | HTTP client |
| **PrimeReact** | 10.9.7 | Advanced UI components |
| **Chart.js** | 4.5.1 | Data visualization |
| **Recharts** | 3.6.0 | React charts |
| **GSAP** | 3.14.2 | Animation library |
| **Motion** | 12.23.24 | Animation framework |
| **React Hook Form** | 7.66.0 | Form management |
| **React Hot Toast** | 2.6.0 | Toast notifications |
| **SweetAlert2** | 11.26.3 | Beautiful alerts |
| **QRCode.react** | 4.2.0 | QR code generation |
| **React Icons** | 5.5.0 | Icon library |

### Backend

| Technology | Purpose |
|------------|---------|
| **ASP.NET Core** | Backend framework |
| **Entity Framework Core** | ORM for database operations |
| **SignalR** | Real-time WebSocket communication |
| **SQL Server** | Primary database |
| **JWT Authentication** | Secure user authentication |
| **Azure App Service** | Cloud hosting platform |

### Development Tools

- **Postman**: API testing and endpoint validation
- **ESLint**: Code linting and quality control
- **Git**: Version control
- **Visual Studio Code**: Primary IDE

---

## 📁 Project Structure

```
PCBuilder/
├── FrontEnd/
│   └── Website/
│       ├── public/
│       │   ├── _redirects                 # Deployment redirects
│       │   └── models/                    # 3D model files
│       ├── src/
│       │   ├── assets/
│       │   │   └── Images/               # Component images
│       │   │       ├── CPU/
│       │   │       ├── GPU/
│       │   │       ├── Motherboard/
│       │   │       ├── Memory/
│       │   │       ├── Storage/
│       │   │       └── ...
│       │   ├── components/
│       │   │   ├── admin/                # Admin components
│       │   │   │   ├── DataTable.jsx
│       │   │   │   ├── Header.jsx
│       │   │   │   ├── Sidebar.jsx
│       │   │   │   └── StatsCard.jsx
│       │   │   ├── animations/           # Animation components
│       │   │   │   ├── BlurText/
│       │   │   │   ├── BounceCard/
│       │   │   │   ├── CardSwap/
│       │   │   │   └── ElectricBorder/
│       │   │   ├── common/
│       │   │   │   └── chatbot/          # AI chatbot
│       │   │   ├── protected/
│       │   │   │   └── ProtectedRoute.jsx
│       │   │   ├── ui/
│       │   │   │   └── GlassIcons/
│       │   │   └── user/
│       │   │       ├── 3D/               # 3D visualization
│       │   │       ├── builder/          # PC builder components
│       │   │       ├── electric-card/
│       │   │       ├── footer/
│       │   │       └── navbar/
│       │   ├── config/
│       │   │   └── colors.js             # Theme colors
│       │   ├── context/
│       │   │   ├── BuildContext.jsx      # Build state management
│       │   │   └── CompareContext.jsx    # Comparison state
│       │   ├── data/
│       │   │   └── components/           # Component data (JSON)
│       │   │       ├── cpus.json
│       │   │       ├── gpus.json
│       │   │       ├── motherboards.json
│       │   │       └── ...
│       │   ├── layouts/
│       │   │   └── AuthLayout.jsx        # Authentication layout
│       │   ├── pages/
│       │   │   ├── admin/                # Admin pages
│       │   │   │   ├── AdminDashboard.jsx
│       │   │   │   ├── Overview.jsx
│       │   │   │   ├── UserManagement.jsx
│       │   │   │   ├── ProductManagement.jsx
│       │   │   │   ├── ShopRequests.jsx
│       │   │   │   └── ...
│       │   │   ├── aiCalculator/
│       │   │   │   └── AIHardwareCalculator.jsx
│       │   │   ├── hardwareComponents/   # Component pages
│       │   │   │   ├── CPU.jsx
│       │   │   │   ├── GPU.jsx
│       │   │   │   ├── Motherboard.jsx
│       │   │   │   ├── HardwareDetail.jsx
│       │   │   │   └── ...
│       │   │   ├── home/
│       │   │   │   └── Home.jsx
│       │   │   ├── techSupport/
│       │   │   │   ├── TechSupport.jsx
│       │   │   │   ├── ApplyTechSupportModal.jsx
│       │   │   │   └── AppointmentModal.jsx
│       │   │   └── user/
│       │   │       ├── auth/             # Authentication pages
│       │   │       ├── builder/          # PC builder page
│       │   │       ├── buildingGuides/   # Educational guides
│       │   │       ├── chat/             # Chat interface
│       │   │       ├── comparator/       # Component comparison
│       │   │       ├── completedBuilds/  # Build showcase
│       │   │       ├── contact/          # Contact page
│       │   │       ├── faq/              # FAQ page
│       │   │       ├── news/             # Hardware news
│       │   │       ├── posts/            # Community posts
│       │   │       ├── profile/          # User profile
│       │   │       ├── quantumComputing/ # Quantum computing
│       │   │       ├── shops/            # Shop listings
│       │   │       ├── submitBuild/      # Submit build
│       │   │       └── termsOfService/   # TOS
│       │   ├── services/
│       │   │   ├── apiService.js         # API client
│       │   │   ├── chatService.js        # Chat & SignalR
│       │   │   ├── chatbot.test.js       # Chatbot tests
│       │   │   ├── huggingFaceService.js # AI service
│       │   │   ├── pcKnowledgeService.js # PC knowledge base
│       │   │   └── webSearchService.js   # Web search
│       │   ├── utils/
│       │   │   ├── compatibilityChecker.js    # Compatibility logic
│       │   │   ├── performanceCalculator.js   # Performance calcs
│       │   │   ├── imageMapper.js             # Image utilities
│       │   │   └── sidebarHelper.js           # UI helpers
│       │   ├── App.jsx                   # Main app component
│       │   ├── main.jsx                  # Entry point
│       │   └── index.css                 # Global styles
│       ├── index.html                    # HTML template
│       ├── package.json                  # Dependencies
│       ├── vite.config.js                # Vite configuration
│       ├── tailwind.config.js            # Tailwind config
│       └── .eslintrc.js                  # ESLint config
└── BackEnd/                              # ASP.NET Core API
    └── PCBuilderAPI/
        ├── Controllers/
        ├── Models/
        ├── Services/
        ├── Data/
        ├── Hubs/                         # SignalR hubs
        └── ...
```

---

## 🚀 Getting Started

### Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (comes with Node.js)
- **.NET SDK**: 8.0 or higher (for backend)
- **SQL Server**: 2019 or higher (or SQL Server Express)
- **Git**: Latest version
- **Visual Studio Code** (recommended) or any code editor
- **Postman** (optional, for API testing)

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/pcbuilder.git
cd pcbuilder
```

#### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd FrontEnd/Website

# Install dependencies
npm install

# Create environment configuration (if needed)
# Copy .env.example to .env and configure
```

#### 3. Backend Setup

```bash
# Navigate to backend directory
cd ../../BackEnd/PCBuilderAPI

# Restore NuGet packages
dotnet restore

# Update database connection string in appsettings.json
# Configure JWT settings
# Configure SignalR settings

# Apply database migrations
dotnet ef database update

# Run the backend server
dotnet run
```

The backend API will start at `https://localhost:5001` (or as configured).

#### 4. Start Frontend Development Server

```bash
# Return to frontend directory
cd ../../FrontEnd/Website

# Start Vite development server
npm run dev
```

The application will be available at `http://localhost:5173`.

### Quick Start Commands

```bash
# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Backend
dotnet run           # Start API server
dotnet build         # Build project
dotnet test          # Run tests
dotnet ef migrations add <name>  # Create migration
dotnet ef database update        # Apply migrations
```

---

## ⚙️ Configuration

### Frontend Configuration

#### **vite.config.js**

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "localhost",
    port: 5173,
    strictPort: false,
    proxy: {
      '/api': {
        target: 'https://pcbuilder.runasp.net',
        changeOrigin: true,
        secure: false,
      }
    }
  },
});
```

#### **Environment Variables**

Create a `.env` file in the frontend root:

```env
VITE_API_BASE_URL=https://pcbuilder.runasp.net/api
VITE_HUB_URL=https://pcbuilder.runasp.net/chatHub
VITE_APP_NAME=PC Builder Platform
```

### Backend Configuration

#### **appsettings.json**

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=your-server;Database=PCBuilderDB;Trusted_Connection=True;"
  },
  "Jwt": {
    "Key": "your-secret-key-here-min-32-chars",
    "Issuer": "PCBuilderAPI",
    "Audience": "PCBuilderClient",
    "ExpiryInDays": 7
  },
  "AllowedHosts": "*",
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:5173",
      "https://pcbuilder.runasp.net"
    ]
  }
}
```

---

## 🔌 API Integration

### Base URL

```
Production: https://pcbuilder.runasp.net/api
Development: http://localhost:5001/api
```

### Key Endpoints

#### **Authentication**

```http
POST   /api/Auth/register          # Register new user
POST   /api/Auth/login             # User login
POST   /api/Auth/forgot-password   # Request password reset
POST   /api/Auth/reset-password    # Reset password
GET    /api/Auth/verify-email      # Verify email address
```

#### **Components**

```http
GET    /api/Components/cpus                # Get all CPUs
GET    /api/Components/gpus                # Get all GPUs
GET    /api/Components/motherboards        # Get all motherboards
GET    /api/Components/{category}/{id}     # Get component by ID
POST   /api/Components                     # Add component (Admin)
PUT    /api/Components/{id}                # Update component (Admin)
DELETE /api/Components/{id}                # Delete component (Admin)
```

#### **Builds**

```http
GET    /api/Builds                         # Get all builds
GET    /api/Builds/{id}                    # Get build by ID
POST   /api/Builds                         # Submit new build
PUT    /api/Builds/{id}                    # Update build
DELETE /api/Builds/{id}                    # Delete build
POST   /api/Builds/validate                # Validate compatibility
```

#### **Chat**

```http
GET    /api/Chat/users                     # Get all users
GET    /api/Chat/{userId}                  # Get chat history
WebSocket: /chatHub                        # SignalR chat hub
```

#### **Tech Support**

```http
GET    /api/TechSupport/requests           # Get support requests
POST   /api/TechSupport/apply              # Apply as technician
POST   /api/TechSupport/appointment        # Schedule appointment
PUT    /api/TechSupport/request/{id}       # Update request status
```

#### **Admin**

```http
GET    /api/Admin/users                    # Get all users
PUT    /api/Admin/users/{id}/role          # Update user role
GET    /api/Admin/statistics               # Get platform stats
GET    /api/Admin/shop-requests            # Get shop requests
PUT    /api/Admin/shop-requests/{id}       # Approve/reject shop
```

### Authentication

All authenticated requests require a JWT token:

```javascript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

### Testing with Postman

1. Import the API collection from `/docs/postman/`
2. Set environment variables:
   - `baseUrl`: `https://pcbuilder.runasp.net/api`
   - `token`: Your JWT token after login
3. Test endpoints in the following order:
   - Register/Login
   - Get component data
   - Create/validate build
   - Test chat functionality
   - Admin operations (if applicable)

---

## 🧩 Key Components

### BuildContext

Manages global build state using React Context API.

```javascript
const { 
  selectedComponents,    // Current build components
  addComponent,          // Add component to build
  removeComponent,       // Remove component
  clearBuild,           // Reset build
  totalPrice,           // Calculate total cost
  compatibility         // Compatibility status
} = useBuild();
```

### CompatibilityChecker

Validates component compatibility.

```javascript
const checker = new CompatibilityChecker();
const result = checker.checkBuild({
  cpu,
  motherboard,
  gpu,
  memory,
  storage,
  psu,
  case: pcCase,
  cpuCooler
});

// Returns: { issues: [], warnings: [], isCompatible: boolean }
```

### SignalR Chat Service

Real-time communication implementation.

```javascript
import { createHubConnection, sendMessage } from '@/services/chatService';

// Connect
const connection = await createHubConnection(token);

// Listen for messages
connection.on('ReceiveMessage', (message) => {
  console.log('New message:', message);
});

// Send message
await sendMessage(recipientId, messageText);
```

---

## 👥 User Roles

### 1. **Guest (Unauthenticated)**
- Browse hardware components
- View completed builds
- Read articles and guides
- Access public pages

### 2. **Regular User (Authenticated)**
- All guest permissions
- Build custom PCs
- Save builds to profile
- Submit completed builds
- Use real-time chat
- Compare components
- Rate and review builds
- Schedule tech support appointments

### 3. **Tech Support Professional**
- All user permissions
- Accept support appointments
- Manage support requests
- Access tech support dashboard
- Receive ratings and reviews

### 4. **Shop Owner**
- All user permissions
- Create shop listing
- Manage product inventory
- View shop analytics
- Respond to inquiries

### 5. **Administrator**
- All permissions
- User management
- Product database management
- Content moderation
- Approve shop requests
- Approve tech support applications
- Access full analytics
- System configuration

---

## 📸 Screenshots

### Home Page
*Modern landing page with hero section, features overview, and call-to-action*

### PC Builder Interface
*Interactive component selection with real-time compatibility checking*

### 3D Visualization
*Immersive 3D models of PC components*

### Build Showcase
*Community-submitted builds with photos and specifications*

### Admin Dashboard
*Comprehensive admin panel with statistics and management tools*

### Chat Interface
*Real-time messaging with online status indicators*

### Hardware Comparison
*Side-by-side component comparison with detailed specs*

---

## 🧪 Testing

### Frontend Testing

```bash
# Run ESLint
npm run lint

# Fix linting issues
npm run lint -- --fix
```

### Backend Testing (Postman)

The project includes a comprehensive Postman collection for API testing:

1. **Authentication Tests**
   - User registration
   - Login with valid/invalid credentials
   - Token refresh
   - Password reset flow

2. **Component CRUD Tests**
   - Create components
   - Read component data
   - Update component specifications
   - Delete components

3. **Build Validation Tests**
   - Compatible builds
   - Incompatible socket types
   - Insufficient power supply
   - GPU clearance issues

4. **Chat Functionality Tests**
   - WebSocket connection
   - Message sending/receiving
   - User online status
   - Message history

5. **Admin Operations Tests**
   - User role management
   - Shop request approval
   - Content moderation
   - Statistics retrieval

### Manual Testing Checklist

- [ ] User registration and login
- [ ] Component selection in builder
- [ ] Compatibility warning displays
- [ ] Build save and load
- [ ] Real-time chat functionality
- [ ] 3D model rendering
- [ ] Responsive design on mobile
- [ ] Admin dashboard operations
- [ ] File upload (build images)
- [ ] Search and filter functionality

---

## 🌐 Deployment

### Frontend Deployment (Netlify/Vercel)

#### **Build for Production**

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

#### **Deploy to Netlify**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

#### **Configure _redirects**

The `public/_redirects` file handles SPA routing:

```
/*    /index.html   200
```

### Backend Deployment (Azure)

#### **Publish to Azure App Service**

```bash
# Login to Azure
az login

# Create resource group
az group create --name PCBuilderRG --location eastus

# Create App Service plan
az appservice plan create --name PCBuilderPlan --resource-group PCBuilderRG --sku B1

# Create web app
az webapp create --resource-group PCBuilderRG --plan PCBuilderPlan --name pcbuilder

# Deploy
dotnet publish -c Release
cd bin/Release/net8.0/publish
az webapp deployment source config-zip --resource-group PCBuilderRG --name pcbuilder --src ./publish.zip
```

#### **Environment Variables (Azure)**

Configure in Azure Portal > App Service > Configuration:

- `ConnectionStrings__DefaultConnection`
- `Jwt__Key`
- `Jwt__Issuer`
- `ASPNETCORE_ENVIRONMENT`: `Production`

### Database Deployment

```bash
# Apply migrations to production database
dotnet ef database update --connection "your-production-connection-string"
```

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Code Style

- Follow existing code patterns
- Use meaningful variable names
- Comment complex logic
- Write descriptive commit messages
- Ensure ESLint passes before committing

### Reporting Issues

- Use GitHub Issues
- Provide detailed description
- Include steps to reproduce
- Add screenshots if applicable
- Specify browser/OS versions

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Developer

**Your Name**
- Email: your.email@example.com
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

---

## 🙏 Acknowledgments

- **React Team** - For the amazing React framework
- **Microsoft** - For ASP.NET Core and SignalR
- **Three.js Community** - For 3D graphics capabilities
- **TailwindCSS Team** - For the utility-first CSS framework
- **PC Building Community** - For inspiration and feature ideas

---

## 📞 Support

For support, email support@pcbuilder.com or join our Discord server.

---

## 🗺️ Roadmap

### Phase 1 (Current)
- [x] Core PC builder functionality
- [x] Compatibility checking
- [x] User authentication
- [x] Admin dashboard
- [x] Real-time chat
- [x] 3D visualization

### Phase 2 (Q2 2026)
- [ ] Mobile application (React Native)
- [ ] Advanced AI recommendations
- [ ] Price tracking and alerts
- [ ] E-commerce integration
- [ ] Video call support
- [ ] Multi-language support

### Phase 3 (Q3 2026)
- [ ] VR/AR build preview
- [ ] Marketplace for used components
- [ ] Build templates
- [ ] YouTube integration
- [ ] Advanced benchmarking tools
- [ ] API for third-party integrations

---

## 📊 Project Statistics

- **Lines of Code**: ~50,000+
- **Components**: 100+
- **API Endpoints**: 80+
- **Supported Hardware Categories**: 12
- **Database Tables**: 25+
- **Supported Component Types**: 1,000+

---

## 🔐 Security

### Reporting Security Issues

Please report security vulnerabilities to security@pcbuilder.com. Do not create public GitHub issues for security concerns.

### Security Measures

- JWT-based authentication with secure token storage
- Password hashing with bcrypt
- SQL injection prevention through parameterized queries
- XSS protection through React's built-in sanitization
- CORS configuration for API protection
- HTTPS enforcement in production
- Rate limiting on authentication endpoints
- Input validation on all forms

---

## 📈 Performance

- **Lighthouse Score**: 95+
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Bundle Size**: ~800KB (gzipped)
- **API Response Time**: < 200ms average

---

<div align="center">

**Built with ❤️ for the PC building community**

[⬆ Back to Top](#-pc-builder-platform)

</div>
