import { Alert, Box, Snackbar } from "@mui/material";

type SnackType = {
    vertical?: "top" | "bottom";
    horizontal?: "center" | "left" | "right";
    open: boolean;
    message?: string;
    handleClose: () => void;
};

const SnackAlert = ({
    vertical = "top",
    horizontal = "center",
    message = "Success",
    open,
    handleClose,
}: SnackType) => {
    return (
        <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            open={open}
            onClose={handleClose}
            key={vertical + horizontal}
            autoHideDuration={3000}
        >
            <Alert
                onClose={handleClose}
                severity="success"
                variant="filled"
                sx={{ width: "100%" }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

export default SnackAlert;
