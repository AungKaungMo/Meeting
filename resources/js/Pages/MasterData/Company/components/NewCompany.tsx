import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    Stack,
    Box,
    Avatar,
    Button,
} from "@mui/material";
import { useForm } from "@inertiajs/react";
import LoadingButton from "@mui/lab/LoadingButton";
import LoadingCircle from "@/icons/LoadingCircle";
import { useSnackbar } from "@/Context/SnackbarProvider";
import CustomTextField from "@/Components/CustomTextField";
import CustomDropdown from "@/Components/CustomDropdown";
import { CompanyDataType, CompanyPackageListType, PackageListPropsType } from "@/PageType";
import { Iconify } from "@/Components/iconify";
import CustomDatePicker from "@/Components/CustomDatePicker";
import dayjs, { Dayjs } from "dayjs";

interface NewCompanyProps {
    open: boolean;
    onClose: () => void;
    packages: CompanyPackageListType[]
}

export type DescriptionType = {
    id: number;
    value: string
}

const NewCompany = ({ open, onClose, packages }: NewCompanyProps) => {
    const [image, setImage] = useState<string | null>(null);
    const { showSnackbar } = useSnackbar();
    const [expDate, setExpDate] = useState<Dayjs>();
    const { data, setData, post, errors, setError, processing, reset } =
        useForm<CompanyDataType>({
            name: "",
            short_name: "",
            profile_image_url: null,
            expire_date: 0,
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post("/companies", {
            onSuccess: () => {
                handleOnClose();
                handleClearImage();
                showSnackbar("Company created successfully.");
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
                showSnackbar("Failed to create company.", "error");
            }
        });
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setData('profile_image_url', file)
            setImage(URL.createObjectURL(file));
        }
    };

    const handleClearImage = () => {
        setImage(null);
    };

    const handleOnClose = () => {
        onClose();
        reset();
        handleClearImage();
        setError("name", "");
        setError("short_name", "");
        setError("profile_image_url", "");
        setError("expire_date", "");
        setError("package_id", "");
    };

    const handleExpDate = (newValue: Dayjs | null) => {
        if(newValue) {
            setExpDate(newValue);
        const formattedExpireDate = newValue
        ? dayjs(newValue).startOf('day').unix()
        : 0;

        setData('expire_date', formattedExpireDate)
        }
    }  

    return (
        <Dialog
            onClose={handleOnClose}
            open={open}
            disableEnforceFocus={false}
            disableAutoFocus={false}
        >
            <DialogTitle>New Company</DialogTitle>

            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 3, width: "100%", minWidth: 500, mx: "auto" }}
            >
                <Stack spacing={3} mx={2}>
                    {/* Image */}
                <Stack spacing={2} alignItems="center" pb={3}>
                        <Avatar
                            src={image || undefined}
                            alt="Company Photo"
                            sx={{ width: 100, height: 100 }}
                        >
                            {!image && <Iconify width={50} icon="mdi:company" />}
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
                        value={data.package_id ?? ''}
                        onChange={(e) => setData("package_id", Number(e.target.value))}
                        options={packages}
                        placeholder="Select options"
                        error={!!errors.package_id}
                        helperText={errors.package_id}
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
                        Create Company
                    </LoadingButton>
                </Box>
            </Box>
        </Dialog>
    );
};

export default NewCompany;
