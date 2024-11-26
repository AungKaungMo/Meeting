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
import { DepartmentDataType, DepartmentType } from "@/PageType";
import { ActiveInactiveStatus } from "@/Data";

interface EditDepartmentProps {
    open: boolean;
    onClose: () => void;
    deptData: DepartmentType;
}

const EditDepartment = ({
    open,
    onClose,
    deptData,
}: EditDepartmentProps) => {
    const { showSnackbar } = useSnackbar();

    const { data, setData, put, errors, setError, processing, reset } =
        useForm<DepartmentDataType>({
            name: deptData.name,
            short_name: deptData.short_name,
            status: deptData.status,
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        put(`/departments/${deptData.id}`, {
            onSuccess: () => {
                handleOnClose();
                showSnackbar("Department updated successfully.");
            },
            onError: (error) => {
                if(error.error) {
                    return showSnackbar("Failed to create employee.", "error");
                }else if (error && typeof error === "object" && !Array.isArray(error)) {
                    const errorKeys = Object.keys(error);
                    if (errorKeys.length > 0) {
                        return;
                    }
                }
                showSnackbar("Failed to update department.", "error");
            },
        });
    };

    const clearError = () => {
        setError("name", "");
        setError("short_name", "");
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
            name: deptData.name,
            short_name: deptData.short_name,
            status: deptData.status,
        });
        restageDefault();
    }, [deptData, open]);

    return (
        <Dialog
            onClose={handleOnClose}
            open={open}
            disableEnforceFocus={false}
            disableAutoFocus={false}
        >
            <DialogTitle>Edit Department</DialogTitle>

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

                    {/* Short Name */}
                    <CustomTextField
                        label="Short Name"
                        value={data.short_name}
                        onChange={(e) => setData("short_name", e.target.value)}
                        error={!!errors.short_name}
                        helperText={errors.short_name}
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

export default EditDepartment;
