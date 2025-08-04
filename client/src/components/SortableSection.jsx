import React, { useState, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Move, Trash2, Eye, EyeOff, Save, Edit, Check } from 'lucide-react';

import PersonalInfoForm from './forms/PersonalInfoForm';
import EnhancedPersonalInfoForm from './EnhancedPersonalInfoForm';
import EducationForm from './forms/EducationForm';
import ExperienceForm from './forms/ExperienceForm';
import ProjectForm from './forms/ProjectForm';
import SkillsForm from './forms/SkillsForm';
import AchievementsForm from './forms/AchievementsForm';
import SummaryForm from './forms/SummaryForm';

const FORM_COMPONENTS = {
  personalInfo: EnhancedPersonalInfoForm,
  education: EducationForm,
  experience: ExperienceForm,
  projects: ProjectForm,
  skills: SkillsForm,
  achievements: AchievementsForm,
  summary: SummaryForm
};

export default function SortableSection({ 
  section, 
  sectionType, 
  isActive, 
  onToggle, 
  onUpdate, 
  onRemove,
  onToggleEnabled,
  onSave,
  user
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const Icon = sectionType.icon;
  const FormComponent = FORM_COMPONENTS[section.type];
  const [isSaved, setIsSaved] = useState(section.isSaved || false);
  const [isEditing, setIsEditing] = useState(!section.isSaved);
  const [hasChanges, setHasChanges] = useState(false);
  const [localData, setLocalData] = useState(section.data);

  const handleSave = async () => {
    if (onSave) {
      await onSave(section.id, localData);
    }
    setIsSaved(true);
    setIsEditing(false);
    setHasChanges(false);
    onUpdate(localData);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setLocalData(section.data); // Reset local data to current section data
    onToggle(); // Expand the section when editing
  };

  const handleDataChange = (newData) => {
    setLocalData(newData);
    setHasChanges(true);
    // Update parent component to trigger LaTeX regeneration
    onUpdate(newData);
  };

  // Count items in section for display
  const getItemCount = () => {
    if (section.type === 'summary') {
      return section.data?.content ? 1 : 0;
    }
    if (section.type === 'personalInfo') {
      return Object.keys(section.data || {}).length;
    }
    if (section.type === 'skills') {
      return Object.values(section.data?.categories || {}).reduce((acc, cat) => 
        acc + (cat.advanced?.length || 0) + (cat.intermediate?.length || 0), 0
      );
    }
    return section.data?.entries?.length || 0;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-xl shadow-sm border overflow-hidden transition-all ${
        isDragging ? 'opacity-50 scale-105 shadow-lg' : ''
      } ${
        section.enabled 
          ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700' 
          : 'bg-gray-50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 opacity-75'
      }`}
    >
      {/* Section Header */}
      <div 
        className={`p-4 border-b border-gray-200 dark:border-gray-600 cursor-pointer transition-colors ${
          isSaved 
            ? 'bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20' 
            : 'bg-gray-50 dark:bg-gray-700'
        }`}
        onClick={() => !isSaved && onToggle()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              {...attributes}
              {...listeners}
              className="p-1.5 bg-white dark:bg-gray-600 rounded-lg shadow-sm cursor-grab hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Move className="w-4 h-4 text-gray-500 dark:text-gray-300" />
            </div>
            
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg text-white">
              <Icon className="w-4 h-4" />
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                {sectionType.title}
                {isSaved && <Check className="w-4 h-4 text-green-500" />}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {getItemCount()} {getItemCount() === 1 ? 'item' : 'items'}
                {isSaved && ' • Saved'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Save/Edit button */}
            {user && (
              <>
                {!isSaved && isEditing && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSave();
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Save
                  </button>
                )}
                {isSaved && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit();
                    }}
                    className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    title="Edit section"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                )}
              </>
            )}

            {/* Toggle visibility button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleEnabled();
              }}
              className={`p-1.5 rounded-lg transition-colors ${
                section.enabled 
                  ? 'text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20' 
                  : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              title={section.enabled ? 'Hide from resume' : 'Show in resume'}
            >
              {section.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>

            {!sectionType.required && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            
            {!isSaved && (
              <div className="text-gray-400 dark:text-gray-500">
                {isActive ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section Content */}
      <AnimatePresence>
        {(isActive && isEditing) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4">
              {FormComponent ? (
                <FormComponent
                  data={localData}
                  onChange={handleDataChange}
                />
              ) : (
                <div className="text-gray-500 dark:text-gray-400 text-center py-8">
                  Form component not implemented yet
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Saved Section Preview */}
      {isSaved && !isEditing && (
        <div className="p-4 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {getSectionPreview(section.type, localData)}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to generate section preview
function getSectionPreview(type, data) {
  if (!data) return 'No data';
  
  switch (type) {
    case 'personalInfo':
      return (
        <div className="space-y-1">
          {data.fullName && <div className="font-medium">{data.fullName}</div>}
          {data.email && <div>{data.email}</div>}
          {data.location && <div>{data.location}</div>}
        </div>
      );
    
    case 'summary':
      return data.content ? (
        <div className="line-clamp-3">{data.content}</div>
      ) : 'No summary';
    
    case 'education':
      return data.entries?.length ? (
        <div className="space-y-2">
          {data.entries.slice(0, 2).map((entry, idx) => (
            <div key={idx}>
              <span className="font-medium">{entry.institution}</span> • {entry.degree}
            </div>
          ))}
          {data.entries.length > 2 && (
            <div className="text-gray-500">+{data.entries.length - 2} more</div>
          )}
        </div>
      ) : 'No education entries';
    
    case 'experience':
      return data.entries?.length ? (
        <div className="space-y-2">
          {data.entries.slice(0, 2).map((entry, idx) => (
            <div key={idx}>
              <span className="font-medium">{entry.position}</span> at {entry.company}
            </div>
          ))}
          {data.entries.length > 2 && (
            <div className="text-gray-500">+{data.entries.length - 2} more</div>
          )}
        </div>
      ) : 'No experience entries';
    
    case 'projects':
      return data.entries?.length ? (
        <div className="space-y-2">
          {data.entries.slice(0, 2).map((entry, idx) => (
            <div key={idx}>
              <span className="font-medium">{entry.name}</span>
              {entry.technologies && <span className="text-gray-500"> • {entry.technologies}</span>}
            </div>
          ))}
          {data.entries.length > 2 && (
            <div className="text-gray-500">+{data.entries.length - 2} more</div>
          )}
        </div>
      ) : 'No projects';
    
    case 'skills':
      const totalSkills = Object.values(data.categories || {}).reduce((acc, cat) => 
        acc + (cat.advanced?.length || 0) + (cat.intermediate?.length || 0), 0
      );
      return totalSkills > 0 ? (
        <div>
          {Object.entries(data.categories || {}).slice(0, 2).map(([category, skills]) => (
            <div key={category}>
              <span className="font-medium">{category}:</span> {
                [...(skills.advanced || []), ...(skills.intermediate || [])].slice(0, 3).join(', ')
              }
            </div>
          ))}
          {totalSkills > 6 && <div className="text-gray-500">+{totalSkills - 6} more skills</div>}
        </div>
      ) : 'No skills added';
    
    case 'achievements':
      return data.entries?.length ? (
        <div className="space-y-1">
          {data.entries.slice(0, 2).map((entry, idx) => (
            <div key={idx} className="line-clamp-1">
              • {entry.title}
            </div>
          ))}
          {data.entries.length > 2 && (
            <div className="text-gray-500">+{data.entries.length - 2} more</div>
          )}
        </div>
      ) : 'No achievements';
    
    default:
      return 'No preview available';
  }
}