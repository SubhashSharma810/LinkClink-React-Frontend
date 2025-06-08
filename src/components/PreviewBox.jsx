// linkclink-frontend/src/components/PreviewBox.jsx
import React from 'react';
import axios from 'axios';
import { API_BASE } from '../globalVariable';

function PreviewBox({ state, dispatch }) {
  const { thumbnail, videoTitle, formats, selectedFormat, inputValue } = state;

  const handleDownload = async () => {
    if (!selectedFormat) return;

    dispatch({ type: 'DOWNLOAD_START' });

    try {
      const response = await axios.post(
        `${API_BASE}/stream-download`,
        {
          url: inputValue,
          format_id: selectedFormat,
        },
        {
          responseType: 'blob', // needed to handle video stream as file
        }
      );

      const blob = new Blob([response.data], { type: 'video/mp4' });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `${videoTitle || 'video'}.mp4`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Download failed. Please try again.');
    }

    dispatch({ type: 'DOWNLOAD_DONE' });
  };

  return (
    <div className="preview-container">
      <img src={thumbnail} alt="Thumbnail" className="preview-thumbnail" />
      <h3 className="preview-title">{videoTitle}</h3>

      <select
        className="quality-select"
        value={selectedFormat}
        onChange={(e) =>
          dispatch({ type: 'SET_SELECTED_FORMAT', payload: e.target.value })
        }
      >
        <option value="">Select Quality</option>
        {formats.length > 0 ? (
          formats.map((f, i) => (
            <option key={i} value={f.format_id}>
              {f.resolution} - {f.with_audio} - {(f.filesize / (1024 * 1024)).toFixed(1)} MB
            </option>
          ))
        ) : (
          <option disabled>No formats available</option>
        )}
      </select>

      <button className="download-btn" onClick={handleDownload}>
        Download
      </button>
    </div>
  );
}

export default PreviewBox;