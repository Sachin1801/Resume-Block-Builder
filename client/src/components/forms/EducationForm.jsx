import React from 'react';
import { Plus, Trash2, GraduationCap, Calendar, MapPin, BookOpen, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EducationForm({ data, onChange }) {
  const entries = data.entries || [];

  const addEntry = () => {
    const newEntry = {
      id: Date.now(),
      institution: '',
      degree: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
      coursework: '',
      enabled: true
    };
    onChange({ entries: [...entries, newEntry] });
  };

  const updateEntry = (id, field, value) => {
    const updatedEntries = entries.map(entry =>
      entry.id === id ? { ...entry, [field]: value } : entry
    );
    onChange({ entries: updatedEntries });
  };

  const removeEntry = (id) => {
    const updatedEntries = entries.filter(entry => entry.id !== id);
    onChange({ entries: updatedEntries });
  };

  const toggleEntry = (id) => {
    const updatedEntries = entries.map(entry =>
      entry.id === id ? { ...entry, enabled: !entry.enabled } : entry
    );
    onChange({ entries: updatedEntries });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Education Entries</h3>
        <button
          onClick={addEntry}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Education
        </button>
      </div>

      <AnimatePresence>
        {entries.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Education {index + 1}
                {entry.enabled === false && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">(Hidden)</span>
                )}
              </h4>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleEntry(entry.id)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    entry.enabled !== false
                      ? 'text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20' 
                      : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  title={entry.enabled !== false ? 'Hide from resume' : 'Show in resume'}
                >
                  {entry.enabled !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => removeEntry(entry.id)}
                  className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {/* Institution and Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Institution *
                  </label>
                  <input
                    type="text"
                    value={entry.institution}
                    onChange={(e) => updateEntry(entry.id, 'institution', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                    placeholder="New York University"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={entry.location}
                    onChange={(e) => updateEntry(entry.id, 'location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                    placeholder="New York, USA"
                  />
                </div>
              </div>

              {/* Degree */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Degree *
                </label>
                <input
                  type="text"
                  value={entry.degree}
                  onChange={(e) => updateEntry(entry.id, 'degree', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                  placeholder="MS in Computer Science"
                />
              </div>

              {/* Dates and GPA */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Calendar className="w-4 h-4" />
                    Start Date
                  </label>
                  <input
                    type="text"
                    value={entry.startDate}
                    onChange={(e) => updateEntry(entry.id, 'startDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                    placeholder="Sept 2024"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Calendar className="w-4 h-4" />
                    End Date
                  </label>
                  <input
                    type="text"
                    value={entry.endDate}
                    onChange={(e) => updateEntry(entry.id, 'endDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                    placeholder="May 2026"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    GPA
                  </label>
                  <input
                    type="text"
                    value={entry.gpa}
                    onChange={(e) => updateEntry(entry.id, 'gpa', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                    placeholder="3.6/4"
                  />
                </div>
              </div>

              {/* Coursework */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <BookOpen className="w-4 h-4" />
                  Relevant Coursework
                </label>
                <textarea
                  value={entry.coursework}
                  onChange={(e) => updateEntry(entry.id, 'coursework', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                  placeholder="Operating Systems, Design and Analysis of Algorithms, Software Engineering, Artificial Intelligence"
                  rows="2"
                />
              </div>

              {/* Preview */}
              {(entry.institution || entry.degree) && (
                <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-600 rounded-lg">
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preview</h5>
                  <div className="text-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {entry.institution || 'Institution Name'}
                        </div>
                        <div className="text-gray-600 dark:text-gray-300">
                          {entry.degree || 'Degree'}{entry.gpa && `, GPA: ${entry.gpa}`}
                        </div>
                      </div>
                      <div className="text-right text-gray-600 dark:text-gray-300">
                        <div className="font-semibold">
                          {entry.startDate && entry.endDate ? `${entry.startDate} - ${entry.endDate}` : 'Dates'}
                        </div>
                        <div>{entry.location || 'Location'}</div>
                      </div>
                    </div>
                    {entry.coursework && (
                      <div className="mt-2 text-gray-600 dark:text-gray-300">
                        <span className="font-medium">Coursework:</span> {entry.coursework}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {entries.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No education entries yet. Click "Add Education" to get started.</p>
        </div>
      )}
    </div>
  );
}