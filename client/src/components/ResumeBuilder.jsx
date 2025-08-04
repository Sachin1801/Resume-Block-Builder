import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, User, BookOpen, Briefcase, GitBranch, Award, 
  Mail, Phone, MapPin, Globe, Github, Linkedin, 
  GraduationCap, Calendar, Building, Percent,
  TrendingUp, Target, Zap, Edit3, Trash2, Move, Save
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
      // Filter only enabled entries
      const enabledEntries = data.entries.filter(entry => entry.enabled !== false);
      if (enabledEntries.length === 0) return '';
      
      return `
\\section{\\textbf{Education}}
\\vspace{-5pt}
\\resumeSubHeadingListStart
${enabledEntries.map(entry => `
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
      // Filter only enabled entries
      const enabledEntries = data.entries.filter(entry => entry.enabled !== false);
      if (enabledEntries.length === 0) return '';
      
      return `
\\section{Experience}
\\vspace{-2pt}
\\resumeSubHeadingListStart
${enabledEntries.map(entry => `
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
      // Filter only enabled entries
      const enabledEntries = data.entries.filter(entry => entry.enabled !== false);
      if (enabledEntries.length === 0) return '';
      
      return `
\\section{Projects \\hfill \\textit{\\small (Click on Title to open project)}}
\\vspace{-10pt}
\\resumeSubHeadingListStart
${enabledEntries.map(entry => `
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
      // Filter enabled entries with valid titles
      const validEntries = data.entries.filter(entry => 
        entry.title && entry.title.trim() && entry.enabled !== false
      );
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

export default function ResumeBuilder({ onLatexChange, user, activeResumeId, onSectionsChange, initialSections }) {
  const [sections, setSections] = useState(initialSections || DEFAULT_SECTIONS);
  const [activeSection, setActiveSection] = useState(null);
  const [showAddSection, setShowAddSection] = useState(false);
  const [currentResumeId, setCurrentResumeId] = useState(activeResumeId);
  const [isSaving, setIsSaving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const updateTimeoutRef = useRef(null);

  // Remove this useEffect entirely to prevent circular updates

  // Create or load resume when user logs in
  useEffect(() => {
    if (user && activeResumeId && activeResumeId !== currentResumeId) {
      setCurrentResumeId(activeResumeId);
      loadResume(activeResumeId);
    } else if (user && !activeResumeId && !currentResumeId) {
      // Only create new resume if user has no resumes
      createDefaultResume();
    }
  }, [user, activeResumeId]);

  const createDefaultResume = async () => {
    try {
      console.log('Creating default resume...');
      const { resumeService } = await import('../services/resumeService');
      
      // First check if user already has resumes
      const existingResumes = await resumeService.getUserResumes();
      if (existingResumes && existingResumes.length > 0) {
        console.log('User already has resumes, not creating new one');
        return;
      }
      
      const resume = await resumeService.createResume('My Resume');
      console.log('Created new resume:', resume.id);
      setCurrentResumeId(resume.id);
      // Save default sections
      await resumeService.saveSections(resume.id, sections);
    } catch (error) {
      console.error('Error creating resume:', error);
    }
  };

  const loadResume = async (resumeId) => {
    try {
      console.log('Loading resume with ID:', resumeId);
      const { resumeService } = await import('../services/resumeService');
      const resume = await resumeService.getResume(resumeId);
      console.log('Resume loaded:', resume);
      
      if (resume.sections && resume.sections.length > 0) {
        // Convert database sections to component format
        const loadedSections = resume.sections.map(s => ({
          id: s.id,
          type: s.type,
          data: s.data,
          enabled: s.enabled,
          isSaved: true
        }));
        console.log('Setting sections:', loadedSections);
        setSections(loadedSections);
      } else {
        console.log('No sections found in resume');
      }
    } catch (error) {
      console.error('Error loading resume:', error);
    }
  };

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
    
    // Debounce parent updates to prevent jitter
    if (onSectionsChange && !isDragging) {
      // Clear existing timeout
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      
      // Set new timeout
      updateTimeoutRef.current = setTimeout(() => {
        onSectionsChange(sections);
      }, 100); // 100ms debounce
    }
    
    // Cleanup timeout on unmount
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [sections, generateLatex, onLatexChange, onSectionsChange, isDragging]);

  // Handle section reordering
  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setSections(sections => {
        const oldIndex = sections.findIndex(section => section.id === active.id);
        const newIndex = sections.findIndex(section => section.id === over.id);
        return arrayMove(sections, oldIndex, newIndex);
      });
    }
    
    setIsDragging(false);
  };

  // Update section data
  const updateSectionData = (sectionId, newData) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, data: { ...section.data, ...newData }, isSaved: false }
        : section
    ));
  };

  // Save section to database
  const saveSection = async (sectionId, data) => {
    if (!user || !currentResumeId) {
      console.log('Cannot save: user or resume ID missing', { user: !!user, currentResumeId });
      return;
    }
    
    setIsSaving(true);
    try {
      console.log('Saving section:', sectionId, 'for resume:', currentResumeId);
      const { resumeService } = await import('../services/resumeService');
      
      // Find the section
      const sectionToSave = sections.find(s => s.id === sectionId);
      if (!sectionToSave) return;
      
      // Save all sections to maintain order
      const updatedSections = sections.map(s => 
        s.id === sectionId 
          ? { ...s, data, isSaved: true }
          : s
      );
      
      console.log('Saving sections to database:', updatedSections);
      await resumeService.saveSections(currentResumeId, updatedSections);
      console.log('Sections saved successfully');
      
      // Update local state
      setSections(updatedSections);
    } catch (error) {
      console.error('Error saving section:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Add new section
  const addSection = (type) => {
    const newSection = {
      id: `${type}-${Date.now()}`,
      type,
      data: type === 'summary' ? { content: '' } : { entries: [] },
      enabled: true,
      isSaved: false
    };
    setSections(prev => [...prev, newSection]);
    setShowAddSection(false);
    setActiveSection(newSection.id); // Automatically open new section
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
              {user && isSaving && ' • Saving...'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {user && (
              <button
                onClick={async () => {
                  // Save all unsaved sections
                  const unsavedSections = sections.filter(s => !s.isSaved);
                  for (const section of unsavedSections) {
                    await saveSection(section.id, section.data);
                  }
                }}
                disabled={!sections.some(s => !s.isSaved) || isSaving}
                className="flex items-center gap-2 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                Save All
              </button>
            )}
            <button
              onClick={() => setShowAddSection(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Section
            </button>
          </div>
        </div>
      </div>

      {/* Sections List */}
      <div className="flex-1 overflow-y-auto p-4">
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
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
                    onSave={saveSection}
                    user={user}
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