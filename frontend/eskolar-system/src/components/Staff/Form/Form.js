  import React, { useState, useEffect } from 'react';
  import WebFont from 'webfontloader';
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import { faClose, faCirclePlus } from '@fortawesome/free-solid-svg-icons';
  import '../../../App.css';

  export default function Form() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [forms, setForms] = useState({
      formname: '',
      effectivitydate: '',
      form_status: 'active',
      fields: [],
    });
    const [selectedForm, setSelectedForm] = useState(null);
    const [formList, setFormList] = useState([]);

    const handleFormChange = (event) => {
      setForms({
        ...forms,
        [event.target.name]: event.target.value,
      });
    };

    const handleSubmit = async (event) => {
      event.preventDefault();

      if (forms.form_status !== 'active' && forms.form_status !== 'inactive') {
        alert('Invalid form status. Please select a valid status.');
        return;
      }

      try {
        const formData = {
          formname: forms.formname,
          effectivitydate: forms.effectivitydate,
          form_status: forms.form_status,
          fields: forms.fields,
        };

        let response;

        if (isEditing && selectedForm) {
          response = await fetch(
            `http://localhost:8000/forms/${selectedForm.id}/`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(formData),
            }
          );
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
          if (isEditing && selectedForm) {
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
        options: [],
      };
    
      setForms({
        ...forms,
        fields: [...forms.fields, newField],
      });
    };

    const removeField = (index) => {
      const updatedFields = [...forms.fields];
      updatedFields.splice(index, 1);
      setForms({
        ...forms,
        fields: updatedFields,
      });
    };

    const handleFieldChange = (event, index) => {
      setForms((prevForms) => {
        const updatedFields = [...prevForms.fields];
        const { name, value } = event.target;
    
        // Set the type to text if it's not radio
        if (name === 'type' && value !== 'radio') {
          updatedFields[index].type = 'text';
        } else {
          updatedFields[index][name] = value;
        }
    
        // Reset options to an empty array if the type is 'radio'
        if (name === 'type' && value === 'radio') {
          updatedFields[index].options = [];
        }
    
        return {
          ...prevForms,
          fields: updatedFields,
        };
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
          setFormList(data);
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
      return forms.fields.map((field, index) => (
        <div key={index} className="mb-4">
          <div className="flex items-center">
            <div className="w-1/2 pr-2">
              <input
                type="text"
                value={field.name}
                name="name"
                placeholder="Field Name"
                onChange={(e) => handleFieldChange(e, index)}
                className="w-full border rounded p-2"
              />
            </div>
            <div className="w-1/2 pl-2">
              <select
                value={field.type}
                name="type"
                onChange={(e) => handleFieldChange(e, index)}
                className="w-full border rounded p-2"
              >
                <option value="text">Text</option>
                <option value="radio">Radio</option>
              </select>
              {field.type === 'radio' && (
                <div>
                  <h3 className="text-base font-bold mb-2">Radio Options</h3>
                  {field.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleRadioOptionChange(e, index, optionIndex)}
                        className="border rounded p-2 mr-2"
                      />
                      <button
                        onClick={() => removeRadioOption(index, optionIndex)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addRadioOption(index)}
                    className="bg-blue-500 text-white px-2 py-1 mt-2 rounded"
                  >
                    Add Option
                  </button>
                </div>
              )}
            </div>
            <div className="pl-2">
              <button
                onClick={() => removeField(index)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Remove Field
              </button>
            </div>
          </div>
        </div>
      ));
    };
    
    
    
    
    const handleRadioOptionChange = (event, fieldIndex, optionIndex) => {
      setForms((prevForms) => {
        const updatedFields = [...prevForms.fields];
        updatedFields[fieldIndex].options[optionIndex] = event.target.value;
        return {
          ...prevForms,
          fields: updatedFields,
        };
      });
    };
    
    const addRadioOption = (fieldIndex) => {
      setForms((prevForms) => {
        const updatedFields = [...prevForms.fields];
        updatedFields[fieldIndex].options.push('');
        return {
          ...prevForms,
          fields: updatedFields,
        };
      });
    };
    
    const removeRadioOption = (fieldIndex, optionIndex) => {
      setForms((prevForms) => {
        const updatedFields = [...prevForms.fields];
        updatedFields[fieldIndex].options.splice(optionIndex, 1);
        return {
          ...prevForms,
          fields: updatedFields,
        };
      });
    };
    

    const handleDeleteClick = async (form) => {
      try {
        const response = await fetch(
          `http://localhost:8000/forms/${form.id}/`,
          {
            method: 'DELETE',
          }
        );
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
            <button
              onClick={openModalForCreate}
              className="center-button bg-blue-500 text-white px-4 py-2 rounded"
            >
              <FontAwesomeIcon
                icon={faCirclePlus}
                className="mr-2"
                style={{ width: 25, height: 25 }}
              />
              FORM
            </button>
          </div>
          <div className="table-container">
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Form Name</th>
                  <th className="border p-2">Effectivity Date</th>
                  <th className="border p-2">Status</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {formList.map((form) => (
                  <tr key={form.id}>
                    <td className="border p-2">
                      <button
                        onClick={() => openModalForEdit(form)}
                        className="text-blue-500 underline"
                      >
                        {form.formname}
                      </button>
                    </td>
                    <td className="border p-2">{form.effectivitydate}</td>
                    <td className="border p-2">{form.form_status}</td>
                    <td className="border p-2">
                      <button
                        onClick={() => handleDeleteClick(form)}
                        className="text-red-500"
                      >
                        Delete
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
                  <input
                    type="text"
                    value={forms.formname}
                    name="formname"
                    onChange={handleFormChange}
                    className="w-full border rounded p-2"
                  />
                </div>
                <div className="input-col">
                  <h2>Effectivity Date</h2>
                  <input
                    type="date"
                    value={forms.effectivitydate}
                    name="effectivitydate"
                    onChange={handleFormChange}
                    className="w-full border rounded p-2"
                  />
                </div>
                <div className="input-col">
                  <h2>Status</h2>
                  <select
                    value={forms.form_status}
                    name="form_status"
                    onChange={handleFormChange}
                    className="w-full border rounded p-2"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              {isEditing && (
                <>
                  <h2 className="text-xl font-bold mb-4">Dynamic Form Fields</h2>
                  <button
                    onClick={addField}
                    className="bg-blue-500 text-white px-4 py-2 mb-4 rounded"
                  >
                    Add Field
                  </button>
                  <div>{renderDynamicFields()}</div>
                </>
              )}
              <div className="button-container2">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  {isEditing ? 'Update' : 'Save'}
                </button>
                <button
                  onClick={closeModal}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
