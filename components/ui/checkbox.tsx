import * as React from 'react';

import { cn } from '@/lib/utils';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    type="checkbox"
    className={cn('h-4 w-4 rounded border border-white/20 bg-slate-950 text-cyan-500 focus:ring-cyan-400/40', className)}
    {...props}
  />
));
Checkbox.displayName = 'Checkbox';

export { Checkbox };
