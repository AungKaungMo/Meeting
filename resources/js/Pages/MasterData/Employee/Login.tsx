import { Box, TextField, Typography, Card, CardContent } from "@mui/material";
import { useForm } from "@inertiajs/react";
import { LoadingButton } from "@mui/lab";
import LoadingCircle from "@/icons/LoadingCircle";
import { useSnackbar } from "@/Context/SnackbarProvider";

type EmployeeDataType = {
    employee_id: string;
    password: string;
};

const Login = () => {
    // const [tabValue, setTabValue] = useState(0);

    // const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    //   setTabValue(newValue);
    // };
    const { showSnackbar } = useSnackbar();
    const { data, setData, post, errors, processing } =
        useForm<EmployeeDataType>({
            employee_id: "",
            password: "",
        });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post("/employee/login", {
            onSuccess: () => {
                showSnackbar("User Login successfully.");
            },
            onError: (error: any) => {
                if (error.error) {
                    return showSnackbar("Failed to login.", "error");
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
                            Welcome Back
                        </Typography>
                        <Typography variant="subtitle1">
                            Log in to access your meetings
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
                        Login To Your Account
                    </Typography>
                    <CardContent sx={{ p: 4 }}>
                        {/* <Tabs
                value={tabValue}
                onChange={handleTabChange}
                centered
                sx={{ marginBottom: 2 }}
              >
                <Tab label="User ID" />
                <Tab label="Email" />
                <Tab label="Phone" />
              </Tabs> */}
                        <form onSubmit={onSubmit} className="w-full h-full">
                            {/* <TabPanel value={tabValue} index={0}>
                  <TextField
                    fullWidth
                    id="userid"
                    label="User ID"
                    placeholder="Enter your user ID"
                    focused
                    required
                  />
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                  <TextField
                    fullWidth
                    id="email"
                    label="Email"
                    type="email"
                    placeholder="name@example.com"
                    required
                  />
                </TabPanel>
                <TabPanel value={tabValue} index={2}>
                  <TextField
                    fullWidth
                    id="phone"
                    label="Phone Number"
                    type="tel"
                    placeholder="Enter your phone number"
                    required
                  />
                </TabPanel>
                <TextField
                  fullWidth
                  id="password"
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  sx={{ mt: 2 }}
                /> */}


                            <Box mb={3}>
                                <TextField
                                    fullWidth
                                    id="employee_id"
                                    autoFocus
                                    label="Employee ID"
                                    type="text"
                                    placeholder="Enter your employee id"
                                    sx={{
                                      mt: 2,
                                    }}
                                    focused
                                    value={data.employee_id}
                                    onChange={(e) =>
                                        setData("employee_id", e.target.value)
                                    }
                                    error={!!errors.employee_id}
                                    helperText={errors.employee_id}
                                />
                            </Box>

                            <TextField
                                fullWidth
                                id="password"
                                label="Password"
                                type="password"
                                placeholder="Enter your password"
                                    focused
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                error={!!errors.password}
                                helperText={errors.password}
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
                                Login
                            </LoadingButton>
                            {/*                 
                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  disabled={isLoading}
                  sx={{ mt: 3, py: 1.3 }}
                >
                  {isLoading ? 'Loading...' : 'Log In'}
                </Button> */}
                        </form>
                    </CardContent>
                </Box>
            </Card>
        </Box>
    );
};

export default Login;

// interface TabPanelProps {
//   children?: React.ReactNode;
//   index: number;
//   value: number;
// }

// function TabPanel(props: TabPanelProps) {
//   const { children, value, index, ...other } = props;

//   return (
//     <div
//       className='p-0'
//       role="tabpanel"
//       hidden={value !== index}
//       id={`tabpanel-${index}`}
//       aria-labelledby={`tab-${index}`}
//       {...other}
//     >
//       {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
//     </div>
//   );
// }
