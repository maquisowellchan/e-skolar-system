import React, { useEffect } from "react";
import "../../App.css";
import WebFont from 'webfontloader';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTachometerAlt, faUser, faClipboard, faHandHoldingHeart, faUniversity, faUsers } from "@fortawesome/free-solid-svg-icons"; 
import { Link, useLocation } from "react-router-dom";

export default function LeftNavBar({ activeRoles, activeStudent, activePrograms, activeDashboard }) {
  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Lexend"],
      },
    });
  }, []);

  return (
    <div className="left-nav-menu bg-dark text-white">
      <ul className="list-unstyled text-center">
        <li className={`menu-item d-flex align-items-center justify-content-center ${activeDashboard ? 'active' : ''}`}>
        <Link to="/admindashboard" className="nav-link">
          <span className="menu-icon center-icon">
            <FontAwesomeIcon icon={faTachometerAlt} />
          </span>
          <span className="menu-label">Dashboard</span>
          </Link>
        </li>
        <li className={`menu-item d-flex align-items-center justify-content-center ${activeStudent ? 'active' : ''}`}>
        <Link to="/adminmanagestudent" className="nav-link">
          <span className="menu-icon center-icon">
            <FontAwesomeIcon icon={faUser} />
          </span>
          <span className="menu-label">Student</span>
          </Link>
        </li>
        <li className="menu-item d-flex align-items-center justify-content-center">
          <span className="menu-icon center-icon">
            <FontAwesomeIcon icon={faClipboard} />
          </span>
          <span className="menu-label">Evaluation</span>
        </li>
        <li className="menu-item d-flex align-items-center justify-content-center">
          <span className="menu-icon center-icon">
            <FontAwesomeIcon icon={faHandHoldingHeart} />
          </span>
          <span className="menu-label">Sponsor</span>
        </li>
        <li className="menu-item d-flex align-items-center justify-content-center">
          <span className="menu-icon center-icon">
            <FontAwesomeIcon icon={faUniversity} />
          </span>
          <span className="menu-label">Programs</span>
        </li>
        <li className={`menu-item d-flex align-items-center justify-content-center ${activeRoles ? 'active' : ''}`}>
        <Link to="/adminmanageroles" className="nav-link">
          <span className="menu-icon center-icon">
          <FontAwesomeIcon icon={faUsers} />
          </span>
          <span className="menu-label">Roles</span>
        </Link>
        </li>
      </ul>
    </div>
  );
}
