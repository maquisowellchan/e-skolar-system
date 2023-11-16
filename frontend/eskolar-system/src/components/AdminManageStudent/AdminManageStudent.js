import React from "react";
import { useState, useEffect } from "react";
import "../../App.css";
import axios from "axios";
import WebFont from 'webfontloader';
import LeftNavBar from "../LeftNavBar/LeftNavBar";
import BatchRegistration from "../BatchRegistration/BatchRegistration";
import 'bootstrap/dist/css/bootstrap.css';

export default function AdminManageStudent(){

    return(
        <>
        <div>
            <BatchRegistration />
            <LeftNavBar activeRoles={false} activeStudent={true} activePrograms={false} />
        </div>
        </>
    )
}