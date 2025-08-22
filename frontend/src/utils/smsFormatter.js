// Utility to convert conversational inputs to # format
export const formatRegistrationSMS = (userData) => {
  return `PENZI#${userData.phone}#${userData.name}#${userData.age}#${userData.gender}#${userData.county}#${userData.town}`;
};

export const formatDetailsSMS = (details) => {
  return `DETAILS#${details.phone}#${details.education}#${details.profession}#${details.maritalStatus}#${details.religion}#${details.ethnicity}`;
};

export const formatDescriptionSMS = (descriptionData) => {
  return `MYSELF#${descriptionData.phone}#${descriptionData.description}`;
};

export const formatMatchSMS = (matchData) => {
  return `MATCH#${matchData.phone}#${matchData.ageRange}#${matchData.town}`;
};

export const formatDescribeSMS = (phone) => {
  return `DESCRIBE#${phone}`;
};

// Parse incoming # messages for display
export const parseSMSForDisplay = (smsText) => {
  if (!smsText.includes('#')) return smsText;
  
  const parts = smsText.split('#');
  const keyword = parts[0];
  
  switch (keyword.toUpperCase()) {
    case 'PENZI':
      return `📋 Registration: ${parts[2]} (${parts[1]}), ${parts[3]}, ${parts[4]}, ${parts[5]}, ${parts[6]}`;
    case 'DETAILS':
      return `📊 Details: ${parts[1]}, ${parts[2]}, ${parts[3]}, ${parts[4]}, ${parts[5]}, ${parts[6]}`;
    case 'MYSELF':
      return `💬 Description: ${parts[1]}, ${parts.slice(2).join(' ')}`;
    case 'MATCH':
      return `🔍 Match: ${parts[1]}, ${parts[2]}, ${parts[3]}`;
    case 'DESCRIBE':
      return `👤 Describe: ${parts[1]}`;
    default:
      return `📨 SMS: ${smsText}`;
  }
};