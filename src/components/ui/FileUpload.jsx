// src/components/ui/FileUpload.jsx
import React, { useState } from 'react';

const FileUpload = ({ onChange, value, accept, placeholder = "Pilih file..." }) => {
    const [fileName, setFileName] = useState(value?.name || '');

    const handleChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            onChange(file);
        }
    };

    return (
        <div className="flex flex-col space-y-1">
            <label className="block text-sm font-medium text-foreground">
                {placeholder}
            </label>
            <div className="flex items-center space-x-2">
                <input
                    type="file"
                    accept={accept}
                    onChange={handleChange}
                    className="hidden"
                    id="file-upload"
                />
                <label
                    htmlFor="file-upload"
                    className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-md cursor-pointer text-sm flex items-center space-x-1"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M.5 3.5A.5.5 0 0 1 1 3H2v1h1a.5.5 0 0 1 0 1H2v1h1a.5.5 0 0 1 0 1H2v1h1a.5.5 0 0 1 0 1H1a.5.5 0 0 1-.5-.5V3.5zm1 1v1h1v-1H1.5zM2.5 4.5V6h1v-1.5H2.5zm0 2.5v1h1v-1H2.5z"/>
                        <path d="M3.5 3.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.5-.5z"/>
                    </svg>
                    <span>Unggah</span>
                </label>
                {fileName && <span className="text-sm text-muted-foreground truncate max-w-xs">{fileName}</span>}
            </div>
        </div>
    );
};

export default FileUpload;