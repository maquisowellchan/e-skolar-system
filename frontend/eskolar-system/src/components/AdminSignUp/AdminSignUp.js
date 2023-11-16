import React from "react";
import { useState, useEffect } from "react";
import "../../App.css";
import axios from "axios";
import WebFont from 'webfontloader';

export default function AdminSignUp(){

    const [formData, setFormData] = useState({
        employee_id: "",
        first_name: "",
        last_name: "",
        email: "",
        password: "",
      });
      const [error, setError] = useState("")
    
      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Extract the CSRF token from the hidden input field
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    
        try {
          const response = await axios.post("http://127.0.0.1:8000/api/registeradmin/", formData, {
            headers: {
              "X-CSRFToken": csrfToken,
            },
          });
          console.log(response.data);
        } catch (error) {
          if (error.response && error.response.status === 400) {
            setError("Email already exists."); 
        } else {
          console.error(error);
      }
        }
      };
    
      useEffect(() => {
        WebFont.load({
          google: {
            families: ["Lexend"],
          },
        });
      }, []);
    

    return(
        <>

            <div className="signupcontainer">
      <div className="titlecontainer">
        <h1>e-SKOLAR</h1>
      </div>
      <h1 className="signup">Sign Up</h1>
      <div className="registercontainer">
      <form onSubmit={handleSubmit}>
        <div className="input-row2">
        <input
            type="number"
            name="employee_id"
            placeholder="Employee Id"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-row2">
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
    <input type="hidden" name="csrfmiddlewaretoken" value="{% csrf_token %}" />
    <div className="button-container">
        <button className="cancel-button"> <a href="/">Cancel</a></button>
        <button type="submit" className="register-button">Register</button>
      </div>
    
  </form>
</div>

    </div>
        </>
    )
}