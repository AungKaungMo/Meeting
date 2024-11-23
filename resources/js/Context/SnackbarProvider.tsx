import React, { createContext, ReactNode, useContext, useState } from "react";
import { Alert, Box, Snackbar } from "@mui/material";

type SnackbarContextType = {
    showSnackbar: (message: string, type?: "error" | "success" | "warning" | "info") => void;
};

// Create the SnackbarContext with the correct type
const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
    const [snackOpen, setSnackOpen] = useState(false);
    const [snackMessage, setSnackMessage] = useState('');
    const [severity, setSeverity] = useState<"error" | "success" | "warning" | "info">('success');

    const showSnackbar = (message: string, type: "error" | "success" | "warning" | "info" = "success") => {
        setSnackMessage(message);
        setSeverity(type);
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
                severity={severity}
            />
        </SnackbarContext.Provider>
    );
};

type SnackType = {
    vertical?: "top" | "bottom";
    horizontal?: "center" | "left" | "right";
    open: boolean;
    message?: string;
    handleClose: () => void;
    severity: "error" | "success" | "warning" | "info";
};

const SnackAlert = ({
    vertical = "top",
    horizontal = "center",
    message = "Success",
    open,
    handleClose,
    severity = "success",
}: SnackType) => {
    return (
        <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            open={open}
            onClose={handleClose}
            key={vertical + horizontal}
            autoHideDuration={1500}
        >
            <Alert
                onClose={handleClose}
                severity={severity}
                variant="filled"
                sx={{ width: "100%" }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

export default SnackAlert;

// Custom hook to use Snackbar context
export const useSnackbar = () => {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error("useSnackbar must be used within a SnackbarProvider");
    }
    return context;
};
