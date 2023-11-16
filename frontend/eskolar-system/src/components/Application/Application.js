import LeftNavBarUser from "../LeftNavBarUser/LeftNavBarUser"
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../csscomponents/UserDashboard.css'
import WebFont from 'webfontloader';
import { useState, useEffect } from "react";
import '../../csscomponents/UserApplication.css'

export default function Application(){

    useEffect(() => {
        WebFont.load({
          google: {
            families: ["Lexend"],
          },
        });
      }, []);
    return(
        <>
        <div className="application-container">
            <LeftNavBarUser />
            <div className="application-content">
                <h1>Application</h1>
            
            </div>
        </div>
        </>
    )
}