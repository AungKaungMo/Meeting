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
import { EmployeeDataType, EmployeeDepartmentType, EmployeeType } from "@/PageType";
import { ActiveInactiveStatus, Roles } from "@/Data";

interface EditEmployeeProps {
    open: boolean;
    onClose: () => void;
    employeeData: EmployeeType;
    departments: EmployeeDepartmentType[]
}

const EditEmployee = ({
    open,
    onClose,
    departments,
    employeeData,
}: EditEmployeeProps) => {
    const { showSnackbar } = useSnackbar();

    const { data, setData, put, errors, setError, processing, reset } =
        useForm<EmployeeDataType>({
            name: employeeData.name,
            email: employeeData.email,
            phone: employeeData.phone,
            role: employeeData.role,
            status: employeeData.status,
            department_id: employeeData.department_id,
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        put(`/employees/${employeeData.id}`, {
            onSuccess: () => {
                handleOnClose();
                showSnackbar("Employee updated successfully.");
            },
            onError: (error: any) => {
                if(error.error) {
                    return showSnackbar("Failed to create employee.", "error");
                }else if (error && typeof error === "object" && !Array.isArray(error)) {
                    const errorKeys = Object.keys(error);
                    if (errorKeys.length > 0) {
                        return;
                    }
                }
                showSnackbar("Failed to create employee.", "error");
            },
        });
    };

    const clearError = () => {
        setError("name", "");
        setError("email", "");
        setError("phone", "");
        setError("department_id", "");
        setError("role", "");
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
            name: employeeData.name,
            email: employeeData.email,
            phone: employeeData.phone,
            role: employeeData.role,
            status: employeeData.status,
            department_id: employeeData.department_id,
        });
        // restageDefault();
    }, [employeeData, open]);

    return (
        <Dialog
            onClose={handleOnClose}
            open={open}
            disableEnforceFocus={false}
            disableAutoFocus={false}
        >
            <DialogTitle>Edit Employee</DialogTitle>

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

                    {/* Email */}
                    <CustomTextField
                        label="Email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        error={!!errors.email}
                        helperText={errors.email}
                    />
                    
                    {/* Phone */}
                    <CustomTextField
                        label="Phone"
                        type="number"
                        value={data.phone}
                        onChange={(e) => setData("phone", e.target.value)}
                        error={!!errors.phone}
                        helperText={errors.phone}
                    />

                    {/* Role */}
                    <CustomDropdown
                        label="Select Role"
                        value={data.role}
                        selectedId="name"
                        onChange={(e) =>
                            setData("role", e.target.value.toString())
                        }
                        options={Roles}
                        placeholder="Select options"
                    />

                    {/* Department */}
                    <CustomDropdown
                        label="Select Department"
                        value={data.department_id}
                        onChange={(e) =>
                            setData("department_id", Number(e.target.value))
                        }
                        options={departments}
                        placeholder="Select options"
                        error={!!errors.department_id}
                        helperText={errors.department_id}
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

export default EditEmployee;
