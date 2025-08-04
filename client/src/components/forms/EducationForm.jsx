import React from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Plus, Trash2, GraduationCap, Calendar, MapPin, BookOpen, Eye, EyeOff } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import NewLocationSelect from '../LocationSelect'

// Education entry validation schema
const educationEntrySchema = z.object({
  institution: z.string()
    .min(1, 'Institution is required')
    .max(100, 'Institution name too long'),
  
  degree: z.string()
    .min(1, 'Degree is required')
    .max(100, 'Degree name too long'),
  
  location: z.string().optional(),
  
  startDate: z.string()
    .optional()
    .refine((val) => !val || /^[A-Za-z]{3,4}\s\d{4}$/.test(val), {
      message: 'Use format like "Sept 2024" or "Jan 2020"'
    }),
  
  endDate: z.string()
    .optional()
    .refine((val) => !val || /^[A-Za-z]{3,4}\s\d{4}$|^Present$|^Current$/.test(val), {
      message: 'Use format like "May 2026", "Present", or "Current"'
    }),
  
  gpa: z.string()
    .optional()
    .refine((val) => !val || /^\d(\.\d{1,2})?\/\d$/.test(val), {
      message: 'Use format like "3.8/4" or "3.67/4"'
    }),
  
  coursework: z.string().optional(),
  
  enabled: z.boolean().optional()
})

// Main form schema
const educationFormSchema = z.object({
  entries: z.array(educationEntrySchema)
})

export default function NewEducationForm({ data, onChange }) {
  const form = useForm({
    resolver: zodResolver(educationFormSchema),
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

  const addEducationEntry = () => {
    append({
      institution: '',
      degree: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
      coursework: '',
      enabled: true
    })
  }

  const removeEducationEntry = (index) => {
    remove(index)
  }
  
  const toggleEducationEntry = (index) => {
    const entries = form.getValues('entries')
    entries[index].enabled = !entries[index].enabled
    form.setValue('entries', entries)
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Education</h3>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-xs">
                {fields.length} {fields.length === 1 ? 'entry' : 'entries'}
              </Badge>
              <Button 
                type="button"
                onClick={addEducationEntry}
                size="sm"
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Education
              </Button>
            </div>
          </div>

          {/* Education Entries */}
          <div className="space-y-4">
            {fields.map((field, index) => (
              <Card key={field.id} className="relative">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      Education {index + 1}
                      {form.watch(`entries.${index}.enabled`) === false && (
                        <Badge variant="secondary" className="text-xs">Hidden</Badge>
                      )}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleEducationEntry(index)}
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
                        onClick={() => removeEducationEntry(index)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Institution and Location */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`entries.${index}.institution`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Institution *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="New York University" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`entries.${index}.location`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Location
                          </FormLabel>
                          <FormControl>
                            <NewLocationSelect
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="Select location"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Degree */}
                  <FormField
                    control={form.control}
                    name={`entries.${index}.degree`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Degree *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="MS in Computer Science" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Dates and GPA */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                              placeholder="Sept 2024" 
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
                              placeholder="May 2026" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`entries.${index}.gpa`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>GPA</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="3.8/4" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Coursework */}
                  <FormField
                    control={form.control}
                    name={`entries.${index}.coursework`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          Relevant Coursework
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Operating Systems, Design and Analysis of Algorithms, Software Engineering, Artificial Intelligence"
                            className="min-h-[60px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Preview */}
                  {(watchedValues.entries?.[index]?.institution || watchedValues.entries?.[index]?.degree) && (
                    <>
                      <Separator />
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h5 className="text-sm font-medium mb-3 flex items-center gap-2">
                          <GraduationCap className="w-4 h-4" />
                          Preview
                        </h5>
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <div className="font-semibold">
                                {watchedValues.entries?.[index]?.institution || 'Institution Name'}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {watchedValues.entries?.[index]?.degree || 'Degree'}
                                {watchedValues.entries?.[index]?.gpa && `, GPA: ${watchedValues.entries[index].gpa}`}
                              </div>
                            </div>
                            <div className="text-right text-sm text-muted-foreground">
                              <div className="font-medium">
                                {watchedValues.entries?.[index]?.startDate && watchedValues.entries?.[index]?.endDate 
                                  ? `${watchedValues.entries[index].startDate} - ${watchedValues.entries[index].endDate}` 
                                  : 'Dates TBD'}
                              </div>
                              <div>{watchedValues.entries?.[index]?.location || 'Location TBD'}</div>
                            </div>
                          </div>
                          {watchedValues.entries?.[index]?.coursework && (
                            <div className="pt-2 border-t border-border">
                              <span className="text-sm font-medium">Coursework:</span>
                              <span className="text-sm text-muted-foreground ml-2">
                                {watchedValues.entries[index].coursework}
                              </span>
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
                <GraduationCap className="w-12 h-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Education Entries</h3>
                <p className="text-muted-foreground mb-6 text-center max-w-sm">
                  Add your educational background to showcase your academic achievements and qualifications.
                </p>
                <Button onClick={addEducationEntry} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Your First Education
                </Button>
              </CardContent>
            </Card>
          )}
        </form>
      </Form>
    </div>
  )
}