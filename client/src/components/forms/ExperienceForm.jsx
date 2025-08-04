import React from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Plus, Trash2, Briefcase, Calendar, Building, TrendingUp } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

// Experience entry validation schema
const experienceEntrySchema = z.object({
  company: z.string()
    .min(1, 'Company is required')
    .max(100, 'Company name too long'),
  
  position: z.string()
    .min(1, 'Position is required')
    .max(100, 'Position title too long'),
  
  startDate: z.string()
    .optional()
    .refine((val) => !val || /^[A-Za-z]{3,4}\s\d{4}$/.test(val), {
      message: 'Use format like "June 2023" or "Jan 2022"'
    }),
  
  endDate: z.string()
    .optional()
    .refine((val) => !val || /^[A-Za-z]{3,4}\s\d{4}$|^Present$|^Current$/.test(val), {
      message: 'Use format like "Sept 2024", "Present", or "Current"'
    }),
  
  achievements: z.array(z.string().min(1, 'Achievement cannot be empty'))
    .min(1, 'At least one achievement is required')
})

// Main form schema
const experienceFormSchema = z.object({
  entries: z.array(experienceEntrySchema)
})

// Individual Achievement Component
function AchievementField({ experienceIndex, achievementIndex, form, removeAchievement, isOnlyAchievement }) {
  return (
    <div className="flex gap-2 group">
      <FormField
        control={form.control}
        name={`entries.${experienceIndex}.achievements.${achievementIndex}`}
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormControl>
              <Textarea
                placeholder="Led development of fintech website using AI tools, achieving 10,000+ views and recognition..."
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

export default function NewExperienceForm({ data, onChange }) {
  const form = useForm({
    resolver: zodResolver(experienceFormSchema),
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

  const addExperienceEntry = () => {
    append({
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      achievements: ['']
    })
  }

  const removeExperienceEntry = (index) => {
    remove(index)
  }

  const addAchievement = (experienceIndex) => {
    const currentAchievements = form.getValues(`entries.${experienceIndex}.achievements`) || []
    form.setValue(`entries.${experienceIndex}.achievements`, [...currentAchievements, ''])
  }

  const removeAchievement = (experienceIndex, achievementIndex) => {
    const currentAchievements = form.getValues(`entries.${experienceIndex}.achievements`) || []
    if (currentAchievements.length > 1) {
      const newAchievements = currentAchievements.filter((_, index) => index !== achievementIndex)
      form.setValue(`entries.${experienceIndex}.achievements`, newAchievements)
    }
  }

  const getAchievementsCount = (experienceIndex) => {
    return watchedValues.entries?.[experienceIndex]?.achievements?.filter(a => a?.trim()).length || 0
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Work Experience</h3>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-xs">
                {fields.length} {fields.length === 1 ? 'position' : 'positions'}
              </Badge>
              <Button 
                type="button"
                onClick={addExperienceEntry}
                size="sm"
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Experience
              </Button>
            </div>
          </div>

          {/* Experience Entries */}
          <div className="space-y-4">
            {fields.map((field, index) => {
              const achievements = watchedValues.entries?.[index]?.achievements || ['']
              
              return (
                <Card key={field.id} className="relative">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        Experience {index + 1}
                        <Badge variant="outline" className="text-xs ml-2">
                          {getAchievementsCount(index)} achievements
                        </Badge>
                      </CardTitle>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExperienceEntry(index)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Company and Position */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`entries.${index}.company`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Building className="w-4 h-4" />
                              Company *
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Growvisionary" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`entries.${index}.position`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Position *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Technical Associate Intern" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`entries.${index}.startDate`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              Start Date
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="June 2023" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`entries.${index}.endDate`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              End Date
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Present" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Achievements Section */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <FormLabel className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          Key Achievements *
                        </FormLabel>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addAchievement(index)}
                          className="gap-2"
                        >
                          <Plus className="w-3 h-3" />
                          Add Achievement
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {achievements.map((_, achievementIndex) => (
                          <AchievementField
                            key={achievementIndex}
                            experienceIndex={index}
                            achievementIndex={achievementIndex}
                            form={form}
                            removeAchievement={(achIndex) => removeAchievement(index, achIndex)}
                            isOnlyAchievement={achievements.length === 1}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Preview */}
                    {(watchedValues.entries?.[index]?.company || watchedValues.entries?.[index]?.position) && (
                      <>
                        <Separator />
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <h5 className="text-sm font-medium mb-3 flex items-center gap-2">
                            <Briefcase className="w-4 h-4" />
                            Preview
                          </h5>
                          <div className="space-y-2">
                            <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                <div className="font-semibold">
                                  {watchedValues.entries?.[index]?.company || 'Company Name'}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {watchedValues.entries?.[index]?.position || 'Position Title'}
                                </div>
                              </div>
                              <div className="text-right text-sm text-muted-foreground">
                                <div className="font-medium">
                                  {watchedValues.entries?.[index]?.startDate && watchedValues.entries?.[index]?.endDate 
                                    ? `${watchedValues.entries[index].startDate} – ${watchedValues.entries[index].endDate}` 
                                    : 'Dates TBD'}
                                </div>
                              </div>
                            </div>
                            
                            {getAchievementsCount(index) > 0 && (
                              <div className="pt-2 border-t border-border">
                                <div className="text-sm font-medium mb-2">Key Achievements:</div>
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
                <Briefcase className="w-12 h-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Work Experience</h3>
                <p className="text-muted-foreground mb-6 text-center max-w-sm">
                  Add your professional experience to highlight your career journey and key achievements.
                </p>
                <Button onClick={addExperienceEntry} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Your First Position
                </Button>
              </CardContent>
            </Card>
          )}
        </form>
      </Form>
    </div>
  )
}