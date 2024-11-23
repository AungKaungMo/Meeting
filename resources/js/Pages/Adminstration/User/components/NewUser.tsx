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

type UserDataType = {
    name: string;
    email: string;
    password: string;
    photo: File | null;
};

interface NewUserProps {
    open: boolean;
    onClose: () => void;
}

const NewUser = ({ open, onClose }: NewUserProps) => {
    const [image, setImage] = useState<string | null>(null);
    const { showSnackbar } = useSnackbar();
    const { data, setData, post, errors, setError, processing, reset } =
        useForm<UserDataType>({
            name: "",
            email: "",
            password: "",
            photo: null,
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/users", {
            onSuccess: () => {
                handleOnClose();
                handleClearImage();
                showSnackbar("User created successfully.");
            },
            onError: (error: any) => {
                if (error.error) {
                    return showSnackbar("Failed to create employee.", "error");
                } else if (
                    error &&
                    typeof error === "object" &&
                    !Array.isArray(error)
                ) {
                    const errorKeys = Object.keys(error);
                    if (errorKeys.length > 0) {
                        return;
                    }
                }
                showSnackbar("Failed to create user.", "error");
            },
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
    };

    const handleOnClose = () => {
        onClose();
        reset();
        handleClearImage();
        setError("name", "");
        setError("email", "");
        setError("password", "");
        setError("photo", "");
    };

    return (
        <Dialog
            onClose={handleOnClose}
            open={open}
            disableEnforceFocus={false}
            disableAutoFocus={false}
        >
            <DialogTitle>New User</DialogTitle>

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

                    {/* Password */}
                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        sx={{
                            "& .MuiFormLabel-root": {
                                fontSize: "0.9rem",
                            },
                        }}
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        error={!!errors.password}
                        helperText={errors.password}
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
                        Create User
                    </LoadingButton>
                    {/* <Button
                        
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Create User
                    </Button> */}
                </Box>
            </Box>
        </Dialog>
    );
};

export default NewUser;
