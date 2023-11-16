import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

function UserProfile() {
  const [userProfile, setUserProfile] = useState({
    email: '',
    first_name: '',
    last_name: '',
    phone_number: '',
  });

  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    // Fetch user's profile data from the backend and set it in the state
    const userToken = localStorage.getItem('userToken'); // Retrieve the token from where you've stored it
    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };
  
    axios.get('http://127.0.0.1:8000/api/user-profile/', config) // Replace with your API endpoint
      .then((response) => {
        const userData = response.data;
        setUserProfile(userData);
      })
      .catch((error) => {
        console.error('Error fetching user profile:', error);
      });
  }, []);
  

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
  };

  const handleProfileUpdate = () => {
    // Prepare the data for profile update
    const updatedData = {
      email: userProfile.email,
      first_name: userProfile.first_name,
      last_name: userProfile.last_name,
      phone_number: userProfile.phone_number,
    };

    // Send a PUT request to update the user's profile
    const userToken = localStorage.getItem('userToken'); // Retrieve the token from where you've stored it
    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };

    axios.put('http://127.0.0.1:8000/api/user-profile/', updatedData, config) // Replace with your API endpoint
      .then((response) => {
        console.log('Profile updated successfully:', response);
      })
      .catch((error) => {
        console.error('Error updating user profile:', error);
      });
  };

  return (
    <div>
      <h2>User Profile</h2>
      <form>
        <label>Email:</label>
        <input type="text" name="email" value={userProfile.email} readOnly />

        <label>First Name:</label>
        <input type="text" name="first_name" value={userProfile.first_name} readOnly />

        <label>Last Name:</label>
        <input type="text" name="last_name" value={userProfile.last_name} readOnly />

        {/* Add more input fields for other profile information */}
        
        <label>Profile Picture:</label>
        <input type="file" onChange={handleProfilePictureChange} />

        <button type="button" onClick={handleProfileUpdate}>Update Profile</button>
      </form>
    </div>
  );
}

export default UserProfile;
