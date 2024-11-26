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
import { TownshipDataType, TownshipRegionStateListType } from "@/PageType";
import CustomDropdown from "@/Components/CustomDropdown";

interface NewTownshipProps {
    open: boolean;
    onClose: () => void;
    region_states: TownshipRegionStateListType[]
}

const NewTownship = ({ open, onClose, region_states }: NewTownshipProps) => {
    const { showSnackbar } = useSnackbar();
    const { data, setData, post, errors, setError, processing, reset } =
        useForm<TownshipDataType>({
            name: "",
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post("/townships", {
            onSuccess: () => {
                handleOnClose();
                showSnackbar("Township created successfully.");
            },
            onError: (error: any) => {
                if(error.error) {
                    return showSnackbar("Failed to create township.", "error");
                }else if (error && typeof error === "object" && !Array.isArray(error)) {
                    const errorKeys = Object.keys(error);
                    if (errorKeys.length > 0) {
                        return;
                    }
                }
                showSnackbar("Failed to create township.", "error");
            }
        });
    };

    const handleOnClose = () => {
        onClose();
        reset();
        setError("name", "");
        setError("region_state_id", "");
    };

    return (
        <Dialog
            onClose={handleOnClose}
            open={open}
            disableEnforceFocus={false}
            disableAutoFocus={false}
        >
            <DialogTitle>New Township</DialogTitle>

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
                        Create Township
                    </LoadingButton>
                </Box>
            </Box>
        </Dialog>
    );
};

export default NewTownship;
