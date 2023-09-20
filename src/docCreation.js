

export const handleGeneration = async () => {
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