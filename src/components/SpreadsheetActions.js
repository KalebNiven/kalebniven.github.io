//SpreadsheetActions.js
import React from 'react';
import RangeSelectionInput from './RangeSelectionInput';

function SpreadsheetActions({ sheetRows, selectedRow, setSelectedRow, selectedRows, setSelectedRows, handleGenerateContent, rangeDisabled, setError }) {

  const handleSelectRows = () => {
    const rowRanges = selectedRow.split(',').map(range => range.trim());

    let newSelectedRows = [];

    for (let range of rowRanges) {
      if (range.includes('-')) {
        const [start, end] = range.split('-').map(Number);
        if (start <= 1 || end <= 1) {
          setError('Row data is starting from 2. You can not enter numbers before');
          newSelectedRows = []; //resetting rows
          break;
        }
        const temp = [...sheetRows.slice(start - 2, end - 1)];
        newSelectedRows = [...newSelectedRows, ...temp]
      } else {
        if (Number(range) <= 1) {
          setError('Row data is starting from 2. You can not enter numbers before');
          newSelectedRows = []//resetting rows
          break;
        }
        const temp = sheetRows[Number(range) - 2];

        if (temp) {
          newSelectedRows.push(temp);
        }
      }
    }
    setSelectedRows(newSelectedRows);
  };

  return (
    <div>
      {sheetRows && (
        <div className='row align-items-center'>
          <div className='col-md-9'>
            <RangeSelectionInput rangeDisabled={rangeDisabled} range={selectedRow} setRange={setSelectedRow} />
          </div>
          <div className='col-md-3 text-end'>
            <button disabled={selectedRow === ''} className='btn btn-sm btn-primary' onClick={handleSelectRows}>
              Select rows
            </button>
          </div>
        </div>
      )}
      <div>
        <div className='row pt-4'>
          <div className=''>
            <button onClick={() => handleGenerateContent(selectedRows)} className='btn btn-block btn-primary'>Generate Content</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpreadsheetActions;
