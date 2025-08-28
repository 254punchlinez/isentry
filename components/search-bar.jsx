"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X } from "lucide-react"

export function SearchBar({ onSearch, onClear, searchFields, placeholder = "Search..." }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchField, setSearchField] = useState(searchFields[0]?.value || "")

  const handleSearch = (term) => {
    setSearchTerm(term)
    onSearch(term, searchField)
  }

  const handleClear = () => {
    setSearchTerm("")
    onClear()
  }

  const handleFieldChange = (field) => {
    setSearchField(field)
    if (searchTerm) {
      onSearch(searchTerm, field)
    }
  }

  return (
    <div className="flex gap-2 items-center w-full max-w-md">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      <Select value={searchField} onValueChange={handleFieldChange}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {searchFields.map((field) => (
            <SelectItem key={field.value} value={field.value}>
              {field.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
