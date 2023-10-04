import React, { useEffect, useState } from 'react';
import useDrivePicker from 'react-google-drive-picker';
import Loadable from './Loadable';
import FileURLInput from './FileURLInput';
import { fetchSpreadsheetData, generateContent } from '../services/file';
import SpreadsheetActions from './SpreadsheetActions';
import SpreadsheetDisplay from './SpreadSheetDisplay';

function FileSelection() {
    const [openPicker, authResponse] = useDrivePicker();
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedDestination, setSelectedDestination] = useState(null);
    const [customURL, setCustomURL] = useState('');
    const [loading, setLoading] = useState(false);
    const [sheetRows, setSheetRows] = useState([]);
    const [selectedRow, setSelectedRow] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (selectedFile && selectedFile.embedUrl) {
            setLoading(true);
            fetchSpreadsheetData(selectedFile.embedUrl, fetchSpreadsheetCallback)
        }
    }, [selectedFile]);

    const handleGenerateContentFromCustom = () => {
        setLoading(true);
        fetchSpreadsheetData(customURL, fetchSpreadsheetCallback)
    }

    const fetchSpreadsheetCallback = (_response) => {
        setLoading(false);
        setSheetRows(_response);
        if (selectedFile === null) {
            setSelectedFile({ name: 'file' })
        }
    }

    const handleSheetPicker = () => {
        openPicker({
            clientId: "807847415697-3erg2gu1dfh0lutqldkm1te2b485ff45.apps.googleusercontent.com",
            developerKey: "AIzaSyDKDkRm2nNdzNtpe5CovXTYjf5dqWo4hRQ",
            viewId: "SPREADSHEETS",
            // token: token, // pass oauth token in case you already have one
            showUploadView: false,
            showUploadFolders: false,
            supportDrives: true,
            multiselect: false,
            // customViews: customViewsArray, // custom view
            callbackFunction: (data) => {
                if (data.action === 'picked') {
                    setSelectedFile(data.docs[0])
                }
                if (data.action === 'cancel') {
                    console.log('User clicked cancel/close button')
                }
            },
        })
    }

    const handleFolderPicker = () => {
        openPicker({
            clientId: "807847415697-3erg2gu1dfh0lutqldkm1te2b485ff45.apps.googleusercontent.com",
            developerKey: "AIzaSyDKDkRm2nNdzNtpe5CovXTYjf5dqWo4hRQ",
            viewId: "FOLDERS",
            // token: token, // pass oauth token in case you already have one
            showUploadView: false,
            showUploadFolders: false,
            supportDrives: true,
            multiselect: false,
            setSelectFolderEnabled: true,
            // customViews: customViewsArray, // custom view
            callbackFunction: (data) => {
                console.log(data)
                if (data.action === 'picked') {
                    setSelectedDestination(data.docs[0]);
                }

            },
        })
    }

    const handleDeleteFile = () => {
        setSelectedFile(null);
        setCustomURL('');
        setSelectedRows([]);
    }

    const handleDeleteDestination = () => {
        setSelectedDestination(null);
    }

    const resetError = () => {
        setError(null);
    }

    const handleGenerateContent = async (data) => {
        try {
            setLoading(true)
            await generateContent({ data })
        } catch (error) {

        } finally {
            setLoading(false)
        }
    }

    const commulativeProgress = () => {
        const parameters = [Boolean(selectedFile !== null), Boolean(selectedDestination !== null), Boolean(selectedRows.length > 0)];
        const completedStepsCount = parameters.filter(Boolean).length;
        return Math.floor((completedStepsCount / (parameters.length + 1)) * 100);

    }

    const progress = commulativeProgress();

    return (
        <div className='p-4'>
            <div>  <h5>File Selection</h5> </div>
            <hr />
            {progress > 0 &&
                <div className='mt-4 mb-2'>
                    <div className="progress">
                        <div className="progress-bar" role="progressbar" style={{ width: `${progress}%` }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">{progress}%</div>
                    </div>
                </div>}
            {error && error.length > 0 &&
                <div className='row mt-4'>
                    <div className='col-md-12'>
                        <div class="alert alert-danger alert-dismissible fade show d-flex justify-content-between align-items-center px-4 mb-0" role="alert">
                            <strong>Error!</strong> {error}
                            <button onClick={resetError} type="button" className='btn btn-transparent p-0'>
                                <i className='fas fa-times'></i>
                            </button>
                        </div>
                    </div>
                </div>
            }

            <div className='row mt-4'>
                <div className='col-md-6 col-sm-6 col-xs-12'>
                    <Loadable loading={loading}>
                        {selectedFile ? <>

                            <div className="card">
                                <div className="card-header">
                                    <div className='d-flex align-items-center justify-content-between'>
                                        <div><span><b>{selectedFile.name}.xlss</b>   </span></div>
                                        <div><button onClick={handleDeleteFile} className='btn btn-sm btn-danger'>Delete</button></div>
                                    </div>
                                </div>
                                <div className="card-body">
                                    {selectedDestination === null ?
                                        <div>
                                            <button onClick={handleFolderPicker} className='btn p-0 mb-3 btn-link'>Select Destination*</button>
                                        </div>
                                        :
                                        <div className='d-flex align-items-center justify-content-between pt-2 pb-3'>
                                            <div><span><b>Destination Folder</b>: <i>{selectedDestination.name}</i>   </span></div>
                                            <div><button onClick={handleDeleteDestination} className='btn btn-sm btn-transparent'><i className='fas fa-trash fa-lg text-secondary'></i> </button></div>
                                        </div>}
                                    <div>
                                        <SpreadsheetActions
                                            sheetRows={sheetRows}
                                            selectedRow={selectedRow}
                                            setSelectedRow={setSelectedRow}
                                            selectedRows={selectedRows}
                                            setSelectedRows={setSelectedRows}
                                            handleGenerateContent={handleGenerateContent}
                                            rangeDisabled={selectedDestination === null}
                                            setError={setError}
                                        />
                                    </div>
                                </div>
                            </div>

                        </> : <>

                            {selectedFile === null &&
                                <div className='row pt-2'>
                                    <div className="">
                                        <FileURLInput sheetURL={customURL} setSheetURL={setCustomURL} />
                                    </div>
                                </div>}

                            {customURL.length === 0 ?
                                <>
                                    <div className='py-2'>
                                        <span>OR</span>
                                    </div>
                                    <div className=''>
                                        <button className='btn btn-link p-0' onClick={() => handleSheetPicker()}>Select File <i className="fa-brands fa-google-drive"></i></button>
                                    </div>
                                </> :
                                <div className='py-4'>
                                    <button onClick={handleGenerateContentFromCustom} className='btn btn-primary'>Submit</button>
                                </div>
                            }
                        </>}
                    </Loadable>
                </div>
                {selectedRows && selectedRows.length > 0 && <div className='col-md-6 col-sm-6 col-xs-12'>
                    <SpreadsheetDisplay selectedRows={selectedRows} />
                </div>}
            </div>
        </div>
    )
}

export default FileSelection
