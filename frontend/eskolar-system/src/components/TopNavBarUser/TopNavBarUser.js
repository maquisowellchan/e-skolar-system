// TopNavbar.js

import React from "react";
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import '../../csscomponents/LeftNavbarUser.css'

const TopNavbarUser = () => {
  return (
    <div className="top-navbar-user">
      <NavDropdown title="My Account" id="basic-nav-dropdown">
        <NavDropdown.Item href="#action/1">Action 1</NavDropdown.Item>
        <NavDropdown.Item href="#action/2">Action 2</NavDropdown.Item>
        <NavDropdown.Item href="#action/3">Action 3</NavDropdown.Item>
      </NavDropdown>
    </div>
  );
};

export default TopNavbarUser;
