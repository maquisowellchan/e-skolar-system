  import React from 'react';
  import '../../App.css';
  import WebFont from 'webfontloader';
  import { useState, useEffect } from "react";
  import eskolarLogo from '../../image/eskolar.png';


  export default function Login(){

      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');

      const handleLogin = async () => {
        try {
          const response = await fetch('http://127.0.0.1:8000/api/login/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });
      
          if (response.status === 200) {
            const responseData = await response.json();
            const { token, user } = responseData;
      
            // Store the token and user details in localStorage
            localStorage.setItem('userToken', token);
            localStorage.setItem('userProfile', JSON.stringify(user));
      
            // Redirect to the user profile or another protected route
            window.location.href = '/dashboard';
          } else {
            // Handle authentication errors, e.g., show an error message
            console.error('Login failed');
          }
        } catch (error) {
          console.error('Login request error:', error);
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
          <div className='logincontainer'>
              <div className='signincontainer'>
                  <div className='leftcontainer'>
                      <h1>LogIn</h1>
                      <p>Doesn't have an account yet? <a href='/signup'>SignUp</a></p>
                      <div className="form-container">
                          <div className="form-group">
                          <label>Email</label>
                          <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='warmtech023@sample.com'></input>
                          </div>
                          <div className="form-group">
                          <label>Password</label>
                          <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Your Password'></input>
                          </div>
                          <a className='forgotpass'>Forgot Password?</a>
                          <button onClick={handleLogin}>Login</button>
                      </div>

                  </div>
                  <div className='rightcontainer'>
                        <img src={eskolarLogo} alt='Eskolar Logo' className='eskolarlogo' />
                        <h3>PORTAL</h3>
                      
                  </div>
              </div>
          </div>
          </>
      )
  }