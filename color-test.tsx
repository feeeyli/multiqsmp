<div className="flex gap-2">
  {[
    'background',
    'foreground',
    'card',
    'card-foreground',
    'popover',
    'popover-foreground',
    'primary',
    'primary-foreground',
    'secondary',
    'secondary-foreground',
    'muted',
    'muted-foreground',
    'accent',
    'accent-foreground',
    'destructive',
    'destructive-foreground',
    'border',
    'input',
    'ring',
  ].map((color) => (
    <div className={`bg-${color} h-8 w-8 rounded-md`} key={color}></div>
  ))}
</div>;
