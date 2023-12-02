import React, { useState, useEffect } from 'react';
import WebFont from 'webfontloader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../OtherComponents/AuthProvider/AuthProvider';
import { Navigate } from 'react-router-dom';
import AdminSideBar from '../../Navbar/AdminSideBar/AdminSideBar';

export default function AdminForms() {
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
  const [updateFormModalOpen, setUpdateFormModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const openUpdateFormModal = async (formId) => {
    setIsEditing(true);
    setSelectedForm(formList.find((form) => form.id === formId));
    setUpdateFormModalOpen(true);

    try {
      const response = await fetch(`http://localhost:8000/forms/${formId}/`);
      if (response.ok) {
        const formData = await response.json();
        setSelectedForm(formData);
        setForms({
          formname: formData.formname,
          effectivitydate: formData.effectivitydate,
          form_status: formData.form_status,
          fields: formData.fields || [],
        });
        setUpdateFormModalOpen(true);
      } else {
        console.log('Failed to fetch form data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  const closeUpdateFormModal = () => {
    setUpdateFormModalOpen(false);
  };  

  const handleFormChange = (event) => {
    const { name, value } = event.target;
  
    if (name === 'effectivitydate' && value) {
      // ... (your existing code)
    } else if (name === 'type' && value === 'file') {
      // If the selected type is 'file', add a new field with text type
      const newField = {
        name: 'New Field',
        type: 'text',
        options: [],
      };
      setForms((prevForms) => ({
        ...prevForms,
        fields: [...prevForms.fields, newField],
      }));
    } else {
      setForms({
        ...forms,
        [name]: value,
      });
    }
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

      console.log('formData:', formData);

      let response;

      if (isEditing && selectedForm) {
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

    setForms((prevForms) => ({
      ...prevForms,
      fields: [...prevForms.fields, newField],
    }));
  }; 

  const removeField = (index) => {
    setForms((prevForms) => {
      const updatedFields = [...prevForms.fields];
      updatedFields.splice(index, 1);
      return {
        ...prevForms,
        fields: updatedFields,
      };
    });
  };

  const handleFieldChange = (event, index) => {
    const { name, value, type } = event.target;
  
    if (type === 'file') {
      // If the selected type is 'file', add a new field with text type
      const newField = {
        name: 'New Field',
        type: 'file',  // Set the type to 'file'
        options: [],
      };
      setForms((prevForms) => ({
        ...prevForms,
        fields: [...prevForms.fields, newField],
      }));
    } else {
      setForms((prevForms) => ({
        ...prevForms,
        fields: prevForms.fields.map((field, i) =>
          i === index ? updateField(field, name, value, type) : field
        ),
      }));
    }
  };
  
  

  
  

  const updateField = (field, name, value) => {
    if (name === 'type') {
      if (value === 'radio') {
        return {
          ...field,
          type: 'radio',
          options: [''],
        };
      } else {
        return {
          ...field,
          type: value,
          options: [],
        };
      }
    } else {
      return {
        ...field,
        [name]: value,
      };
    }
  };

  const openModalForCreate = () => {
    setIsModalOpen(true);
    setIsEditing(false);
    setSelectedForm(null);
    setForms({
      formname: '', // Reset to an empty string
      effectivitydate: '', // Reset to an empty string
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

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }



  const renderDynamicFields = () => {
    if (isEditing) {
      return forms.fields.map((field, index) => (
        <div key={index} className="mb-4 border p-4 rounded">
          <div className="flex items-center">
            <div className="w-1/2 pr-2">
              {field.type === 'file' || field.type === 'date' || field.type === 'number' || field.type === 'radio' || field.type === 'text'  ? (
                <>
                <label className="block text-sm font-medium text-gray-700">File Name</label>
                <input
                  type={field.originalType}
                  value={field.name}
                  name="name"
                  placeholder="Field Name"
                  onChange={(e) => handleFieldChange(e, index)}
                  className="max-w-5xl w-72 p-2 rounded-sm border border-gray-300 focus:outline-none focus:border-blue-500"
                />
                </>
              ) : (
                <input
                  type={field.type === 'date' || field.type === 'number' || field.type === 'radio' ? 'text' : field.type}
                  value={field.name}
                  name="name"
                  placeholder="Field Name"
                  onChange={(e) => handleFieldChange(e, index)}
                  className="max-w-5xl w-72 p-2 rounded-sm border border-gray-300 focus:outline-none focus:border-blue-500"
                />
              )}
            </div>
            <div className="w-1/2 pl-2">

            <label className="block text-sm font-medium text-gray-700">File Type</label>
                <select
                  value={field.type}
                  name="type"
                  onChange={(e) => handleFieldChange(e, index)}
                  className="max-w-5xl w-72 p-2 rounded-sm border border-gray-300 focus:outline-none focus:border-blue-500"
                >
                  <option value="text">Text</option>
                  <option value="radio">Radio</option>
                  <option value="number">Number</option>
                  <option value="date">Date</option>
                  <option value="file">File</option>
                </select>
             
              {field.type === 'radio' && (
                <div>
                  {field.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center mt-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleRadioOptionChange(e, index, optionIndex)}
                        className="max-w-5xl w-72 p-2 rounded-sm border border-gray-300 focus:outline-none focus:border-blue-500"
                      />
                      <button
                        onClick={() => removeRadioOption(index, optionIndex)}
                        className="bg-red-500 text-white px-1 py-0.5 ml-2 rounded"
                      >
                        Remove Option
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
    } else {
      return null;
    }
  };

  const renderUpdateFormModal = () => {
    return (
      <div className={`modal ${updateFormModalOpen ? 'modal-open' : 'modal-close'}`}>
        <div className="modal-content p-4 max-w-md mx-auto bg-white shadow-md rounded-md">
          <h2 className="text-2xl font-bold mb-4 text-center">Update Form</h2>
          <input
            type="text"
            value={forms.formname}
            name="formname"
            onChange={handleFormChange}
            placeholder="Form Name"
            className="w-full border rounded p-2 mb-4"
          />
          <input
            type="date"
            value={forms.effectivitydate}
            name="effectivitydate"
            onChange={handleFormChange}
            placeholder="Effectivity Date"
            className="w-full border rounded p-2 mb-4"
          />
          <select
            value={forms.form_status}
            name="form_status"
            onChange={handleFormChange}
            className="w-full border rounded p-2 mb-4"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
  
          <div className="button-container2 mt-4 flex justify-end">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            >
              Update
            </button>
            <button
              onClick={closeUpdateFormModal}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  

  const handleRadioOptionChange = (event, fieldIndex, optionIndex) => {
    setForms((prevForms) => ({
      ...prevForms,
      fields: prevForms.fields.map((field, i) => (i === fieldIndex ? updateRadioOption(field, optionIndex, event.target.value) : field)),
    }));
  };

  const updateRadioOption = (field, optionIndex, value) => {
    const updatedOptions = [...field.options];
    updatedOptions[optionIndex] = value;
    return {
      ...field,
      options: updatedOptions,
    };
  };

  const addRadioOption = (fieldIndex) => {
    setForms((prevForms) => ({
      ...prevForms,
      fields: prevForms.fields.map((field, i) => (i === fieldIndex ? addOptionToRadio(field) : field)),
    }));
  };

  const addOptionToRadio = (field) => ({
    ...field,
    options: [...field.options, ''],
  });

  const removeRadioOption = (fieldIndex, optionIndex) => {
    setForms((prevForms) => ({
      ...prevForms,
      fields: prevForms.fields.map((field, i) => (i === fieldIndex ? removeOptionFromRadio(field, optionIndex) : field)),
    }));
  };

  const removeOptionFromRadio = (field, optionIndex) => {
    const updatedOptions = [...field.options];
    updatedOptions.splice(optionIndex, 1);
    return {
      ...field,
      options: updatedOptions,
    };
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
      <AdminSideBar />
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
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
            <div className="table-container mx-auto">
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
                      onClick={() => openUpdateFormModal(form.id)}
                      className="text-green-500"
                    > 
                      Update
                    </button>
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
            <div className="modal-content p-4">
              <FontAwesomeIcon
                className="close cursor-pointer"
                style={{ width: 35, height: 35 }}
                icon={faClose}
                onClick={closeModal}
              />


              {isEditing && (
                <>
                  <h2 className="text-xl font-bold mb-4 text-center">Dynamic Form Fields</h2>
                  <div className="flex items-center justify-center mb-4">
                    <button
                      onClick={addField}
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      Add Field
                    </button>
                  </div>
                  <div className="dynamic-fields-container overflow-y-auto max-h-56">
                    {renderDynamicFields()}
                  </div>
                </>
              )}

              {renderUpdateFormModal()}

              <div className="button-container2 mt-4">
                <button
                  onClick={handleSubmit}
                  className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
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

          {updateFormModalOpen && ( 
              <div className={`modal ${updateFormModalOpen ? 'modal-open' : 'modal-close'}`}>
              <div className="modal-content p-4 max-w-md mx-auto bg-white shadow-md rounded-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Update Form</h2>
                <input
                  type="text"
                  value={forms.formname}
                  name="formname"
                  onChange={handleFormChange}
                  placeholder="Form Name"
                  className="w-full border rounded p-2 mb-4"
                />
                <input
                  type="date"
                  value={forms.effectivitydate}
                  name="effectivitydate"
                  onChange={handleFormChange}
                  placeholder="Effectivity Date"
                  className="w-full border rounded p-2 mb-4"
                />
                <select
                  value={forms.form_status}
                  name="form_status"
                  onChange={handleFormChange}
                  className="w-full border rounded p-2 mb-4"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
        
                <div className="button-container2 mt-4 flex justify-end">
                  <button
                    onClick={handleSubmit}
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                  >
                    Update
                  </button>
                  <button
                    onClick={closeUpdateFormModal}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Cancel
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
