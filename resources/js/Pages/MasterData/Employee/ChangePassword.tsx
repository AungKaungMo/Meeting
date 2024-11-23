import { Box, TextField, Typography, Card, CardContent } from "@mui/material";
import { useForm } from "@inertiajs/react";
import { LoadingButton } from "@mui/lab";
import LoadingCircle from "@/icons/LoadingCircle";
import { useSnackbar } from "@/Context/SnackbarProvider";

type PasswordDataType = {
    new_password: string;
    confirm_password: string;
};

const Login = () => {
    const { showSnackbar } = useSnackbar();
    const { data, setData, post, errors, processing } =
        useForm<PasswordDataType>({
            new_password: "",
            confirm_password: "",
        });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post("/employee/change-password", {
            onSuccess: () => {
                showSnackbar("Password change successfully.");
            },
            onError: (error: any) => {
                if (error.error) {
                    return showSnackbar("Failed to change password.", "error");
                } 
            },
        });
    };

    return (
        <Box
            sx={{
                display: "flex",
                minHeight: "100vh",
                alignItems: "center",
                justifyContent: "center",
                p: 4,
                bgcolor: "grey.100",
            }}
        >
            <Card
                className="lg:min-w-[1200px] md:w-[600px]  lg:min-h-[70vh]"
                sx={{
                    display: "flex",
                    overflow: "hidden",
                    borderRadius: 2,
                    boxShadow: 4,
                }}
            >
                <Box
                    className="lg:block hidden "
                    sx={{
                        width: { xs: "100%", md: "50%" },
                        position: "relative",
                    }}
                >
                    <img
                        src="/assets/background/meeting.jpg"
                        alt="Meeting System"
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                    <Box
                        sx={{
                            position: "absolute",
                            inset: 0,
                            background:
                                "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
                        }}
                    />
                    <Box
                        sx={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            p: 3,
                            color: "common.white",
                        }}
                    >
                        <Typography variant="h4" gutterBottom>
                            First time Login
                        </Typography>
                        <Typography variant="subtitle1">
                            Change password for security alert.
                        </Typography>
                    </Box>
                </Box>
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        mx: 4,
                    }}
                >
                    <Typography fontWeight="bold" align="center" fontSize={23}>
                        Change New Password 
                    </Typography>
                    <CardContent sx={{ p: 4 }}>
                 
                        <form onSubmit={onSubmit} className="w-full h-full">

                            <Box mb={3}>
                                <TextField
                                    fullWidth
                                    id="new_password"
                                    autoFocus
                                    label="New Password"
                                    type="password"
                                    placeholder="Enter your new password"
                                    sx={{
                                      mt: 2,
                                    }}
                                    focused
                                    value={data.new_password}
                                    onChange={(e) =>
                                        setData("new_password", e.target.value)
                                    }
                                    error={!!errors.new_password}
                                    helperText={errors.new_password}
                                />
                            </Box>

                            <TextField
                                fullWidth
                                id="confirm_password"
                                label="Confirm Password"
                                type="password"
                                placeholder="Enter your confirm password"
                                    focused
                                value={data.confirm_password}
                                onChange={(e) =>
                                    setData("confirm_password", e.target.value)
                                }
                                error={!!errors.confirm_password}
                                helperText={errors.confirm_password}
                                sx={{ mt: 2 }}
                            />

                            <LoadingButton
                                fullWidth
                                loading={false}
                                type="submit"
                                loadingPosition="start"
                                startIcon={
                                    processing ? <LoadingCircle /> : <span />
                                }
                                sx={{ mt: 4, mb: 2, py: 1.5 }}
                                variant="contained"
                            >
                                Change Password
                            </LoadingButton>
                 
                        </form>
                    </CardContent>
                </Box>
            </Card>
        </Box>
    );
};

export default Login;

