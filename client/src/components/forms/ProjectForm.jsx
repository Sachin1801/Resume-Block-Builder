import React from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Plus, Trash2, GitBranch, Calendar, Globe, Code, TrendingUp, ExternalLink, Eye, EyeOff } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

// Project entry validation schema
const projectEntrySchema = z.object({
  name: z.string()
    .min(1, 'Project name is required')
    .max(100, 'Project name too long'),
  
  url: z.string()
    .optional()
    .refine((val) => {
      if (!val) return true
      try {
        new URL(val)
        return true
      } catch {
        return false
      }
    }, 'Please enter a valid URL'),
  
  technologies: z.string()
    .optional()
    .refine((val) => !val || val.length <= 200, {
      message: 'Technologies list too long (max 200 characters)'
    }),
  
  date: z.string()
    .optional()
    .refine((val) => !val || /^[A-Za-z]{3,4}\s\d{4}$/.test(val), {
      message: 'Use format like "Dec 2023" or "January 2024"'
    }),
  
  achievements: z.array(z.string().min(1, 'Achievement cannot be empty'))
    .min(1, 'At least one achievement is required'),
    
  enabled: z.boolean().optional()
})

// Main form schema
const projectFormSchema = z.object({
  entries: z.array(projectEntrySchema)
})

// Individual Achievement Component for Projects
function ProjectAchievementField({ projectIndex, achievementIndex, form, removeAchievement, isOnlyAchievement }) {
  return (
    <div className="flex gap-2 group">
      <FormField
        control={form.control}
        name={`entries.${projectIndex}.achievements.${achievementIndex}`}
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormControl>
              <Textarea
                placeholder="Implemented machine learning algorithms resulting in 95% accuracy prediction rate and $50K cost savings..."
                className="min-h-[60px] resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {!isOnlyAchievement && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => removeAchievement(achievementIndex)}
          className="text-destructive hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity mt-2"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      )}
    </div>
  )
}

