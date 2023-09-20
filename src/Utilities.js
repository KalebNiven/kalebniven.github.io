// utilities.js

import axios from "axios";



export async function sendTokenToServer(token, client_id) {
  try {
    const response = await fetch('https://localhost:5000/google-auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, client_id }),
    });
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

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


export function  validateAndParseRows(selectedRow, totalRows, spreadsheet) {
    if (!selectedRow) {
        throw new Error("Please specify row(s) to proceed.");
    }

    // Validate selectedRow input
    const rowRegex = /^(?:\d+|\d+-\d+)(?:,\s*(?:\d+|\d+-\d+))*$/;
    if (!rowRegex.test(selectedRow)) {
        throw new Error("Invalid row input. Please enter numeric values or ranges separated by commas.");
    }

    // Parse the selectedRow string to get individual rows or a range of rows
    const ranges = selectedRow.split(',').map((range) => range.trim());
    const selectedRows = [];
    
    // Further validations to check individual numbers or ranges
    for (let range of ranges) {
        if (range.includes('-')) {
            const [start, end] = range.split('-').map(Number);
            
            // Validate the start and end range values
            if (start < 1 || end > totalRows || start >= end) {
                throw new Error(`Invalid range: ${range}. Please provide a valid range.`);
            }
            
            selectedRows.push(...spreadsheet.slice(start - 1, end));
        } else {
            const rowNum = Number(range);
            // Validate individual row number
            if (rowNum < 1 || rowNum > totalRows) {
                throw new Error(`Invalid row number: ${range}. Please provide a valid row number.`);
            }
            selectedRows.push(spreadsheet[rowNum - 1]);
        }
    }
    
    return selectedRows;
}

export const createDoc = async (title, content, email, setDocUrl) => {
    try {
      const response = await axios.post('https://localhost:5000/create-doc', {
        title,
        content,
        email,
      });
      console.log('Document created:', response.data);
  
      setDocUrl(response.data.docUrl); // Set the docUrl state variable
      return response.data;
    } catch (error) {
      console.error('Error creating doc:', error);
      throw error;
    }
  };
  
