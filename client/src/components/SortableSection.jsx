import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Move, Trash2, Eye, EyeOff } from 'lucide-react';

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
  onToggleEnabled
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
        className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 cursor-pointer"
        onClick={onToggle}
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
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {sectionType.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {getItemCount()} {getItemCount() === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
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
            
            <div className="text-gray-400 dark:text-gray-500">
              {isActive ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </div>
          </div>
        </div>
      </div>

      {/* Section Content */}
      <AnimatePresence>
        {isActive && (
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
                  data={section.data}
                  onChange={onUpdate}
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
    </div>
  );
}