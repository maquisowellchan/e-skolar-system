import React, { useState } from "react";
import axios from "axios";
import "../../App.css";

export default function BatchRegistration(){

    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type === "text/csv") {
          setSelectedFile(file);
        } else {
          alert("Please select a valid CSV file.");
          event.target.value = null; // Clear the input field
        }
      };

    const handleUpload = () => {

        if(selectedFile){
            const formData = new FormData();
            formData.append("file", selectedFile);

            axios.post("/api/upload-csv", formData).then((response)=> {

            })
        } else {
            const fileInput = document.querySelector('input[type="file"]');
            fileInput.click();
        }
    }

    return(
        <>
        <div className="batch-registration">
            <input type="file" accept=".csv" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload CSV</button>
        </div>
        </>
    )

}