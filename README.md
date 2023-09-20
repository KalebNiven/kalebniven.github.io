# BloggingBear

This project is a React-based content generator that facilitates the automatic creation of content documents using data from Google spreadsheets. Below is a guide to setting up, using, and understanding the structure of this project.

## Contributing

To contribute to this project, please fork the repository and submit your pull requests for review.

### Project Structure

The project is divided into two main folders:

- `frontend/`: Contains all the frontend code.
- `backend/`: Contains all the backend code including the Flask server (`App.py`) and utility functions.

## Setting Up

Before you begin, make sure to have Node.js and npm installed. Follow the next steps to set up the project:

1. Clone the repository to your local environment.
2. Navigate to the project root directory in your terminal.
3. Run `npm install` to install all necessary dependencies.
4. Create a `.env` file in the root directory and add the following environment variable:
    ```
    REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
    ```
5. Replace `your_google_client_id_here` with your actual Google Client ID.

## Running the Application

To run the application, execute the following command in the terminal:

```bash
npm start
```

This will start the development server and the application should open in your default browser at `http://localhost:3000`.

## Features

### Google Authentication

Users can authenticate using Google to enable the application to create Google docs on their behalf. The authentication status is displayed at the top of the page.

### Spreadsheet Input

This feature allows users to input data through two methods:

1. **Upload a Spreadsheet:** Users can upload a local spreadsheet file.
2. **Google Spreadsheet URL:** Users can provide a Google Spreadsheet URL to fetch data from.

### Spreadsheet Display

Displays the data fetched from the spreadsheet. Users can select rows that will be used in the content generation.

### Max Tokens Input

Allows users to set the maximum number of tokens to be used in content generation. This effectively sets a limit on the length of the generated content.

### Content Generation

Users can generate content by clicking the "Generate Content" button. The process involves several stages and the progress is displayed in a progress bar.

Generated content will be used to create Google Docs, and the URL of each document will be displayed upon successful creation.

### Error Handling

Displays errors and issues that occur during various processes, helping users troubleshoot problems effectively.

## Components Breakdown

- `App.js`: The main component that houses the state and logic of the application.
- `SpreadsheetInput.js`: Component to handle the spreadsheet input section.
- `SpreadsheetDisplay.js`: Component to display the fetched spreadsheet data.
- `MaxTokensInput.js`: Component to input the max tokens for content generation.
- `Utilities.js`: A utility file where helper functions are housed.

## Key Functions

Below are some of the key functions defined in the `App.js`:

- `handleLoginSuccess`: Handles the process after a successful login.
- `handleLoginFailure`: Handles the process after a login failure.
- `handleGeneration`: Orchestrates the content generation process.
- `getSelectedRows`: Retrieves selected rows from the spreadsheet data.
- `validateRows`: Validates the selected rows to ensure all required fields are filled.
- `prepareData`: Prepares data for content generation.
- `initiateContentGeneration`: Initiates the content generation API call.
- `handleGenerationResponse`: Handles the response from the content generation API.

## Development

### Environment Variables

- `REACT_APP_GOOGLE_CLIENT_ID`: Your Google OAuth 2.0 Client ID.

### Dependencies

- `react`: For building the UI of the application.
- `axios`: For making HTTP requests.
- `react-google-login`: For handling Google OAuth authentication.
"# BloggingBear_frontend" 
