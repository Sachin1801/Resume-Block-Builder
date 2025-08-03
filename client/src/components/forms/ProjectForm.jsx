import React from 'react';
import { Plus, Trash2, GitBranch, Calendar, Globe, Code } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProjectForm({ data, onChange }) {
  const entries = data.entries || [];

  const addEntry = () => {
    const newEntry = {
      id: Date.now(),
      name: '',
      url: '',
      technologies: '',
      date: '',
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
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Project Entries</h3>
        <button
          onClick={addEntry}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Project
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
                <GitBranch className="w-4 h-4" />
                Project {index + 1}
              </h4>
              <button
                onClick={() => removeEntry(entry.id)}
                className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Project Name and URL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    value={entry.name}
                    onChange={(e) => updateEntry(entry.id, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                    placeholder="AI-Powered Multi-Agent Hedge Fund System"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Globe className="w-4 h-4" />
                    Project URL
                  </label>
                  <input
                    type="url"
                    value={entry.url}
                    onChange={(e) => updateEntry(entry.id, 'url', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                    placeholder="https://github.com/username/project"
                  />
                </div>
              </div>

              {/* Technologies and Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Code className="w-4 h-4" />
                    Technologies
                  </label>
                  <input
                    type="text"
                    value={entry.technologies}
                    onChange={(e) => updateEntry(entry.id, 'technologies', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                    placeholder="Python, LangGraph, AWS EC2, Pandas"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Calendar className="w-4 h-4" />
                    Date
                  </label>
                  <input
                    type="text"
                    value={entry.date}
                    onChange={(e) => updateEntry(entry.id, 'date', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                    placeholder="Feb 2025 - May 2025"
                  />
                </div>
              </div>

              {/* Achievements */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Key Achievements & Features
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
                        placeholder="Architected multi-agent framework simulating 10 legendary investor strategies, generating trading signals with 72-75% confidence..."
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
          <GitBranch className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No project entries yet. Click "Add Project" to get started.</p>
        </div>
      )}
    </div>
  );
}