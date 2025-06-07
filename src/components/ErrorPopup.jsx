import React from 'react';


const ErrorPopup = ({ message, onClose }) => {
  return (
    <div className="ErrorPopup-Container">
      <div className="ErrorPopup">
        <h2 className="ErrorPopup-title">Oops!😜 Invalid Link</h2>
        <p className="ErrorPopup-message">{message}</p>
        <button
          onClick={onClose}
          className="ErrorPopup-close-btn"
        >

          Close
        </button>
      </div>
    </div>
  );
};

export default ErrorPopup;