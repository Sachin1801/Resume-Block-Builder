import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Globe, Github, Linkedin, Check, AlertCircle } from 'lucide-react';
import LocationSelect from './LocationSelect';
import { 
  validateEmail, 
  validateAndFormatPhone, 
  validateURL, 
  validateLinkedInURL, 
  validateGitHubURL,
  validateFullName
} from '../utils/validation';

export default function EnhancedPersonalInfoForm({ data, onChange }) {
  // Validation states
  const [validationStates, setValidationStates] = useState({
    fullName: { isValid: true, message: '' },
    email: { isValid: true, message: '' },
    phone: { isValid: true, message: '' },
    website: { isValid: true, message: '' },
    linkedin: { isValid: true, message: '' },
    github: { isValid: true, message: '' }
  });

  const handleInputChange = (field, value) => {
    // Update the data
    onChange({ ...data, [field]: value });
    
    // Perform real-time validation
    let validation = { isValid: true, message: '' };
    let processedValue = value;
    
    switch (field) {
      case 'fullName':
        validation = validateFullName(value);
        break;
      case 'email':
        validation = validateEmail(value);
        break;
      case 'phone':
        const phoneResult = validateAndFormatPhone(value);
        validation = { isValid: phoneResult.isValid, message: phoneResult.message };
        processedValue = phoneResult.formatted;
        // Update with formatted value
        if (phoneResult.formatted !== value) {
          setTimeout(() => onChange({ ...data, [field]: phoneResult.formatted }), 0);
        }
        break;
      case 'website':
        const urlResult = validateURL(value);
        validation = { isValid: urlResult.isValid, message: urlResult.message };
        // Update with formatted URL if valid and different from input
        if (urlResult.isValid && urlResult.formatted && urlResult.formatted !== value) {
          setTimeout(() => onChange({ ...data, [field]: urlResult.formatted }), 0);
        }
        break;
      case 'linkedin':
        const linkedinResult = validateLinkedInURL(value);
        validation = { isValid: linkedinResult.isValid, message: linkedinResult.message };
        // Update with formatted LinkedIn URL if valid and different from input
        if (linkedinResult.isValid && linkedinResult.formatted && linkedinResult.formatted !== value) {
          setTimeout(() => onChange({ ...data, [field]: linkedinResult.formatted }), 0);
        }
        break;
      case 'github':
        const githubResult = validateGitHubURL(value);
        validation = { isValid: githubResult.isValid, message: githubResult.message };
        // Update with formatted GitHub URL if valid and different from input
        if (githubResult.isValid && githubResult.formatted && githubResult.formatted !== value) {
          setTimeout(() => onChange({ ...data, [field]: githubResult.formatted }), 0);
        }
        break;
      default:
        break;
    }
    
    // Update validation state
    setValidationStates(prev => ({
      ...prev,
      [field]: validation
    }));
  };

  // Validation indicator component
  const ValidationIndicator = ({ field, showSuccess = true }) => {
    const validation = validationStates[field];
    const hasValue = data[field] && data[field].length > 0;
    
    if (!hasValue) return null;
    
    if (validation.isValid && showSuccess) {
      return (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          <Check className="w-4 h-4 text-green-500" />
        </div>
      );
    }
    
    if (!validation.isValid) {
      return (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500" />
        </div>
      );
    }
    
    return null;
  };

  // Validation message component
  const ValidationMessage = ({ field }) => {
    const validation = validationStates[field];
    const hasValue = data[field] && data[field].length > 0;
    
    if (!hasValue || validation.isValid) return null;
    
    return (
      <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
        <AlertCircle className="w-3 h-3" />
        {validation.message}
      </p>
    );
  };

  // Get input border class based on validation
  const getInputClass = (field, baseClass) => {
    const validation = validationStates[field];
    const hasValue = data[field] && data[field].length > 0;
    
    if (!hasValue) return baseClass;
    
    if (validation.isValid) {
      return `${baseClass} border-green-300 focus:border-green-500 focus:ring-green-500`;
    } else {
      return `${baseClass} border-red-300 focus:border-red-500 focus:ring-red-500`;
    }
  };

  const baseInputClass = "w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white";

  return (
    <div className="space-y-4">
      {/* Full Name */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <User className="w-4 h-4" />
          Full Name *
        </label>
        <div className="relative">
          <input
            type="text"
            value={data.fullName || ''}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            className={getInputClass('fullName', baseInputClass)}
            placeholder="Sachin Adlakha"
          />
          <ValidationIndicator field="fullName" />
        </div>
        <ValidationMessage field="fullName" />
      </div>

      {/* Contact Info Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Mail className="w-4 h-4" />
            Email *
          </label>
          <div className="relative">
            <input
              type="email"
              value={data.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={getInputClass('email', baseInputClass)}
              placeholder="sa9082@nyu.edu"
            />
            <ValidationIndicator field="email" />
          </div>
          <ValidationMessage field="email" />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Phone className="w-4 h-4" />
            Phone
          </label>
          <div className="relative">
            <input
              type="tel"
              value={data.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={getInputClass('phone', baseInputClass)}
              placeholder="(646) 633-5776"
            />
            <ValidationIndicator field="phone" />
          </div>
          <ValidationMessage field="phone" />
          {data.phone && validationStates.phone.isValid && (
            <p className="text-sm text-green-600 mt-1">Auto-formatted US phone number</p>
          )}
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <MapPin className="w-4 h-4" />
          Location
        </label>
        <LocationSelect
          value={data.location || ''}
          onChange={(value) => handleInputChange('location', value)}
          placeholder="Select or type your location"
        />
      </div>

      {/* Professional Links */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Professional Links</h4>
        
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Globe className="w-4 h-4" />
            Portfolio Website
          </label>
          <div className="relative">
            <input
              type="url"
              value={data.website || ''}
              onChange={(e) => handleInputChange('website', e.target.value)}
              className={getInputClass('website', baseInputClass)}
              placeholder="sachinadlakha3d.vercel.app"
            />
            <ValidationIndicator field="website" />
          </div>
          <ValidationMessage field="website" />
          {data.website && validationStates.website.isValid && !data.website.startsWith('http') && (
            <p className="text-sm text-green-600 mt-1">✓ Auto-formatted to include https://</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </label>
            <div className="relative">
              <input
                type="url"
                value={data.linkedin || ''}
                onChange={(e) => handleInputChange('linkedin', e.target.value)}
                className={getInputClass('linkedin', baseInputClass)}
                placeholder="sachin-adlakha or full URL"
              />
              <ValidationIndicator field="linkedin" />
            </div>
            <ValidationMessage field="linkedin" />
            {data.linkedin && validationStates.linkedin.isValid && !data.linkedin.includes('linkedin.com') && (
              <p className="text-sm text-green-600 mt-1">✓ Auto-formatted to full LinkedIn URL</p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Github className="w-4 h-4" />
              GitHub
            </label>
            <div className="relative">
              <input
                type="url"
                value={data.github || ''}
                onChange={(e) => handleInputChange('github', e.target.value)}
                className={getInputClass('github', baseInputClass)}
                placeholder="Sachin1801 or full URL"
              />
              <ValidationIndicator field="github" />
            </div>
            <ValidationMessage field="github" />
            {data.github && validationStates.github.isValid && !data.github.includes('github.com') && (
              <p className="text-sm text-green-600 mt-1">✓ Auto-formatted to full GitHub URL</p>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Preview */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview</h4>
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {data.fullName || 'Your Name'}
          </h2>
          {data.location && (
            <p className="text-sm text-gray-600 dark:text-gray-400">{data.location}</p>
          )}
          <div className="flex flex-wrap justify-center gap-2 mt-2 text-sm text-gray-600 dark:text-gray-400">
            {data.phone && validationStates.phone.isValid && <span>{data.phone}</span>}
            {data.email && validationStates.email.isValid && <span>{data.email}</span>}
            {data.website && validationStates.website.isValid && <span>🌐 Portfolio</span>}
            {data.linkedin && validationStates.linkedin.isValid && <span>💼 LinkedIn</span>}
            {data.github && validationStates.github.isValid && <span>💻 GitHub</span>}
          </div>
        </div>
      </div>
    </div>
  );
}