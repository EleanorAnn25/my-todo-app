'use client';

import { format, isValid, parse, parseISO } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { ChangeEvent, startTransition, useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

import { Calendar } from '@/components/ui/calendar';
import { Field, FieldLabel } from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DatePickerProps {
  label?: string;
  value: string;
  onChange: (dateStr: string) => void;
  error?: string;
  placeholder?: string;
  className?: string;
}

const DISPLAY_FORMAT = 'dd/MM/yyyy';
const FORM_FORMAT = 'yyyy-MM-dd';

export function DatePicker({
  label,
  value,
  onChange,
  error,
  placeholder = 'dd/mm/yyyy',
  className = 'w-full',
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const [month, setMonth] = useState<Date | undefined>(new Date());

  useEffect(() => {
    if (value) {
      const parsedDate = parseISO(value);
      if (isValid(parsedDate)) {
        startTransition(() => {
          setInputValue(format(parsedDate, DISPLAY_FORMAT));
          setMonth(parsedDate);
        });
        return;
      }
    }
    startTransition(() => {
      setInputValue('');
    });
  }, [value]);

  const handleDateCommit = (date: Date | null) => {
    if (date && isValid(date)) {
      onChange(format(date, FORM_FORMAT));
    } else {
      onChange('');
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setInputValue(text);

    if (!text.trim()) {
      onChange('');
      return;
    }

    const parsedDate = parse(text, DISPLAY_FORMAT, new Date());
    if (isValid(parsedDate) && text.length === 10) {
      handleDateCommit(parsedDate);
    }
  };

  const selectedCalendarDate = value ? parseISO(value) : undefined;

  return (
    <Field className={className}>
      {label && <FieldLabel className={cn(error && 'text-rose-400')}>{label}</FieldLabel>}

      <InputGroup>
        <InputGroupInput
          placeholder={placeholder}
          value={inputValue}
          maxLength={10}
          onChange={handleInputChange}
          className={error ? 'border-red-500 focus-visible:ring-red-500' : ''}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />
        <InputGroupAddon align="inline-end">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
              render={
                <InputGroupButton
                  id="date-picker"
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Select date"
                  type="button"
                >
                  <CalendarIcon />
                  <span className="sr-only">Select date</span>
                </InputGroupButton>
              }
            />
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="end"
              alignOffset={-8}
              sideOffset={10}
            >
              <Calendar
                mode="single"
                selected={selectedCalendarDate}
                month={month}
                onMonthChange={setMonth}
                onSelect={(date) => {
                  const targetDate = date || null;
                  handleDateCommit(targetDate);
                  if (targetDate) {
                    setInputValue(format(targetDate, DISPLAY_FORMAT));
                  }
                  setOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>

      {error && <p className="text-xs text-red-500 font-medium mt-1.5">{error}</p>}
    </Field>
  );
}
