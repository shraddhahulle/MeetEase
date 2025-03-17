
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 pointer-events-auto premium-calendar w-full max-w-none", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4 w-full",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-md font-medium text-cyan-700 dark:text-cyan-300",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-9 w-9 bg-white dark:bg-gray-800 border-cyan-200 dark:border-cyan-700 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-900 p-0 opacity-90 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex w-full justify-between",
        head_cell:
          "text-cyan-700 dark:text-cyan-300 rounded-md w-14 font-normal text-[0.9rem] m-0.5 text-center",
        row: "flex w-full mt-2 justify-between",
        cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 h-14 w-14 m-0.5 [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-cyan-500/50 [&:has([aria-selected])]:bg-cyan-500/10 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-14 w-14 p-0 font-normal aria-selected:opacity-100 hover:bg-cyan-100 hover:text-cyan-900 dark:hover:bg-cyan-800 dark:hover:text-cyan-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-gradient-to-r from-cyan-500 to-blue-400 text-white hover:text-white dark:bg-gradient-to-r dark:from-cyan-500 dark:to-blue-400 dark:text-white focus:bg-cyan-700 focus:text-white",
        day_today: "bg-cyan-100 dark:bg-cyan-900 text-cyan-900 dark:text-cyan-100 font-medium border-2 border-cyan-400 dark:border-cyan-500",
        day_outside:
          "day-outside text-gray-400 opacity-50 aria-selected:bg-cyan-500/5 aria-selected:text-gray-400 aria-selected:opacity-30",
        day_disabled: "text-gray-400 opacity-50",
        day_range_middle:
          "aria-selected:bg-cyan-100 aria-selected:text-cyan-900 dark:aria-selected:bg-cyan-800 dark:aria-selected:text-cyan-100",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-5 w-5" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-5 w-5" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
