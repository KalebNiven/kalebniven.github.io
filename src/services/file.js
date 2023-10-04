import axios from "axios";
import { config } from "../config";

export async function fetchSpreadsheetData(sheetUrl, callback, errorCallback) {
    try {
        // Replace 'https://localhost:5000' with your Flask app's URL
        const response = await axios.post(`${config.apiURL}/get-spreadsheet-data`, { sheet_url: sheetUrl });

        // Update your state or do something with the data
        callback(response.data.data)
    } catch (error) {
        errorCallback("Error fetching spreadsheet. Please contact administrator");
        console.error('Error fetching spreadsheet data:', error);
    }
}

export async function generateContent(payload, callback, errorCallback) {
    try {
        // Replace 'https://localhost:5000' with your Flask app's URL
        const response = await axios.post(`${config.apiURL}/generate-content`, payload);

        // Update your state or do something with the data
        callback(response.data.data)
    } catch (error) {
        errorCallback("Error generating report. Please contact administrator");
        console.error('Error generating report:', error);
    }
}