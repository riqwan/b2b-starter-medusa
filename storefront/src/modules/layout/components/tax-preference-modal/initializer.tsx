"use client";

import React, { useState, useEffect } from 'react';
import TaxPreferenceModal from './index';

const TaxPreferenceInitializer: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Check localStorage only on the client side
    try {
      const preferenceSet = localStorage.getItem('medusa_tax_preference_set');
      if (!preferenceSet) {
        // Only open the modal if the preference hasn't been set
        setIsModalOpen(true);
      }
    } catch (e) {
      console.error("Failed to access localStorage for tax preference", e);
      // Handle potential storage errors (e.g., private browsing)
      // Decide if you want to show the modal anyway or handle differently
    }
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Render the modal conditionally based on the state
  return <TaxPreferenceModal isOpen={isModalOpen} closeModal={closeModal} />;
};

export default TaxPreferenceInitializer;
