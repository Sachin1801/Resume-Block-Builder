import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Plus, Trash2, Award, Code, Database, Cloud, Star, StarHalf, BookOpen } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

// Skills validation schema
const skillsFormSchema = z.object({
  categories: z.record(z.object({
    advanced: z.array(z.string()).optional(),
    intermediate: z.array(z.string()).optional()
  })).optional()
})

// Predefined category suggestions with icons
const CATEGORY_SUGGESTIONS = [
  { name: 'Programming', icon: Code, description: 'Languages & Frameworks' },
  { name: 'Developer Tools', icon: Database, description: 'IDEs, Version Control, etc.' },
  { name: 'Cloud & DevOps', icon: Cloud, description: 'AWS, Docker, CI/CD' },
  { name: 'Soft Skills', icon: BookOpen, description: 'Communication, Leadership' }
]

export default function NewSkillsForm({ data, onChange }) {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')

  const form = useForm({
    resolver: zodResolver(skillsFormSchema),
    defaultValues: {
      categories: data?.categories || {}
    }
  })

  // Watch form values for real-time updates
  const watchedValues = form.watch()

  // Update parent component when form changes
  React.useEffect(() => {
    if (onChange) {
      onChange(watchedValues)
    }
  }, [watchedValues, onChange])

  const addCategory = (categoryName) => {
    if (categoryName && !watchedValues.categories?.[categoryName]) {
      const newCategories = {
        ...watchedValues.categories,
        [categoryName]: { advanced: [], intermediate: [] }
      }
      form.setValue('categories', newCategories)
      setNewCategoryName('')
      setShowAddDialog(false)
    }
  }

  const removeCategory = (categoryName) => {
    const newCategories = { ...watchedValues.categories }
    delete newCategories[categoryName]
    form.setValue('categories', newCategories)
  }

  const updateSkills = (categoryName, level, value) => {
    console.log('Updating skills:', categoryName, level, 'Value:', JSON.stringify(value))
    // Don't split until user is done typing - only split on blur
    const newCategories = {
      ...watchedValues.categories,
      [categoryName]: {
        ...watchedValues.categories[categoryName],
        [level]: [value] // Temporarily store as single string
      }
    }
    form.setValue('categories', newCategories)
  }
  
  const handleSkillsBlur = (categoryName, level, value) => {
    // Split into array when user finishes typing
    const skillsArray = value ? value.split(';').map(s => s.trim()).filter(s => s) : []
    const newCategories = {
      ...watchedValues.categories,
      [categoryName]: {
        ...watchedValues.categories[categoryName],
        [level]: skillsArray
      }
    }
    form.setValue('categories', newCategories)
  }

  const getTotalSkillsCount = () => {
    if (!watchedValues.categories) return 0
    return Object.values(watchedValues.categories).reduce((total, category) => {
      return total + (category.advanced?.length || 0) + (category.intermediate?.length || 0)
    }, 0)
  }

  const categories = watchedValues.categories || {}
  const categoryEntries = Object.entries(categories)

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Technical Skills</h3>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-xs">
                {getTotalSkillsCount()} skills total
              </Badge>
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Skill Category</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Input
                        placeholder="Enter category name (e.g., Programming, Tools)"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            addCategory(newCategoryName)
                          }
                        }}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => addCategory(newCategoryName)}>
                        Add Category
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Skill Categories */}
          <div className="space-y-4">
            {categoryEntries.map(([categoryName, categoryData]) => {
              const advancedCount = categoryData.advanced?.length || 0
              const intermediateCount = categoryData.intermediate?.length || 0
              
              return (
                <Card key={categoryName}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        {categoryName}
                        <div className="flex items-center gap-1 ml-2">
                          {advancedCount > 0 && (
                            <Badge variant="default" className="text-xs gap-1">
                              <Star className="w-3 h-3" />
                              {advancedCount}
                            </Badge>
                          )}
                          {intermediateCount > 0 && (
                            <Badge variant="secondary" className="text-xs gap-1">
                              <StarHalf className="w-3 h-3" />
                              {intermediateCount}
                            </Badge>
                          )}
                        </div>
                      </CardTitle>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCategory(categoryName)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Advanced Skills */}
                    <div>
                      <FormLabel className="flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        Advanced Level Skills
                      </FormLabel>
                      <Input
                        value={
                          Array.isArray(categoryData.advanced) 
                            ? categoryData.advanced.join('; ') 
                            : categoryData.advanced || ''
                        }
                        onChange={(e) => updateSkills(categoryName, 'advanced', e.target.value)}
                        onBlur={(e) => handleSkillsBlur(categoryName, 'advanced', e.target.value)}
                        placeholder="C++; SQL; Python; TypeScript"
                        className="font-mono text-sm"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Separate skills with semicolons (;). These are your strongest competencies.
                      </p>
                    </div>

                    {/* Intermediate Skills */}
                    <div>
                      <FormLabel className="flex items-center gap-2 mb-2">
                        <StarHalf className="w-4 h-4 text-blue-500" />
                        Intermediate Level Skills
                      </FormLabel>
                      <Input
                        value={
                          Array.isArray(categoryData.intermediate) 
                            ? categoryData.intermediate.join('; ') 
                            : categoryData.intermediate || ''
                        }
                        onChange={(e) => updateSkills(categoryName, 'intermediate', e.target.value)}
                        onBlur={(e) => handleSkillsBlur(categoryName, 'intermediate', e.target.value)}
                        placeholder="Java; C#; Go"
                        className="font-mono text-sm"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Skills you're comfortable with but still developing. Separate with semicolons (;).
                      </p>
                    </div>

                    {/* Preview */}
                    {(advancedCount > 0 || intermediateCount > 0) && (
                      <>
                        <Separator />
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <h5 className="text-sm font-medium mb-2">Preview</h5>
                          <div className="space-y-2">
                            {advancedCount > 0 && (
                              <div className="text-sm">
                                <span className="font-medium">Advanced:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {categoryData.advanced.map((skill, index) => (
                                    <Badge key={index} variant="default" className="text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            {intermediateCount > 0 && (
                              <div className="text-sm">
                                <span className="font-medium">Intermediate:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {categoryData.intermediate.map((skill, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
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
          {categoryEntries.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Award className="w-12 h-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Skill Categories</h3>
                <p className="text-muted-foreground mb-6 text-center max-w-sm">
                  Organize your technical skills into categories to showcase your expertise effectively.
                </p>
                
                {/* Quick Add Suggestions */}
                <div className="grid grid-cols-2 gap-3 w-full max-w-md">
                  {CATEGORY_SUGGESTIONS.map((category) => {
                    const Icon = category.icon
                    return (
                      <Button
                        key={category.name}
                        variant="outline"
                        className="h-auto p-4 flex flex-col items-center gap-2"
                        onClick={() => addCategory(category.name)}
                      >
                        <Icon className="w-5 h-5" />
                        <div className="text-center">
                          <div className="font-medium text-sm">{category.name}</div>
                          <div className="text-xs text-muted-foreground">{category.description}</div>
                        </div>
                      </Button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </form>
      </Form>
    </div>
  )
}