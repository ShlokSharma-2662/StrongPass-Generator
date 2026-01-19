# 🔐 StrongPass Generator

A secure, customizable password generator built with modern technologies. Generate ultra-strong passwords with advanced cryptographic algorithms and real-time customization.

![.NET](https://img.shields.io/badge/.NET-10.0-512BD4?style=flat-square&logo=dotnet)
![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker)
![Material UI](https://img.shields.io/badge/Material_UI-6.3-007FFF?style=flat-square&logo=mui)

## ✨ Features

- **🔒 Cryptographically Secure**: Uses `RandomNumberGenerator` for true random password generation
- **⚡ Real-time Customization**: Adjust password options and generate instantly
- **📊 Strength Analysis**: Visual password strength meter with entropy calculation
- **⏱️ Crack Time Estimation**: See estimated time to crack your password
- **🎨 Modern UI**: Beautiful dark theme with gradient animations using Material UI
- **🐳 Dockerized**: Complete Docker setup with docker-compose orchestration
- **🧪 Fully Tested**: Comprehensive unit and integration tests (>80% coverage)
- **📡 RESTful API**: Standardized API responses with OpenAPI/Swagger documentation
- **🛡️ Global Exception Handling**: Centralized error handling and logging
- **🔄 CORS Enabled**: Configured for frontend-backend communication

## 🎯 Customization Options

- **Length**: 4-128 characters
- **Character Types**:
  - Uppercase Letters (A-Z)
  - Lowercase Letters (a-z)
  - Numbers (0-9)
  - Symbols (!@#$%^&*()_+-=[]{}|;:,.<>?)
- **Exclusions**:
  - Similar characters (l, 1, I, O, 0)
  - Ambiguous symbols ({, }, [, ], (, ), /, \, ', ", ~, ,, ., <, >)

## 🛠 Tech Stack

### Backend

- **C# .NET 10** - Modern, high-performance runtime
- **ASP.NET Core** - Web API framework
- **Swashbuckle** - OpenAPI/Swagger documentation
- **xUnit** - Unit testing framework
- **Moq** - Mocking library
- **FluentAssertions** - Fluent test assertions

### Frontend

- **React 19.2** - UI library
- **TypeScript 5.9** - Type-safe JavaScript
- **Material UI 6.3** - Component library
- **Vite** - Build tool and dev server
- **Axios** - HTTP client
- **Emotion** - CSS-in-JS styling

### DevOps

- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Production web server for frontend

## 📋 Prerequisites

- [Docker](https://www.docker.com/get-started) and Docker Compose
- OR for local development:
  - [.NET 10 SDK](https://dotnet.microsoft.com/download)
  - [Node.js 20+](https://nodejs.org/)

## 🚀 Quick Start with Docker

The easiest way to run the application is using Docker Compose:

```bash
# Clone the repository
git clone <repository-url>
cd StrongPass Generator

# Build and run with Docker Compose
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
# Swagger UI: http://localhost:5000/swagger
```

To stop the containers:

```bash
docker-compose down
```

## 💻 Local Development Setup

### Backend Setup

```bash
cd StrongPassWordGenerator.Server

# Restore dependencies
dotnet restore

# Run the backend
dotnet run

# Backend will be available at http://localhost:5000
# Swagger UI at http://localhost:5000/swagger
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Frontend will be available at http://localhost:5173
```

## 🧪 Running Tests

```bash
# Run all tests
dotnet test

# Run tests with coverage
dotnet test /p:CollectCoverage=true /p:CoverletOutputFormat=opencover

# Run tests in watch mode
dotnet watch test
```

## 📡 API Documentation

### Generate Password

**Endpoint:** `POST /api/password/generate`

**Request Body:**

```json
{
  "length": 16,
  "includeUppercase": true,
  "includeLowercase": true,
  "includeNumbers": true,
  "includeSymbols": true,
  "excludeSimilar": false,
  "excludeAmbiguous": false
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "password": "aB3$xY9@mNpQ2!vT",
    "strength": 85,
    "strengthLabel": "Very Strong",
    "estimatedCrackTime": "5.2 billion years",
    "entropy": 104.5
  },
  "message": "Password generated successfully"
}
```

### Health Check

**Endpoint:** `GET /api/password/health`

**Response:**

```json
{
  "success": true,
  "data": "healthy",
  "message": "Password generator service is running"
}
```

## 🏗️ Project Structure

```
StrongPass Generator/
├── StrongPassWordGenerator.Server/    # Backend (.NET)
│   ├── Controllers/                    # API controllers
│   ├── Services/                       # Business logic
│   ├── Models/                         # DTOs and models
│   ├── Middleware/                     # Global exception handling
│   ├── Dockerfile                      # Backend container
│   └── Program.cs                      # Application entry point
│
├── StrongPassWordGenerator.Tests/     # Test project
│   ├── Services/                       # Service tests
│   └── Controllers/                    # Controller tests
│
├── frontend/                           # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/                 # React components
│   │   ├── services/                   # API integration
│   │   ├── types/                      # TypeScript interfaces
│   │   ├── App.tsx                     # Main app component
│   │   └── main.tsx                    # Application entry point
│   ├── Dockerfile                      # Frontend container
│   ├── nginx.conf                      # Nginx configuration
│   └── package.json
│
└── docker-compose.yml                  # Multi-container orchestration
```

## 🔧 Configuration

### Environment Variables

**Backend** (`.env` or docker-compose):

- `ASPNETCORE_ENVIRONMENT`: Development/Production
- `ASPNETCORE_URLS`: HTTP binding URLs

**Frontend** (`frontend/.env`):

- `VITE_API_URL`: Backend API URL (default: <http://localhost:5000>)

## 🐳 Docker Configuration

### Build Individual Containers

```bash
# Backend
docker build -t strongpass-backend -f StrongPassWordGenerator.Server/Dockerfile .

# Frontend
docker build -t strongpass-frontend -f frontend/Dockerfile ./frontend
```

### Run Individual Containers

```bash
# Backend
docker run -p 5000:8080 strongpass-backend

# Frontend
docker run -p 3000:80 strongpass-frontend
```

## 📊 Testing Coverage

The project includes comprehensive tests:

- **Service Tests**: Password generation logic, character sets, exclusions, strength calculation
- **Controller Tests**: API endpoints, validation, error handling
- **Integration Tests**: Full request/response cycle testing

Target coverage: **>80%** for Services and Controllers

## 🔐 Security Features

- **Cryptographically Secure Random**: Uses `System.Security.Cryptography.RandomNumberGenerator`
- **No Password Storage**: Passwords are never stored server-side
- **HTTPS Ready**: Production-ready SSL/TLS support
- **Security Headers**: X-Frame-Options, X-Content-Type-Options, X-XSS-Protection
- **Input Validation**: Comprehensive request validation
- **Error Handling**: No sensitive information leaked in errors

## 🎨 UI/UX Highlights

- **Dark Theme**: Modern dark mode with gradient backgrounds
- **Real-time Feedback**: Instant password strength updates
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Copy to Clipboard**: One-click password copying with visual confirmation
- **Password Visibility Toggle**: Show/hide generated password
- **Smooth Animations**: Polished transitions and micro-interactions

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 👤 Author

Built with ❤️ using C# .NET 10 and React TypeScript

---

**Note**: All passwords are generated client-side using cryptographically secure algorithms. No passwords are ever transmitted or stored on any server.
