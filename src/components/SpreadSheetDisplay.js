import React from 'react'

function SpreadsheetDisplay({ selectedRows }) {
    return (
        <div>
            <div className="card">
                <div className="card-header">
                    Selected Rows
                </div>
                <div className="card-body">
                    <div className='sheet-display-div'>
                        <table class="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th className='text-center' scope="col">#</th>
                                    <th scope="col">Blog Title</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedRows.map((row, index) => (
                                    <tr className='text-center' key={`key-${index.toString()}`}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{row['Blog Title']}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SpreadsheetDisplay
