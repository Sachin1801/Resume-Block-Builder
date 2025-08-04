import React, { useState, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Move, Trash2, Eye, EyeOff, Save, Edit, Check } from 'lucide-react';

import { Button } from '@/components/ui/button';

import NewEnhancedPersonalInfoForm from './forms/PersonalInfoForm';
import NewEducationForm from './forms/EducationForm';
import NewExperienceForm from './forms/ExperienceForm';
import NewProjectForm from './forms/ProjectForm';
import NewSkillsForm from './forms/SkillsForm';
import NewAchievementsForm from './forms/AchievementsForm';
import NewSummaryForm from './forms/SummaryForm';

const FORM_COMPONENTS = {
  personalInfo: NewEnhancedPersonalInfoForm,
  education: NewEducationForm,
  experience: NewExperienceForm,
  projects: NewProjectForm,
  skills: NewSkillsForm,
  achievements: NewAchievementsForm,
  summary: NewSummaryForm
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
  const [isSaved, setIsSaved] = useState(section.isSaved || false);
  const [isEditing, setIsEditing] = useState(!section.isSaved);
  const [hasChanges, setHasChanges] = useState(false);
  const [localData, setLocalData] = useState(section.data);

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

  // Handle local data updates
  const handleLocalUpdate = (newData) => {
    setLocalData(newData);
    setHasChanges(true);
    onUpdate(newData);
  };

  // Handle save
  const handleSave = async () => {
    if (!user || !onSave) return;
    
    await onSave(section.id, localData);
    setIsSaved(true);
    setIsEditing(false);
    setHasChanges(false);
  };

  // Handle edit
  const handleEdit = () => {
    setIsEditing(true);
    setIsSaved(false);
  };

  // Sync with parent data changes
  useEffect(() => {
    setLocalData(section.data);
  }, [section.data]);

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
          ? 'bg-background border-border' 
          : 'bg-muted/50 border-muted opacity-75'
      }`}
    >
      {/* Section Header */}
      <div 
        className={`p-4 border-b cursor-pointer transition-colors ${
          isSaved 
            ? 'bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20' 
            : 'bg-muted/50'
        }`}
        onClick={() => !isSaved && onToggle()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              {...attributes}
              {...listeners}
              className="p-1.5 bg-background rounded-lg shadow-sm cursor-grab hover:bg-muted transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Move className="w-4 h-4 text-muted-foreground" />
            </div>
            
            <div className="p-2 bg-primary rounded-lg text-primary-foreground">
              <Icon className="w-4 h-4" />
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold flex items-center gap-2">
                {sectionType.title}
                {isSaved && (
                  <Check className="w-4 h-4 text-green-600" />
                )}
              </h3>
              <p className="text-sm text-muted-foreground">
                {getItemCount()} {getItemCount() === 1 ? 'item' : 'items'}
                {isSaved && ' • Saved'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Save/Edit buttons */}
            {user && !sectionType.required && (
              <>
                {isSaved ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit();
                      onToggle();
                    }}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                ) : isEditing && hasChanges && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSave();
                    }}
                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                )}
              </>
            )}

            {/* Toggle visibility button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onToggleEnabled();
              }}
              className={section.enabled 
                ? 'text-green-600 hover:text-green-700 hover:bg-green-50' 
                : 'text-muted-foreground hover:text-foreground'
              }
              title={section.enabled ? 'Hide from resume' : 'Show in resume'}
            >
              {section.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </Button>

            {!sectionType.required && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
            
            <div className="text-muted-foreground">
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
                  data={localData}
                  onChange={handleLocalUpdate}
                />
              ) : (
                <div className="text-muted-foreground text-center py-8">
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