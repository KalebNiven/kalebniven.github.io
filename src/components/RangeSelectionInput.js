import React, { useState } from 'react';

function RangeSelectionInput({ range, setRange, rangeDisabled }) {

  return (
    <>
      <label htmlFor='range' className='form-label'>
        Specify Rows from the file
      </label>
      <input
        required
        disabled={rangeDisabled}
        className='form-control'
        type="text"
        id="range"
        name="range"
        value={range}
        onChange={(e) => setRange(e.target.value)}
        placeholder='(e.g.2-5, 8, 11-13)'
      />
      <span className='font-12 text-muted'>e.g. 2,3,4 OR 5-10</span>
    </>
  );
}

export default RangeSelectionInput;