export default function NewProjectForm({ data, onChange }) {
  const form = useForm({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      entries: data?.entries || []
    }
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'entries'
  })

  // Watch all form values for real-time updates
  const watchedValues = form.watch()

  // Update parent component when form changes
  React.useEffect(() => {
    if (onChange) {
      onChange(watchedValues)
    }
  }, [watchedValues, onChange])

  const addProjectEntry = () => {
    append({
      name: '',
      url: '',
      technologies: '',
      date: '',
      achievements: [''],
      enabled: true
    })
  }

  const removeProjectEntry = (index) => {
    remove(index)
  }
  
  const toggleProjectEntry = (index) => {
    const entries = form.getValues('entries')
    entries[index].enabled = !entries[index].enabled
    form.setValue('entries', entries)
  }

  const addAchievement = (projectIndex) => {
    const currentAchievements = form.getValues(`entries.${projectIndex}.achievements`) || []
    form.setValue(`entries.${projectIndex}.achievements`, [...currentAchievements, ''])
  }

  const removeAchievement = (projectIndex, achievementIndex) => {
    const currentAchievements = form.getValues(`entries.${projectIndex}.achievements`) || []
    if (currentAchievements.length > 1) {
      const newAchievements = currentAchievements.filter((_, index) => index !== achievementIndex)
      form.setValue(`entries.${projectIndex}.achievements`, newAchievements)
    }
  }

  const getAchievementsCount = (projectIndex) => {
    return watchedValues.entries?.[projectIndex]?.achievements?.filter(a => a?.trim()).length || 0
  }

  const formatURL = (url) => {
    if (!url) return url
    if (url.startsWith('http')) return url
    return `https://${url}`
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Projects</h3>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-xs">
                {fields.length} {fields.length === 1 ? 'project' : 'projects'}
              </Badge>
              <Button 
                type="button"
                onClick={addProjectEntry}
                size="sm"
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Project
              </Button>
            </div>
          </div>

          {/* Project Entries */}
          <div className="space-y-4">
            {fields.map((field, index) => {
              const achievements = watchedValues.entries?.[index]?.achievements || ['']
              
              return (
                <Card key={field.id} className="relative">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <GitBranch className="w-4 h-4" />
                        Project {index + 1}
                        <Badge variant="outline" className="text-xs ml-2">
                          {getAchievementsCount(index)} highlights
                        </Badge>
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleProjectEntry(index)}
                          className={form.watch(`entries.${index}.enabled`) !== false 
                            ? 'text-green-600 hover:text-green-700 hover:bg-green-50' 
                            : 'text-muted-foreground hover:text-foreground'
                          }
                        >
                          {form.watch(`entries.${index}.enabled`) !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeProjectEntry(index)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Project Name and URL */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`entries.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Project Name *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="AI-Powered Multi-Agent Hedge Fund System" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`entries.${index}.url`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Globe className="w-4 h-4" />
                              Project URL
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type="url"
                                placeholder="github.com/username/project" 
                                {...field}
                                onBlur={() => {
                                  if (field.value && !field.value.startsWith('http')) {
                                    field.onChange(formatURL(field.value))
                                  }
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                            {field.value && !field.value.startsWith('http') && (
                              <p className="text-sm text-muted-foreground">✓ Will auto-format to include https://</p>
                            )}
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Technologies and Date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`entries.${index}.technologies`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Code className="w-4 h-4" />
                              Technologies
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Python, TensorFlow, AWS, Docker" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`entries.${index}.date`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              Date
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Dec 2023" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Project Highlights Section */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <FormLabel className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          Project Highlights *
                        </FormLabel>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addAchievement(index)}
                          className="gap-2"
                        >
                          <Plus className="w-3 h-3" />
                          Add Highlight
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {achievements.map((_, achievementIndex) => (
                          <ProjectAchievementField
                            key={achievementIndex}
                            projectIndex={index}
                            achievementIndex={achievementIndex}
                            form={form}
                            removeAchievement={(achIndex) => removeAchievement(index, achIndex)}
                            isOnlyAchievement={achievements.length === 1}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Preview */}
                    {(watchedValues.entries?.[index]?.name) && (
                      <>
                        <Separator />
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <h5 className="text-sm font-medium mb-3 flex items-center gap-2">
                            <GitBranch className="w-4 h-4" />
                            Preview
                          </h5>
                          <div className="space-y-2">
                            <div className="flex justify-between items-start">
                              <div className="space-y-1 flex-1">
                                <div className="font-semibold flex items-center gap-2">
                                  {watchedValues.entries?.[index]?.url ? (
                                    <a 
                                      href={watchedValues.entries[index].url.startsWith('http') ? watchedValues.entries[index].url : `https://${watchedValues.entries[index].url}`}
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-primary hover:underline flex items-center gap-1"
                                    >
                                      {watchedValues.entries[index].name}
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  ) : (
                                    watchedValues.entries[index].name
                                  )}
                                </div>
                                {watchedValues.entries?.[index]?.technologies && (
                                  <div className="text-sm text-muted-foreground">
                                    <Code className="w-3 h-3 inline mr-1" />
                                    {watchedValues.entries[index].technologies}
                                  </div>
                                )}
                              </div>
                              <div className="text-right text-sm text-muted-foreground">
                                {watchedValues.entries?.[index]?.date || 'Date TBD'}
                              </div>
                            </div>
                            
                            {getAchievementsCount(index) > 0 && (
                              <div className="pt-2 border-t border-border">
                                <div className="text-sm font-medium mb-2">Key Highlights:</div>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                  {watchedValues.entries?.[index]?.achievements
                                    ?.filter(a => a?.trim())
                                    .map((achievement, achIndex) => (
                                      <li key={achIndex} className="flex items-start gap-2">
                                        <span className="text-primary mt-1.5">•</span>
                                        <span>{achievement}</span>
                                      </li>
                                    ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Empty State */}
          {fields.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <GitBranch className="w-12 h-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Projects Yet</h3>
                <p className="text-muted-foreground mb-6 text-center max-w-sm">
                  Showcase your technical projects to demonstrate your skills and impact in real-world applications.
                </p>
                <Button onClick={addProjectEntry} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Your First Project
                </Button>
              </CardContent>
            </Card>
          )}
        </form>
      </Form>
    </div>
  )
}