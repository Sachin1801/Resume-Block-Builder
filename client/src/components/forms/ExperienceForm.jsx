import React from 'react';
import { Plus, Trash2, Briefcase, Calendar, Building, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ExperienceForm({ data, onChange }) {
  const entries = data.entries || [];

  const addEntry = () => {
    const newEntry = {
      id: Date.now(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      achievements: ['']
    };
    onChange({ entries: [...entries, newEntry] });
  };

  const updateEntry = (id, field, value) => {
    const updatedEntries = entries.map(entry =>
      entry.id === id ? { ...entry, [field]: value } : entry
    );
    onChange({ entries: updatedEntries });
  };

  const updateAchievement = (entryId, achievementIndex, value) => {
    const updatedEntries = entries.map(entry => {
      if (entry.id === entryId) {
        const newAchievements = [...entry.achievements];
        newAchievements[achievementIndex] = value;
        return { ...entry, achievements: newAchievements };
      }
      return entry;
    });
    onChange({ entries: updatedEntries });
  };

  const addAchievement = (entryId) => {
    const updatedEntries = entries.map(entry =>
      entry.id === entryId 
        ? { ...entry, achievements: [...entry.achievements, ''] }
        : entry
    );
    onChange({ entries: updatedEntries });
  };

  const removeAchievement = (entryId, achievementIndex) => {
    const updatedEntries = entries.map(entry => {
      if (entry.id === entryId) {
        const newAchievements = entry.achievements.filter((_, index) => index !== achievementIndex);
        return { ...entry, achievements: newAchievements.length > 0 ? newAchievements : [''] };
      }
      return entry;
    });
    onChange({ entries: updatedEntries });
  };

  const removeEntry = (id) => {
    const updatedEntries = entries.filter(entry => entry.id !== id);
    onChange({ entries: updatedEntries });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Experience Entries</h3>
        <button
          onClick={addEntry}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Experience
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
                <Briefcase className="w-4 h-4" />
                Experience {index + 1}
              </h4>
              <button
                onClick={() => removeEntry(entry.id)}
                className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Company and Position */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Building className="w-4 h-4" />
                    Company *
                  </label>
                  <input
                    type="text"
                    value={entry.company}
                    onChange={(e) => updateEntry(entry.id, 'company', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                    placeholder="Growvisionary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Position *
                  </label>
                  <input
                    type="text"
                    value={entry.position}
                    onChange={(e) => updateEntry(entry.id, 'position', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                    placeholder="Technical Associate Intern"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                    placeholder="June 2023"
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
                    placeholder="Sept 2023"
                  />
                </div>
              </div>

              {/* Achievements */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <TrendingUp className="w-4 h-4" />
                    Key Achievements
                  </label>
                  <button
                    onClick={() => addAchievement(entry.id)}
                    className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                  >
                    + Add
                  </button>
                </div>
                
                <div className="space-y-2">
                  {entry.achievements.map((achievement, achievementIndex) => (
                    <div key={achievementIndex} className="flex gap-2">
                      <textarea
                        value={achievement}
                        onChange={(e) => updateAchievement(entry.id, achievementIndex, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                        placeholder="Led development of fintech website using AI tools, achieving 10,000+ views..."
                        rows="2"
                      />
                      {entry.achievements.length > 1 && (
                        <button
                          onClick={() => removeAchievement(entry.id, achievementIndex)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {entries.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No experience entries yet. Click "Add Experience" to get started.</p>
        </div>
      )}
    </div>
  );
}