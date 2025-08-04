import React, { useState } from 'react'
import { Check, ChevronsUpDown, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

// Popular US cities - same list as before
const POPULAR_CITIES = [
  'New York, NY',
  'Los Angeles, CA', 
  'Chicago, IL',
  'Houston, TX',
  'Phoenix, AZ',
  'Philadelphia, PA',
  'San Antonio, TX',
  'San Diego, CA',
  'Dallas, TX',
  'San Jose, CA',
  'Austin, TX',
  'Jacksonville, FL',
  'Fort Worth, TX',
  'Columbus, OH',
  'Charlotte, NC',
  'San Francisco, CA',
  'Indianapolis, IN',
  'Seattle, WA',
  'Denver, CO',
  'Washington, DC',
  'Boston, MA',
  'Nashville, TN',
  'Oklahoma City, OK',
  'Las Vegas, NV',
  'Portland, OR',
  'Memphis, TN',
  'Louisville, KY',
  'Baltimore, MD',
  'Milwaukee, WI',
  'Albuquerque, NM',
  'Tucson, AZ',
  'Fresno, CA',
  'Sacramento, CA',
  'Mesa, AZ',
  'Kansas City, MO',
  'Atlanta, GA',
  'Colorado Springs, CO',
  'Omaha, NE',
  'Raleigh, NC',
  'Miami, FL',
  'Cleveland, OH',
  'Tulsa, OK',
  'Arlington, TX',
  'New Orleans, LA',
  'Wichita, KS',
  'Minneapolis, MN',
  'Tampa, FL',
  'Orlando, FL',
  'Pittsburgh, PA',
  'Remote'
]

export default function NewLocationSelect({ value, onChange, placeholder = "Select or type your location" }) {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const isCustomLocation = value && !POPULAR_CITIES.includes(value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className={cn("truncate", !value && "text-muted-foreground")}>
              {value || placeholder}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput 
            placeholder="Search locations..." 
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>
              <div className="py-2 px-4">
                <p className="text-sm text-muted-foreground mb-2">No location found.</p>
                {searchValue && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      onChange(searchValue)
                      setOpen(false)
                      setSearchValue('')
                    }}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Use "{searchValue}"
                  </Button>
                )}
              </div>
            </CommandEmpty>

            <CommandGroup>
              {/* Show current custom location at top if it exists */}
              {isCustomLocation && (
                <CommandItem
                  value={value}
                  onSelect={() => {
                    onChange(value)
                    setOpen(false)
                    setSearchValue('')
                  }}
                  className="bg-muted/50"
                >
                  <MapPin className="mr-2 h-4 w-4 text-blue-500" />
                  <span className="font-medium">{value}</span>
                  <span className="ml-auto text-xs text-muted-foreground">(Custom)</span>
                  <Check
                    className={cn(
                      "ml-2 h-4 w-4",
                      value === value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              )}

              {/* Popular cities */}
              {POPULAR_CITIES.map((city) => (
                <CommandItem
                  key={city}
                  value={city}
                  onSelect={() => {
                    onChange(city === value ? '' : city)
                    setOpen(false)
                    setSearchValue('')
                  }}
                >
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{city}</span>
                  {city === 'Remote' && (
                    <span className="ml-auto text-xs text-blue-600 font-medium">🌐</span>
                  )}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === city ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}

              {/* Add custom location option */}
              {searchValue && !POPULAR_CITIES.some(city => 
                city.toLowerCase().includes(searchValue.toLowerCase())
              ) && searchValue !== value && (
                <CommandItem
                  value={searchValue}
                  onSelect={() => {
                    onChange(searchValue)
                    setOpen(false)
                    setSearchValue('')
                  }}
                  className="border-t border-border"
                >
                  <MapPin className="mr-2 h-4 w-4 text-blue-500" />
                  <span>Use "{searchValue}"</span>
                  <span className="ml-auto text-xs text-muted-foreground">(Custom)</span>
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}