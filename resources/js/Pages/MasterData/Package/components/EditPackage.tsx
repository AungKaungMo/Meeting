import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, Stack, Box, IconButton } from "@mui/material";
import CustomTextField from "@/Components/CustomTextField";
import CustomDropdown from "@/Components/CustomDropdown";
import { Iconify } from "@/Components/iconify";
import { router, useForm } from "@inertiajs/react";
import LoadingButton from "@mui/lab/LoadingButton";
import LoadingCircle from "@/icons/LoadingCircle";
import { useSnackbar } from "@/Context/SnackbarProvider";
import { PackageDataType } from "@/PageType";
import { DescriptionType } from "./NewPackage";
import { ActiveInactiveStatus, Status } from "@/Data";

interface EditPackageProps {
    open: boolean;
    onClose: () => void;
    packageData: PackageDataType & {id: number};
}

const EditPackage = ({ open, onClose, packageData }: EditPackageProps) => {
    const { showSnackbar } = useSnackbar();

    const { data, setData, errors, setError, processing, reset } =
        useForm<PackageDataType>({
            name: packageData.name,
            limit_employee: packageData.limit_employee,
            max_employee: packageData.max_employee,
            status: packageData.status,
            description: packageData.description || [],
        });

    const [desc, setDesc] = useState<DescriptionType[]>(packageData.description)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, key === 'description' ? JSON.stringify(desc) : value);
        });

        formData.append("description", JSON.stringify(desc));
        formData.append("_method", "PUT");

        router.post("/packages/" + packageData.id, formData, {
            onSuccess: () => {
                handleOnClose();
                showSnackbar("Package updated successfully.");
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
                showSnackbar("Failed to update package.", "error");
            }
        });
    };

    const clearError = () => {
        setError("name", "");
        setError("limit_employee", "");
        setError("max_employee", "");
        setError("status", "");
        setError("description", "");
    };

    const restageDefault = () => {
        reset();
        clearError();
    };

    const handleOnClose = () => {
        onClose();
        restageDefault();
    };

    useEffect(() => {
        restageDefault();
        setData("status", packageData.status);
        setDesc(packageData.description)
    }, [packageData, open]);

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
            <DialogTitle>Edit Package</DialogTitle>

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
                        onChange={(e) =>
                            setData("limit_employee", Number(e.target.value))
                        }
                        options={Status}
                        placeholder="Select options"
                        width={300}
                    />

                    {/* Max Employee */}
                    <CustomTextField
                        type="number"
                        label="Max Employee"
                        value={data.max_employee ?? ""}
                        onChange={(e) =>
                            setData("max_employee", Number(e.target.value))
                        }
                        error={!!errors.max_employee}
                        helperText={errors.max_employee}
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
                        Update
                    </LoadingButton>
                </Box>
            </Box>
        </Dialog>
    );
};

export default EditPackage;
