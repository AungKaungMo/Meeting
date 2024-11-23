import {
    Box,
    Button,
    Dialog,
    DialogContent,
    Paper,
    Table,
    Typography,
} from "@mui/material";
import { useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { Iconify } from "./iconify";
import { useSnackbar } from "@/Context/SnackbarProvider";
import { LoadingButton } from "@mui/lab";
import LoadingCircle from "@/icons/LoadingCircle";

type ExcelProps = {
    file: File | null; // Allow null since the initial state is null
};

const ExcelImportDialog = ({
    open,
    handleOpen,
    url,
    example_excel_formats,
    example_excel_header_formats,
    notes,
}: {
    open: boolean;
    handleOpen: () => void;
    url: string;
    example_excel_formats: any;
    example_excel_header_formats: any;
    notes?: any;
}) => {
    const { data, setData, post, processing, errors } = useForm<ExcelProps>({
        file: null,
    });
    const { showSnackbar } = useSnackbar();
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) {
            setData("file", null);
            return;
        }

        // Validate file size (example: 10 MB)
        const maxFileSize = 10 * 1024 * 1024;
        if (file.size > maxFileSize) {
            setData("file", null);
            alert("File size should not exceed 10MB");
            return;
        }

        setData("file", file);
    };

    const handleRemove = () => {
        setData("file", null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        if (data.file) {
            formData.append("file", data.file);
        }
        formData.append("_method", "PUT");

        post(url, {
            onSuccess: () => {
                showSnackbar("Successfully imported data.");
                handleOpen();
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
                showSnackbar("Failed to create package.", "error");
            },
        });
    };

    useEffect(() => {
        setData("file", null);
    }, [open]);

    return (
        <Dialog
            open={open}
            onClose={handleOpen}
            disableEnforceFocus
            disableAutoFocus
            sx={{
                "& .MuiPaper-root": {
                    maxWidth: "1000px",
                },
            }}
        >
            <DialogContent>
                <Paper sx={{ padding: 2, textAlign: "center" }}>
                    <Box marginBottom={2}>
                        <Typography variant="body1">
                            {data.file
                                ? `Selected File: ${data.file.name}`
                                : "No file selected"}
                        </Typography>
                    </Box>

                    <Box display="flex" justifyContent="center" gap={2}>
                        {data.file ? (
                            <Box
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                gap={2}
                            >
                                {/* <Button
                                    onClick={handleSubmit}
                                    variant="contained"
                                    component="label"
                                    color="primary"
                                    disabled={processing}
                                    startIcon={
                                        <Iconify icon="lets-icons:import-light" />
                                    }
                                >
                                    Upload Here
                                </Button> */}

                                <LoadingButton
                                    onClick={handleSubmit}
                                    loading={processing}
                                    type="submit"
                                    loadingPosition="start"
                                    startIcon={
                                        processing ? (
                                            <LoadingCircle />
                                        ) : (
                                            <Iconify icon="lets-icons:import-light" />
                                        )
                                    }
                                    variant="contained"
                                >
                                    Upload Here
                                </LoadingButton>

                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={handleRemove}
                                    disabled={processing}
                                >
                                    Remove File
                                </Button>
                            </Box>
                        ) : (
                            <Button
                                variant="contained"
                                component="label"
                                color="primary"
                                disabled={processing}
                                startIcon={
                                    <Iconify icon="lets-icons:import-light" />
                                }
                            >
                                Upload File
                                <input
                                    type="file"
                                    hidden
                                    onChange={handleFileChange}
                                />
                            </Button>
                        )}
                    </Box>

                    {errors.file && (
                        <Typography variant="body2" color="error" marginTop={2}>
                            {errors.file}
                        </Typography>
                    )}
                </Paper>

                <Box mt={3}>
                    <Typography fontWeight="bold">
                        Example Excel Format{" "}
                    </Typography>
                    <table className="border-2 border-black my-2 w-full">
                        <thead>
                            <tr>
                                {example_excel_header_formats?.map(
                                    (data: any) => (
                                        <td
                                            key={data}
                                            className="border-2 p-3 font-semibold border-black my-3 "
                                        >
                                            {data}
                                        </td>
                                    )
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {example_excel_formats.map(
                                (item: Record<string, any>, index: number) => (
                                    <tr key={index}>
                                        {Object.keys(item).map((key) => (
                                            <td
                                                className="border-2 p-3 border-black my-3 w-full"
                                                key={key}
                                            >
                                                {item[key]}
                                            </td>
                                        ))}
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>

                    {notes && notes.length > 0 && (
                        <>
                            <Typography fontWeight="bold" my={3}>
                                Notes:
                            </Typography>
                            {notes.map((note: string, index: number) => (
                                <Typography key={index}>{note}</Typography>
                            ))}
                        </>
                    )}
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default ExcelImportDialog;
