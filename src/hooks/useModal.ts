import { useState } from 'react';

export const useModal = (initialModalOpenState: boolean = false) => {
  const [isOpen, setIsOpen] = useState(initialModalOpenState);

  const openModal = (_open?: boolean) => setIsOpen(true);
  const closeModal = (_close?: boolean) => setIsOpen(false);

  return {
    isOpen,
    setIsOpen,
    openModal,
    closeModal,
    toggleModal: () => setIsOpen(!isOpen),
  };
};
