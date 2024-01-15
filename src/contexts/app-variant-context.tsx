'use client';

import React, { createContext, useContext } from 'react';

export const AppVariantContext = createContext<string>('');

export const AppVariantProvider = ({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant: string;
}) => {
  return (
    <AppVariantContext.Provider value={variant}>
      {children}
    </AppVariantContext.Provider>
  );
};

export const useAppVariant = () => useContext(AppVariantContext);
