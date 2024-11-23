import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    Stack,
    TextField,
    Avatar,
    Button,
    Box,
} from "@mui/material";
import { router, useForm } from "@inertiajs/react";
import LoadingButton from "@mui/lab/LoadingButton";
import LoadingCircle from "@/icons/LoadingCircle";
import { useSnackbar } from "@/Context/SnackbarProvider";

type UserDataType = {
    name: string;
    email: string;
    photo: File | null;
    changeImage: boolean;
};

type UserProps = {
    id: number;
    name: string;
    email: string;
    profile_image_url: string;
};

interface EditUserProps {
    open: boolean;
    onClose: () => void;
    user: UserProps;
}

const EditUser = ({ open, onClose, user }: EditUserProps) => {
    const { showSnackbar } = useSnackbar();
    const [image, setImage] = useState<string | null>(
        user.profile_image_url ? "storage/" + user.profile_image_url : null
    );
    const { data, setData, errors, setError, processing, reset } =
        useForm<UserDataType>({
            name: user.name,
            email: user.email,
            photo: null,
            changeImage: false,
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setData("changeImage", image !== `storage/${user.profile_image_url}`);

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);

        if(image !== `storage/${user.profile_image_url}`) {
            formData.append('changeImage', '1')
            // console.log('reach');
        }

        // return;

        if(data.photo) {
            formData.append('photo', data.photo)
        }

        formData.append("_method", "PUT");

        router.post(`/users/${user.id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            onSuccess: () => {
                handleOnClose();
                showSnackbar('User updated successfully.')
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
                showSnackbar("Failed to update user.", "error");
            }
        });
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setData("photo", file);
            setImage(URL.createObjectURL(file));
        }
    };

    const handleClearImage = () => {
        setImage(null);
        setData("photo", null);
    };

    const clearError = () => {
        setError("name", "");
        setError("email", "");
        setError("photo", "");
    }

    const restageDefault = () => {
        reset();
        setImage(user.profile_image_url ? `storage/${user.profile_image_url}` : null);
        clearError();
    }

    const handleOnClose = () => {
        onClose();
        restageDefault();
    };

    useEffect(() => {
        restageDefault()
    }, [user, open]);

    return (
        <Dialog
            onClose={handleOnClose}
            open={open}
            disableEnforceFocus={false}
            disableAutoFocus={false}
        >
            <DialogTitle>Edit User</DialogTitle>

            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 3, width: "100%", minWidth: 500, mx: "auto" }}
            >
                <Stack spacing={2} mx={2}>
                    <Stack spacing={2} alignItems="center" pb={3}>
                        <Avatar
                            src={image || undefined}
                            alt="User Photo"
                            sx={{ width: 100, height: 100 }}
                        />

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
                    <TextField
                        fullWidth
                        label="Name"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        sx={{
                            "& .MuiFormLabel-root": {
                                fontSize: "0.9rem",
                            },
                        }}
                        error={!!errors.name}
                        helperText={errors.name}
                    />

                    {/* Email */}
                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        sx={{
                            "& .MuiFormLabel-root": {
                                fontSize: "0.9rem",
                            },
                        }}
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        error={!!errors.email}
                        helperText={errors.email}
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
                        Update
                    </LoadingButton>
                </Box>
            </Box>
        </Dialog>
    );
};

export default EditUser;
