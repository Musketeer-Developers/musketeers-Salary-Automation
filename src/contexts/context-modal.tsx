// ModalContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ModalContextType {
    isModalOpen: boolean; // Changed to isModalOpen
    showModal: () => void;
    hideModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
    const context = useContext(ModalContext);
    if (context === undefined) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};

interface ModalProviderProps {
    children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
    const [isModalOpen, setIsModalOpen] = useState(false); // Changed to isModalOpen

    const showModal = () => setIsModalOpen(true);
    const hideModal = () => setIsModalOpen(false);

    return (
        <ModalContext.Provider value={{ isModalOpen, showModal, hideModal }}>
            {children}
        </ModalContext.Provider>
    );
};
