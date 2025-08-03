import React from 'react';
import { Plus, Trash2, TrendingUp, Award, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AchievementsForm({ data, onChange }) {
  const entries = data.entries || [];

  const addEntry = () => {
    const newEntry = {
      id: Date.now(),
      title: '',
      description: '',
      url: ''
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Achievements</h3>
        <button
          onClick={addEntry}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Achievement
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
                <TrendingUp className="w-4 h-4" />
                Achievement {index + 1}
              </h4>
              <button
                onClick={() => removeEntry(entry.id)}
                className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Achievement Title *
                </label>
                <input
                  type="text"
                  value={entry.title}
                  onChange={(e) => updateEntry(entry.id, 'title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                  placeholder="Research Paper Published in ACM Conference Proceedings"
                />
              </div>

              {/* URL */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <ExternalLink className="w-4 h-4" />
                  Link (optional)
                </label>
                <input
                  type="url"
                  value={entry.url}
                  onChange={(e) => updateEntry(entry.id, 'url', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                  placeholder="https://dl.acm.org/doi/10.1145/3647444.3647906"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={entry.description}
                  onChange={(e) => updateEntry(entry.id, 'description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                  placeholder="Action and Gesture Recognition Using Deep Learning and Computer Vision for Deaf and Dumb People cited by 3 researchers"
                  rows="2"
                />
              </div>

              {/* Preview */}
              {entry.title && (
                <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-600 rounded-lg">
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preview</h5>
                  <div className="text-sm">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {entry.url ? `🔗 ${entry.title}` : entry.title}
                    </div>
                    {entry.description && (
                      <div className="text-gray-600 dark:text-gray-300 mt-1">
                        {entry.description}
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
          <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No achievements yet. Click "Add Achievement" to get started.</p>
        </div>
      )}
    </div>
  );
}