import React from 'react';
import '../../App.css';
import WebFont from 'webfontloader';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClose,
  faCirclePlus,
  faEdit,
  faSquareMinus,
} from '@fortawesome/free-solid-svg-icons';

export default function Form() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [Forms, setForms] = useState({
    formname: '',
    effectivitydate: '',
    form_status: 'active',
    fields: [],
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
  
    if (Forms.form_status !== 'active' && Forms.form_status !== 'inactive') {
      alert('Invalid form status. Please select a valid status.');
      return;
    }
  
    try {
      const formData = {
        formname: Forms.formname,
        effectivitydate: Forms.effectivitydate,
        form_status: Forms.form_status,
        fields: Forms.fields,
      };
  
      let response;
  
      if (selectedForm) {
        response = await fetch(`http://localhost:8000/forms/${selectedForm.id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      } else {
        response = await fetch('http://localhost:8000/forms/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
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
          form_status: 'active',
          fields: [],
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
        families: ['Lexend'],
      },
    });
  }, []);

  const addField = () => {
    const newField = {
      name: 'New Field',
      type: 'text',
    };
  
    setForms({
      ...Forms,
      fields: [...Forms.fields, newField],
    });
  };

  const handleFieldChange = (event, index) => {
    const updatedFields = [...Forms.fields];
    updatedFields[index][event.target.name] = event.target.value;
    setForms({
      ...Forms,
      fields: updatedFields,
    });
  };

  const openModalForCreate = () => {
    setIsModalOpen(true);
    setIsEditing(false);
    setSelectedForm(null);
    setForms({
      formname: '',
      effectivitydate: '',
      form_status: 'active',
      fields: [],
    });
  };

  const openModalForEdit = (form) => {
    setIsModalOpen(true);
    setIsEditing(true);
    setSelectedForm(form);
    setForms({
      formname: form.formname,
      effectivitydate: form.effectivitydate,
      form_status: form.form_status,
      fields: form.fields || [],
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
        console.log('Failed to fetch forms');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while fetching forms');
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  const renderDynamicFields = () => {
    return Forms.fields.map((field, index) => (
      <div key={index} className="input-row">
        <div className="input-col">
          <input
            type="text"
            value={field.name}
            name="name"
            placeholder="Field Name"
            onChange={(e) => handleFieldChange(e, index)}
          />
        </div>
        <div className="input-col">
          <select
            value={field.type}
            name="type"
            onChange={(e) => handleFieldChange(e, index)}
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="date">Date</option>
          </select>
        </div>
      </div>
    ));
  };

  const handleDeleteClick = async (form) => {
    try {
      const response = await fetch(`http://localhost:8000/forms/${form.id}/`, {
        method: 'DELETE',
      });
      if (response.ok) {
        console.log('Form deleted successfully');
        alert('Form deleted successfully');
        fetchForms();
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
          <button onClick={openModalForCreate} className="center-button">
            <FontAwesomeIcon
              icon={faCirclePlus}
              style={{ color: 'white', width: 25, height: 25, marginRight: 10 }}
            />{' '}
            FORM
          </button>
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
                    <button onClick={() => openModalForEdit(form)}>
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
          <FontAwesomeIcon
            className="close"
            style={{ width: 35, height: 35 }}
            icon={faClose}
            onClick={closeModal}
          />
          <div>
            <div className="input-row">
              <div className="input-col">
                <h2>Form Name</h2>
                <input type="text" value={Forms.formname} name="formname" onChange={handleFormChange} />
              </div>
              <div className="input-col">
                <h2>Effectivity Date</h2>
                <input
                  type="date"
                  value={Forms.effectivitydate}
                  name="effectivitydate"
                  onChange={handleFormChange}
                />
              </div>
              <div className="input-col">
                <h2>Status</h2>
                <select value={Forms.form_status} name="form_status" onChange={handleFormChange}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            {isEditing && (
              <>
                <h2>Dynamic Form Fields</h2>
                <button onClick={addField}>Add Field</button>
                <div>{renderDynamicFields()}</div>
              </>
            )}
            <div className="button-container2">
              <button type="submit" onClick={handleSubmit} className="addbutton">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
