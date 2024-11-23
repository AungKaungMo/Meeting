import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    Stack,
    Box,
} from "@mui/material";
import CustomTextField from "@/Components/CustomTextField";
import CustomDropdown from "@/Components/CustomDropdown";
import { useForm } from "@inertiajs/react";
import LoadingButton from "@mui/lab/LoadingButton";
import LoadingCircle from "@/icons/LoadingCircle";
import { useSnackbar } from "@/Context/SnackbarProvider";
import { RoomLocationTownshipListType, RoomLocationRegionStateListType, RoomLocationDataType, RoomLocationType } from "@/PageType";
import { ActiveInactiveStatus } from "@/Data";

interface EditRoomLocationProps {
    open: boolean;
    onClose: () => void;
    roomLocationData: RoomLocationType;
    region_states: RoomLocationRegionStateListType[];
    townships: RoomLocationTownshipListType[];
}

const EditRoomLocation = ({
    open,
    onClose,
    roomLocationData,
    region_states,
    townships
}: EditRoomLocationProps) => {
    const { showSnackbar } = useSnackbar();

    const { data, setData, put, errors, setError, processing, reset } =
        useForm<RoomLocationDataType>({
            name: roomLocationData.name,
            region_state_id: roomLocationData.region_state_id,
            township_id: roomLocationData.township_id,
            status: roomLocationData.status,
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        put(`/room-locations/${roomLocationData.id}`, {
            onSuccess: () => {
                handleOnClose();
                showSnackbar("Room Location updated successfully.");
            },
            onError: (error) => {
                if(error.error) {
                    return showSnackbar("Failed to create room location.", "error");
                }else if (error && typeof error === "object" && !Array.isArray(error)) {
                    const errorKeys = Object.keys(error);
                    if (errorKeys.length > 0) {
                        return;
                    }
                }
                showSnackbar("Failed to update room location.", "error");
            },
        });
    };

    const clearError = () => {
        setError("name", "");
        setError("region_state_id", "");
        setError("township_id", "");
        setError("status", "");
    };

    const restageDefault = () => {
        // reset();
        clearError();
    };

    const handleOnClose = () => {
        onClose();
        restageDefault();
    };

    useEffect(() => {
        setData({
            name: roomLocationData.name,
            region_state_id: roomLocationData.region_state_id,
            township_id: roomLocationData.township_id,
            status: roomLocationData.status,
        });
        restageDefault();
    }, [roomLocationData, open]);

    useEffect(() => {
        if(data.township_id !== roomLocationData.township_id) {
            return setData('township_id', undefined)
        }
    }, [data.region_state_id])

    return (
        <Dialog
            onClose={handleOnClose}
            open={open}
            disableEnforceFocus={false}
            disableAutoFocus={false}
        >
            <DialogTitle>Edit Room Location</DialogTitle>

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

                    {/* Region & State */}
                    <CustomDropdown
                        label="Select Region or State"
                        value={data.region_state_id ?? ''}
                        onChange={(e) => setData("region_state_id", Number(e.target.value))}
                        options={region_states}
                        placeholder="Select options"
                        width={300}
                        error={!!errors.region_state_id}
                        helperText={errors.region_state_id}
                    />

                    {/* Township */}
                    <CustomDropdown
                        label="Select township"
                        value={data.township_id ?? ''}
                        onChange={(e) => setData("township_id", Number(e.target.value))}
                        options={townships && townships.length > 0 && data.region_state_id ? townships.filter(township => township.region_state_id === data.region_state_id) : []}
                        placeholder="Select options"
                        width={300}
                        error={!!errors.township_id}
                        helperText={errors.township_id}
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

export default EditRoomLocation;