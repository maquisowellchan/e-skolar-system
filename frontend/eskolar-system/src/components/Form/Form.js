import React from 'react';
import '../../App.css';
import WebFont from 'webfontloader';
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faCirclePlus, faEdit, faSquareMinus } from "@fortawesome/free-solid-svg-icons";

export default function Form(){
    const [isModalOpen, setIsModalOpen] = useState(false); // Initialize to true
    const [Forms, setForms] = useState({
        formname: '',
        effectivitydate: '',
        form_status: '',
  });
  const [selectedForm, setSelectedForm] = useState(null);
    const [Formy, setFormy] = useState([]);
    const handleFormChange = (event) => {
        setForms({
          ...Forms,
          [event.target.name]: event.target.value,
        });
      };

      const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('Form submitted');

        if (Forms.form_status !== 'active' && Forms.form_status !== 'inactive') {
            alert('Invalid form status. Please select a valid status.');
            return;
          }
    
        try {
            let response;
    
            if (selectedForm) {
                
                response = await fetch(`http://localhost:8000/forms/${selectedForm.id}/`, {
                    method: 'PUT', 
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(Forms), 
                });
            } else {
                
                response = await fetch('http://localhost:8000/forms/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(Forms)
                });
            }
    
            if (response.ok) {
                if (selectedForm) {
                    console.log('The form updated successfully');
                    alert('The form updated successfully');
                } else {
                    console.log('The form added successfully');
                    alert('The form added successfully');
                }
                setForms({
                    formname: '',
                    effectivitydate: '',
                    form_status: '',
                });
                setIsModalOpen(false);
                fetchForms();
            } else {
                console.log('Failed to add/update a form');
                alert('Failed to add/update a form');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while adding/updating a form');
        }
    };

    useEffect(() => {
        WebFont.load({
          google: {
            families: ["Lexend"],
          },
        });
      }, []);

      const openModal = () => {
        setIsModalOpen(true);
        setSelectedForm(null);
        setForms({
            formname: '',
            effectivitydate: '',
            form_status: '',
        });
      };

      const closeModal = () => {
        setIsModalOpen(false);
      };

      const fetchForms = async () => {
        try {
            const response = await fetch('http://localhost:8000/forms/');
            if (response.ok) {
                const data = await response.json();
                setFormy(data);
            } else {
                console.log('Failed to fetch a form');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while fetching a form');
        }
    };

    useEffect(() => {
        fetchForms(); 
    }, []);

    const handleEditClick = (form) => {
        setSelectedForm(form);
        setIsModalOpen(true);
        setForms({
            formname: form.formname,
            effectivitydate: form.effectivitydate,
            form_status: form.form_status,
        });
      };

      const handleDeleteClick = async (form) => {
        try {
            const response = await fetch(`http://localhost:8000/forms/${form.id}/`, {
                method: 'DELETE',
            });
            if (response.ok) {
                console.log('Form deleted successfully');
                alert('Form deleted successfully');
                fetchForms(); // Fetch the updated list of Arts after deletion
            } else {
                console.log('Failed to delete a form');
                alert('Failed to delete a form');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while deleting a form');
        }
      };

      return (
        <>
        <div className="main-content">
                    <div className="button-container">
                    <button onClick={openModal} className="center-button"><FontAwesomeIcon icon={faCirclePlus} style={{color:'white', width:25, height:25, marginRight:10}} /> FORMS</button>
                      </div>
              <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Form Name</th>
                            <th>Effectivity Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Formy.map((form) => (
                            <tr key={form.id}>
                                <td>{form.formname}</td>
                                <td>{form.effectivitydate}</td>
                                <td>{form.form_status}</td>
                                <td>
                                    <button onClick={() => handleEditClick(form)}>
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                    <button onClick={() => handleDeleteClick(form)}>
                                        <FontAwesomeIcon icon={faSquareMinus} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            </div>

            <div className={`modal ${isModalOpen ? 'modal-open' : 'modal-close'}`}>
          <div className="modal-content">
            <FontAwesomeIcon className="close" style={{ width: 35, height: 35 }} icon={faClose} onClick={closeModal} />
            <div>
              <div className="input-row">
                <div className="input-col">
                  <h2>Form Name</h2>
                  <input type="text" value={Forms.formname} name="formname" onChange={handleFormChange} />
                </div>
                <div className="input-col">
                  <h2>Effectivity Date</h2>
                  <input type="date" value={Forms.effectivitydate} name="effectivitydate" onChange={handleFormChange} />
                </div>
                <div className="input-col">
                  <h2>Status</h2>
                  <select value={Forms.form_status} name="form_status" onChange={handleFormChange}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    </select>
                </div>
              </div>
              <div className="button-container2">
                <button type="submit" onClick={handleSubmit} className="addbutton">Submit</button>
              </div>
            </div>
          </div>
        </div>
        </>
      )
}