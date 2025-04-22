"use client"

import React, { createContext, useContext, useState, useMemo } from 'react';

interface TaxContextProps {
  includeTax: boolean;
  setIncludeTax: React.Dispatch<React.SetStateAction<boolean>>;
  toggleTaxInclusion: () => void;
}

const TaxContext = createContext<TaxContextProps | undefined>(undefined);

export const TaxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to showing prices *excluding* tax initially
  const [includeTax, setIncludeTax] = useState<boolean>(false);

  const toggleTaxInclusion = () => {
    setIncludeTax(prev => !prev);
  };

  const value = useMemo(() => ({
    includeTax,
    setIncludeTax,
    toggleTaxInclusion,
  }), [includeTax]);

  return (
    <TaxContext.Provider value={value}>
      {children}
    </TaxContext.Provider>
  );
};

export const useTax = (): TaxContextProps => {
  const context = useContext(TaxContext);
  if (context === undefined) {
    throw new Error('useTax must be used within a TaxProvider');
  }
  return context;
};
