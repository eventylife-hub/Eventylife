import * as React from 'react';
import { cn } from '@/lib/utils';

interface RadioGroupContextType { value: string; onValueChange: (value: string) => void; }
const RadioGroupContext = React.createContext<RadioGroupContextType>({ value: '', onValueChange: () => {} });

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, value: controlledValue, defaultValue = '', onValueChange, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const value = controlledValue ?? internalValue;
    const handleChange = (v: string) => { setInternalValue(v); onValueChange?.(v); };
    return (
      <RadioGroupContext.Provider value={{ value, onValueChange: handleChange }}>
        <div ref={ref} className={cn('grid gap-2', className)} role="radiogroup" {...props} />
      </RadioGroupContext.Provider>
    );
  }
);
RadioGroup.displayName = 'RadioGroup';

interface RadioGroupItemProps extends React.InputHTMLAttributes<HTMLInputElement> { value: string; }
const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, value, ...props }, ref) => {
    const context = React.useContext(RadioGroupContext);
    return (
      <input
        ref={ref}
        type="radio"
        checked={context.value === value}
        onChange={() => context.onValueChange(value)}
        className={cn('aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', className)}
        {...props}
      />
    );
  }
);
RadioGroupItem.displayName = 'RadioGroupItem';

export { RadioGroup, RadioGroupItem };
