"use client"

import React, { createContext, useState, useContext, useCallback, PropsWithChildren } from 'react';

// Define the shape of the context data
interface TaxContextType {
  showTaxes: boolean;
  toggleTaxView: () => void;
}

// Create the context with a default value
const TaxContext = createContext<TaxContextType | undefined>(undefined);

// Create the provider component
export const TaxProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [showTaxes, setShowTaxes] = useState<boolean>(false); // Default to showing prices *excluding* tax

  const toggleTaxView = useCallback(() => {
    setShowTaxes((prev) => !prev);
  }, []);

  return (
    <TaxContext.Provider value={{ showTaxes, toggleTaxView }}>
      {children}
    </TaxContext.Provider>
  );
};

// Create a custom hook for easy context consumption
export const useTax = (): TaxContextType => {
  const context = useContext(TaxContext);
  if (context === undefined) {
    throw new Error('useTax must be used within a TaxProvider');
  }
  return context;
};
