import React from "react";
import { useState, useEffect } from "react";
import '../../../App.css'
import 'bootstrap/dist/css/bootstrap.css';
import AdminSideBar from "../../Navbar/AdminSideBar/AdminSideBar";
import { useAuth } from '../../OtherComponents/AuthProvider/AuthProvider';
import { Navigate } from 'react-router-dom';

export default function AdminManageStudent(){

    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/" />;
      }

    return(
        <>
   
            {/* <BatchRegistration />
            <LeftNavBar activeRoles={false} activeStudent={true} activePrograms={false} /> */}
            <AdminSideBar />

            
            <div className="p-4 sm:ml-64">
                <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
                
                
                
                
                
                </div>
            </div>
        </>
    )
}