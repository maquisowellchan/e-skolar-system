import React from "react";
import { useState, useEffect } from "react";
import "../../App.css";
import axios from "axios";
import WebFont from 'webfontloader';
import eskolarLogo from '../../image/eskolar.png';

export default function SignUp() {
  const [formData, setFormData] = useState({
    student_id: "",
    course: "",
    first_name: "",
    last_name: "",
    email: "",
    year_level: "",
    password: "",
    re_password: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Extract the CSRF token from the hidden input field
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/register/", formData, {
        headers: {
          "X-CSRFToken": csrfToken,
        },
      });

      if (response.status === 201) {
        const responseData = response.data;
        const token = responseData.token;

        localStorage.setItem('userToken', token);

        // Log the response data to the console (you can remove this line in production)
        console.log(responseData);
      }
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleRePasswordVisibility = () => {
    setShowRePassword(!showRePassword);
  };

  return (
    <div className="signupcontainer">
      <div className="titlecontainer">
        <img src={eskolarLogo} alt="Eskolar Logo" className="eskolarlogo2" />
      </div>
      <h1 className="signup">Sign Up</h1>
      <div className="registercontainer">
        <form onSubmit={handleSubmit}>
          <div className="input-row2">
            <input
              type="text"
              name="student_id"
              placeholder="Student ID"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="course"
              placeholder="Course"
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-row2">
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
            <select
              name="year_level"
              onChange={handleChange}
              className="select-field"
              required
            >
              <option value="" disabled selected>
                Select Year Level
              </option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>
          <div className="input-row2">

            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
            
            <input
              type="password"
              name="re_password"
              placeholder="Re-enter Password"
              onChange={handleChange}
              required
            />          
          </div>
          {error && <p className="error-message">{error}</p>}
          <input type="hidden" name="csrfmiddlewaretoken" value="{% csrf_token %}" />
          <div className="button-container">
            <button className="cancel-button" onClick={() => window.location.href = "/"}>Cancel</button>
            <button type="submit" className="register-button">Register</button>
          </div>
        </form>
      </div>
    </div>
  );
}
