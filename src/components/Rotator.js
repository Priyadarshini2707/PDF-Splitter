import React, { useState } from 'react';
import axios from 'axios';
import './Rotator.css';

function Rotator() {
  const [rotationAngle, setRotationAngle] = useState('');
  const [fileName, setFileName] = useState('');
  const [inputPdf, setInputPdf] = useState(null);
  const [downloadLink, setDownloadLink] = useState('');

  const handleFileChange = (e) => {
    setFileName(e.target.files[0].name);
    setInputPdf(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', inputPdf);
    try {
      const { data } = await axios.post('http://127.0.0.1:5000/upload', formData);
      setFileName(data.filename);
      const rotationData = {
        filename: data.filename,
        rotationAngle: rotationAngle
      };
      const rotationResponse = await axios.post('http://127.0.0.1:5000/rotate-pdf', rotationData);
      const outputPdfUrl = `http://127.0.0.1:5000/${rotationResponse.data.output_pdf}`;
      setDownloadLink(outputPdfUrl);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const downloadFile = async () => {
    try {
      if (downloadLink) {
        const response = await fetch(downloadLink);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName.replace('.pdf', '')}_rotated.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <div className="rotator-container">
      <h1>Rotator Page</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="file">Choose File:</label>
        <input type="file" id="file" required onChange={handleFileChange} style={{ display: 'none' }} />
        <label htmlFor="file" className="file-input-button">Choose File</label>
        {fileName && <p style={{ color: 'darkblue', fontSize: '16px' }}>{fileName}</p>}
        <label htmlFor="rotationAngle">Rotation Angle:</label>
        <input type="text" id="rotationAngle" value={rotationAngle} onChange={(e) => setRotationAngle(e.target.value)} placeholder="Enter rotation angle" required />
        <button type="submit">Rotate</button>
      </form>
      <div className="viewer-container">
        {inputPdf && <iframe src={URL.createObjectURL(inputPdf)} title="Input PDF" className="pdf-viewer" style={{ width: '500px', height: '600px' }} />}
      </div>
      {downloadLink && (
        <div>
          <p style={{ color: 'green', fontSize: '18px' }}>Download Rotated File:</p>
          <button onClick={downloadFile}>Download</button>
        </div>
      )}
    </div>
  );
}

export default Rotator;
