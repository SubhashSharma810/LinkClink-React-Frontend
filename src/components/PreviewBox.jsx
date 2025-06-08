import React from 'react';
import { WS_URL } from '../globalVariable';

function PreviewBox({ state, dispatch }) {
  const { thumbnail, videoTitle, formats, selectedFormat, inputValue } = state;

  const handleDownload = () => {
    if (!selectedFormat) return;

    dispatch({ type: 'DOWNLOAD_START' });

    const ws = new WebSocket(WS_URL);
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: 'download',
          data: {
            url: inputValue,
            format_id: selectedFormat,
            title: videoTitle,
          },
        })
      );
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'progress') {
        dispatch({ type: 'DOWNLOAD_PROGRESS', payload: msg.data });
      }
      if (msg.type === 'done') {
        dispatch({ type: 'DOWNLOAD_DONE' });
        ws.close();
      }
    };
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
              {f.resolution} - {f.with_audio} - {f.filesize} MB
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