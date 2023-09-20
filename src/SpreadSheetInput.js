import React, { useState } from 'react';
import axios from 'axios';
// import { fetchSpreadsheetData } from './Utilities'; // Adjust the path accordingly

export async function fetchSpreadsheetData(sheetUrl, setSpreadsheet) {
  try {
      // Replace 'https://localhost:5000' with your Flask app's URL
      const response = await fetch(`https://localhost:5000/get-spreadsheet-data?sheetUrl=${encodeURIComponent(sheetUrl)}`);
      
      if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
      }
      
      const data = await response.json();
      alert(data.message);

      // Update your state or do something with the data
      setSpreadsheet(data.data);

      console.log(data);
  } catch (error) {
      console.error('Error fetching spreadsheet data:', error);
  }
}

function SpreadsheetInput({ setError, setSpreadsheet }) {
  const [inputType, setInputType] = useState('');
  const [rows, setRows] = useState([]); 
  const [spreadsheetUrl, setSpreadsheetUrl] = useState(process.env.DEFAULT_GOOGLE_SPREADSHEET_URL); // Define spreadsheetUrl and its setter

  


 const handleSpreadsheetUpload = async (event) => {
  const file = event.target.files[0];
  
  const formData = new FormData();
  formData.append('file', file);
  
  try {
      const response = await axios.post('https://localhost:5000/upload-file', formData);
  
      if (response.data) {
        // Update the rows state with the data returned from the server
        setRows(JSON.parse(response.data.data));
        
        // Update the spreadsheet state in the parent component
        setSpreadsheet(JSON.parse(response.data.data));
      }
  } catch (error) {
      console.error('Error uploading file:', error);
  }
 };


  const handleSpreadsheetUrlChange = (event) => {
    setSpreadsheetUrl(event.target.value);
  };


  return (
    <div>
      <div>
        <label>
          Select Input Type:
          <select onChange={(e) => setInputType(e.target.value)}>
            <option value="">Select</option>
            <option value="file">Upload Spreadsheet</option>
            <option value="url">Google Spreadsheet URL</option>
          </select>
        </label>
      </div>
      {inputType === 'file' && (
        <div>
          <label>
            Upload Spreadsheet:
            <input type="file" onChange={handleSpreadsheetUpload} />
          </label>
        </div>
      )}
      {inputType === 'url' && (
        <div>
          <label>
            Google Spreadsheet URL:
            <input type="text" value={spreadsheetUrl} onChange={handleSpreadsheetUrlChange} />
          </label>
          <button onClick={() => fetchSpreadsheetData(spreadsheetUrl, setSpreadsheet)}>Fetch Data</button>
        </div>
      )}
    </div>
  );
}

export default SpreadsheetInput;
