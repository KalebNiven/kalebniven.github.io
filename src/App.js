import React, { useState } from 'react';
// import GoogleLoginComponent from 'react-google-login';
import SpreadsheetInput from './SpreadSheetInput'; // Remember to create and import this component
import { validateAndParseRows, createDoc, sendTokenToServer } from './Utilities';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import Layout from './components/Layout';
import FileSelection from './components/FileSelection';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';

function App() {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const [docUrl, setDocUrl] = useState(null);
    const [progress, setProgress] = useState(0);
    const [spreadsheet, setSpreadsheet] = useState('');
    const [selectedRow, setSelectedRow] = useState(3);
    const [selectedRows, setSelectedRows] = useState([]);
    const [maxTokens, setMaxTokens] = useState(750);
    const [email, setEmail] = useState(null);

    const handleLoginSuccess = async (response) => {
        console.log('Login Success:', response.profileObj);
        setUserData(response.profileObj);

        try {
            const token = response.tokenId; // Adjust this to correctly get the token from the response
            const client_id = process.env.REACT_APP_GOOGLE_CLIENT_ID // replace with your client ID
            const data = await sendTokenToServer(token, client_id);
            if (data.email) {
                setEmail(data.email);
            } else {
                throw new Error("Email not received");
            }
        } catch (error) {
            console.error('Error:', error);
            // Handle error appropriately
        }
    };

    const handleLoginFailure = (response) => {
        console.error('Login Failure:', response);
        setError('Failed to login. Please try again.');
    };



    const handleGeneration = async () => {
        try {
            setProgress(0);

            const selectedRows = getSelectedRows();
            validateRows(selectedRows);

            setProgress(15);

            const preparedData = prepareData(selectedRows);
            setProgress(35);

            const response = await initiateContentGeneration(preparedData);
            setProgress(45);

            await handleGenerationResponse(response, selectedRows);

            setProgress(100);
        } catch (err) {
            setError(err.message);
        }
    };

    const getSelectedRows = () => {
        const totalRows = spreadsheet.length;
        return validateAndParseRows(selectedRow, totalRows, spreadsheet);
    };

    const validateRows = (rows) => {
        const requiredFields = [
            "Blog Title", "Meta", "Instructions", "Headlines_1", "Keywords_1", "Headlines_2", "Keywords_2"
        ];

        for (const row of rows) {
            for (const field of requiredFields) {
                if (!row[field]) {
                    throw new Error(`The field "${field}" cannot be empty. Please check row(s) and try again.`);
                }
            }
        }
    };

    const prepareData = (rows) => {
        return rows.map(row => ({
            'Blog Title': row['Blog Title'],
            'Meta': row['Meta'],
            'Instructions': row['Instructions'],
            'Headlines_1': row['Headlines_1'],
            'Keywords_1': row['Keywords_1'],
            'Headlines_2': row['Headlines_2'],
            'Keywords_2': row['Keywords_2'],
            'Facts': row['Facts'],
        }));
    };

    const initiateContentGeneration = (data) => {
        return axios.post('https://localhost:5000/generate-content', {
            data,
            max_tokens: Number(maxTokens),
        });
    };

    const handleGenerationResponse = async (response, selectedRows) => {
        if (response.data && response.data.data && response.data.data.length > 0) {
            console.log("Content generation was successful!", response.data.data);

            const generatedContents = response.data.data.map(item => item.choices[0].message.content);

            const increment = 50 / selectedRows.length;

            const promises = createDocsForGeneratedContent(generatedContents, selectedRows, increment);

            await Promise.allSettled(promises);
        } else {
            throw new Error("Content generation failed.");
        }
    };

    const createDocsForGeneratedContent = (contents, rows, increment) => {
        return rows.map((row, i) => {
            const title = row['Blog Title'];
            const content = contents[i];
            if (!email) {
                throw new Error("Email is not set.");
            }

            return createDoc(title, content, email, setDocUrl)
                .then(docData => {
                    const docUrl = docData.docUrl;
                    console.log('Google Doc URL:', docUrl);
                })
                .catch(error => {
                    console.error('Failed to create Google Doc:', error);
                })
                .finally(() => {
                    setProgress(Math.round(45 + ((i + 1) * increment)));
                });
        });
    };


    const responseGoogle = (response) => {
        console.log(response);
        if (response && response.tokenId) {
            handleLoginSuccess(response);
            // Now you have the token, which can be used to authenticate API requests
            const token = response.tokenId;
            const client_id = process.env.REACT_APP_GOOGLE_CLIENT_ID;
            sendTokenToServer(token, client_id);
            console.log("Google auth successful, token obtained: ", token);
        } else {
            handleLoginFailure(response);
            console.error("Google auth unsuccessful");
        }
    };


    return (
        <GoogleOAuthProvider clientId="807847415697-3erg2gu1dfh0lutqldkm1te2b485ff45.apps.googleusercontent.com">
            {/* <GoogleLogin
                onSuccess={credentialResponse => {
                    console.log(credentialResponse);
                }}
                onError={() => {
                    console.log('Login Failed');
                }}
            />; */}
            <div className="App">
                <Layout>
                    <FileSelection />
                </Layout>
                {/* <div>
                {error && <div className="error-text">{error}</div>}
                <GoogleLoginComponent
                    clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                    onLoginSuccess={responseGoogle}
                    onLoginFailure={responseGoogle}
                />
                {userData && <div>Welcome, {userData.givenName}</div>}
            </div>
            <SpreadsheetInput setError={setError} setSpreadsheet={setSpreadsheet} />
            <SpreadsheetActions
                spreadsheet={spreadsheet}
                selectedRow={selectedRow}
                setSelectedRow={setSelectedRow}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
            />

            <MaxTokensInput
                maxTokens={maxTokens}
                setMaxTokens={setMaxTokens}
            />
            <div>
                <button className="generate-content" onClick={handleGeneration}>Generate Content</button>
            </div>
            {/* ... (Add a progress indicator to show the progress to the users) */}
                {/* <div>
                <progress value={progress} max="100"></progress>
            </div>
            {docUrl && (
                <div>
                    <a href={docUrl} target="_blank" rel="noopener noreferrer">{docUrl}</a>
                </div>
            )}
            {error && <p className="error-message">{error}</p>}  */}
            </div>
        </GoogleOAuthProvider>
    );
}

export default App;
