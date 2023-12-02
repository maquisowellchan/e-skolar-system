import 'bootstrap/dist/css/bootstrap.min.css';
import WebFont from 'webfontloader';
import { useState, useEffect } from 'react';
import ApplicantSideBar from '../../Navbar/ApplicantSideBar/ApplicantSideBar';
import { useAuth } from '../../OtherComponents/AuthProvider/AuthProvider';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

export default function Application() {
  const [formData, setFormData] = useState(null);
  const [userInput, setUserInput] = useState({}); // State to store user input
  const [applicantInfo, setApplicantInfo] = useState(null);
  const [userProfile, setUserProfile] = useState({});
  const { isAuthenticated } = useAuth();
  

  const getCsrfToken = () => {
    const csrfCookie = document.cookie.split('; ').find((row) => row.startsWith('csrftoken='));
    if (csrfCookie) {
      return csrfCookie.split('=')[1];
    }
    console.error('CSRF token not found in cookies.');
    return 'unknown'; 
  };

  useEffect(() => {
    WebFont.load({
      google: {
        families: ['Lexend'],
      },
    });
  }, []);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const formId = 1;
        const response = await fetch(`http://127.0.0.1:8000/forms/${formId}/`);

        if (response.ok) {
          const form = await response.json();
          console.log('Fetched Form:', form);
          setFormData(form);
        } else {
          console.error('Failed to fetch form data');
        }
      } catch (error) {
        console.error('Error fetching form data:', error);
      }
    };

    fetchForm();
  }, []); // Moved fetchForm to its own useEffect with an empty dependency array

  useEffect(() => {
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

          // Assuming the response includes the user's ID
          const userId = response.data.id;
          localStorage.setItem('id', userId);
          console.log('User ID:', userId);
        } else {
          console.error('Failed to fetch user profile data.');
        }
      } catch (error) {
        console.error('API request error:', error);
      }
    };

    const token = localStorage.getItem('jwt');
    console.log('Token from localStorage:', token);

    if (token) {
      fetchUserProfile(token);
    } else {
      console.error('Token not found.');
    }
  }, []); // Moved fetchUserProfile to its own useEffect with an empty dependency array

  useEffect(() => {
    const fetchApplicantInfo = async () => {
      try {
        // Check if formData is present
        if (formData) {
          console.log('Current formData:', formData); // Log the current formData

          let applicantId;

          // Check if applicant_id is directly present
          if (formData.applicant_id) {
            applicantId = formData.applicant_id;
          } else if (formData.transformed_fields) {
            // Check if applicant_id is in transformed_fields
            const applicantIdField = formData.transformed_fields.find(
              (field) => field.name === 'applicant_id'
            );
            if (applicantIdField) {
              applicantId = applicantIdField.value;
            }
          }

          if (applicantId) {
            const response = await fetch(
              `http://127.0.0.1:8000/api/fetchapplicants/${applicantId}/`
            );
            if (response.ok) {
              const applicantData = await response.json();
              console.log('Fetched Applicant Information:', applicantData);
              setApplicantInfo(applicantData);
            } else {
              console.error(
                'Failed to fetch applicant information. Response:',
                response
              );
            }
          } else {
            console.error('No applicant_id found in formData:', formData);
            // Handle the absence of applicant_id, e.g., set a default value or skip
          }
        }
      } catch (error) {
        console.error('Error fetching applicant information:', error);
      }
    };

    fetchApplicantInfo();
  }, [formData]);

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  const handleInputChange = (fieldName, value) => {
    setUserInput((prevInput) => {
      // If the field is a file input, handle it differently
      if (value instanceof File) {
        // Read the file and encode it as a base64 string
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Data = reader.result.split(",")[1];
          // Update state with the base64-encoded file data
          setUserInput((prevInput) => ({
            ...prevInput,
            [fieldName]: `data:${value.type};base64,${base64Data}`,
          }));
        };
        reader.readAsDataURL(value);
      } else {
        // For non-file inputs, handle as usual
        return {
          ...prevInput,
          [fieldName]: value,
        };
      }
    });
  };
  

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const jwtToken = localStorage.getItem('jwt');
      const csrfToken = getCsrfToken();
      console.log('CSRF Token:', csrfToken);

      // Ensure formData is not null before using formData.id
      if (formData) {
        const response = await fetch('http://127.0.0.1:8000/applications/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`,
            'X-CSRFToken': csrfToken,
          },  
          body: JSON.stringify({
            dynamic_form: formData.id,
            submission_application: userInput,
            applicant_id: userProfile.id,
          }),
          credentials: 'include',
        });

        if (response.ok) {
          console.log('Form submitted successfully');
          // You might want to redirect or show a success message here
        } else {
          const responseData = await response.json();
          console.error('Failed to submit form', responseData);
        }
      } else {
        console.error('Form data is null. Cannot submit form.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const renderFormFields = () => {
    if (formData && formData.fields && formData.fields.length > 0) {
      return formData.fields.map((field, index) => {
        const inputClass = "form-control w-60"; // Added w-full class for full width
  
        switch (field.type) {
          case 'text':
            return (
              <div key={index} className="mb-4">
                <label className="block text-gray-700">{field.name}</label>
                <input
                  type="text"
                  className={inputClass}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                />
              </div>
            );
          case 'number':
            return (
              <div key={index} className="mb-4">
                <label className="block text-gray-700">{field.name}</label>
                <input
                  type="number"
                  className={inputClass}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                />
              </div>
            );
          case 'date':
            return (
              <div key={index} className="mb-4">
                <label className="block text-gray-700">{field.name}</label>
                <input
                  type="date"
                  className={inputClass}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                />
              </div>
            );
          case 'file':
            return (
              <div key={index} className="mb-4">
                <label className="block text-gray-700">{field.name}</label>
                <input
                  type="file"
                  className={inputClass}
                  onChange={(e) => handleInputChange(field.name, e.target.files[0])}
                />
              </div>
            );
          case 'radio':
            return (
              <div key={index} className="mb-4">
                <label className="block text-gray-700">{field.name}</label>
                <div className="flex">
                  {field.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="form-check mr-4">
                      <input
                        type="radio"
                        className="form-check-input"
                        name={field.name}
                        value={option}
                        onChange={() => handleInputChange(field.name, option)}
                      />
                      <label className="form-check-label">{option}</label>
                    </div>
                  ))}
                </div>
              </div>
            );
          default:
            return null;
        }
      });
    } else {
      return null;
    }
  };
  
  

  return (
    <>
      <ApplicantSideBar />
      <div className="p-4 sm:ml-64 bg-gray-200 h-screen flex items-center justify-center">
        <div className="p-4 border-0 border-gray-200 border-solid rounded-lg dark:border-gray-700 max-w-md w-3/4 mx-auto bg-white shadow-lg">
          <h1 className="text-xl font-bold mb-4 text-center">{formData ? formData.formname : 'Loading...'}</h1>
          <form onSubmit={handleFormSubmit}>
            {renderFormFields()}
            <div className="flex justify-center">
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
  
}
