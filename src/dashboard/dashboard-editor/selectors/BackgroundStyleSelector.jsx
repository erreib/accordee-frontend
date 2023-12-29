import React from 'react';

function BackgroundStyleSelector({ currentStyle, onChange }) {
    const styleOptions = [
        { value: 'style1', label: 'Style 1', imageUrl: 'https://via.placeholder.com/50' },
        { value: 'style2', label: 'Style 2', imageUrl: 'https://via.placeholder.com/50' },
        { value: 'style3', label: 'Style 3', imageUrl: 'https://via.placeholder.com/50' },
        { value: 'style4', label: 'Style 4', imageUrl: 'https://via.placeholder.com/50' },
        // Add more style options as needed
    ];

    return (
        <>
            <label>Dashboard Background:</label>
            <div className="style-grid">
                {styleOptions.map((option) => (
                    <div
                        key={option.value}
                        className={`style-item ${currentStyle === option.value ? 'active' : ''}`}
                        onClick={() => onChange(option.value)}
                    >
                        <img src={option.imageUrl} alt={option.label} />
                        <span>{option.label}</span>
                    </div>
                ))}
            </div>
        </>
    );
}

export default BackgroundStyleSelector;