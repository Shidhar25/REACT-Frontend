# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Register Page

A Register page is available for new users to sign up. It supports multiple roles:
- User (Requester)
- Ambulance Driver
- Fire Truck Driver
- Police Officer

To use the Register page:
1. Ensure the backend is running at `http://localhost:8080`.
2. Add the `Register.jsx` file to your `src` directory (see code below).
3. Import and use the `Register` component in your app, e.g. in `App.jsx`:
   ```jsx
   import Register from './Register';
   // ...
   <Register />
   ```

The registration form will POST to `/auth/register` on your backend.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
