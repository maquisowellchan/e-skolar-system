import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareMinus, faSearch } from "@fortawesome/free-solid-svg-icons";
import AdminSideBar from "../../Navbar/AdminSideBar/AdminSideBar";
import { useAuth } from '../../OtherComponents/AuthProvider/AuthProvider';
import { Navigate } from 'react-router-dom';

export default function AdminManageRoles() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [Roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [updatedRole, setUpdatedRole] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { isAuthenticated } = useAuth();

  const fetchRoles = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/fetchroles/");
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched roles:", data);
        setRoles(data);
      } else {
        console.log("Failed to fetch roles");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while fetching roles");
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  const handleEditClick = (role) => {
    console.log("Editing role:", role);
    setSelectedRole({
      ...role,
      id: role.id,
    });
    setUpdatedRole(role.role);
    setIsModalOpen(true);
  };

  const handleUpdateClick = async () => {
    try {
      if (!selectedRole || !selectedRole.id) {
        console.log("Selected role does not have a valid ID");
        return;
      }

      console.log("Updating role with ID:", selectedRole.id);
      console.log("Updated role value:", updatedRole);

      const response = await axios.put(
        `http://localhost:8000/api/fetchroles/${selectedRole.id}/`,
        { role: updatedRole }
      );

      if (response.status === 200) {
        console.log("Role updated successfully");
        alert("Role updated successfully");
        setIsModalOpen(false);
        fetchRoles();
      } else {
        console.log("Failed to update role");
        alert("Failed to update role");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while updating role");
    }
  };

  // Filter roles based on the entered search term
  const filteredRoles = Roles.filter((role) =>
  role.first_name.toLowerCase().startsWith(searchTerm.toLowerCase())
);

  return (
    <>
      <AdminSideBar />

      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
          <div>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xxl font-semibold text-[#0A1274]">Manage Roles</h1>
          <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search..."
                  className="px-4 py-2 border rounded-md pr-10" // Increase right padding to accommodate the icon
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute right-3 top-2">
                  <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                </div>
              </div>
        </div>
        <div className="table-container">
        <table className="mx-auto table-auto centered-table">
          <thead>
            <tr>
              <th className="px-4 py-2">Employee ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {searchTerm && filteredRoles.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  No matching roles found.
                </td>
              </tr>
            ) : (
              filteredRoles.map((role) => (
                <tr key={role.id}>
                  <td className="border px-4 py-2">{role.user_id}</td>
                  <td className="border px-4 py-2">
                    {role.first_name} {role.last_name}
                  </td>
                  <td className="border px-4 py-2">{role.email}</td>
                  <td className="border px-4 py-2">{role.role}</td>
                  <td className="border px-4 py-2">
                    <div className="flex">
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                        onClick={() => handleEditClick(role)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        <FontAwesomeIcon icon={faSquareMinus} />
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

          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-8 rounded shadow-lg">
                <label
                  htmlFor="roleDropdown"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Select Role:
                </label>
                <select
                  id="roleDropdown"
                  value={updatedRole}
                  onChange={(e) => setUpdatedRole(e.target.value)}
                  className="w-full p-2 border rounded-md mb-4"
                >
                  <option value="admin">Admin</option>
                  <option value="director">Director</option>
                  <option value="head">Head</option>
                  <option value="staff">Staff</option>
                  <option value="student">Student</option>
                </select>
                <div className="flex justify-end">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                    onClick={handleUpdateClick}
                  >
                    Update Role
                  </button>
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
