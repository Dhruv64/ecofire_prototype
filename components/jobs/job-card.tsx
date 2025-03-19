"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Job } from "@/components/jobs/table/columns";

interface JobCardProps {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
  onSelect: (jobId: string, checked: boolean) => void;
  onOpenTasksSidebar: (job: Job) => void;
  isSelected: boolean;
  taskOwnerMap?: Record<string, string>; 
}

interface TaskCounts {
  total: number;
  completed: number;
}

export function JobCard({
  job,
  onEdit,
  onDelete,
  onSelect,
  onOpenTasksSidebar,
  isSelected,
  taskOwnerMap
}: JobCardProps) {
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [taskCounts, setTaskCounts] = useState<TaskCounts>({ total: 0, completed: 0 });

  // Fetch progress data when the component mounts
  useEffect(() => {
    const fetchJobProgress = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/jobs/progress?ids=${job.id}`);
        const result = await response.json();
        
        if (result.success && result.data) {
          setProgress(result.data[job.id] || 0);
        }
        
        // Also fetch task counts
        const countsResponse = await fetch('/api/jobs/progress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ jobId: job.id }),
        });
        
        const countsResult = await countsResponse.json();
        
        if (countsResult.success && countsResult.data) {
          setTaskCounts(countsResult.data);
        }
      } catch (error) {
        console.error("Error fetching job progress:", error);
      } finally {
        setLoading(false);
      }
    };

    if (job.id) {
      fetchJobProgress();
    }
  }, [job.id]);

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "No due date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get owner name
  const getOwnerName = () => {
    const nextTaskId = job.nextTaskId;
    if (nextTaskId && taskOwnerMap && taskOwnerMap[nextTaskId]) {
      return taskOwnerMap[nextTaskId];
    }
    return "Not assigned";
  };

  // Get task count
  const getTaskCount = () => {
    return `#${job.id.slice(0, 2)}, ${taskCounts.completed} done`;
  };

  // Get function color
  const getFunctionColor = () => {
    const functionName = job.businessFunctionName?.toLowerCase() || "";
    if (functionName.includes("product")) return "bg-orange-100 text-orange-800";
    if (functionName.includes("design")) return "bg-green-100 text-green-800";
    if (functionName.includes("engineering")) return "bg-blue-100 text-blue-800";
    return "bg-gray-100 text-gray-800"; // Default color
  };

  return (
    <div 
      style={{ width: '100%', minHeight: '180px' }}
      className={`bg-white border rounded-md shadow-sm ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
      onClick={() => onOpenTasksSidebar(job)}
    >
      <div className="p-4 cursor-pointer">
        {/* Top section with checkbox, function name, and owner */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div onClick={(e) => e.stopPropagation()}>
              <Checkbox
                checked={isSelected}
                onCheckedChange={(value) => onSelect(job.id, !!value)}
                aria-label="Select job"
              />
            </div>
            <span className={`px-2 py-1 text-xs font-medium rounded ${getFunctionColor()}`}>
              {job.businessFunctionName || "No function"}
            </span>
          </div>
          <span className="text-sm font-medium">
            {getOwnerName()}
          </span>
        </div>
        
        {/* Job title */}
        <div className="mb-6 pl-6">
          <h3 className="text-base font-semibold">{job.title}</h3>
        </div>
        
        {/* Bottom section with task count, due date, and progress */}
        <div className="flex items-center justify-between pl-6">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">{getTaskCount()}</p>
            <p className="text-sm text-gray-500">Due date: {formatDate(job.dueDate)}</p>
          </div>
          
          <div className="relative w-14 h-14">
            {loading ? (
              <div className="h-full w-full flex items-center justify-center">
                <div className="h-7 w-7 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
              </div>
            ) : (
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" stroke="#f0f0f0" strokeWidth="3"></circle>
                <circle 
                  cx="18" 
                  cy="18" 
                  r="16" 
                  fill="none" 
                  stroke={progress > 50 ? "#4CAF50" : progress > 0 ? "#FFC107" : "#f0f0f0"} 
                  strokeWidth="3" 
                  strokeDasharray={`${progress} 100`}
                  strokeLinecap="round"
                  transform="rotate(-90 18 18)"
                ></circle>
                <text x="18" y="21" textAnchor="middle" fontSize="9" fill="#000" fontWeight="bold">
                  {progress}%
                </text>
              </svg>
            )}
          </div>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex justify-end p-2 border-t" onClick={(e) => e.stopPropagation()}>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8" 
          onClick={(e) => {
            e.stopPropagation();
            onEdit(job);
          }}
        >
          <Edit className="h-4 w-4" />
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                job "{job.title}" and remove it from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(job.id)}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}