
import React from "react";
import { DateRange } from "@/types/attendance";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

type DateRangePickerProps = {
  dateRange: DateRange;
  setDateRange: React.Dispatch<React.SetStateAction<DateRange>>;
  onPrint: () => void;
};

export function DateRangePicker({ dateRange, setDateRange, onPrint }: DateRangePickerProps) {
  return (
    <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
      <div className="flex flex-1 flex-col space-y-2">
        <label className="text-sm font-medium">Start Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !dateRange.startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.startDate ? (
                format(dateRange.startDate, "PPP")
              ) : (
                <span>Pick a start date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateRange.startDate}
              onSelect={(date) =>
                setDateRange((prev) => ({ ...prev, startDate: date }))
              }
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-1 flex-col space-y-2">
        <label className="text-sm font-medium">End Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !dateRange.endDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.endDate ? (
                format(dateRange.endDate, "PPP")
              ) : (
                <span>Pick an end date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateRange.endDate}
              onSelect={(date) =>
                setDateRange((prev) => ({ ...prev, endDate: date }))
              }
              disabled={(date) =>
                dateRange.startDate
                  ? date < dateRange.startDate
                  : false
              }
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col justify-end">
        <Button 
          onClick={onPrint}
          disabled={!dateRange.startDate || !dateRange.endDate}
          className="h-10"
        >
          Print Attendance
        </Button>
      </div>
    </div>
  );
}
