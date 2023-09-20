//SpreadsheetDisplay.js
import React from 'react';

function SpreadsheetDisplay({ spreadsheet, selectedRow, setSelectedRow, selectedRows, setSelectedRows }) {

  const handleSelectRows = () => {
    const rowRanges = selectedRow.split(',').map(range => range.trim());

    const newSelectedRows = [];

    for (let range of rowRanges) {
        if (range.includes('-')) {
            const [start, end] = range.split('-').map(Number);
            newSelectedRows.push(...spreadsheet.slice(start - 1, end));
        } else {
            newSelectedRows.push(spreadsheet[Number(range) - 1]);
        }
    }

    setSelectedRows(newSelectedRows);
};

  return (
    <div>
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
  );
}

export default SpreadsheetDisplay;
