import 'bootstrap/dist/css/bootstrap.min.css';
import WebFont from 'webfontloader';
import { useState, useEffect } from "react";
import ApplicantSideBar from '../../Navbar/ApplicantSideBar/ApplicantSideBar';
import axios from 'axios';
import { useAuth } from '../../OtherComponents/AuthProvider/AuthProvider';
import { Navigate } from 'react-router-dom';

export default function Dashboard() {
  const [userProfile, setUserProfile] = useState({});
  const { isAuthenticated } = useAuth();

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
    const token = localStorage.getItem('jwt');
    console.log('Token from localStorage:', token);

    if (token) {
      fetchUserProfile(token);
    } else {
      console.error('Token not found.');
    }
  }, []);

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

  return (
    <>
      <ApplicantSideBar />

      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">

          <h1 className='text-xxl font-bold'>Welcome, {userProfile.first_name}</h1>
          <h2 className='mt-10 text-base'>FEATURED SCHOLARSHIPS</h2>

        </div>
      </div>
    </>
  );
}
