import SnackAlert from '@/Components/SnackAlert';
import React, { createContext, useContext, useState, ReactNode } from 'react';

type SnackbarContextType = {
    showSnackbar: (message: string) => void;
};

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const useSnackbar = () => {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error('useSnackbar must be used within a SnackbarProvider');
    }
    return context;
};

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
    const [snackOpen, setSnackOpen] = useState(false);
    const [snackMessage, setSnackMessage] = useState('');

    const showSnackbar = (message: string) => {
        setSnackMessage(message);
        setSnackOpen(true);
    };

    const handleSnackClose = () => {
        setSnackOpen(false);
    };

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}
            <SnackAlert
                open={snackOpen}
                handleClose={handleSnackClose}
                message={snackMessage}
            />
        </SnackbarContext.Provider>
    );
};
