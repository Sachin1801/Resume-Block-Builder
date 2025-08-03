import React, { useState, useEffect, useCallback } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, User, BookOpen, Briefcase, GitBranch, Award, 
  Mail, Phone, MapPin, Globe, Github, Linkedin, 
  GraduationCap, Calendar, Building, Percent,
  TrendingUp, Target, Zap, Edit3, Trash2, Move
} from 'lucide-react';

import SortableSection from './SortableSection';
import PersonalInfoForm from './forms/PersonalInfoForm';
import EducationForm from './forms/EducationForm';
import ExperienceForm from './forms/ExperienceForm';
import ProjectForm from './forms/ProjectForm';
import SkillsForm from './forms/SkillsForm';
import AchievementsForm from './forms/AchievementsForm';

// Resume section types and their configurations
const SECTION_TYPES = {
  personalInfo: {
    id: 'personalInfo',
    title: 'Personal Information',
    icon: User,
    required: true,
    component: PersonalInfoForm,
    latexTemplate: (data) => {
      if (!data.fullName && !data.email && !data.phone) return '';
      
      return `
\\begin{center}
    {\\vspace{-28pt}
    \\Huge \\scshape ${data.fullName || 'Your Name'}} \\\\ \\vspace{1pt}
    ${data.location ? `{\\small \\scshape ${data.location}} \\hspace{1em}` : ''} ${data.phone ? `\\small \\raisebox{-0.2\\height}\\faPhone\\ ${data.phone}` : ''} ${data.location && data.phone ? '\\\\ \\vspace{1pt}' : ''}
    ${data.email ? `\\href{mailto:${data.email}}{\\raisebox{-0.2\\height}\\faEnvelope\\ \\underline{${data.email}}}` : ''}${data.website ? ` ~ 
    \\href{${data.website}}{\\raisebox{-0.2\\height}\\faGlobe\\ \\underline{Portfolio Website}}` : ''}${data.linkedin ? ` ~
    \\href{${data.linkedin}}{\\raisebox{-0.2\\height}\\faLinkedin\\ \\underline{${data.linkedin.split('/').pop() || 'linkedin'}}}` : ''}${data.github ? ` ~
    \\href{${data.github}}{\\raisebox{-0.2\\height}\\faGithub\\ \\underline{${data.github.split('/').pop() || 'github'}}}` : ''}
    \\vspace{-8pt}
\\end{center}`
    }
  },
  
  summary: {
    id: 'summary',
    title: 'Professional Summary',
    icon: Target,
    required: false,
    component: null, // Simple text area
    latexTemplate: (data) => {
      if (!data.content || !data.content.trim()) return '';
      return `
\\section{Summary}
${data.content}
\\vspace{-6pt}`;
    }
  },
  
  education: {
    id: 'education',
    title: 'Education',
    icon: BookOpen,
    required: false,
    component: EducationForm,
    latexTemplate: (data) => {
      if (!data.entries || data.entries.length === 0) return '';
      return `
\\section{\\textbf{Education}}
\\vspace{-5pt}
\\resumeSubHeadingListStart
${data.entries.map(entry => `
  \\resumeSubheading
    {${entry.institution || 'Institution'}}{${entry.startDate || 'Start'} - ${entry.endDate || 'End'}}
    {${entry.degree || 'Degree'}${entry.gpa ? `, \\textbf{GPA: ${entry.gpa}}` : ''}}{${entry.location || 'Location'}}
    ${entry.coursework ? `\\resumeItemListStart
      \\resumeItem{Coursework: ${entry.coursework}}
    \\resumeItemListEnd` : ''}
`).join('')}
\\resumeSubHeadingListEnd
\\vspace{-17pt}`;
    }
  },
  
  experience: {
    id: 'experience',
    title: 'Experience',
    icon: Briefcase,
    required: false,
    component: ExperienceForm,
    latexTemplate: (data) => {
      if (!data.entries || data.entries.length === 0) return '';
      return `
\\section{Experience}
\\vspace{-2pt}
\\resumeSubHeadingListStart
${data.entries.map(entry => `
  \\resumeSubheading
    {${entry.company || 'Company'}}{${entry.startDate || 'Start'} – ${entry.endDate || 'End'}}
    {${entry.position || 'Position'}}{}
    ${entry.achievements && entry.achievements.length > 0 && entry.achievements.some(a => a.trim()) ? `\\resumeItemListStart
${entry.achievements.filter(a => a.trim()).map(achievement => `      \\resumeItem{${achievement}}`).join('\n')}
    \\resumeItemListEnd` : ''}
    \\vspace{-2pt}
`).join('')}
\\resumeSubHeadingListEnd`;
    }
  },
  
  projects: {
    id: 'projects',
    title: 'Projects',
    icon: GitBranch,
    required: false,
    component: ProjectForm,
    latexTemplate: (data) => {
      if (!data.entries || data.entries.length === 0) return '';
      return `
\\section{Projects \\hfill \\textit{\\small (Click on Title to open project)}}
\\vspace{-10pt}
\\resumeSubHeadingListStart
${data.entries.map(entry => `
  \\resumeProjectHeading
    {${entry.url ? `\\href{${entry.url}}{\\textbf{${entry.name || 'Project'}}}` : `\\textbf{${entry.name || 'Project'}}`} $|$ \\emph{${entry.technologies || 'Technologies'}}}{${entry.date || 'Date'}}
    ${entry.achievements && entry.achievements.length > 0 && entry.achievements.some(a => a.trim()) ? `\\resumeItemListStart
${entry.achievements.filter(a => a.trim()).map(achievement => `      \\resumeItem{${achievement}}`).join('\n')}
    \\resumeItemListEnd` : ''}
    \\vspace{-16pt}
`).join('')}
\\resumeSubHeadingListEnd`;
    }
  },
  
  skills: {
    id: 'skills',
    title: 'Technical Skills',
    icon: Award,
    required: false,
    component: SkillsForm,
    latexTemplate: (data) => {
      if (!data.categories || Object.keys(data.categories).length === 0) return '';
      const hasContent = Object.values(data.categories).some(cat => 
        (cat.advanced && cat.advanced.length > 0) || (cat.intermediate && cat.intermediate.length > 0)
      );
      if (!hasContent) return '';
      
      return `
\\section{Technical Skills}
\\vspace{-5pt}
\\begin{itemize}[leftmargin=0.15in, label={}]
  \\small{\\item{
${Object.entries(data.categories).filter(([category, skills]) => 
  (skills.advanced && skills.advanced.length > 0) || (skills.intermediate && skills.intermediate.length > 0)
).map(([category, skills]) => {
  const advancedText = skills.advanced?.length ? `\\textit{\\textbf{Advanced}}: ${skills.advanced.join(', ')}` : '';
  const intermediateText = skills.intermediate?.length ? `\\textit{\\textbf{Intermediate}}: ${skills.intermediate.join(', ')}` : '';
  const separator = advancedText && intermediateText ? ' ' : '';
  return `     \\textbf{${category}}{: ${advancedText}${separator}${intermediateText}} \\\\`;
}).join('\n')}
  }}
\\end{itemize}
\\vspace{-18pt}`;
    }
  },
  
  achievements: {
    id: 'achievements',
    title: 'Achievements',
    icon: TrendingUp,
    required: false,
    component: AchievementsForm,
    latexTemplate: (data) => {
      if (!data.entries || data.entries.length === 0) return '';
      const validEntries = data.entries.filter(entry => entry.title && entry.title.trim());
      if (validEntries.length === 0) return '';
      
      return `
\\section{Achievements}
\\vspace{-5pt}
\\begin{itemize}[leftmargin=0.10in, label={}]
\\small{\\item
\\resumeItemListStart
${validEntries.map(entry => 
  `\\resumeItem{${entry.url ? `\\href{${entry.url}}{\\textbf{${entry.title}}}` : `\\textbf{${entry.title}}`}${entry.description ? ` \\\\ ${entry.description}` : ''}}`
).join('\n')}
\\resumeItemListEnd
}
\\end{itemize}
\\vspace{-5pt}`;
    }
  }
};

