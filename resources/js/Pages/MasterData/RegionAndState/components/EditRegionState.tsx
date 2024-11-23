import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    Stack,
    Box,
} from "@mui/material";
import CustomTextField from "@/Components/CustomTextField";
import CustomDropdown from "@/Components/CustomDropdown";
import { useForm } from "@inertiajs/react";
import LoadingButton from "@mui/lab/LoadingButton";
import LoadingCircle from "@/icons/LoadingCircle";
import { useSnackbar } from "@/Context/SnackbarProvider";
import { RegionAndStateDataType, RegionAndStateType } from "@/PageType";
import { ActiveInactiveStatus } from "@/Data";

interface EditRegionAndStateProps {
    open: boolean;
    onClose: () => void;
    regionStateData: RegionAndStateType;
}

const EditRegionAndState = ({
    open,
    onClose,
    regionStateData,
}: EditRegionAndStateProps) => {
    const { showSnackbar } = useSnackbar();

    const { data, setData, put, errors, setError, processing, reset } =
        useForm<RegionAndStateDataType>({
            name: regionStateData.name,
            status: regionStateData.status,
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        put(`/region-states/${regionStateData.id}`, {
            onSuccess: () => {
                handleOnClose();
                showSnackbar("Region or State updated successfully.");
            },
            onError: (error) => {
                if(error.error) {
                    return showSnackbar("Failed to create region or state.", "error");
                }else if (error && typeof error === "object" && !Array.isArray(error)) {
                    const errorKeys = Object.keys(error);
                    if (errorKeys.length > 0) {
                        return;
                    }
                }
                showSnackbar("Failed to update region or state.", "error");
            },
        });
    };

    const clearError = () => {
        setError("name", "");
        setError("status", "");
    };

    const restageDefault = () => {
        // reset();
        clearError();
    };

    const handleOnClose = () => {
        onClose();
        restageDefault();
    };

    useEffect(() => {
        setData({
            name: regionStateData.name,
            status: regionStateData.status,
        });
        restageDefault();
    }, [regionStateData, open]);

    return (
        <Dialog
            onClose={handleOnClose}
            open={open}
            disableEnforceFocus={false}
            disableAutoFocus={false}
        >
            <DialogTitle>Edit Region or State</DialogTitle>

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

                    {/* Status */}
                    <CustomDropdown
                        label="Select Status"
                        value={data.status}
                        onChange={(e) =>
                            setData("status", Number(e.target.value))
                        }
                        options={ActiveInactiveStatus}
                        placeholder="Select options"
                        width={300}
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
                        Update
                    </LoadingButton>
                </Box>
            </Box>
        </Dialog>
    );
};

export default EditRegionAndState;
