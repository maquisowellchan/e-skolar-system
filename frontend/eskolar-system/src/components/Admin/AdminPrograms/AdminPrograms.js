import React, { useState, useEffect } from 'react';
import axios from 'axios';

import AdminSideBar from "../../Navbar/AdminSideBar/AdminSideBar";
import { useAuth } from '../../OtherComponents/AuthProvider/AuthProvider';
import { Navigate } from 'react-router-dom';

export default function AdminPrograms(){

  const { isAuthenticated } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [programData, setProgramData] = useState({  
    scholarship_type: '',
    scholarship_status: '',
    name: '',
    application_deadline: null,
    funding_amount: null,
    sponsor_id: null,
  });

  const [programList, setProgramList] = useState([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [currentProgram, setCurrentProgram] = useState(null);
  const [sponsorsList, setSponsorsList] = useState([]);


  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setProgramData({
        scholarship_type: '',
        scholarship_status: '',
        name: '',
        application_deadline: null,
        funding_amount: null,
        sponsor_id: null,
    });
  };

  const openUpdateModal = () => {
    setIsUpdateModalOpen(true);
  };

  const formattedDate = programData.application_deadline
  ? new Date(programData.application_deadline).toISOString().split('T')[0]
  : null;

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setCurrentProgram(null);
    setProgramData({
        scholarship_type: '',
        scholarship_status: '',
        name: '',
        application_deadline: null,
        funding_amount: null,
        sponsor_id: null,
    });
  };

  const handleUpdateModal = (program) => {
    setCurrentProgram(program);
    setProgramData({
      scholarship_id: program.scholarship_id,
      scholarship_status: program.scholarship_status,
      name: program.name,
      application_deadline: program.application_deadline || '',
      funding_amount: program.funding_amount || '',
      sponsor_id: program.sponsor_id || '',
    });
    openUpdateModal();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProgramData({ ...programData, [name]: value });
  };

  const handleNumberChange = (event) => {
    const { name, value } = event.target;
    // Check if the input is for the application_deadline field
    const numberValue = name === 'application_deadline' ? value : parseInt(value, 10);
    setProgramData({ ...programData, [name]: numberValue });
  };
  

  const handleSubmit = async () => {
    try {
      // Convert the date to the desired format
      const formattedDate = programData.application_deadline
        ? new Date(programData.application_deadline).toISOString().split('T')[0]
        : null;
  
      // Update the programData object with the formatted date
      const updatedProgramData = {
        ...programData,
        application_deadline: formattedDate,
      };
  
      const response = await axios.post('http://localhost:8000/api/program/', updatedProgramData);
  
      if (response.status === 201) {
        console.log('Program added successfully');
        closeModal();
        fetchProgramList();
      } else {
        console.log('Failed to add program');
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle error as needed
    }
  };

  const fetchProgramList = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/program/');
      setProgramList(response.data);
      
      const sponsorsResponse = await axios.get('http://localhost:8000/api/sponsor/');
      setSponsorsList(sponsorsResponse.data); 
    } catch (error) {
      console.error('Error fetching program or sponsor list:', error);
    }
  };
  

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`http://localhost:8000/api/program/${currentProgram.scholarship_id}/`, programData);
      if (response.status === 200) {
        console.log('Program updated successfully');
        fetchProgramList();
        closeUpdateModal();
      } else {
        console.log('Failed to update program');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (scholarship_id) => {
    try {
      const response = await axios.delete(`http://localhost:8000/api/program/${scholarship_id}/`);
      if (response.status === 204) {
        console.log('Program deleted successfully');
        fetchProgramList();
        closeModal();
      } else {
        console.log('Failed to delete program');
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle error as needed
    }
  };

  const SCHOLARSHIPTYPE_CHOICES = [
    ['Merit-Based', 'Merit-Based'],
    ['Need-Based', 'Need-Based'],
    ['STEM Scholarship', 'STEM Scholarship'],
  ];
  
  const SCHOLARSHIPSTATUS_CHOICES = [
    ['Open', 'Open'],
    ['Closed', 'Closed'],
    ['Pending Approval', 'Pending Approval'],
  ];

  useEffect(() => {
    fetchProgramList();
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <AdminSideBar />

      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xxl font-semibold text-[#0A1274]">Manage Programs</h1>
            <button onClick={openModal} className="bg-blue-500 text-white px-4 py-2 rounded">
              Add Programs
            </button>
          </div>

          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Scholarship Type</th>
                <th className="py-2 px-4 border-b">Scholarship Status</th>
                <th className="py-2 px-4 border-b">Application Deadline</th>
                <th className="py-2 px-4 border-b">Funding Amount</th>
                <th className="py-2 px-4 border-b">Sponsor ID</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
  {programList.map((program) => (
    <tr key={program.scholarship_id}>
      <td className="py-2 px-4 border-b">{program.name}</td>
      <td className="py-2 px-4 border-b">{program.scholarship_type}</td>
      <td className="py-2 px-4 border-b">{program.scholarship_status}</td>
      <td className="py-2 px-4 border-b">{program.application_deadline}</td>
      <td className="py-2 px-4 border-b">{program.funding_amount}</td>
      <td className="py-2 px-4 border-b">{program.sponsor_id}</td>
      <td className="py-2 px-4 border-b flex items-center justify-center">
      <button className="mr-2 text-blue-500 hover:underline bg-transparent" onClick={() => handleUpdateModal(program)}>
        Update
        </button>
        <button className="text-red-500 hover:underline bg-transparent" onClick={() => handleDelete(program.scholarship_id)}>
        Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>


          </table>

          {isModalOpen && (
            <div className="fixed inset-0 z-50 overflow-auto flex items-center justify-center">
              <div className="fixed inset-0 bg-black opacity-50"></div>
              <div className="relative mx-auto w-1/2 my-6">
                <div className="bg-white rounded-lg p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xxl font-semibold">Add Programs</h3>
                    <button
                      onClick={closeModal}
                      className="text-3xl font-semibold cursor-pointer"
                    >
                      &times;
                    </button>
                  </div>
                  <form>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sponsor_name">
                        Name
                      </label>
                      <input
                        className="w-full border p-2 rounded"
                        type="text"
                        id="name"
                        name="name"
                        value={programData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="scholarship_type">
                            Scholarship Type:
                        </label>
                        <select
                            className="w-full border p-2 rounded"
                            id="scholarship_type"
                            name="scholarship_type"
                            value={programData.scholarship_type}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Scholarship Type</option>
                            {SCHOLARSHIPTYPE_CHOICES.map((option) => (
                            <option key={option[0]} value={option[0]}>
                                {option[1]}
                            </option>
                            ))}
                        </select>
                        </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="scholarship_status">
                        Scholarship Status:
                      </label>
                      <select
                        className="w-full border p-2 rounded"
                        id="scholarship_status"
                        name="scholarship_status"
                        value={programData.scholarship_status}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Scholarship Status</option>
                        {SCHOLARSHIPSTATUS_CHOICES.map((option) => (
                          <option key={option[0]} value={option[0]}>
                            {option[1]}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contact_number">
                        Application Deadline:
                      </label>
                      <input
                        className="w-full border p-2 rounded"
                        type="date"
                        id="application_deadline"
                        name="application_deadline"
                        value={programData.application_deadline || ''}
                        onChange={handleNumberChange}
                        />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contact_number">
                        Funding Amount:
                      </label>
                      <input
                        className="w-full border p-2 rounded"
                        type="number"
                        id="funding_amount"
                        name="funding_amount"
                        value={programData.funding_amount || ''}
                        onChange={handleNumberChange}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contact_number">
                        Sponsor Name:
                      </label>
                      <select
                        className="w-full border p-2 rounded"
                        id="sponsor_id"
                        name="sponsor_id"
                        value={programData.sponsor_id}
                        onChange={handleInputChange}
                        >
                        <option value="">Select Sponsor</option>
                        {sponsorsList.map((sponsor) => (
                            <option key={sponsor.sponsor_id} value={sponsor.sponsor_id}>
                            {sponsor.sponsor_name}
                            </option>
                        ))}
                        </select>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="mr-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmit}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {isUpdateModalOpen && (
            <div className="fixed inset-0 z-50 overflow-auto flex items-center justify-center">
              <div className="fixed inset-0 bg-black opacity-50"></div>
              <div className="relative mx-auto w-1/2 my-6">
                <div className="bg-white rounded-lg p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xxl font-semibold">Update Sponsor</h3>
                    <button
                      onClick={closeUpdateModal}
                      className="text-3xl font-semibold cursor-pointer"
                    >
                      &times;
                    </button>
                  </div>
                  <form>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sponsor_name">
                        Name
                      </label>
                      <input
                        className="w-full border p-2 rounded"
                        type="text"
                        id="name"
                        name="name"
                        value={programData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="scholarship_type">
                            Scholarship Type:
                        </label>
                        <select
                            className="w-full border p-2 rounded"
                            id="scholarship_type"
                            name="scholarship_type"
                            value={programData.scholarship_type}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Scholarship Type</option>
                            {SCHOLARSHIPTYPE_CHOICES.map((option) => (
                            <option key={option[0]} value={option[0]}>
                                {option[1]}
                            </option>
                            ))}
                        </select>
                        </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="scholarship_status">
                        Scholarship Status:
                      </label>
                      <select
                        className="w-full border p-2 rounded"
                        id="scholarship_status"
                        name="scholarship_status"
                        value={programData.scholarship_status}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Scholarship Status</option>
                        {SCHOLARSHIPSTATUS_CHOICES.map((option) => (
                          <option key={option[0]} value={option[0]}>
                            {option[1]}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contact_number">
                        Application Deadline:
                      </label>
                      <input
                        className="w-full border p-2 rounded"
                        type="date"
                        id="application_deadline"
                        name="application_deadline"
                        value={programData.application_deadline || ''}
                        onChange={handleNumberChange}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contact_number">
                        Funding Amount:
                      </label>
                      <input
                        className="w-full border p-2 rounded"
                        type="number"
                        id="funding_amount"
                        name="funding_amount"
                        value={programData.funding_amount || ''}
                        onChange={handleNumberChange}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contact_number">
                        Sponsor Name:
                      </label>
                      <select
                        className="w-full border p-2 rounded"
                        id="sponsor_id"
                        name="sponsor_id"
                        value={programData.sponsor_id}
                        onChange={handleInputChange}
                        >
                        <option value="">Select Sponsor</option>
                        {sponsorsList.map((sponsor) => (
                            <option key={sponsor.sponsor_id} value={sponsor.sponsor_id}>
                            {sponsor.sponsor_name}
                            </option>
                        ))}
                        </select>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="mr-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        onClick={handleUpdate}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}