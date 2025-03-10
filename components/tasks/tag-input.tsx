// components/tasks/tag-input.tsx
"use client";

import React, { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export function TagInput({ value = [], onChange, placeholder = "Add tag..." }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Add tag when pressing Enter or comma
    if ((e.key === "Enter" || e.key === ",") && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue.trim());
    }
  };

  const addTag = (tag: string) => {
    // Don't add if the tag already exists or it's empty
    if (tag.length === 0 || value.includes(tag)) {
      setInputValue("");
      return;
    }

    const newTags = [...value, tag];
    onChange(newTags);
    setInputValue("");
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = value.filter(tag => tag !== tagToRemove);
    onChange(newTags);
  };

  // Function to generate a consistent color for a tag (same as in column definition)
  const getTagColor = (tag: string) => {
    const hashCode = tag.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    const h = Math.abs(hashCode % 360);
    const s = 65 + (hashCode % 20);
    const l = 55 + (hashCode % 15);
    
    return `hsl(${h}, ${s}%, ${l}%)`;
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-1.5 mb-2">
        {value.map((tag, index) => (
          <div
            key={`${tag}-${index}`}
            className="inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-medium text-white"
            style={{ backgroundColor: getTagColor(tag) }}
          >
            <span className="mr-1">{tag}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={() => removeTag(tag)}
            >
              <X className="h-3 w-3 text-white" />
              <span className="sr-only">Remove tag {tag}</span>
            </Button>
          </div>
        ))}
      </div>
      
      <div className="flex items-center gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button 
          type="button" 
          onClick={() => inputValue.trim() && addTag(inputValue.trim())}
          disabled={!inputValue.trim()}
          size="sm"
        >
          Add
        </Button>
      </div>
    </div>
  );
}