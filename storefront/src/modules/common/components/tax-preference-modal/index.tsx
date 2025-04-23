"use client"

import React, { useState, useEffect } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { Button, Heading, Text } from "@medusajs/ui"
import { useTax } from "@/lib/context/tax-context"

const LOCAL_STORAGE_KEY = "medusa_tax_preference_set"

const TaxPreferenceModal = () => {
  const { setTaxInclusion } = useTax()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Check localStorage only on the client-side
    const preferenceSet = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!preferenceSet) {
      setIsOpen(true)
    }
  }, [])

  const handlePreferenceSelect = (include: boolean) => {
    setTaxInclusion(include)
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, "true")
    } catch (e) {
      console.error("Failed to set tax preference in localStorage", e)
      // Handle potential storage errors (e.g., private browsing)
    }
    setIsOpen(false)
  }

  // Don't render anything if the modal shouldn't be open
  if (!isOpen) {
    return null
  }

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-[80]" onClose={() => { /* Prevent closing by clicking outside */ }}>
        {/* Backdrop */}
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
        </Transition.Child>

        {/* Modal Content */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={React.Fragment}
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
                  className="text-lg font-medium leading-6 text-gray-900 mb-2"
                >
                  Display Prices
                </Dialog.Title>
                <div className="mt-2">
                  <Text className="text-sm text-gray-500">
                    Would you like to see product prices including or excluding tax?
                    This setting won't affect the final price during checkout.
                  </Text>
                </div>

                <div className="mt-6 flex justify-end gap-x-3">
                  <Button
                    variant="secondary"
                    onClick={() => handlePreferenceSelect(false)}
                    data-testid="exclude-tax-button"
                  >
                    Exclude Tax
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => handlePreferenceSelect(true)}
                    data-testid="include-tax-button"
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
  )
}

export default TaxPreferenceModal
