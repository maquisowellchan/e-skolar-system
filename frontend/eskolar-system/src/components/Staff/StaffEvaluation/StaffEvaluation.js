import React, { useState, useEffect } from 'react';
import StaffSideBar from '../../Navbar/StaffSideBar/StaffSideBar';
import { useAuth } from '../../OtherComponents/AuthProvider/AuthProvider';
import { Navigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

export default function StaffEvaluation() {
  const [applicants, setApplicants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showActive, setShowActive] = useState(true);
  const [selectedAction, setSelectedAction] = useState(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/fetchapplicants/');
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched applicants:', data);
          setApplicants(data);
        } else {
          console.log('Failed to fetch applicants');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while fetching applicants');
      }
    };

    fetchApplicants();
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  const handleViewClick = (applicant) => {
    // Logic for handling view action
    console.log('Viewing applicant:', applicant);
  };

  const handleRecommendClick = (applicant) => {
    // Logic for handling recommend action
    console.log('Recommending applicant:', applicant);
  };

  const handleDeleteClick = (applicant) => {
    // Logic for handling delete action
    console.log('Deleting applicant:', applicant);
  };

  const handleActionSelect = (action) => {
    // Logic for handling the selected action (e.g., Approve, Reject)
    console.log('Selected Action:', action);
    setSelectedAction(action);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const filteredApplicants = applicants.filter((applicant) =>
    applicant.first_name.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  const filteredApplicantsWithFilter = showActive
    ? filteredApplicants.filter((applicant) => applicant.status === 'active')
    : filteredApplicants;

  return (
    <>
      <StaffSideBar />

      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xxl font-semibold text-[#0A1274]">Manage Evaluation</h1>
            <div className="flex items-center">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search..."
                  className="px-4 py-2 border rounded-md pr-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute right-3 top-2">
                  <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                </div>
              </div>
              <button
                className={`ml-4 px-4 py-2 rounded-md ${showActive ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                onClick={() => setShowActive(!showActive)}
              >
                {showActive ? 'Active' : 'All'}
              </button>
            </div>
          </div>

          <div className="mb-4 flex justify-end">
            <div className="relative inline-block">
              <button
                onClick={toggleDropdown}
                className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-4 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                type="button"
              >
                <span className="sr-only">Action button</span>
                Action
                <svg
                  className={`w-2.5 h-2.5 ms-2.5 ${isDropdownOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                </svg>
              </button>

              <div
                id="dropdownAction"
                className={`absolute mt-2 z-10 ${isDropdownOpen ? 'block' : 'hidden'} bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600`}
              >
                <ul className="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownActionButton">
                  <li>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                      Accept
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                      Reject
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="table-container">
            <table className="mx-auto table-auto centered-table">
              <thead>
                <tr>
                  <th className="px-4 py-2">No.</th>
                  <th className="px-4 py-2">Full Name</th>
                  <th className="px-4 py-2">Course</th>
                  <th className="px-4 py-2">Year Level</th>
                  <th className="px-4 py-2">Age</th>
                  <th className="px-4 py-2">Sex</th>
                  <th className="px-4 py-2">Date of Birth</th>
                  <th className="px-4 py-2">Annual Income</th>
                  <th className="px-4 py-2">Application Form</th>
                  <th className="px-4 py-2">Official Copy of Grades</th>
                </tr>
              </thead>
              <tbody>
                {searchTerm && filteredApplicantsWithFilter.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No matching applicants found.
                    </td>
                  </tr>
                ) : (
                  filteredApplicantsWithFilter.map((applicant) => (
                    <tr key={applicant.id}>
                      <td className="border px-4 py-2">{applicant.user_id}</td>
                      <td className="border px-4 py-2">
                        {applicant.first_name} {applicant.last_name}
                      </td>
                      <td className="border px-4 py-2">{applicant.status}</td>
                      <td className="border px-4 py-2">
                        <div className="flex justify-center">
                          <button
                            className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                            onClick={() => handleViewClick(applicant)}
                          >
                            View
                          </button>
                          <button
                            className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                            onClick={() => handleRecommendClick(applicant)}
                          >
                            Recommend
                          </button>
                          <button
                            className="bg-red-500 text-white px-2 py-1 rounded"
                            onClick={() => handleDeleteClick(applicant)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
