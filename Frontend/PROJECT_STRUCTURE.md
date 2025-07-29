# Frontend Project Structure

This document explains the organized structure of your React frontend project.

## 📁 Directory Structure

```
src/
├── components/           # Reusable UI components
│   ├── Auth/            # Authentication related components
│   │   ├── login.jsx    # Login component
│   │   └── Register.jsx # Registration component
│   ├── Dashboard/       # Dashboard components for different user types
│   │   ├── AmbulanceDashboard.jsx
│   │   ├── FireDashboard.jsx
│   │   ├── PoliceDashboard.jsx
│   │   └── UserDashboard.jsx
│   ├── Navigation/      # Navigation related components
│   │   └── NavigationMap.jsx
│   └── index.js         # Barrel exports for all components
├── pages/               # Page-level components
│   ├── Landing.jsx      # Landing page
│   └── index.js         # Barrel exports for pages
├── hooks/               # Custom React hooks
│   └── useApi.js        # API and form handling hooks
├── services/            # API service functions
│   └── api.js           # Centralized API calls
├── utils/               # Utility functions
│   └── helpers.js       # Common helper functions
├── constants/           # Application constants
│   └── index.js         # App-wide constants
├── contexts/            # React context providers
│   └── AuthContext.js   # Authentication context
├── styles/              # Styling files
│   ├── App.css          # App-specific styles
│   ├── index.css        # Base styles
│   └── globals.css      # Global styles and CSS variables
├── assets/              # Static assets
│   ├── images/          # Image files
│   ├── icons/           # Icon files
│   └── react.svg        # React logo
├── App.jsx              # Main App component
└── main.jsx             # Application entry point
```

## 🎯 Key Benefits of This Structure

### 1. **Separation of Concerns**
- Components are organized by functionality
- Services handle all API interactions
- Utilities contain reusable helper functions

### 2. **Scalability**
- Easy to add new components in appropriate folders
- Barrel exports make imports cleaner
- Clear separation between UI and business logic

### 3. **Maintainability**
- Related files are grouped together
- Consistent naming conventions
- Easy to locate and modify specific functionality

## 📝 Usage Guidelines

### Components
- Place reusable UI components in `src/components/`
- Group related components in subfolders
- Use barrel exports in `index.js` files for clean imports

### Pages
- Full-page components go in `src/pages/`
- These typically correspond to different routes

### Services
- All API calls should be centralized in `src/services/`
- Use the provided `apiCall` function for consistency

### Hooks
- Custom hooks go in `src/hooks/`
- Follow the `use` naming convention

### Constants
- App-wide constants in `src/constants/`
- Helps avoid magic strings/numbers

### Contexts
- React contexts for global state management
- Authentication, theme, etc.

## 🔧 Import Examples

Thanks to barrel exports, you can now import components cleanly:

```javascript
// Instead of multiple imports
import Login from './components/Auth/login';
import Register from './components/Auth/Register';
import UserDashboard from './components/Dashboard/UserDashboard';

// You can do this
import { Login, Register, UserDashboard } from './components';
```

## 🚀 Next Steps

1. **Environment Variables**: Create `.env` files for different environments
2. **Testing**: Add `__tests__` folders alongside components
3. **Documentation**: Add README files in complex component folders
4. **Types**: Consider adding TypeScript for better type safety
5. **Routing**: Consider using a more structured routing approach with protected routes

## 📋 File Naming Conventions

- **Components**: PascalCase (e.g., `UserDashboard.jsx`)
- **Hooks**: camelCase starting with 'use' (e.g., `useApi.js`)
- **Utilities**: camelCase (e.g., `helpers.js`)
- **Constants**: UPPER_SNAKE_CASE for values, camelCase for files
- **Styles**: kebab-case or camelCase (e.g., `globals.css`)

This structure provides a solid foundation for your React application that can grow and scale effectively!
