import React, { useState, useEffect } from 'react';
import WebFont from 'webfontloader';
import eskolarLogo from '../../image/eskolar.png';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getCsrfToken = () => {
    const csrfCookie = document.cookie.split('; ').find((row) => row.startsWith('csrftoken='));
    if (csrfCookie) {
      return csrfCookie.split('=')[1];
    }
    console.error('CSRF token not found in cookies.');
    return null;
  };

  // Inside the handleLogin function
// Inside the handleLogin function
  const handleLogin = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCsrfToken(),
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      console.log('Response Data:', response);

      if (response.ok) {

        const responseData = await response.json();


        if (responseData.jwt) {
          localStorage.setItem('jwt', responseData.jwt);
          console.log('Stored Token:', responseData.jwt);

          const storedApplicantId = localStorage.getItem('applicant_id');

          if (storedApplicantId) {
            console.log('Applicant ID is stored:', storedApplicantId);
          } else {
            console.log('Applicant ID is not stored in localStorage.');
          }


          // Fetch user details, assuming you have an endpoint for that
          const userResponse = await fetch('http://127.0.0.1:8000/api/fetchroles/', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${responseData.jwt}`,
            },
            credentials: 'include',
          });

          if (userResponse.ok) {
            const users = await userResponse.json();

            if (users.length > 0) {
              const user = users[0];
              // Log the user object to inspect its structure
              console.log('User object:', user);

              // Check the user's role and navigate accordingly
              switch (user.role) {
                case 'admin':
                  navigate('/admindashboard');
                  break;
                case 'director':
                  navigate('/directordashboard');
                  break;
                case 'head':
                  navigate('/headdashboard');
                  break;
                case 'staff':
                  navigate('/staffdashboard');
                  break;
                case 'student':
                  navigate('/dashboard');
                  break;
                default:
                  console.error('Unknown role:', user.role);
                  break;
              }
            } else {
              console.error('User array is empty');
            }
          } else {
            console.error('Failed to fetch user details');
          }
        } else {
          console.error('JWT token not found in the response');
        }
      } else {
        const errorResponse = await response.json();
        setError(errorResponse.message || 'Login failed'); // Set error message

        // Automatically hide the error message after 3 seconds
        setTimeout(() => {
          setError(null);
        }, 3000);
      }
    } catch (error) {
      console.error('Login request error:', error);
    }
  };


  

  const closeError = () => {
    setError(null);
  };

  useEffect(() => {
    WebFont.load({
      google: {
        families: ['Lexend'],
      },
    });

    // Add event listener to close the error message when clicking outside
    document.addEventListener('click', closeError);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener('click', closeError);
    };
  }, []);

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <>
      <div className="logincontainer bg-cover bg-center bg-fixed bg-opacity-75">
        <div className="signincontainer mx-auto p-4 md:p-8 bg-white rounded-md shadow-lg md:w-3/4 lg:w-2/3">
          <div className="leftcontainer md:w-1/2">
            <h1 className="text-3xl md:text-4xl">Login</h1>
            <p className="text-base md:text-lg">
              Doesn't have an account yet? <a href="/signup">SignUp</a>
            </p>
            <div className="form-container" onClick={stopPropagation}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="warmtech023@sample.com"
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your Password"
                />
              </div>
              <a className="forgotpass">Forgot Password?</a>
              <button onClick={handleLogin}>Login</button>
            </div>
          </div>
          <div className="rightcontainer">
            <img src={eskolarLogo} alt="Eskolar Logo" className="eskolarlogo" />
          </div>
        </div>
      </div>

      {error && (
        <div className="error-dialog fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white p-4 rounded-md text-base">
          {error}
        </div>
      )}
    </>
  );
};

export default Login;
