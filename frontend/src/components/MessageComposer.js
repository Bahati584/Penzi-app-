// src/components/MessageComposer.js
import React, { useState } from 'react';

const MessageComposer = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() === '') return; // Don't send empty messages
    onSendMessage(message);
    setMessage(''); // Clear the input field after sending
  };

  return (
    <form className="message-composer" onSubmit={handleSubmit}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message to Penzi..."
      />
      <button type="submit">➤</button>
    </form>
  );
};

export default MessageComposer;