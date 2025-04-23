"use client";

import React from 'react';
import { useTaxDisplay } from '@/lib/context/tax-display-context';
import { Switch, Label, clx } from '@medusajs/ui';

const TaxToggle: React.FC = () => {
  const { showWithTax, toggleTaxDisplay } = useTaxDisplay();

  return (
    <div className="flex items-center gap-x-2">
      <Label htmlFor="tax-toggle" className="text-sm text-neutral-600 whitespace-nowrap">
        {showWithTax ? 'Price incl. Tax' : 'Price excl. Tax'}
      </Label>
      <Switch
        id="tax-toggle"
        checked={showWithTax}
        onCheckedChange={toggleTaxDisplay}
        data-testid="tax-toggle-switch"
        className={clx(
          "relative inline-flex h-[18px] w-[34px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75",
          showWithTax ? 'bg-neutral-900' : 'bg-neutral-300'
        )}
      >
        <span className="sr-only">Toggle Tax Display</span>
        <span
          aria-hidden="true"
          className={clx(
            "pointer-events-none inline-block h-[14px] w-[14px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
            showWithTax ? 'translate-x-[16px]' : 'translate-x-0'
          )}
        />
      </Switch>
    </div>
  );
};

export default TaxToggle;
