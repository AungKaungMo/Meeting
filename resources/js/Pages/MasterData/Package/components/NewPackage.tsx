import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    Stack,
    Box,
    IconButton,
} from "@mui/material";
import { useForm } from "@inertiajs/react";
import LoadingButton from "@mui/lab/LoadingButton";
import LoadingCircle from "@/icons/LoadingCircle";
import { useSnackbar } from "@/Context/SnackbarProvider";
import CustomTextField from "@/Components/CustomTextField";
import CustomDropdown from "@/Components/CustomDropdown";
import { PackageDataType } from "@/PageType";
import { Iconify } from "@/Components/iconify";

interface NewPackageProps {
    open: boolean;
    onClose: () => void;
}

export type DescriptionType = {
    id: number;
    value: string
}

const NewPackage = ({ open, onClose }: NewPackageProps) => {
    const { showSnackbar } = useSnackbar();
    const { data, setData, post, errors, setError, processing, reset } =
        useForm<PackageDataType>({
            name: "",
            limit_employee: 1,
            max_employee: null,
            status: 1,
            description: []
        });
    const [desc, setDesc] = useState<DescriptionType[]>([
        {
            id: 1,
            value: ''
        }
    ])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setData("description", JSON.stringify(desc))

        post("/packages", {
            onSuccess: () => {
                handleOnClose();
                showSnackbar("Package created successfully.");
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
                showSnackbar("Failed to create package.", "error");
            }
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

    const handleChangeDesc = (index: number, value: string) => {
        const newDesc = [...desc];
        newDesc[index] = { ...newDesc[index], value };
        setDesc(newDesc);
    }

    const handleAdd = (id: number) => {
        const newDesc =  [...desc, { id: id + 1, value: '' }];
        setDesc(newDesc)
    }

    const handleRemove = (id: number) => {
        const newDesc = desc.filter(item => item.id !== id);
        setDesc(newDesc);
    }

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

                    {/* Max Employee */}
                    <CustomTextField
                        type="number"
                        label="Max Employee"
                        value={data.max_employee ?? ''}
                        onChange={(e) => setData("max_employee",Number(e.target.value))}
                        error={!!errors.max_employee}
                        helperText={errors.max_employee}
                    />

                    {desc.map((item, index) => (
                        <Stack spacing={2} direction='row' key={index}>
                            <CustomTextField
                                label="Description"
                                value={item.value}
                                onChange={(e) => handleChangeDesc(index, e.target.value)}
                                error={!!errors.name}
                                helperText={errors.name}
                            />

                            {index === desc.length - 1 ? (
                                <IconButton onClick={() => handleAdd(item.id)}>
                                    <Iconify icon="icon-park-twotone:add-one" />
                                </IconButton>
                            ) : (
                                <IconButton onClick={() => handleRemove(item.id)}>
                                    <Iconify icon="mdi:delete" />
                                </IconButton>
                            )}
                        </Stack>
                    ))}

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
