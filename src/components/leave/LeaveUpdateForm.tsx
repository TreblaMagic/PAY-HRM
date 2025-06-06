import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Employee } from "@/types/employee";
import { cn } from "@/lib/utils";

interface LeaveUpdateFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    employeeId: string;
    startDate: Date;
    endDate: Date;
    daysUsed: number;
    reason: string;
    status: string;
  }) => void;
  selectedEmployeeId?: string;
  employees: Employee[];
}

export function LeaveUpdateForm({
  isOpen,
  onClose,
  onSubmit,
  selectedEmployeeId,
  employees,
}: LeaveUpdateFormProps) {
  const [employeeId, setEmployeeId] = React.useState(selectedEmployeeId || "");
  const [startDate, setStartDate] = React.useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = React.useState<Date | undefined>(undefined);
  const [reason, setReason] = React.useState("");

  React.useEffect(() => {
    if (selectedEmployeeId) {
      setEmployeeId(selectedEmployeeId);
    }
  }, [selectedEmployeeId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (employeeId && startDate && endDate && reason) {
      const daysUsed = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      onSubmit({
        employeeId,
        startDate,
        endDate,
        daysUsed,
        reason,
        status: "Approved"
      });
      resetForm();
    }
  };

  const resetForm = () => {
    if (!selectedEmployeeId) {
      setEmployeeId("");
    }
    setStartDate(undefined);
    setEndDate(undefined);
    setReason("");
  };

  const calculateDaysDifference = () => {
    if (startDate && endDate) {
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates
      return diffDays;
    }
    return 0;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Update Leave Record</DialogTitle>
          <DialogDescription>
            Add a new leave record for the selected employee.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="employee">Employee</Label>
            <select
              id="employee"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full p-2 border rounded-md"
              disabled={!!selectedEmployeeId}
              required
            >
              <option value="">Select Employee</option>
              {Array.isArray(employees) && employees.length > 0 ? (
                employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  {employees && employees.length === 0 ? 'No employees found' : 'Loading...'}
                </option>
              )}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) =>
                      startDate ? date < startDate : false
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {startDate && endDate && (
            <div className="bg-muted p-3 rounded-md text-sm">
              <p className="font-medium">
                Leave duration:{" "}
                <span className="text-primary">{calculateDaysDifference()} days</span>
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Leave</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for leave"
              className="min-h-[100px]"
              required
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Save Leave Record</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
