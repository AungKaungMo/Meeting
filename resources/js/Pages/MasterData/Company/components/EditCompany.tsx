import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    Stack,
    Box,
    IconButton,
    Avatar,
    Button,
} from "@mui/material";
import CustomTextField from "@/Components/CustomTextField";
import CustomDropdown from "@/Components/CustomDropdown";
import { Iconify } from "@/Components/iconify";
import { router, useForm } from "@inertiajs/react";
import LoadingButton from "@mui/lab/LoadingButton";
import LoadingCircle from "@/icons/LoadingCircle";
import { useSnackbar } from "@/Context/SnackbarProvider";
import { CompanyDataType, CompanyPackageListType } from "@/PageType";
import { ActiveInactiveStatus, Status } from "@/Data";
import CustomDatePicker from "@/Components/CustomDatePicker";
import dayjs, { Dayjs } from "dayjs";

interface EditCompanyProps {
    open: boolean;
    onClose: () => void;
    companyData: CompanyDataType & { id: number };
    packages: CompanyPackageListType[];
}

const EditCompany = ({
    open,
    onClose,
    companyData,
    packages,
}: EditCompanyProps) => {
    const { showSnackbar } = useSnackbar();
    const [image, setImage] = useState<string | null>(
        companyData.profile_image_url ? "storage/" + companyData.profile_image_url : null
    );
    const [expDate, setExpDate] = useState<Dayjs>(
        dayjs.unix(companyData.expire_date)
    );
    const { data, setData, errors, setError, processing, reset } =
        useForm<CompanyDataType>({
            name: companyData.name,
            short_name: companyData.short_name,
            profile_image_url: null,
            package_id: companyData.package_id,
            expire_date: companyData.expire_date,
            status: companyData.status,
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== null) {
                if (typeof value === "string" || value instanceof Blob) {
                    formData.append(key, value);
                } else if (
                    typeof value === "number" ||
                    typeof value === "boolean"
                ) {
                    formData.append(key, value.toString());
                }
            }
        });

        if (image !== `storage/${companyData.profile_image_url}`) {
            formData.append("changeImage", "1");
        }

        if (data.profile_image_url) {
            formData.append("profile_image_url", data.profile_image_url);
        }

        formData.append("_method", "PUT");

        router.post(`/companies/${companyData.id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            onSuccess: () => {
                handleOnClose();
                showSnackbar("Company updated successfully.");
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
                showSnackbar("Failed to update employee.", "error");
            },
        });
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setData("profile_image_url", file);
            setImage(URL.createObjectURL(file));
        }
    };

    const handleClearImage = () => {
        setImage(null);
        setData("profile_image_url", null);
    };

    const clearError = () => {
        setError("name", "");
        setError("short_name", "");
        setError("profile_image_url", "");
        setError("package_id", "");
        setError("expire_date", "");
        setError("status", "");
    };

    const restageDefault = () => {
        // reset();
        setImage(companyData.profile_image_url ? `storage/${companyData.profile_image_url}` : null);
        clearError();
    };

    const handleOnClose = () => {
        onClose();
        restageDefault();
    };

    useEffect(() => {
        setData({
            name: companyData.name,
            short_name: companyData.short_name,
            profile_image_url: null,
            package_id: companyData.package_id,
            expire_date: companyData.expire_date,
            status: companyData.status,
        });
        restageDefault();
        setExpDate(dayjs.unix(companyData.expire_date));
    }, [companyData, open]);

    const handleExpDate = (newValue: Dayjs | null) => {
        if (newValue) {
            setExpDate(newValue);
            const formattedExpireDate = newValue
                ? dayjs(newValue).startOf("day").unix()
                : 0;

            setData("expire_date", formattedExpireDate);
        }
    };

    return (
        <Dialog
            onClose={handleOnClose}
            open={open}
            disableEnforceFocus={false}
            disableAutoFocus={false}
        >
            <DialogTitle>Edit Company</DialogTitle>

            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 3, width: "100%", minWidth: 500, mx: "auto" }}
            >
                <Stack spacing={3} mx={2}>
                    <Stack spacing={2} alignItems="center" pb={3}>
                        <Avatar
                            src={image || undefined}
                            alt="Company Photo"
                            sx={{ width: 100, height: 100 }}
                        >
                            {!image && (
                                <Iconify width={50} icon="mdi:company" />
                            )}
                        </Avatar>
                        <Stack direction="row" spacing={2}>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleClearImage}
                                disabled={!image}
                            >
                                Clear Image
                            </Button>

                            <label htmlFor="upload-image">
                                <input
                                    accept="image/*"
                                    id="upload-image"
                                    type="file"
                                    style={{ display: "none" }}
                                    onChange={handleImageChange}
                                />
                                <Button variant="outlined" component="span">
                                    Upload New Image
                                </Button>
                            </label>
                        </Stack>
                    </Stack>

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

                    {/* Expire Date */}
                    <CustomDatePicker
                        label="Select Date"
                        value={expDate ?? null}
                        onChange={(newDate) => handleExpDate(newDate)}
                        error={!!errors.expire_date}
                        helperText={errors.expire_date}
                    />

                    {/* Package */}
                    <CustomDropdown
                        label="Select Package"
                        value={data.package_id ?? ""}
                        onChange={(e) =>
                            setData("package_id", Number(e.target.value))
                        }
                        options={packages}
                        placeholder="Select options"
                        width={300}
                        error={!!errors.package_id}
                        helperText={errors.package_id}
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

export default EditCompany;
