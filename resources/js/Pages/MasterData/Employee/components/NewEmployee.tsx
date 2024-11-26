import React, { memo, useState } from "react";
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
import { EmployeeDataType, EmployeeDepartmentType } from "@/PageType";
import CustomDropdown from "@/Components/CustomDropdown";
import { Roles } from "@/Data";

interface NewEmployeeProps {
    open: boolean;
    onClose: () => void;
    departments: EmployeeDepartmentType[]
}

const NewEmployee = memo(({ open, onClose, departments }: NewEmployeeProps) => {
    const { showSnackbar } = useSnackbar();
    const { data, setData, post, errors, setError, processing, reset } =
        useForm<EmployeeDataType>({
            name: "",
            email: "",
            phone: "",
            role: "employee"
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/employees", {
            onSuccess: () => {
                handleOnClose();
                showSnackbar("Employee created successfully.");
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

    const handleOnClose = () => {
        onClose();
        reset();
        setError("name", "");
        setError("email", "");
        setError("phone", "");
        setError("department_id", "");
        setError("role", "");
    };

    return (
        <Dialog
            onClose={handleOnClose}
            open={open}
            disableEnforceFocus={false}
            disableAutoFocus={false}
        >
            <DialogTitle>New Employee</DialogTitle>

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
                        selectedId="code"
                        placeholder="Select options"
                        error={!!errors.department_id}
                        helperText={errors.department_id}
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
                        Create Company
                    </LoadingButton>
                </Box>
            </Box>
        </Dialog>
    );
});

export default NewEmployee;
