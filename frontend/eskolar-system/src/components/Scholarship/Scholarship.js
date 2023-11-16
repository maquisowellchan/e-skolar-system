import LeftNavBarUser from "../LeftNavBarUser/LeftNavBarUser"
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../csscomponents/UserDashboard.css'
import WebFont from 'webfontloader';
import { useState, useEffect } from "react";
import '../../csscomponents/UserScholarship.css'

export default function Scholarship(){

    useEffect(() => {
        WebFont.load({
          google: {
            families: ["Lexend"],
          },
        });
      }, []);
    return(
        <>
        <div className="scholarship-container">
            <LeftNavBarUser />
            <div className="scholarship-content">
                <h1>Scholarship</h1>
            
            </div>
        </div>
        </>
    )
}