import React, { useState, useEffect } from 'react';
import axios from 'axios';

import AdminSideBar from "../../Navbar/AdminSideBar/AdminSideBar";
import { useAuth } from '../../OtherComponents/AuthProvider/AuthProvider';
import { Navigate } from 'react-router-dom';

export default function AdminSponsor() {
  const { isAuthenticated } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sponsorData, setSponsorData] = useState({
    sponsor_name: '',
    contact_person: '',
    contact_email: '',
    contact_number: null,
  });

  const [sponsorList, setSponsorList] = useState([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [currentSponsor, setCurrentSponsor] = useState(null);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSponsorData({
      sponsor_name: '',
      contact_person: '',
      contact_email: '',
      contact_number: null,
    });
  };

  const openUpdateModal = () => {
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setCurrentSponsor(null);
    setSponsorData({
      sponsor_name: '',
      contact_person: '',
      contact_email: '',
      contact_number: null,
    });
  };

  const handleUpdateModal = (sponsor) => {
    setCurrentSponsor(sponsor);
    setSponsorData({
      sponsor_id: sponsor.sponsor_id,
      sponsor_name: sponsor.sponsor_name,
      contact_person: sponsor.contact_person,
      contact_email: sponsor.contact_email,
      contact_number: sponsor.contact_number || '',
    });
    openUpdateModal();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSponsorData({ ...sponsorData, [name]: value });
  };

  const handleNumberChange = (event) => {
    const { name, value } = event.target;
    // Convert input value to a number or set to null if not a valid number
    const numberValue = isNaN(value) ? null : parseInt(value, 10);
    setSponsorData({ ...sponsorData, [name]: numberValue });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/sponsor/', sponsorData);
      if (response.status === 201) {
        console.log('Sponsor added successfully');
        closeModal();
        fetchSponsorList();
      } else {
        console.log('Failed to add sponsor');
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle error as needed
    }
  };

  const fetchSponsorList = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/sponsor/');
      setSponsorList(response.data);
    } catch (error) {
      console.error('Error fetching sponsor list:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`http://localhost:8000/api/sponsor/${currentSponsor.sponsor_id}/`, sponsorData);
      if (response.status === 200) {
        console.log('Sponsor updated successfully');
        fetchSponsorList();
        closeUpdateModal();
      } else {
        console.log('Failed to update sponsor');
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle error as needed
    }
  };

  const handleDelete = async (sponsorId) => {
    try {
      const response = await axios.delete(`http://localhost:8000/api/sponsor/${sponsorId}/`);
      if (response.status === 204) {
        console.log('Sponsor deleted successfully');
        fetchSponsorList();
        closeModal();
      } else {
        console.log('Failed to delete sponsor');
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle error as needed
    }
  };

  useEffect(() => {
    fetchSponsorList();
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
            <h1 className="text-xxl font-semibold text-[#0A1274]">Manage Sponsor</h1>
            <button onClick={openModal} className="bg-blue-500 text-white px-4 py-2 rounded">
              Add Sponsor
            </button>
          </div>

          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Sponsor Name</th>
                <th className="py-2 px-4 border-b">Contact Person</th>
                <th className="py-2 px-4 border-b">Contact Email</th>
                <th className="py-2 px-4 border-b">Contact Number</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sponsorList.map((sponsor) => (
                <tr key={sponsor.sponsor_id}>
                  <td className="py-2 px-4 border-b">{sponsor.sponsor_name}</td>
                  <td className="py-2 px-4 border-b">{sponsor.contact_person}</td>
                  <td className="py-2 px-4 border-b">{sponsor.contact_email}</td>
                  <td className="py-2 px-4 border-b">{sponsor.contact_number}</td>
                  <td className="py-2 px-4 border-b">
                    <button className="mr-2 text-blue-500 hover:underline" onClick={() => handleUpdateModal(sponsor)}>
                      Update
                    </button>
                    <button className="text-red-500 hover:underline" onClick={() => handleDelete(sponsor.sponsor_id)}>
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
                    <h3 className="text-xxl font-semibold">Add Sponsor</h3>
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
                        Sponsor Name:
                      </label>
                      <input
                        className="w-full border p-2 rounded"
                        type="text"
                        id="sponsor_name"
                        name="sponsor_name"
                        value={sponsorData.sponsor_name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contact_person">
                        Contact Person:
                      </label>
                      <input
                        className="w-full border p-2 rounded"
                        type="text"
                        id="contact_person"
                        name="contact_person"
                        value={sponsorData.contact_person}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contact_email">
                        Contact Email:
                      </label>
                      <input
                        className="w-full border p-2 rounded"
                        type="email"
                        id="contact_email"
                        name="contact_email"
                        value={sponsorData.contact_email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contact_number">
                        Contact Number:
                      </label>
                      <input
                        className="w-full border p-2 rounded"
                        type="text"
                        id="contact_number"
                        name="contact_number"
                        value={sponsorData.contact_number || ''}
                        onChange={handleNumberChange}
                      />
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
                        Sponsor Name:
                      </label>
                      <input
                        className="w-full border p-2 rounded"
                        type="text"
                        id="sponsor_name"
                        name="sponsor_name"
                        value={sponsorData.sponsor_name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contact_person">
                        Contact Person:
                      </label>
                      <input
                        className="w-full border p-2 rounded"
                        type="text"
                        id="contact_person"
                        name="contact_person"
                        value={sponsorData.contact_person}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contact_email">
                        Contact Email:
                      </label>
                      <input
                        className="w-full border p-2 rounded"
                        type="email"
                        id="contact_email"
                        name="contact_email"
                        value={sponsorData.contact_email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contact_number">
                        Contact Number:
                      </label>
                      <input
                        className="w-full border p-2 rounded"
                        type="text"
                        id="contact_number"
                        name="contact_number"
                        value={sponsorData.contact_number || ''}
                        onChange={handleNumberChange}
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={closeUpdateModal}
                        className="mr-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        onClick={handleUpdate}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Update Sponsor
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
