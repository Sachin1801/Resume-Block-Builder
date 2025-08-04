import React from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Plus, Trash2, TrendingUp, Award, ExternalLink, Medal, Eye, EyeOff } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

// Achievement entry validation schema
const achievementEntrySchema = z.object({
  title: z.string()
    .min(1, 'Achievement title is required')
    .max(150, 'Title too long (max 150 characters)'),
  
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
  
  description: z.string()
    .optional()
    .refine((val) => !val || val.length <= 500, {
      message: 'Description too long (max 500 characters)'
    }),
    
  enabled: z.boolean().optional()
})

// Main form schema
const achievementsFormSchema = z.object({
  entries: z.array(achievementEntrySchema)
})

export default function NewAchievementsForm({ data, onChange }) {
  const form = useForm({
    resolver: zodResolver(achievementsFormSchema),
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

  const addAchievementEntry = () => {
    append({
      title: '',
      description: '',
      url: '',
      enabled: true
    })
  }

  const removeAchievementEntry = (index) => {
    remove(index)
  }
  
  const toggleAchievementEntry = (index) => {
    const entries = form.getValues('entries')
    entries[index].enabled = !entries[index].enabled
    form.setValue('entries', entries)
  }

  const formatURL = (url) => {
    if (!url) return url
    if (url.startsWith('http')) return url
    return `https://${url}`
  }

  const getAchievementsWithLinks = () => {
    return watchedValues.entries?.filter(entry => entry.url && entry.title) || []
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Achievements & Recognition</h3>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-xs">
                {fields.length} {fields.length === 1 ? 'achievement' : 'achievements'}
              </Badge>
              {getAchievementsWithLinks().length > 0 && (
                <Badge variant="outline" className="text-xs gap-1">
                  <ExternalLink className="w-3 h-3" />
                  {getAchievementsWithLinks().length} linked
                </Badge>
              )}
              <Button 
                type="button"
                onClick={addAchievementEntry}
                size="sm"
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Achievement
              </Button>
            </div>
          </div>

          {/* Achievement Entries */}
          <div className="space-y-4">
            {fields.map((field, index) => (
              <Card key={field.id} className="relative">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Medal className="w-4 h-4" />
                      Achievement {index + 1}
                      {watchedValues.entries?.[index]?.url && (
                        <Badge variant="outline" className="text-xs gap-1">
                          <ExternalLink className="w-3 h-3" />
                          Linked
                        </Badge>
                      )}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleAchievementEntry(index)}
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
                        onClick={() => removeAchievementEntry(index)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Achievement Title */}
                  <FormField
                    control={form.control}
                    name={`entries.${index}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Achievement Title *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Research Paper Published in ACM Conference Proceedings" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Achievement URL */}
                  <FormField
                    control={form.control}
                    name={`entries.${index}.url`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <ExternalLink className="w-4 h-4" />
                          Link (optional)
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="url"
                            placeholder="https://dl.acm.org/doi/10.1145/3647444.3647906"
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

                  {/* Achievement Description */}
                  <FormField
                    control={form.control}
                    name={`entries.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Action and Gesture Recognition Using Deep Learning and Computer Vision for Deaf and Dumb People cited by 3 researchers"
                            className="min-h-[60px]"
                            {...field} 
                          />
                        </FormControl>
                        <div className="text-xs text-muted-foreground text-right">
                          {field.value?.length || 0}/500 characters
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Preview */}
                  {watchedValues.entries?.[index]?.title && (
                    <>
                      <Separator />
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h5 className="text-sm font-medium mb-3 flex items-center gap-2">
                          <Medal className="w-4 h-4" />
                          Preview
                        </h5>
                        <div className="space-y-2">
                          <div className="font-semibold flex items-center gap-2">
                            {watchedValues.entries[index].url ? (
                              <a 
                                href={watchedValues.entries[index].url.startsWith('http') ? watchedValues.entries[index].url : `https://${watchedValues.entries[index].url}`}
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary hover:underline flex items-center gap-1"
                              >
                                <ExternalLink className="w-4 h-4" />
                                {watchedValues.entries[index].title}
                              </a>
                            ) : (
                              <span className="flex items-center gap-1">
                                <Award className="w-4 h-4 text-yellow-500" />
                                {watchedValues.entries[index].title}
                              </span>
                            )}
                          </div>
                          {watchedValues.entries?.[index]?.description && (
                            <div className="text-sm text-muted-foreground leading-relaxed">
                              {watchedValues.entries[index].description}
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {fields.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <TrendingUp className="w-12 h-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Achievements Yet</h3>
                <p className="text-muted-foreground mb-6 text-center max-w-md">
                  Highlight your accomplishments, awards, publications, certifications, and other notable achievements 
                  that set you apart from other candidates.
                </p>
                <Button onClick={addAchievementEntry} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Your First Achievement
                </Button>
                
                {/* Achievement Examples */}
                <div className="mt-8 w-full max-w-md">
                  <h4 className="text-sm font-medium mb-3 text-center">Examples of achievements:</h4>
                  <div className="grid grid-cols-1 gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Medal className="w-3 h-3" />
                      Published research papers or articles
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-3 h-3" />
                      Awards and recognitions received
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-3 h-3" />
                      Competition wins or rankings
                    </div>
                    <div className="flex items-center gap-2">
                      <ExternalLink className="w-3 h-3" />
                      Certifications and licenses
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </form>
      </Form>
    </div>
  )
}