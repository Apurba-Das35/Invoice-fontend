import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = {
  default: 'inline-flex items-center justify-center rounded-md bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-cyan-400',
  secondary: 'inline-flex items-center justify-center rounded-md border border-white/10 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700',
  outline: 'inline-flex items-center justify-center rounded-md border border-white/15 bg-transparent px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/5',
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: keyof typeof buttonVariants;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = 'default', asChild = false, children, ...props }, ref) => {
  const baseClassName = cn(buttonVariants[variant], className);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      className: cn(baseClassName, (children.props as React.HTMLAttributes<HTMLElement> & { className?: string }).className),
      ...props,
    } as React.HTMLAttributes<HTMLElement>);
  }

  return (
    <button ref={ref} className={baseClassName} {...props}>
      {children}
    </button>
  );
});
Button.displayName = 'Button';

export { Button, buttonVariants };
