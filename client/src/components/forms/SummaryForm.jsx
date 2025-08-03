import React from 'react';
import { Target, Lightbulb } from 'lucide-react';

export default function SummaryForm({ data, onChange }) {
  const handleChange = (value) => {
    onChange({ content: value });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Professional Summary</h3>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Write a compelling professional summary that highlights your key strengths and career objectives.
        </label>
        <textarea
          value={data.content || ''}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          placeholder="Emerging tech professional with a unique blend of software development, AI, and Finance expertise, poised to drive innovation in fintech..."
          rows="6"
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {data.content?.length || 0} characters
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Recommended: 100-200 words
          </span>
        </div>
      </div>

      {/* Tips */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="w-4 h-4 text-blue-500" />
          <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">Writing Tips</h4>
        </div>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• Start with your professional title or key expertise</li>
          <li>• Mention years of experience and key achievements</li>
          <li>• Include 2-3 top skills or technologies</li>
          <li>• End with your career objective or what you bring to employers</li>
        </ul>
      </div>

      {/* Preview */}
      {data.content && (
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview</h4>
          <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {data.content}
          </div>
        </div>
      )}
    </div>
  );
}