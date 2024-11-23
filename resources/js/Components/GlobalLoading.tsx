import { Box, LinearProgress } from "@mui/material";

const GlobalLoading = () => {
    return (
        <Box
            sx={{ width: "100%", height: "90vh" }}
            display="flex"
            alignItems="center"
            justifyContent="center"
            flex="1 1 auto"
        >
            <LinearProgress sx={{ width: 1, maxWidth: 400 }} />
        </Box>
    );
};

export default GlobalLoading;
