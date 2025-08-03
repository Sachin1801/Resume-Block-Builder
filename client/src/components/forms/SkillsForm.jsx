import React from 'react';
import { Plus, Trash2, Award, Code, Database, Cloud } from 'lucide-react';

export default function SkillsForm({ data, onChange }) {
  const categories = data.categories || {};

  const addCategory = () => {
    const categoryName = prompt('Enter category name (e.g., Programming, Tools, etc.):');
    if (categoryName) {
      onChange({
        categories: {
          ...categories,
          [categoryName]: { advanced: [], intermediate: [] }
        }
      });
    }
  };

  const updateCategory = (categoryName, level, skills) => {
    onChange({
      categories: {
        ...categories,
        [categoryName]: {
          ...categories[categoryName],
          [level]: skills
        }
      }
    });
  };

  const removeCategory = (categoryName) => {
    const newCategories = { ...categories };
    delete newCategories[categoryName];
    onChange({ categories: newCategories });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Technical Skills</h3>
        <button
          onClick={addCategory}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      <div className="space-y-4">
        {Object.entries(categories).map(([categoryName, categoryData]) => (
          <div key={categoryName} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <Award className="w-4 h-4" />
                {categoryName}
              </h4>
              <button
                onClick={() => removeCategory(categoryName)}
                className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Advanced Level Skills
                </label>
                <input
                  type="text"
                  value={categoryData.advanced?.join(', ') || ''}
                  onChange={(e) => updateCategory(categoryName, 'advanced', e.target.value.split(', ').filter(s => s.trim()))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                  placeholder="C++, SQL, Python, TypeScript"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Intermediate Level Skills
                </label>
                <input
                  type="text"
                  value={categoryData.intermediate?.join(', ') || ''}
                  onChange={(e) => updateCategory(categoryName, 'intermediate', e.target.value.split(', ').filter(s => s.trim()))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                  placeholder="Java, C#"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {Object.keys(categories).length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No skill categories yet. Click "Add Category" to get started.</p>
        </div>
      )}

      {/* Default Categories Suggestion */}
      {Object.keys(categories).length === 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {['Programming', 'Developer Tools', 'Frontend/Backend', 'Soft Skills'].map(category => (
            <button
              key={category}
              onClick={() => onChange({
                categories: {
                  ...categories,
                  [category]: { advanced: [], intermediate: [] }
                }
              })}
              className="p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              {category}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}