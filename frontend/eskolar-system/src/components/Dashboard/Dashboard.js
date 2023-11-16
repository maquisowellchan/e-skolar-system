import LeftNavBarUser from "../LeftNavBarUser/LeftNavBarUser"
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../csscomponents/UserDashboard.css'
import WebFont from 'webfontloader';
import { useState, useEffect } from "react";

export default function Dashboard(){

    useEffect(() => {
        WebFont.load({
          google: {
            families: ["Lexend"],
          },
        });
      }, []);
    return(
        <>
        <div className="dashboard-container">
            <LeftNavBarUser />
            <div className="dashboard-content">
                <h1>Welcome, applicant.name</h1>
                <h2>FEATURED SCHOLARSHIP</h2>
            </div>
        </div>
        </>
    )
}