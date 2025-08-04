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

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import SortableSection from './SortableSection';

// Resume section types and their configurations
const SECTION_TYPES = {
  personalInfo: {
    id: 'personalInfo',
    title: 'Personal Information',
    icon: User,
    required: true,
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
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Edit3 className="text-primary" />
                Resume Builder
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {sections.filter(s => s.enabled).length} of {sections.length} sections enabled
                </Badge>
              </div>
            </div>
            <Button
              onClick={() => setShowAddSection(true)}
              size="sm"
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Section
            </Button>
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

      {/* Add Section Dialog */}
      <Dialog open={showAddSection} onOpenChange={setShowAddSection}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Section</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(SECTION_TYPES).map(([key, sectionType]) => {
              const Icon = sectionType.icon;
              const isAdded = sections.some(s => s.type === key);
              
              return (
                <Button
                  key={key}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start gap-2"
                  onClick={() => addSection(key)}
                  disabled={isAdded && sectionType.required}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span className="font-medium text-sm">{sectionType.title}</span>
                  </div>
                  {isAdded && sectionType.required && (
                    <span className="text-xs text-muted-foreground">Already added</span>
                  )}
                </Button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}