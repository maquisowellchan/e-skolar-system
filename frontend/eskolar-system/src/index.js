import React from 'react';
import { createRoot } from "react-dom/client";
import {createBrowserRouter,RouterProvider,Route,Link,} from "react-router-dom";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Login from './components/Login/Login';
import SignUp from './components/SignUp/SignUp';
import Form from './components/Form/Form';
import Dashboard from './components/Dashboard/Dashboard';
import AdminSignUp from './components/AdminSignUp/AdminSignUp';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/signup",
    element: <SignUp />
  },
  {
    path: "/form",
    element: <Form />
  },
  {
    path: "/dashboard",
    element: <Dashboard />
  },
  {
    path: "/adminsignup",
    element: <AdminSignUp />
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
