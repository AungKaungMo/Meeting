import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    Stack,
    TextField,
    Avatar,
    Button,
    Box,
} from "@mui/material";
import { useForm } from "@inertiajs/react";
import LoadingButton from "@mui/lab/LoadingButton";
import LoadingCircle from "@/icons/LoadingCircle";
import { useSnackbar } from "@/Context/SnackbarProvider";
import CustomTextField from "@/Components/CustomTextField";
import CustomDropdown from "@/Components/CustomDropdown";
import { PackageDataType } from "@/PageType";

interface NewPackageProps {
    open: boolean;
    onClose: () => void;
}

const NewPackage = ({ open, onClose }: NewPackageProps) => {
    const { showSnackbar } = useSnackbar();
    const { data, setData, post, errors, setError, processing, reset } =
        useForm<PackageDataType>({
            name: "",
            limit_employee: 1,
            max_employee: 0,
            status: 1,
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/packages", {
            onSuccess: () => {
                handleOnClose();
                showSnackbar("Package created successfully.");
            },
        });
    };

    const handleOnClose = () => {
        onClose();
        reset();
        setError("name", "");
        setError("limit_employee", "");
        setError("max_employee", "");
        setError("status", "");
    };

    return (
        <Dialog
            onClose={handleOnClose}
            open={open}
            disableEnforceFocus={false}
            disableAutoFocus={false}
        >
            <DialogTitle>New Package</DialogTitle>

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

                     {/* Limit Employee */}
                     <CustomDropdown
                        label="Select Limit Employee"
                        value={data.limit_employee}
                        onChange={(e) => setData("limit_employee", Number(e.target.value))}
                        options={[
                            { id: 1, name: "Yes" },
                            { id: 0, name: "No" },
                        ]}
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
                        loading={false}
                        type="submit"
                        loadingPosition="start"
                        startIcon={processing ? <LoadingCircle /> : <span />}
                        sx={{ mt: 3, mb: 2 }}
                        variant="contained"
                    >
                        Create Package
                    </LoadingButton>
                    {/* <Button
                        
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Create Package
                    </Button> */}
                </Box>
            </Box>
        </Dialog>
    );
};

export default NewPackage;
