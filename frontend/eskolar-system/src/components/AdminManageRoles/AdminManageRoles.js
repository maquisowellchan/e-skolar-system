import React from "react";
import { useState, useEffect } from "react";
import "../../App.css";
import axios from "axios";
import WebFont from 'webfontloader';
import LeftNavBar from "../LeftNavBar/LeftNavBar";
import 'bootstrap/dist/css/bootstrap.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faCirclePlus, faEdit, faSquareMinus } from "@fortawesome/free-solid-svg-icons";

export default function AdminManageRoles(){
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [Roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);

    

      const fetchRoles = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/fetchroles');
            if (response.ok) {
                const data = await response.json();
                setRoles(data);
            } else {
                console.log('Failed to fetch a form');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while fetching a form');
        }
    };

    useEffect(() => {
        fetchRoles(); 
    }, []);

    const handleEditClick = (role) => {
        setSelectedRole(role);
        setIsModalOpen(true);
        setRoles({
            employee_id: role.employee_id,
            first_name: role.first_name,
            last_name: role.last_name,
            email: role.email,
            roles: role.roles,
        });
      };

      const handleDeleteClick = async (role) => {
        try {
            const response = await fetch(`http://localhost:8000/api/fetchroles/${role.id}/`, {
                method: 'DELETE',
            });
            if (response.ok) {
                console.log('Form deleted successfully');
                alert('Form deleted successfully');
                fetchRoles(); // Fetch the updated list of Arts after deletion
            } else {
                console.log('Failed to delete a form');
                alert('Failed to delete a form');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while deleting a form');
        }
      };

    return(
        <>
        <div>
            <LeftNavBar activeRoles={true} activeStudent={false} activePrograms={false} />
        </div>

        <div>
        <div className="roletable-container">
                <table>
                    <thead>
                        <tr>
                            <th>Employee ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            {/* <th>Actions</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {Roles.map((role) => (
                            <tr key={role.employee_id}>
                                <td>{role.employee_id}</td>
                                <td>{role.first_name}</td>
                                <td>{role.last_name}</td>
                                <td>{role.email}</td>
                                <td>{role.roles}</td>
                                {/* <td>
                                    <button onClick={() => handleEditClick(role)}>
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                    <button onClick={() => handleDeleteClick(role)}>
                                        <FontAwesomeIcon icon={faSquareMinus} />
                                    </button>
                                </td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
        </div>
        </>
    )
}

