# 📚 LibraGenie - Library Management System

## BallastLane Technical Challenge

A modern, full-stack library management system built with **Rails 8.0** and **React 19**, demonstrating advanced web development skills, React integration, and production-ready code practices.

![Rails](https://img.shields.io/badge/Rails-8.0.2-red?logo=rubyonrails)
![React](https://img.shields.io/badge/React-19.1.0-blue?logo=react)
![Ruby](https://img.shields.io/badge/Ruby-3.3.4-red?logo=ruby)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.11-blue?logo=tailwindcss)

---

## 🎯 Challenge Overview

This project was developed as a technical assessment to demonstrate:

- **Full-stack development** expertise with modern Rails and React
- **React integration** in Rails applications using Turbo and Hotwire
- **Complex state management** and component architecture
- **Production-ready code** with proper error handling and testing
- **Modern web development** practices and patterns

---

## ✨ Features

### 📖 Core Library Management
- **Books Management**: Complete CRUD operations with advanced search and filtering
- **Authors Management**: Author profiles with book associations
- **Categories Management**: Book categorization and organization
- **Loans System**: Book borrowing and return tracking
- **User Authentication**: Secure login/logout with Devise

### ⚛️ React Integration
- **Hybrid Architecture**: Traditional Rails views + React components
- **Real-time Search**: Instant book search with live results
- **Interactive Dashboard**: Statistics and data visualization
- **Dynamic Forms**: Advanced form handling with React
- **Seamless Navigation**: Turbo-powered navigation with React compatibility

### 🔧 Technical Features
- **Rails 8.0**: Latest Rails features and conventions
- **React 19**: Modern React with concurrent features
- **Responsive Design**: Mobile-first approach with TailwindCSS
- **Test Coverage**: Comprehensive RSpec test suite
- **Production Ready**: Error handling, validation, and security

---

## 🏗️ Architecture

### Backend (Rails 8.0)
```
app/
├── controllers/         # RESTful controllers with JSON API support
├── models/             # ActiveRecord models with validations
├── services/           # Business logic and data processing
├── serializers/        # JSON response formatting
├── policies/           # Authorization and access control
└── views/              # ERB templates with React integration
```

### Frontend (React 19)
```
app/javascript/
├── components/         # React components
│   ├── Dashboard.jsx   # Interactive dashboard
│   ├── BooksList.jsx   # Books management
│   ├── SearchBooks.jsx # Real-time search
│   └── *Form.jsx       # Dynamic forms
└── application.js      # Entry point and React setup
```

### Key Technologies
- **Rails 8.0** - Backend framework with modern features
- **React 19** - Frontend UI library with concurrent features
- **Turbo/Hotwire** - Fast navigation and real-time updates
- **TailwindCSS** - Utility-first CSS framework
- **PostgreSQL** - Robust database with advanced features
- **Devise** - Authentication and user management
- **RSpec** - Testing framework with factory patterns

---

## 🚀 Quick Start

### Prerequisites
- **Ruby 3.3.4** or higher
- **Node.js 18+** and **Yarn**
- **PostgreSQL 16**
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/teraspace/LibraGenie.git
   cd LibraGenie
   ```

2. **Install dependencies**
   ```bash
   # Ruby dependencies
   bundle install

   # JavaScript dependencies
   yarn install
   ```

3. **Database setup**
   ```bash
   # Create and setup database
   bin/rails db:create
   bin/rails db:migrate

   # Seed with sample data
   bin/rails db:seed
   ```

4. **Start the development server**
   ```bash
   # Start all services (Rails server, asset compilation)
   bin/dev
   ```

5. **Access the application**
   - Open http://localhost:3000
   - Login with: `admin@libragenie.com` / `password123`

---

## 📱 Usage Guide

### User Roles & Authentication
- **Admin Users**: Full access to all features
- **Regular Users**: Can browse books and manage their loans
- **Guest Access**: Limited to browsing capabilities

### Core Workflows

#### 📚 Book Management
1. Navigate to "Books" → "Add New Book (React)"
2. Fill in book details with author and category
3. Save and manage inventory

#### 👤 Author Management
1. Go to "Authors" → "Add New Author (React)"
2. Create author profiles
3. Associate with books

#### 🏷️ Category Management
1. Access "Categories" → "Add New Category (React)"
2. Create and organize book categories
3. Filter books by categories

#### 📊 Dashboard Analytics
- View library statistics
- Monitor active loans
- Track overdue books
- Recent activity overview

---

## 🧪 Testing

### Running the Test Suite
```bash
# Run all tests
bundle exec rspec

# Run specific test files
bundle exec rspec spec/models/
bundle exec rspec spec/controllers/
bundle exec rspec spec/requests/

# Run with coverage
COVERAGE=true bundle exec rspec
```

### Test Structure
- **Model Tests**: Business logic validation
- **Controller Tests**: HTTP request/response testing
- **Request Tests**: API endpoint testing
- **System Tests**: End-to-end user workflows

---

## 🔧 Development

### Code Quality Tools
```bash
# Linting
bundle exec rubocop

# Security scanning
bundle exec brakeman

# Dependency audit
bundle audit
```

### Asset Compilation
```bash
# Build JavaScript assets
yarn build

# Build CSS assets
yarn build:css

# Watch for changes (development)
yarn watch
```

### Database Management
```bash
# Create migration
bin/rails generate migration AddFieldToModel field:type

# Run migrations
bin/rails db:migrate

# Rollback migration
bin/rails db:rollback

# Reset database
bin/rails db:reset
```

---

## 🏗️ Technical Highlights

### React Integration Strategy
- **ReactRootManager**: Custom root management system preventing duplicate React roots
- **Turbo Compatibility**: Seamless navigation between traditional Rails and React pages
- **Component Lifecycle**: Proper mounting/unmounting on Turbo navigation
- **Error Boundaries**: Graceful error handling in React components

### Performance Optimizations
- **Efficient Queries**: N+1 query prevention with `includes`
- **Smart Caching**: Strategic caching of expensive operations
- **Asset Optimization**: Modern asset pipeline with esbuild
- **Database Indexing**: Optimized indexes for search and filtering

### Security Features
- **CSRF Protection**: Rails-native CSRF token handling
- **SQL Injection Prevention**: Parameterized queries and strong parameters
- **XSS Protection**: Content sanitization and secure rendering
- **Authentication**: Secure session management with Devise

---

## 📦 Production Deployment

### Environment Setup
```bash
# Set production environment
export RAILS_ENV=production

# Precompile assets
bin/rails assets:precompile

# Setup production database
bin/rails db:create RAILS_ENV=production
bin/rails db:migrate RAILS_ENV=production
```

### Docker Support
```dockerfile
# Use provided Dockerfile for containerization
docker build -t libragenie .
docker run -p 3000:3000 libragenie
```

### Deployment Checklist
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Assets precompiled
- [ ] SSL certificates installed
- [ ] Monitoring setup
- [ ] Backup strategy implemented

---

## 🎯 Challenge Requirements Met

### ✅ Technical Requirements
- [x] **Modern Rails Application** (Rails 8.0 with latest features)
- [x] **React Integration** (React 19 with proper lifecycle management)
- [x] **Responsive Design** (Mobile-first with TailwindCSS)
- [x] **Database Design** (PostgreSQL with proper relationships)
- [x] **Authentication** (Devise with role-based access)
- [x] **Testing** (Comprehensive RSpec test suite)
- [x] **Code Quality** (Rubocop, security scanning, best practices)

### ✅ Functional Requirements
- [x] **CRUD Operations** (Books, Authors, Categories, Loans)
- [x] **Search & Filtering** (Real-time search with React)
- [x] **User Management** (Authentication and authorization)
- [x] **Data Relationships** (Complex associations and validations)
- [x] **Error Handling** (Graceful error management)
- [x] **Performance** (Optimized queries and caching)

### ✅ Advanced Features
- [x] **React Components** (Modern component architecture)
- [x] **Real-time Features** (Live search and updates)
- [x] **Production Ready** (Security, performance, monitoring)
- [x] **Documentation** (Comprehensive README and code comments)

---

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Run tests (`bundle exec rspec`)
5. Commit changes (`git commit -m 'Add AmazingFeature'`)
6. Push to branch (`git push origin feature/AmazingFeature`)
7. Open a Pull Request

### Code Standards
- Follow Rails conventions and best practices
- Write comprehensive tests for new features
- Maintain code coverage above 90%
- Use meaningful commit messages
- Update documentation for significant changes

---

## 📚 Additional Resources

### Documentation
- [Rails Guides](https://guides.rubyonrails.org/) - Official Rails documentation
- [React Documentation](https://react.dev/) - Official React documentation
- [TailwindCSS](https://tailwindcss.com/docs) - CSS framework documentation

### Project Structure
- `app/controllers/` - Application controllers
- `app/models/` - ActiveRecord models
- `app/javascript/components/` - React components
- `app/services/` - Business logic services
- `spec/` - Test files

---

## 👤 Author

**Developed by:** [Your Name]
**Contact:** [Your Email]
**GitHub:** [@teraspace](https://github.com/teraspace)
**Project Repository:** [LibraGenie](https://github.com/teraspace/LibraGenie)

---

## 🎖️ BallastLane Challenge Submission

This project demonstrates:
- **Full-stack development** expertise
- **Modern web technologies** implementation
- **Production-ready code** practices
- **Problem-solving** and architectural skills
- **Attention to detail** in UX/UI design

**Submission Date:** July 27, 2025
**Development Time:** [Estimated time]
**Technologies Showcased:** Rails 8.0, React 19, PostgreSQL, TailwindCSS, RSpec

---

## 📄 License

This project is created for the BallastLane technical challenge and is available for review and evaluation purposes.

---

**Built with ❤️ using Ruby on Rails and React**
