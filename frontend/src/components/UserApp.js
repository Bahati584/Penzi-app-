import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';
import { smsAPI } from '../services/api';

const UserApp = () => {
  const [messages, setMessages] = useState([]);
  const [currentStep, setCurrentStep] = useState('awaiting_registration');
  const [userPhone, setUserPhone] = useState('');
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    if (isFirstLoad) {
      const welcomeMessage = {
        id: 1,
        text: "Welcome to our dating service with 6000 potential dating partners! To register SMS PENZI#phone#name#age#gender#county#town. E.g., PENZI#0722000000#John Doe#26#Male#Nakuru#Naivasha",
        sender: 'received',
        isSMSFormat: true
      };
      setMessages([welcomeMessage]);
      setIsFirstLoad(false);
    }
    console.log({isFirstLoad}, "LOGGGED")
  }, []);

  const processSMS = async (text) => {
    try {
      const message = text.trim();
      if (!message) return;

      // Add user message to chat first
      const userMessage = {
        id: Date.now(),
        text: message,
        sender: 'sent'
      };
      setMessages(prev => [...prev, userMessage]);

      // Extract phone number if present in the message
      let phone = userPhone;
      if (message.toUpperCase().startsWith('PENZI#') || 
          message.toUpperCase().startsWith('DETAILS#') || 
          message.toUpperCase().startsWith('MYSELF#') || 
          message.toUpperCase().startsWith('MATCH#')) {
        const parts = message.split('#');
        if (parts.length >= 2 && /^\d{10}$/.test(parts[1])) {
          phone = parts[1];
          setUserPhone(phone);
        }
      }

      // Send to backend for processing
      const response = await smsAPI.processCommand({ 
        phone: phone || '0000000000',
        text: message 
      });

      // Add backend response to chat
      const responseMessage = {
        id: Date.now() + 1,
        text: response.message || response.error || "Message processed successfully",
        sender: 'received'
      };

      setMessages(prev => [...prev, responseMessage]);

      // Update step based on successful responses
      if (message.toUpperCase().startsWith('PENZI#') && response.message && !response.error) {
        setCurrentStep('awaiting_details');
      } else if (message.toUpperCase().startsWith('DETAILS#') && response.message && !response.error) {
        setCurrentStep('awaiting_description');
      } else if (message.toUpperCase().startsWith('MYSELF#') && response.message && !response.error) {
        setCurrentStep('ready_for_matching');
      }

    } catch (error) {
      console.error('API Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: `Error: ${error.message || 'Network error. Please try again.'}`,
        sender: 'received'
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const sendMessage = (text) => {
    if (!text.trim()) return;
    processSMS(text);
  };

  return (
    <div className="app">
      <Header />
      <div className="app-body">
        <Sidebar currentStep={currentStep} userPhone={userPhone} />
        <ChatArea messages={messages} onSendMessage={sendMessage} />
      </div>
    </div>
  );
};

export default UserApp;