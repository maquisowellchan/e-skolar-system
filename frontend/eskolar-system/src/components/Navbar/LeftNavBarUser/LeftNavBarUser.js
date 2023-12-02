// LeftNavBarUser.js

import React, { useEffect } from "react";
import WebFont from 'webfontloader';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTachometerAlt, faUser, faClipboard, faHandHoldingHeart } from "@fortawesome/free-solid-svg-icons";
import { Link, NavLink } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../../image/logo.png'
import '../../csscomponents/LeftNavbarUser.css'
import { Navbar, Nav } from 'react-bootstrap';
import TopNavbarUser from "../TopNavBarUser/TopNavBarUser";

export default function LeftNavBarUser() {
  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Lexend"],
      },
    });
  }, {});

  const navLinkStyle = {
    fontSize: '20px',
    color: 'black',
  };

  return (
    <div className="left-navbar-container">
      <div className="left-navbar">
        <Navbar expand="lg">
          <Navbar.Brand href="/">
            <img src={logo} width={150} height={150} alt="Logo" />
          </Navbar.Brand>
          <Nav className="flex-column">
            <Nav.Link as={NavLink} to="/dashboard" style={navLinkStyle} activeClassName="active">
              Dashboard
            </Nav.Link>
            <Nav.Link as={NavLink} to="/application" style={navLinkStyle} activeClassName="active">
              Application
            </Nav.Link>
            <Nav.Link as={NavLink} to="/scholarship" style={navLinkStyle} activeClassName="active">
              Scholarship
            </Nav.Link>
            <Nav.Link as={NavLink} to="/profile" style={navLinkStyle} activeClassName="active">
              Profile
            </Nav.Link>
          </Nav>
        </Navbar>
      </div>
      <div className="top-navbar-user">
        <TopNavbarUser />
      </div>
    </div>
  );
}
