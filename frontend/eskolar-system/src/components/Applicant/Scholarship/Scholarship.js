import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../csscomponents/UserDashboard.css'
import WebFont from 'webfontloader';
import { useState, useEffect } from "react";
import '../../../csscomponents/UserScholarship.css'
import ApplicantSideBar from '../../Navbar/ApplicantSideBar/ApplicantSideBar';
import { useAuth } from '../../OtherComponents/AuthProvider/AuthProvider';
import { Navigate } from 'react-router-dom';

export default function Scholarship(){

  const { isAuthenticated } = useAuth();

    useEffect(() => {
        WebFont.load({
          google: {
            families: ["Lexend"],
          },
        });
      }, []);

      if (!isAuthenticated) {
        return <Navigate to="/" />;
      }
    return(
        <>
        <ApplicantSideBar />

        <div className="p-4 sm:ml-64">
            <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
                
            <h1>Scholarship</h1>              
                
                
            </div>
        </div>
        
        </>
    )
}