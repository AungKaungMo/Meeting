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
import { TownshipType, TownshipDataType, TownshipRegionStateListType } from "@/PageType";
import { ActiveInactiveStatus } from "@/Data";

interface EditTownshipProps {
    open: boolean;
    onClose: () => void;
    townshipData: TownshipType;
    region_states: TownshipRegionStateListType[];
}

const EditTownship = ({
    open,
    onClose,
    townshipData,
    region_states
}: EditTownshipProps) => {
    const { showSnackbar } = useSnackbar();

    const { data, setData, put, errors, setError, processing, reset } =
        useForm<TownshipDataType>({
            name: townshipData.name,
            region_state_id: townshipData.region_state_id,
            status: townshipData.status,
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        put(`/townships/${townshipData.id}`, {
            onSuccess: () => {
                handleOnClose();
                showSnackbar("Township updated successfully.");
            },
            onError: (error) => {
                if(error.error) {
                    return showSnackbar("Failed to create township.", "error");
                }else if (error && typeof error === "object" && !Array.isArray(error)) {
                    const errorKeys = Object.keys(error);
                    if (errorKeys.length > 0) {
                        return;
                    }
                }
                showSnackbar("Failed to update township.", "error");
            },
        });
    };

    const clearError = () => {
        setError("name", "");
        setError("region_state_id", "");
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
            name: townshipData.name,
            region_state_id: townshipData.region_state_id,
            status: townshipData.status,
        });
        restageDefault();
    }, [townshipData, open]);

    return (
        <Dialog
            onClose={handleOnClose}
            open={open}
            disableEnforceFocus={false}
            disableAutoFocus={false}
        >
            <DialogTitle>Edit Township</DialogTitle>

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

                    {/* Region & State */}
                    <CustomDropdown
                        label="Select Region or State"
                        value={data.region_state_id ?? ''}
                        onChange={(e) => setData("region_state_id", Number(e.target.value))}
                        options={region_states}
                        placeholder="Select options"
                        error={!!errors.region_state_id}
                        helperText={errors.region_state_id}
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

export default EditTownship;
