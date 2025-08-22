// src/components/ChatArea.js
import React from 'react';
import Message from './Message';
import MessageComposer from './MessageComposer';

const ChatArea = ({ messages, onSendMessage, userPhone }) => {
  return (
    <div className="app-chatarea">
      <div className="chat-header">
        <h2>Penzi Matching Assistant</h2>
        {userPhone && <span style={{fontSize: '14px', opacity: 0.8}}>Phone: {userPhone}</span>}
      </div>
      <div className="message-list">
        {messages.map(message => (
          <Message key={message.id} text={message.text} sender={message.sender} />
        ))}
      </div>
      <MessageComposer onSendMessage={onSendMessage} />
    </div>
  );
};

export default ChatArea;