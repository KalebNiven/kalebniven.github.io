import React from 'react';
import './loadable.css'

export default function Loadable({ children, loading = false, className, size = 40 }) {
    return (
        <div className={`loadable ${loading && 'loadable--loading'}`}>
            <div className={className}>
                {children}
            </div>
            <div className="loading-overlay">
                <div className="loading-overlay-spinner">
                    <div className="spinner-border" role="status">
                    </div>
                </div>
            </div>
        </div >
    );
}
