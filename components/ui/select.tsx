import * as React from 'react';

import { cn } from '@/lib/utils';

const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        'flex h-10 w-full rounded-md border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white shadow-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30',
        className,
      )}
      {...props}
    />
  ),
);
Select.displayName = 'Select';

export { Select };
