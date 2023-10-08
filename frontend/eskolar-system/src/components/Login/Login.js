import React from 'react';
import '../../App.css';
import WebFont from 'webfontloader';
import { useState, useEffect } from "react";


export default function Login(){

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
                        <input type='email' placeholder='warmtech023@sample.com'></input>
                        </div>
                        <div className="form-group">
                        <label>Password</label>
                        <input type='password' placeholder='Your Password blehhhh'></input>
                        </div>
                        <a className='forgotpass'>Forgot Password?</a>
                        <button>Login</button>
                    </div>

                </div>
                <div className='rightcontainer'>
                    <h1>Logo</h1>
                    <h2>e-SKOLAR</h2>
                    <h3>PORTAL</h3>
                </div>
            </div>
        </div>
        </>
    )
}