import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Target, Lightbulb, FileText } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

// Summary validation schema
const summaryFormSchema = z.object({
  content: z.string()
    .min(50, 'Summary should be at least 50 characters')
    .max(800, 'Summary should not exceed 800 characters')
    .optional()
    .or(z.literal(''))
})

export default function NewSummaryForm({ data, onChange }) {
  const form = useForm({
    resolver: zodResolver(summaryFormSchema),
    defaultValues: {
      content: data?.content || ''
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

  const getWordCount = (text) => {
    return text ? text.trim().split(/\s+/).filter(word => word.length > 0).length : 0
  }

  const getCharacterCount = () => {
    return watchedValues.content?.length || 0
  }

  const getWordCountStatus = () => {
    const wordCount = getWordCount(watchedValues.content)
    if (wordCount < 50) return { status: 'low', color: 'text-yellow-600' }
    if (wordCount <= 150) return { status: 'good', color: 'text-green-600' }
    if (wordCount <= 200) return { status: 'excellent', color: 'text-blue-600' }
    return { status: 'high', color: 'text-orange-600' }
  }

  const wordCountStatus = getWordCountStatus()

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Professional Summary</h3>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {getWordCount(watchedValues.content)} words
              </Badge>
              <Badge 
                variant={wordCountStatus.status === 'good' || wordCountStatus.status === 'excellent' ? 'default' : 'secondary'} 
                className="text-xs"
              >
                {getCharacterCount()}/800
              </Badge>
            </div>
          </div>

          {/* Summary Content */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Your Professional Story</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Write a compelling professional summary that highlights your key strengths and career objectives.
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Emerging tech professional with a unique blend of software development, AI, and Finance expertise, poised to drive innovation in fintech..."
                        className="min-h-[120px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>{getCharacterCount()} characters</span>
                      <span className={wordCountStatus.color}>
                        {getWordCount(watchedValues.content)} words • 
                        {wordCountStatus.status === 'low' && ' Add more detail'}
                        {wordCountStatus.status === 'good' && ' Perfect length!'}
                        {wordCountStatus.status === 'excellent' && ' Excellent detail!'}
                        {wordCountStatus.status === 'high' && ' Consider shortening'}
                      </span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Writing Tips */}
          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertTitle>Writing Tips for a Strong Summary</AlertTitle>
            <AlertDescription className="mt-2">
              <ul className="text-sm space-y-1">
                <li>• <strong>Start strong:</strong> Begin with your professional title or key expertise</li>
                <li>• <strong>Quantify experience:</strong> Mention years of experience and key achievements</li>
                <li>• <strong>Highlight skills:</strong> Include 2-3 top skills or technologies you excel in</li>
                <li>• <strong>Show value:</strong> End with your career objective or what you bring to employers</li>
                <li>• <strong>Keep it concise:</strong> Aim for 100-200 words for maximum impact</li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Preview */}
          {watchedValues.content && watchedValues.content.length > 20 && (
            <Card className="bg-muted/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Resume Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="text-sm leading-relaxed text-foreground">
                    {watchedValues.content}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty State Guidance */}
          {!watchedValues.content && (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Target className="w-12 h-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Craft Your Professional Summary</h3>
                <p className="text-muted-foreground mb-6 text-center max-w-md">
                  A compelling summary is your elevator pitch. It's the first thing recruiters read, 
                  so make it count by highlighting your unique value proposition.
                </p>
              </CardContent>
            </Card>
          )}
        </form>
      </Form>
    </div>
  )
}