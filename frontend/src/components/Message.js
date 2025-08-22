import React from 'react';
import { parseSMSForDisplay } from '../utils/smsFormatter';

const Message = ({ text, sender, isSMSFormat }) => {
  const messageClass = sender === 'sent' ? 'message sent' : 'message received';
  const displayText = isSMSFormat ? parseSMSForDisplay(text) : text;

  return (
    <div className={messageClass}>
      {isSMSFormat && (
        <div style={{ 
          fontSize: '12px', 
          opacity: 0.7, 
          marginBottom: '5px',
          fontFamily: 'monospace'
        }}>
          📨 SMS Format
        </div>
      )}
      {displayText}
      {isSMSFormat && (
        <div style={{ 
          fontSize: '10px', 
          opacity: 0.5, 
          marginTop: '5px',
          fontFamily: 'monospace'
        }}>
          Raw: {text}
        </div>
      )}
    </div>
  );
};

export default Message;