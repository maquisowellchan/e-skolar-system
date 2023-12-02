import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WebFont from 'webfontloader';
import samplecover from '../../../image/samplecover.png'
import '../../../csscomponents/output.css'
import ApplicantSideBar from '../../Navbar/ApplicantSideBar/ApplicantSideBar';
import { useAuth } from '../../OtherComponents/AuthProvider/AuthProvider';
import { Navigate } from 'react-router-dom';

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState({});
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    console.log('Token from localStorage:', token);
  
    if (token) {
      fetchUserProfile(token);
    } else {
      console.error('Token not found.');
    }
  }, []);

  const getCsrfToken = () => {
    const csrfCookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('csrftoken='));
  
    if (csrfCookie) {
      return csrfCookie.split('=')[1];
    }
  
    console.error('CSRF token not found in cookies.');
    return null;
  };

  const fetchUserProfile = async (token) => {
    try {
      const response = await axios.get('http://localhost:8000/api/userview/', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
          'X-CSRFToken': getCsrfToken(),
        },
        withCredentials: true, 
      });

      console.log('Sent Token:', token);
      console.log('Request:', response);

      if (response.status === 200) {
        setUserProfile(response.data);
      } else {
        console.error('Failed to fetch user profile data.');
      }
    } catch (error) {
      console.error('API request error:', error);
    }
  };

  useEffect(() => {
    WebFont.load({
      google: {
        families: ['Lexend'],
      },
    });
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <>
    <ApplicantSideBar />

    <div className="p-4 sm:ml-64">
            <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
                
      <div className="profile-container">
        <div className='profile-content relative'>
          <div className="profile-subcontent w-4/5 bg-slate-50 h-full rounded-lg relative overflow-auto">
          <div className='coverphoto'>
              <img
                src={samplecover}
                alt="Cover"
                className="h-48 w-11/12 object-cover object-center mx-auto mt-6 rounded-lg"
              />
            </div>

            <div className='profilepic-content absolute top left-1/3 transform -translate-x-1/2 -translate-y-1/2'>
              <div className='alterprofilepic flex items-center'>
                {userProfile.profile_picture ? (
                  <img
                    src={userProfile.profile_picture}
                    alt="Profile"
                    className="h-32 w-32 object-cover object-center mx-auto mt-6 rounded-full"
                  />
                ) : (
                  <div className="h-36 w-36 bg-gray-300 mx-auto mt-6 rounded-xl"></div>
                  
                )}
                <div className="ml-4 text-left">
                  <p className="font-['Lexend'] font-bold text-xl mt-20">{userProfile.first_name} {userProfile.last_name}</p>
                  <p className="font-['Lexend'] font-light text-base">{userProfile.user_id}</p>
                </div>
              </div>
            </div>

            <div className="button-container absolute top-1/5 right-8 mt-4 transform -translate-y-1/2">
              {/* Add your button here */}
              <button className="bg-blue-500 text-white p-2 rounded">Edit Profile</button>
            </div>
            <div className='personaldetails-container mt-28 flex justify-around'>
            <div className='leftpersonaldet-container overflow-visible'>
                <p className="font-['Lexend'] font-bold text-xxl mt-4" style={{ color: '#0A1274' }}>Personal Details</p>

                <div className="mt-4">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="p-2 border rounded-md w-72"
                    value={userProfile.email}
                    readOnly
                  />
                </div>

                <div className="mt-4">
                  <label htmlFor="yearLevel" className="block text-sm font-semibold text-gray-700">
                    Year Level
                  </label>
                  <input
                    type="text"
                    id="yearLevel"
                    name="yearLevel"
                    className="p-2 border rounded-md w-72"
                    value={userProfile.year_level}
                    readOnly
                  />
                </div>

                <div className="mt-4">
                  <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    className="p-2 border rounded-md w-72"
                    value={userProfile.phone_number}
                    readOnly
                  />
                </div>

                <div className="mt-4">
                  <label htmlFor="status" className="block text-sm font-semibold text-gray-700">
                    Status
                  </label>
                  <input
                    type="text"
                    id="status"
                    name="status"
                    className="p-2 border rounded-md w-72"
                    value={userProfile.status}
                    readOnly
                  />
                </div>
              </div>
              <div className="rightpersonaldet-container mt-6">
                <p className="font-['Lexend'] font-bold text-xxl mb-4" style={{ color: '#0A1274' }}>Inbox</p>
                <div
                  className="message-box"
                  style={{ width: '350px', height: '350px', border: '1px solid #cbd5e0', borderRadius: '8px', padding: '8px', overflowY: 'auto' }}
                >
                  {/* Display messages here */}
                  <p>System: Your message goes here...</p>
                  {/* Add more messages as needed */}
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>     
                
                
            </div>
        </div>
      
    </>
  );
};

export default UserProfile;
