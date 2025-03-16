import React, { useState } from 'react';
import axios from 'axios';
import './Splitter.css';

export default function Splitter() {
  const [file, setFile] = useState(null);
  const [pageRanges, setPageRanges] = useState([{ startPage: '', endPage: '' }]);
  const [fileName, setFileName] = useState('');
  const [downloadLink, setDownloadLink] = useState('');
  const [missingInputIndex, setMissingInputIndex] = useState(null);

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const list = [...pageRanges];
    list[index][name] = value;
    setPageRanges(list);
    if (name === 'startPage' || name === 'endPage') {
      // If the input field is not empty, remove the warning message and reset the border color
      if (value !== '') {
        setMissingInputIndex(null);
      }
    }
  };

  const handleAddPageRange = () => {
    const lastPageRange = pageRanges[pageRanges.length - 1];
    if (lastPageRange.startPage === '' || lastPageRange.endPage === '') {
      setMissingInputIndex(pageRanges.length - 1);
      return;
    }
    setPageRanges([...pageRanges, { startPage: '', endPage: '' }]);
    setMissingInputIndex(null); // Clear missing input index when a new page range is added
  };

  const handleRemovePageRange = (index) => {
    const list = [...pageRanges];
    list.splice(index, 1);
    setPageRanges(list);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await axios.post('http://127.0.0.1:5000/upload', formData);
    setFileName(data.filename);
    const startPages = pageRanges.map(range => range.startPage).join(',');
    const endPages = pageRanges.map(range => range.endPage).join(',');
    const splitData = {
      filename: data.filename,
      startPages,
      endPages
    };
    const splitResponse = await axios.post('http://127.0.0.1:5000/split-pdf', splitData);
    setDownloadLink(splitResponse.data.output_zip); // Set the download link received from the backend
  };

  const downloadFile = async () => {
    try {
      if (downloadLink) {
        const response = await fetch(`http://localhost:5000/${downloadLink}`);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName.replace('.pdf', '')}_split.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <div className="splitter-container">
      <h1>Splitter Page</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="file" className="file-input-button">Choose File</label>
        <input type="file" id="file" onChange={(e) => {
          setFile(e.target.files[0]);
          setFileName(e.target.files[0].name);
        }} required style={{ display: 'none' }} />
        {fileName && <p style={{ color: 'darkblue', fontSize: '16px', marginBottom: '5px' }}>{fileName}</p>}
        <br />
        {pageRanges.map((pageRange, index) => (
          <div key={index}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div>
                <label htmlFor={`startPage${index}`}>Start Page:</label>
                <input
                  type="number"
                  id={`startPage${index}`}
                  name="startPage"
                  value={pageRange.startPage}
                  onChange={e => handleInputChange(index, e)}
                  required
                  style={{ width: '120px', margin: '0 5px', border: index === missingInputIndex ? '1px solid red' : '1px solid black' }}
                />
              </div>
              <div>
                <label htmlFor={`endPage${index}`}>End Page:</label>
                <input
                  type="number"
                  id={`endPage${index}`}
                  name="endPage"
                  value={pageRange.endPage}
                  onChange={e => handleInputChange(index, e)}
                  required
                  style={{ width: '120px', margin: '0 5px', border: index === missingInputIndex ? '1px solid red' : '1px solid black' }}
                />
              </div>
              {index === missingInputIndex && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginTop: '10px' }}>
                  <span style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>Please fill in both start page and end page.</span>
                </div>
              )}
              <button type="button" onClick={handleAddPageRange} style={{ marginLeft: '10px', marginTop: '10px' }}>Add Page Range</button>
              {pageRanges.length > 1 && (
                <button type="button" onClick={() => handleRemovePageRange(index)} style={{ marginLeft: '10px', marginTop: '10px' }}>Remove</button>
              )}
            </div>
          </div>
        ))}
        <button type="submit" style={{ marginTop: '10px' }}>Split</button>
      </form>
      {downloadLink && (
        <div>
          <p style={{ color: 'green', fontSize: '18px' }}>Download Splitted File:</p>
          <button onClick={downloadFile}>Download</button>
        </div>
      )}
    </div>
  );
}
