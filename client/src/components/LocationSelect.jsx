import React, { useState, useRef, useEffect } from 'react';
import { MapPin, ChevronDown, Check } from 'lucide-react';

// Popular US cities
const POPULAR_CITIES = [
  'New York, NY',
  'Los Angeles, CA',
  'Chicago, IL',
  'Houston, TX',
  'Phoenix, AZ',
  'Philadelphia, PA',
  'San Antonio, TX',
  'San Diego, CA',
  'Dallas, TX',
  'San Jose, CA',
  'Austin, TX',
  'Jacksonville, FL',
  'Fort Worth, TX',
  'Columbus, OH',
  'Charlotte, NC',
  'San Francisco, CA',
  'Indianapolis, IN',
  'Seattle, WA',
  'Denver, CO',
  'Washington, DC',
  'Boston, MA',
  'Nashville, TN',
  'Oklahoma City, OK',
  'Las Vegas, NV',
  'Portland, OR',
  'Memphis, TN',
  'Louisville, KY',
  'Baltimore, MD',
  'Milwaukee, WI',
  'Albuquerque, NM',
  'Tucson, AZ',
  'Fresno, CA',
  'Sacramento, CA',
  'Mesa, AZ',
  'Kansas City, MO',
  'Atlanta, GA',
  'Colorado Springs, CO',
  'Omaha, NE',
  'Raleigh, NC',
  'Miami, FL',
  'Cleveland, OH',
  'Tulsa, OK',
  'Arlington, TX',
  'New Orleans, LA',
  'Wichita, KS',
  'Minneapolis, MN',
  'Tampa, FL',
  'Orlando, FL',
  'Pittsburgh, PA',
  'Remote'
];

export default function LocationSelect({ value, onChange, placeholder = "Select or type your location" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Filter cities based on search term
  const filteredCities = POPULAR_CITIES.filter(city =>
    city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    
    // If the value doesn't match any popular city, treat it as custom
    const isPopularCity = POPULAR_CITIES.some(city => 
      city.toLowerCase() === newValue.toLowerCase()
    );
    
    setIsCustom(!isPopularCity && newValue.length > 0);
    onChange(newValue);
    
    if (!isOpen) setIsOpen(true);
  };

  // Handle city selection
  const handleCitySelect = (city) => {
    onChange(city);
    setSearchTerm('');
    setIsCustom(false);
    setIsOpen(false);
  };

  // Handle input focus
  const handleFocus = () => {
    setIsOpen(true);
    setSearchTerm(value || '');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={isOpen ? searchTerm : (value || '')}
          onChange={handleInputChange}
          onFocus={handleFocus}
          className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredCities.length > 0 ? (
            <>
              {filteredCities.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => handleCitySelect(city)}
                  className={`w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between ${
                    value === city ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{city}</span>
                  </div>
                  {value === city && <Check className="w-4 h-4" />}
                </button>
              ))}
              
              {searchTerm && !filteredCities.some(city => city.toLowerCase() === searchTerm.toLowerCase()) && (
                <button
                  type="button"
                  onClick={() => handleCitySelect(searchTerm)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span>Use "{searchTerm}"</span>
                  </div>
                </button>
              )}
            </>
          ) : searchTerm ? (
            <button
              type="button"
              onClick={() => handleCitySelect(searchTerm)}
              className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-white"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span>Use "{searchTerm}"</span>
              </div>
            </button>
          ) : (
            <div className="px-3 py-2 text-gray-500 dark:text-gray-400">
              No cities found
            </div>
          )}
        </div>
      )}
    </div>
  );
}