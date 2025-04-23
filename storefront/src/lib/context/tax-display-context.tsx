"use client";

import React, { createContext, useContext, useState, useMemo, PropsWithChildren } from 'react';

interface TaxDisplayContextType {
  showWithTax: boolean;
  toggleTaxDisplay: () => void;
}

const TaxDisplayContext = createContext<TaxDisplayContextType | undefined>(undefined);

export const TaxDisplayProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [showWithTax, setShowWithTax] = useState(false); // Default to showing prices WITHOUT tax

  const toggleTaxDisplay = () => {
    setShowWithTax((prev) => !prev);
  };

  const value = useMemo(() => ({
    showWithTax,
    toggleTaxDisplay,
  }), [showWithTax]);

  return (
    <TaxDisplayContext.Provider value={value}>
      {children}
    </TaxDisplayContext.Provider>
  );
};

export const useTaxDisplay = (): TaxDisplayContextType => {
  const context = useContext(TaxDisplayContext);
  if (context === undefined) {
    throw new Error('useTaxDisplay must be used within a TaxDisplayProvider');
  }
  return context;
};
