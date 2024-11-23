import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    Stack,
    Box,
} from "@mui/material";
import { useForm } from "@inertiajs/react";
import LoadingButton from "@mui/lab/LoadingButton";
import LoadingCircle from "@/icons/LoadingCircle";
import { useSnackbar } from "@/Context/SnackbarProvider";
import CustomTextField from "@/Components/CustomTextField";
import { RegionAndStateDataType } from "@/PageType";

interface NewRegionAndStateProps {
    open: boolean;
    onClose: () => void;
}

export type DescriptionType = {
    id: number;
    value: string
}

const NewRegionAndState = ({ open, onClose }: NewRegionAndStateProps) => {
    const { showSnackbar } = useSnackbar();
    const { data, setData, post, errors, setError, processing, reset } =
        useForm<RegionAndStateDataType>({
            name: "",
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post("/region-states", {
            onSuccess: () => {
                handleOnClose();
                showSnackbar("Region or State created successfully.");
            },
            onError: (error: any) => {
                if(error.error) {
                    return showSnackbar("Failed to create region or state.", "error");
                }else if (error && typeof error === "object" && !Array.isArray(error)) {
                    const errorKeys = Object.keys(error);
                    if (errorKeys.length > 0) {
                        return;
                    }
                }
                showSnackbar("Failed to create region or state.", "error");
            }
        });
    };

    const handleOnClose = () => {
        onClose();
        reset();
        setError("name", "");
    };

    return (
        <Dialog
            onClose={handleOnClose}
            open={open}
            disableEnforceFocus={false}
            disableAutoFocus={false}
        >
            <DialogTitle>New Region Or State</DialogTitle>

            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 3, width: "100%", minWidth: 500, mx: "auto" }}
            >
                <Stack spacing={3} mx={2}>

                    {/* Name */}
                    <CustomTextField
                        label="Name"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        error={!!errors.name}
                        helperText={errors.name}
                    />
                    
                </Stack>

                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <LoadingButton
                        loading={processing}
                        type="submit"
                        loadingPosition="start"
                        startIcon={processing ? <LoadingCircle /> : <span />}
                        sx={{ mt: 3, mb: 2 }}
                        variant="contained"
                    >
                        Create Region or State
                    </LoadingButton>
                </Box>
            </Box>
        </Dialog>
    );
};

export default NewRegionAndState;
