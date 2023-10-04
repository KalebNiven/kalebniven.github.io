import axios from "axios";

export async function fetchSpreadsheetData(sheetUrl, callback) {
    try {
        // Replace 'https://localhost:5000' with your Flask app's URL
        const response = await axios.post(`http://localhost:5000/get-spreadsheet-data`, { sheet_url: sheetUrl });

        // Update your state or do something with the data
        callback(response.data.data)
    } catch (error) {
        console.error('Error fetching spreadsheet data:', error);
    }
}

export async function generateContent(payload, callback) {
    try {
        // Replace 'https://localhost:5000' with your Flask app's URL
        const response = await axios.post(`http://localhost:5000/generate-content`, payload);

        // Update your state or do something with the data
        callback(response.data.data)
    } catch (error) {
        console.error('Error fetching spreadsheet data:', error);
    }
}