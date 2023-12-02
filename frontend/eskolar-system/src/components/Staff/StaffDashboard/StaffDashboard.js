import React, { useState, useRef, useEffect } from 'react';
import StaffSideBar from '../../Navbar/StaffSideBar/StaffSideBar';
import { useAuth } from '../../OtherComponents/AuthProvider/AuthProvider';
import { Navigate } from 'react-router-dom';

export default function StaffDashboard(){

   const { isAuthenticated } = useAuth();

   if (!isAuthenticated) {
      return <Navigate to="/" />;
    }



   return(
      <>
      <StaffSideBar/>

      <div className="p-4 sm:ml-64">
                <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
                
                
                
                
                
                </div>
            </div>
      </>
   )
}