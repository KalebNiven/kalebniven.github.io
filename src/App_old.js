import React, { useState } from "react";
import "./App.css";
import GoogleLoginComponent from './GoogleLoginComponent'; // adjust the path as necessary
import { responseGoogle, fetchSpreadsheetData, validateAndParseRows, createDoc } from './Utilities';
import {handleSpreadsheetUpload, handleSpreadsheetUrlChange, handleSelectRows} from './Spreadsheet';
import axios from "axios";
	


function App() {
	const [inputType, setInputType] = useState(null);
	const [spreadsheet, setSpreadsheet] = useState(null);
	const [spreadsheetUrl, setSpreadsheetUrl] = useState("");
	const [rows, setRows] = useState([]);
	const [selectedRow, setSelectedRow] = useState(""); // Set the initial value to an empty string
	const [folder, setFolder] = useState(null);
	const [progress, setProgress] = useState(0);
	const [selectedRows, setSelectedRows] = useState([]);
	const [maxTokens, setMaxTokens] = useState(550);  // Default value is set to 550
	const [docUrl, setDocUrl] = useState(null);
	const [userData, setUserData] = useState(null);
	const [error, setError] = useState(null);

	const handleGeneration = async () => {
		try {
			setProgress(0);
	
			const totalRows = spreadsheet.length;
			const selectedRows = validateAndParseRows(selectedRow, totalRows, spreadsheet);
	
	
			setProgress(15); // Updated progress after parsing the rows
	
			// Step 1: Validate the selected rows
			const requiredFields = [
			"Blog Title", "Meta", "Instructions", "Headlines_1", "Keywords_1", "Headlines_2", "Keywords_2"
			];
	
			for (const row of selectedRows) {
			for (const field of requiredFields) {
				if (!row[field]) {
				throw new Error(`The field "${field}" cannot be empty. Please check row(s) and try again.`);
				}
			}
			}
			setProgress(25); // Updated progress after validating the fields
			// Step 2: Prepare the data
			// Transform the data from the selected rows into the format needed for content generation
			// Step 2: Prepare the data
			const preparedData = selectedRows.map(row => {
				return {
					'Blog Title': row['Blog Title'],
					'Meta': row['Meta'],
					'Instructions': row['Instructions'],
					'Headlines_1': row['Headlines_1'],
					'Keywords_1': row['Keywords_1'],
					'Headlines_2': row['Headlines_2'],
					'Keywords_2': row['Keywords_2'],
					'Facts': row['Facts'], // Include the 'Facts' field from your spreadsheet data
				};
			});
			
	
			setProgress(35); // Updated progress after preparing the data
	
			// Step 3: Initiate content generation
			const response = await axios.post('http://localhost:5000/generate-content', { 
				data: preparedData,
				max_tokens: Number(maxTokens),  // Include max_tokens in the payload
			});
			setProgress(45); // Updated progress after initiating content generation
	
			// console.log("response", response);
			if (response.data && response.data.data && response.data.data.length > 0) {
				console.log("Content generation was successful!", response.data.data);
			
				const generatedContents = response.data.data.map(item => item.choices[0].message.content);
				
				const increment = 50 / selectedRows.length;
				
				const promises = selectedRows.map((row, i) => {
					const title = row['Blog Title'];
					const content = generatedContents[i];
					
					return createDoc(title, content, email, setDocUrl)
					
						.then(docData => {
							const docUrl = docData.docUrl; // Assuming the URL is stored in a property named "url" in the response data
							console.log('Google Doc URL:', docUrl);
							// ... (use docUrl in your script)
						})
						.catch(error => {
							console.error('Failed to create Google Doc:', error);
						})
						.finally(() => {
							setProgress(Math.round(45 + ((i + 1) * increment)));
						});
				});
			
				await Promise.allSettled(promises);
			} else {
				// console.error("Content generation failed with the following data:", response.data);
				throw new Error("Content generation failed.");
			}
			
			setProgress(100);
		} catch (err) {
			setError(err.message);
		}
	};


	return (
		<div className="App">
			<h1>Content Generator</h1>
			<div>
			{error && <div className="error-text">{error}</div>}
			<GoogleLoginComponent 
				onLoginSuccess={responseGoogle} 
				onLoginFailure={responseGoogle} 
			/>
			{userData && <div>Welcome, {userData.givenName}</div>}
			</div>
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
			{inputType === "file" && (
				<div>
				<label>
					Upload Spreadsheet:
					<input type="file" onChange={handleSpreadsheetUpload} />
				</label>
				</div>
			)}

			{inputType === "url" && (
				<div>
					<label>
					c:
					<input type="text" value={spreadsheetUrl} onChange={handleSpreadsheetUrlChange} />
					</label>
					<button onClick={() => fetchSpreadsheetData(spreadsheetUrl)}>Fetch Data</button>

					{spreadsheet && (
						<div>
							<label>
							Specify row range (e.g., 1-5, 8, 11-13):
							<input type="text" value={selectedRow || ""} onChange={(e) => setSelectedRow(e.target.value)} />
							</label>
							<button onClick={handleSelectRows}>Select rows</button>
						</div>
					)}

					<div className="container">
						{selectedRows.length > 0 && selectedRows[0] && (
							<table className="table">
								<thead>
									<tr>
										<th>{Object.keys(selectedRows[0])[0]}</th>
									</tr>
								</thead>
								<tbody>
									{selectedRows.map((row, index) => (
										<tr key={index} className="smallRow">
											<td>{Object.values(row)[0]}</td>
										</tr>
									))}
								</tbody>
							</table>
						)}
					</div>

				</div>
			)}	
			<text> Max Tokens (OpenAPI)</text>
			<input type="number" id="maxTokens" name="maxTokens" min="1" max="2048" value={maxTokens} onChange={(e) => setMaxTokens(e.target.value)} />

			<div>
				<button classname="generate-content" onClick={handleGeneration}>Generate Content</button>
			</div>
			{/* ... (Add a progress indicator to show the progress to the users) */}
			<div>
				<progress value={progress} max="100"></progress>
			</div>

			{docUrl && (
				<div>
					<a href={docUrl} target="_blank" rel="noopener noreferrer">{docUrl}</a>
				</div>
			)}

				

				{error && <p className="error-message">{error}</p>}
			</div>
		);

	}

	export default App;