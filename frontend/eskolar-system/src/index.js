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
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import AdminManageRoles from './components/AdminManageRoles/AdminManageRoles';
import AdminManageStudent from './components/AdminManageStudent/AdminManageStudent';
import UserProfile from './components/UserProfile/UserProfile';
import ProfileManagement from './components/ProfileManagement/ProfileManagement';
import Application from './components/Application/Application';
import Scholarship from './components/Scholarship/Scholarship';

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
    path: "/application",
    element: <Application />
  },
  {
    path: "/scholarship",
    element: <Scholarship />
  },
  {
    path: "/adminsignup",
    element: <AdminSignUp />
  },
  {
    path: "/admindashboard",
    element: <AdminDashboard />
  },
  {
    path: "/adminmanageroles",
    element: <AdminManageRoles />
  },
  {
    path: "/adminmanagestudent",
    element: <AdminManageStudent />
  },
  {
    path: "/profile",
    element: <UserProfile />
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