// Default resume structure with toggle capability
const DEFAULT_SECTIONS = [
  { id: 'personalInfo', type: 'personalInfo', data: {}, enabled: true },
  { id: 'education', type: 'education', data: { entries: [] }, enabled: true },
  { id: 'projects', type: 'projects', data: { entries: [] }, enabled: true },
  { id: 'experience', type: 'experience', data: { entries: [] }, enabled: true },
  { id: 'skills', type: 'skills', data: { categories: {} }, enabled: true },
  { id: 'achievements', type: 'achievements', data: { entries: [] }, enabled: true },
  { id: 'summary', type: 'summary', data: { content: '' }, enabled: false }
];

export default function ResumeBuilder({ onLatexChange }) {
  const [sections, setSections] = useState(DEFAULT_SECTIONS);
  const [activeSection, setActiveSection] = useState(null);
  const [showAddSection, setShowAddSection] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Generate LaTeX from enabled sections only
  const generateLatex = useCallback(() => {
    const latexContent = sections
      .filter(section => section.enabled) // Only include enabled sections
      .map(section => {
        const sectionType = SECTION_TYPES[section.type];
        if (!sectionType) return '';
        return sectionType.latexTemplate(section.data || {});
      })
      .filter(content => content.trim() !== '') // Filter out empty sections
      .join('\n\n');
    
    return latexContent;
  }, [sections]);

  // Update LaTeX when sections change
  useEffect(() => {
    const latex = generateLatex();
    console.log('Generated LaTeX:', latex ? 'Content generated' : 'Empty content');
    onLatexChange(latex);
  }, [sections, generateLatex]);

  // Handle section reordering
  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setSections(sections => {
        const oldIndex = sections.findIndex(section => section.id === active.id);
        const newIndex = sections.findIndex(section => section.id === over.id);
        return arrayMove(sections, oldIndex, newIndex);
      });
    }
  };

  // Update section data
  const updateSectionData = (sectionId, newData) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, data: { ...section.data, ...newData } }
        : section
    ));
  };

  // Add new section
  const addSection = (type) => {
    const newSection = {
      id: `${type}-${Date.now()}`,
      type,
      data: type === 'summary' ? { content: '' } : { entries: [] }
    };
    setSections(prev => [...prev, newSection]);
    setShowAddSection(false);
  };

  // Remove section
  const removeSection = (sectionId) => {
    setSections(prev => prev.filter(section => section.id !== sectionId));
  };

  // Toggle section enabled/disabled
  const toggleSectionEnabled = (sectionId) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, enabled: !section.enabled }
        : section
    ));
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Edit3 className="text-blue-500" />
              Resume Builder
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {sections.filter(s => s.enabled).length} of {sections.length} sections enabled
            </p>
          </div>
          <button
            onClick={() => setShowAddSection(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Section
          </button>
        </div>
      </div>

      {/* Sections List */}
      <div className="flex-1 overflow-y-auto p-4">
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={sections.map(s => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {sections.map((section) => {
                const sectionType = SECTION_TYPES[section.type];
                if (!sectionType) return null;

                return (
                  <SortableSection
                    key={section.id}
                    section={section}
                    sectionType={sectionType}
                    isActive={activeSection === section.id}
                    onToggle={() => setActiveSection(activeSection === section.id ? null : section.id)}
                    onUpdate={(data) => updateSectionData(section.id, data)}
                    onRemove={() => removeSection(section.id)}
                    onToggleEnabled={() => toggleSectionEnabled(section.id)}
                  />
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Add Section Modal */}
      <AnimatePresence>
        {showAddSection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddSection(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Add New Section
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(SECTION_TYPES).map(([key, sectionType]) => {
                  const Icon = sectionType.icon;
                  const isAdded = sections.some(s => s.type === key);
                  
                  return (
                    <button
                      key={key}
                      onClick={() => addSection(key)}
                      disabled={isAdded && sectionType.required}
                      className={`p-3 rounded-lg border-2 transition-all text-left ${
                        isAdded && sectionType.required
                          ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                          : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50 dark:border-gray-600 dark:hover:border-blue-400'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="w-4 h-4" />
                        <span className="font-medium text-sm">{sectionType.title}</span>
                      </div>
                      {isAdded && sectionType.required && (
                        <span className="text-xs text-gray-400">Already added</span>
                      )}
                    </button>
                  );
                })}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={() => setShowAddSection(false)}
                  className="w-full px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}