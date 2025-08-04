import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { User, Mail, Phone, MapPin, Globe, Github, Linkedin } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import NewLocationSelect from '../LocationSelect'

// Validation schema with Zod - much cleaner than custom validation!
const personalInfoSchema = z.object({
  fullName: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  
  email: z.string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
  
  phone: z.string()
    .optional()
    .refine((val) => !val || /^\(\d{3}\) \d{3}-\d{4}$/.test(val), {
      message: 'Phone must be in format (123) 456-7890'
    }),
  
  location: z.string().optional(),
  
  website: z.string()
    .optional()
    .refine((val) => {
      if (!val) return true
      try {
        new URL(val.startsWith('http') ? val : `https://${val}`)
        return true
      } catch {
        return false
      }
    }, 'Please enter a valid website URL'),
  
  linkedin: z.string()
    .optional()
    .refine((val) => {
      if (!val) return true
      const linkedinRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/
      return linkedinRegex.test(val) || /^[a-zA-Z0-9-]+$/.test(val)
    }, 'Please enter a valid LinkedIn profile URL or username'),
  
  github: z.string()
    .optional()
    .refine((val) => {
      if (!val) return true
      const githubRegex = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9-]+\/?$/
      return githubRegex.test(val) || /^[a-zA-Z0-9-]+$/.test(val)
    }, 'Please enter a valid GitHub profile URL or username')
})

// Auto-formatting utilities
const formatPhone = (value) => {
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 3) return numbers
  if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`
  return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`
}

const formatURL = (value) => {
  if (!value) return value
  if (value.startsWith('http')) return value
  return `https://${value}`
}

const formatLinkedIn = (value) => {
  if (!value) return value
  if (value.includes('linkedin.com')) return value
  return `https://linkedin.com/in/${value}`
}

const formatGitHub = (value) => {
  if (!value) return value
  if (value.includes('github.com')) return value
  return `https://github.com/${value}`
}

export default function NewEnhancedPersonalInfoForm({ data, onChange }) {
  const form = useForm({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      fullName: data?.fullName || '',
      email: data?.email || '',
      phone: data?.phone || '',
      location: data?.location || '',
      website: data?.website || '',
      linkedin: data?.linkedin || '',
      github: data?.github || ''
    }
  })

  // Watch all form values for real-time updates
  const watchedValues = form.watch()

  // Update parent component when form changes
  React.useEffect(() => {
    if (onChange) {
      onChange(watchedValues)
    }
  }, [watchedValues, onChange])

  // Handle auto-formatting
  const handlePhoneChange = (value, field) => {
    const formatted = formatPhone(value)
    field.onChange(formatted)
  }

  const handleURLChange = (value, field, formatter) => {
    field.onChange(value)
    // Auto-format after a brief delay if the field loses focus
    if (value && !value.startsWith('http')) {
      setTimeout(() => {
        const formatted = formatter(value)
        if (formatted !== value) {
          field.onChange(formatted)
        }
      }, 500)
    }
  }

  const getContactCount = () => {
    const contacts = [watchedValues.email, watchedValues.phone, watchedValues.website, watchedValues.linkedin, watchedValues.github]
    return contacts.filter(Boolean).length
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Personal Information</h3>
            </div>
            <Badge variant="secondary" className="text-xs">
              {getContactCount()} contact method{getContactCount() !== 1 ? 's' : ''}
            </Badge>
          </div>

          {/* Full Name - Required */}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name *
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Sachin Adlakha" 
                    {...field} 
                    className="transition-all duration-200"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Contact Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email *
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="email"
                      placeholder="sa9082@nyu.edu" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="tel"
                      placeholder="(646) 633-5776"
                      {...field}
                      onChange={(e) => handlePhoneChange(e.target.value, field)}
                    />
                  </FormControl>
                  <FormMessage />
                  {field.value && form.formState.errors.phone === undefined && (
                    <p className="text-sm text-muted-foreground">✓ Auto-formatted US phone number</p>
                  )}
                </FormItem>
              )}
            />
          </div>

          {/* Location */}
          <FormField
            control={form.control}
            name="location"
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
                    placeholder="Select or type your location"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Professional Links */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Professional Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Portfolio Website
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="url"
                        placeholder="sachinadlakha3d.vercel.app"
                        {...field}
                        onBlur={() => handleURLChange(field.value, field, formatURL)}
                      />
                    </FormControl>
                    <FormMessage />
                    {field.value && !field.value.startsWith('http') && (
                      <p className="text-sm text-muted-foreground">✓ Will auto-format to include https://</p>
                    )}
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Linkedin className="w-4 h-4" />
                        LinkedIn
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="sachin-adlakha"
                          {...field}
                          onBlur={() => handleURLChange(field.value, field, formatLinkedIn)}
                        />
                      </FormControl>
                      <FormMessage />
                      {field.value && !field.value.includes('linkedin.com') && (
                        <p className="text-sm text-muted-foreground">✓ Will auto-format to full LinkedIn URL</p>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="github"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Github className="w-4 h-4" />
                        GitHub
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Sachin1801"
                          {...field}
                          onBlur={() => handleURLChange(field.value, field, formatGitHub)}
                        />
                      </FormControl>
                      <FormMessage />
                      {field.value && !field.value.includes('github.com') && (
                        <p className="text-sm text-muted-foreground">✓ Will auto-format to full GitHub URL</p>
                      )}
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Preview */}
          <Card className="bg-muted/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Resume Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-2">
                <h2 className="text-xl font-bold">
                  {watchedValues.fullName || 'Your Name'}
                </h2>
                {watchedValues.location && (
                  <p className="text-sm text-muted-foreground">{watchedValues.location}</p>
                )}
                <div className="flex flex-wrap justify-center gap-2 text-sm">
                  {watchedValues.phone && (
                    <Badge variant="outline" className="gap-1">
                      <Phone className="w-3 h-3" />
                      {watchedValues.phone}
                    </Badge>
                  )}
                  {watchedValues.email && (
                    <Badge variant="outline" className="gap-1">
                      <Mail className="w-3 h-3" />
                      {watchedValues.email}
                    </Badge>
                  )}
                  {watchedValues.website && (
                    <Badge variant="outline" className="gap-1">
                      <Globe className="w-3 h-3" />
                      Portfolio
                    </Badge>
                  )}
                  {watchedValues.linkedin && (
                    <Badge variant="outline" className="gap-1">
                      <Linkedin className="w-3 h-3" />
                      LinkedIn
                    </Badge>
                  )}
                  {watchedValues.github && (
                    <Badge variant="outline" className="gap-1">
                      <Github className="w-3 h-3" />
                      GitHub
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  )
}