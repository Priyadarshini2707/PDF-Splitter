import React, { useState } from 'react';
import axios from 'axios';
import './Rearranger.css';

function Rearranger() {
  const [pageOrder, setPageOrder] = useState('');
  const [fileName, setFileName] = useState('');
  const [downloadLink, setDownloadLink] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', e.target.file.files[0]);
    try {
      const { data } = await axios.post('http://127.0.0.1:5000/upload', formData);
      setFileName(data.filename);
      const rearrangeData = {
        filename: data.filename,
        pageOrder: pageOrder // Pass the pageOrder directly
      };
      const rearrangeResponse = await axios.post('http://127.0.0.1:5000/rearrange-pdf', rearrangeData);
      setDownloadLink(`http://127.0.0.1:5000/uploads/${rearrangeResponse.data.output_pdf}`);
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
        a.download = `${fileName.replace('.pdf', '')}_rearranged.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <div className="rearranger-container">
      <h1>Rearranger Page</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="file">Choose File:</label>
        <input type="file" id="file" required style={{ display: 'none' }} />
        <label htmlFor="file" className="file-input-button">Choose File</label>
        <label htmlFor="pageOrder">Page Order:</label>
        <input type="text" id="pageOrder" value={pageOrder} onChange={(e) => setPageOrder(e.target.value)} placeholder="e.g., 1,4,3,5,2" required />
        <button type="submit">Rearrange</button>
      </form>
      {fileName && <p style={{ color: 'blue', fontSize: '18px', marginTop: '10px' }}>{fileName}</p>}
      {downloadLink && (
        <div>
          <p style={{ color: 'green', fontSize: '18px' }}>Download Rearranged File:</p>
          <button onClick={downloadFile}>Download</button>
        </div>
      )}
    </div>
  );
}

export default Rearranger;
