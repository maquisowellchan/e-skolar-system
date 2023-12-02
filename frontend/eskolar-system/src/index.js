import React from 'react';
import { createRoot } from "react-dom/client";
import {createBrowserRouter,RouterProvider} from "react-router-dom";
import './index.css';
import { AuthProvider } from './components/OtherComponents/AuthProvider/AuthProvider';
import Login from './components/Login/Login';
import SignUp from './components/SignUp/SignUp';
import Form from './components/Staff/Form/Form';
import Dashboard from './components/Applicant/Dashboard/Dashboard';
import AdminSignUp from './components/Admin/AdminSignUp/AdminSignUp'
import AdminDashboard from './components/Admin/AdminDashboard/AdminDashboard';
import AdminManageRoles from './components/Admin/AdminManageRoles/AdminManageRoles';
import AdminManageApplicant from './components/Admin/AdminManageApplicant/AdminManageApplicant'
import UserProfile from './components/Applicant/UserProfile/UserProfile';
import Application from './components/Applicant/Application/Application';
import Scholarship from './components/Applicant/Scholarship/Scholarship';
import StaffDashboard from './components/Staff/StaffDashboard/StaffDashboard';
import 'tailwindcss/tailwind.css';
import StaffApplicant from './components/Staff/StaffApplicant/StaffApplicant';
import StaffEvaluation from './components/Staff/StaffEvaluation/StaffEvaluation';
import StaffSponsor from './components/Staff/StaffSponsor/StaffSponsor';
import StaffPrograms from './components/Staff/StaffPrograms/StaffPrograms';
import StaffForms from './components/Staff/StaffForms/StaffForms';
import DirectorDashboard from './components/Director/DirectorDashboard/DirectorDashboard';
import DirectorReports from './components/Director/DirectorReports/DirectorReports';
import HeadDashboard from './components/Head/HeadDashboard/HeadDashboard';
import HeadApplicant from './components/Head/HeadApplicant/HeadApplicant';
import HeadEvaluation from './components/Head/HeadEvaluation/HeadEvaluation';
import HeadSponsor from './components/Head/HeadSponsor/HeadSponsor';
import HeadPrograms from './components/Head/HeadPrograms/HeadPrograms';
import HeadForms from './components/Head/HeadForms/HeadForms';
import AdminForms from './components/Admin/AdminForms/AdminForms';
import AdminSponsor from './components/Admin/AdminSponsor/AdminSponsor';
import AdminPrograms from './components/Admin/AdminPrograms/AdminPrograms';

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
    path: "/adminroles",
    element: <AdminManageRoles />
  },
  {
    path: "/adminapplicant",
    element: <AdminManageApplicant />
  },
  {
    path: "/adminform",
    element: <AdminForms />
  },
  {
    path: "/adminsponsor",
    element: <AdminSponsor />
  },
  {
    path: "/adminprograms",
    element: <AdminPrograms />
  },
  {
    path: "/profile",
    element: <UserProfile />
  },
  {
    path: "/staffdashboard",
    element: <StaffDashboard />
  },
  {
    path: "/staffapplicant",
    element: <StaffApplicant />
  },
  {
    path: "/staffevaluation",
    element: <StaffEvaluation />
  },
  {
    path: "/staffsponsor",
    element: <StaffSponsor/>
  },
  {
    path: "/staffprograms",
    element: <StaffPrograms/>
  },
  {
    path: "/staffform",
    element: <StaffForms/>
  },

  {
    path: "/directordashboard",
    element: <DirectorDashboard/>
  },
  {
    path: "/directorreports",
    element: <DirectorReports/>
  },
  {
    path: "/headdashboard",
    element: <HeadDashboard/>
  },
  {
    path: "/headapplicant",
    element: <HeadApplicant />
  },
  {
    path: "/headevaluation",
    element: <HeadEvaluation />
  },
  {
    path: "/headsponsor",
    element: <HeadSponsor/>
  },
  {
    path: "/headprograms",
    element: <HeadPrograms/>
  },
  {
    path: "/headform",
    element: <HeadForms/>
  },

]);

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider> 
);
