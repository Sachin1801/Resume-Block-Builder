// Validation utilities for form inputs

// Email validation
export const validateEmail = (email) => {
  if (!email) return { isValid: true, message: '' }; // Optional field
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(email);
  
  return {
    isValid,
    message: isValid ? 'Valid email' : 'Please enter a valid email address'
  };
};

// Phone validation and formatting (US only)
export const validateAndFormatPhone = (phone) => {
  if (!phone) return { isValid: true, message: '', formatted: '' }; // Optional field
  
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  
  // Check if it's a valid US phone number (10 digits)
  if (digits.length === 0) {
    return { isValid: true, message: '', formatted: '' };
  }
  
  if (digits.length < 10) {
    return { 
      isValid: false, 
      message: 'Phone number must be 10 digits', 
      formatted: formatPhoneDisplay(digits) 
    };
  }
  
  if (digits.length === 10) {
    return { 
      isValid: true, 
      message: 'Valid phone number', 
      formatted: formatPhoneDisplay(digits) 
    };
  }
  
  if (digits.length === 11 && digits[0] === '1') {
    // Remove leading 1 for US
    const usDigits = digits.slice(1);
    return { 
      isValid: true, 
      message: 'Valid phone number', 
      formatted: formatPhoneDisplay(usDigits) 
    };
  }
  
  return { 
    isValid: false, 
    message: 'Invalid phone number format', 
    formatted: formatPhoneDisplay(digits.slice(0, 10)) 
  };
};

// Format phone number for display
export const formatPhoneDisplay = (digits) => {
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
};

// URL validation
export const validateURL = (url) => {
  if (!url) return { isValid: true, message: '' }; // Optional field
  
  try {
    // Auto-add https:// if no protocol
    let processedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      processedUrl = `https://${url}`;
    }
    
    new URL(processedUrl);
    return { 
      isValid: true, 
      message: 'Valid URL', 
      formatted: processedUrl 
    };
  } catch {
    return { 
      isValid: false, 
      message: 'Please enter a valid URL', 
      formatted: url 
    };
  }
};

// LinkedIn URL validation
export const validateLinkedInURL = (url) => {
  if (!url) return { isValid: true, message: '' };
  
  const linkedinRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[\w-]+\/?$/;
  
  // Auto-format LinkedIn URL
  let processedUrl = url;
  if (!url.startsWith('http')) {
    if (url.startsWith('linkedin.com') || url.startsWith('www.linkedin.com')) {
      processedUrl = `https://${url}`;
    } else if (url.includes('linkedin.com/in/')) {
      processedUrl = `https://${url}`;
    } else if (!url.includes('linkedin.com')) {
      // Assume it's just a username
      processedUrl = `https://www.linkedin.com/in/${url}`;
    }
  }
  
  const isValid = linkedinRegex.test(processedUrl);
  
  return {
    isValid,
    message: isValid ? 'Valid LinkedIn profile' : 'Please enter a valid LinkedIn profile URL',
    formatted: processedUrl
  };
};

// GitHub URL validation
export const validateGitHubURL = (url) => {
  if (!url) return { isValid: true, message: '' };
  
  const githubRegex = /^(https?:\/\/)?(www\.)?github\.com\/[\w-]+\/?$/;
  
  // Auto-format GitHub URL
  let processedUrl = url;
  if (!url.startsWith('http')) {
    if (url.startsWith('github.com')) {
      processedUrl = `https://${url}`;
    } else if (!url.includes('github.com')) {
      // Assume it's just a username
      processedUrl = `https://github.com/${url}`;
    }
  }
  
  const isValid = githubRegex.test(processedUrl);
  
  return {
    isValid,
    message: isValid ? 'Valid GitHub profile' : 'Please enter a valid GitHub profile URL',
    formatted: processedUrl
  };
};

// Full name validation
export const validateFullName = (name) => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, message: 'Full name is required' };
  }
  
  if (name.trim().length < 2) {
    return { isValid: false, message: 'Name must be at least 2 characters' };
  }
  
  // Check for at least first and last name
  const nameParts = name.trim().split(/\s+/);
  if (nameParts.length < 2) {
    return { isValid: false, message: 'Please enter your full name (first and last)' };
  }
  
  return { isValid: true, message: 'Valid name' };
};