
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Job } from "./table/columns"

interface JobDialogProps {
  mode: 'create' | 'edit';
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (job: Partial<Job>) => void;
  initialData?: Job;
}

export function JobDialog({ 
  mode, 
  open, 
  onOpenChange, 
  onSubmit, 
  initialData 
}: JobDialogProps) {
  const [formData, setFormData] = useState<Partial<Job>>(
    initialData || {
      title: '',
      owner: '',
      businessFunction: '',
      dueDate: ''
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {mode === 'create' ? 'Create New Job' : 'Edit Job'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="owner" className="text-right">
                Owner
              </Label>
              <Input
                id="owner"
                value={formData.owner}
                onChange={(e) => setFormData({...formData, owner: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="businessFunction" className="text-right">
                Business Function
              </Label>
              <Input
                id="businessFunction"
                value={formData.businessFunction}
                onChange={(e) => setFormData({...formData, businessFunction: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="text-right">
                Due Date
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate ? new Date(formData.dueDate).toISOString().split('T')[0] : ''}
                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">
              {mode === 'create' ? 'Create' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}