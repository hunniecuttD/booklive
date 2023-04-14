/* eslint-disable @typescript-eslint/no-floating-promises */
import React, { useState } from 'react';

interface Props {
  accepts: string;
}

const FileInputWithProgress: React.FC<Props> = ({ accepts }) => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    console.log('here');
    // Upload file using your preferred method (e.g. fetch, axios, etc.)
    const formData = new FormData();
    formData.append('file', selectedFile);
    const uploadUrl = 's3://booklivebucket/uploads/';
    fetch(uploadUrl, {
      method: 'POST',
      body: formData,
      onUploadProgress: (progressEvent: { loaded: number; total: number; }) => {
        const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setProgress(percentage);
      },
    });
  };

  return (
    <div>
      <input type="file" accept={accepts} onChange={handleFileChange} />
      {file && (
        <div>
          <p>File name: {file.name}</p>
          <p>File size: {file.size} bytes</p>
        </div>
      )}
      {progress > 0 && (
        <div>
          <p>Upload progress: {progress}%</p>
          <progress value={progress} max="100" />
        </div>
      )}
    </div>
  );
};

export default FileInputWithProgress;
