import { supabase } from '../lib/supabase';

export const resumeService = {
  // Get all resumes for the current user
  async getUserResumes() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get a specific resume with its sections
  async getResume(resumeId) {
    const { data: resume, error: resumeError } = await supabase
      .from('resumes')
      .select('*')
      .eq('id', resumeId)
      .single();
    
    if (resumeError) throw resumeError;

    const { data: sections, error: sectionsError } = await supabase
      .from('resume_sections')
      .select('*')
      .eq('resume_id', resumeId)
      .order('position', { ascending: true });
    
    if (sectionsError) throw sectionsError;

    return { ...resume, sections };
  },

  // Create a new resume
  async createResume(name = 'Untitled Resume') {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('resumes')
      .insert({ user_id: user.id, name })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update resume
  async updateResume(resumeId, updates) {
    const { data, error } = await supabase
      .from('resumes')
      .update(updates)
      .eq('id', resumeId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete resume
  async deleteResume(resumeId) {
    const { error } = await supabase
      .from('resumes')
      .delete()
      .eq('id', resumeId);
    
    if (error) throw error;
  },

  // Save all sections for a resume
  async saveSections(resumeId, sections) {
    // First, delete existing sections
    const { error: deleteError } = await supabase
      .from('resume_sections')
      .delete()
      .eq('resume_id', resumeId);
    
    if (deleteError) throw deleteError;

    // Then insert new sections
    const sectionsToInsert = sections.map((section, index) => ({
      resume_id: resumeId,
      type: section.type,
      data: section.data,
      enabled: section.enabled,
      position: index
    }));

    const { data, error } = await supabase
      .from('resume_sections')
      .insert(sectionsToInsert)
      .select();
    
    if (error) throw error;
    return data;
  },

  // Update a single section
  async updateSection(sectionId, updates) {
    const { data, error } = await supabase
      .from('resume_sections')
      .update(updates)
      .eq('id', sectionId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Set active resume
  async setActiveResume(resumeId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // First, set all resumes to inactive
    await supabase
      .from('resumes')
      .update({ is_active: false })
      .eq('user_id', user.id);

    // Then set the selected resume as active
    const { data, error } = await supabase
      .from('resumes')
      .update({ is_active: true })
      .eq('id', resumeId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};