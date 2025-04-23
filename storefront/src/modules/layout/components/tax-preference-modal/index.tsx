"use client";

import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Button, Heading, Text } from '@medusajs/ui';
import { useTaxDisplay } from '@/lib/context/tax-display-context';

type TaxPreferenceModalProps = {
  isOpen: boolean;
  closeModal: () => void;
};

const TaxPreferenceModal: React.FC<TaxPreferenceModalProps> = ({ isOpen, closeModal }) => {
  const { showWithTax, toggleTaxDisplay } = useTaxDisplay();

  const handleSetPreference = (shouldShowWithTax: boolean) => {
    // Only toggle if the desired state is different from the current state
    if (showWithTax !== shouldShowWithTax) {
      toggleTaxDisplay();
    }
    try {
      localStorage.setItem('medusa_tax_preference_set', 'true');
    } catch (e) {
      console.error("Failed to set tax preference in localStorage", e);
      // Handle potential storage errors (e.g., private browsing)
    }
    closeModal();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[80]" onClose={closeModal}> {/* Increased z-index */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 mb-4"
                >
                  Price Display Preference
                </Dialog.Title>
                <div className="mt-2">
                  <Text className="text-sm text-gray-500 mb-4">
                    Choose how you'd like to see product prices displayed on the site.
                    You can change this anytime using the toggle in the header.
                  </Text>
                </div>

                <div className="mt-6 flex justify-around gap-4">
                  <Button
                    variant="secondary"
                    onClick={() => handleSetPreference(false)} // Show WITHOUT tax
                    data-testid="pref-exclude-tax-button"
                  >
                    Exclude Tax
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => handleSetPreference(true)} // Show WITH tax
                    data-testid="pref-include-tax-button"
                  >
                    Include Tax
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default TaxPreferenceModal;
