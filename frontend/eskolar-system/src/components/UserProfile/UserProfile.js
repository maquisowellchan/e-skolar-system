import React, { useState, useEffect } from 'react';
import WebFont from 'webfontloader';
import LeftNavBarUser from "../LeftNavBarUser/LeftNavBarUser"
import '../../csscomponents/UserProfile.css'

export default function UserProfile() {
    const [userProfile, setUserProfile] = useState({});

    useEffect(() => {
      const token = localStorage.getItem('userToken');
  
      if (token) {
        fetchUserProfile(token);
      } else {
        console.error('Token not found.');
      }
    }, []);
  
    const fetchUserProfile = async (token) => {
      try {
        const response = await fetch('http://localhost:8000/userprofile/', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          }).then(response => response.json())
          .then(data => console.log(data))
          .catch(error => console.error('Error:', error));
  
        if (response.ok) {
          const data = await response.json();
          setUserProfile(data);
        } else {
          console.error('Failed to fetch user profile data.');
        }
      } catch (error) {
        console.error('API request error:', error);
      }
    };
  return (

    <>
    <div className="profile-container">
            <LeftNavBarUser />
            <div className="profile-content">
                <h2>User Profile</h2>
      <p>First Name: {userProfile.first_name}</p>
      <p>Last Name: {userProfile.last_name}</p>
      <p>Email: {userProfile.email}</p>
      <p>Phone Number: {userProfile.phone_number}</p>
      {userProfile.profile_picture && (
        <img src={userProfile.profile_picture} alt="Profile" style={{ maxWidth: '100px' }} />
      )}
            
            </div>
        </div>
    </>
    
  );
}
