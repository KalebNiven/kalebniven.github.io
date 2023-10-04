import React, { useState } from 'react';

function FileURLInput({ sheetURL, setSheetURL }) {

  return (
    <>
      <label htmlFor='sheetURL' className='form-label'>
        Spreadsheet URL
      </label>
      <input
        className='form-control'
        type="text"
        id="sheetURL"
        name="sheetURL"
        placeholder='Enter Spreadsheet URL'
        value={sheetURL}
        onChange={(e) => setSheetURL(e.target.value)}
      />
    </>
  );
}

export default FileURLInput;
