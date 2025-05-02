
// Helper function to get location information
export const getLocationInfo = () => {
  // In a real app, you would use a geolocation service or IP-based location
  // For demo purposes, extract basic browser info
  const browser = detectBrowser();
  const language = navigator.language || 'en-US';
  const platform = navigator.platform || 'Unknown';
  
  return `${browser} on ${platform} (${language})`;
};

// Helper function to detect browser
export const detectBrowser = () => {
  const userAgent = navigator.userAgent;
  
  if (userAgent.indexOf("Firefox") > -1) {
    return "Firefox";
  } else if (userAgent.indexOf("Chrome") > -1) {
    return "Chrome";
  } else if (userAgent.indexOf("Safari") > -1) {
    return "Safari";
  } else if (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident") > -1) {
    return "Internet Explorer";
  } else if (userAgent.indexOf("Edge") > -1) {
    return "Edge";
  } else {
    return "Unknown Browser";
  }
};

// Helper function to log login attempts
export const logLoginAttempt = (userId: number | null, success: boolean, location: string) => {
  // In a real app, you would send this to your server
  console.log(`Login attempt: user=${userId}, success=${success}, location=${location}`);
};
