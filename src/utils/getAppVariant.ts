type AppVariants = 'qsmp' | 'frogg' | 'purgatory';

export const getAppVariant = () => {
  if (/^\/purgatory/g.test((window ?? '').location.pathname))
    return 'purgatory';

  return (process.env.NEXT_PUBLIC_APP_VARIANT as AppVariants) ?? 'qsmp';
};
