import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, Stack, Box, Typography } from "@mui/material";
import CustomTextField from "@/Components/CustomTextField";
import CustomDropdown from "@/Components/CustomDropdown";
import { useForm } from "@inertiajs/react";
import LoadingButton from "@mui/lab/LoadingButton";
import LoadingCircle from "@/icons/LoadingCircle";
import { useSnackbar } from "@/Context/SnackbarProvider";
import { MeetingAttendanceDataType, MeetingAttendanceType } from "@/PageType";
import { MeetingStatus } from "@/Data";

interface EditMeetingAttendanceProps {
    open: boolean;
    onClose: () => void;
    attendance: MeetingAttendanceType;
}

const EditMeetingAttendance = ({
    open,
    onClose,
    attendance,
}: EditMeetingAttendanceProps) => {
    const { showSnackbar } = useSnackbar();

    const { data, setData, put, errors, setError, processing, reset } =
        useForm<MeetingAttendanceDataType>({
            attendance_participants: attendance.attendance_participants,
            status: attendance.status,
        });

        const [attendanceData, setAttendanceData] = useState<{employee_id: number, status: number}[]>([]);

    useEffect(() => {
        const mapData = attendance.meeting_invitation.participants.map((participant) => {
            const matchingParticipant = attendance.attendance_participants?.find(
              (att_participant) => att_participant.employee_id === participant.id
            );
            return {
              employee_id: participant.id,
              status: matchingParticipant ? matchingParticipant.status : 1, 
            };
          })
          setAttendanceData(mapData);
          setData('attendance_participants', mapData)

    }, [attendance])

    const handleStatusChange = (index: number, status: number) => {
        setAttendanceData((prev) => {
            const updatedData = prev.map((item, i) =>
                i === index ? { ...item, status } : item
            );
            setData('attendance_participants', updatedData);
            return updatedData;
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        put(`/meeting-attendances/${attendance.id}`, {
            onSuccess: () => {
                handleOnClose();
                showSnackbar("Meeting Attendance updated successfully.");
            },
            onError: (error) => {
                if (error.error) {
                    return showSnackbar(
                        error.error || "Failed to create meeting attendance.",
                        "error"
                    );
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
                showSnackbar("Failed to update meeting attendance.", "error");
            },
        });
    };

    useEffect(() => {
        if (attendanceData && attendanceData.length > 0) {
            setData('attendance_participants', attendanceData);
        }
    }, [attendanceData, attendance.meeting_invitation.participants, attendance.attendance_participants]);

    const clearError = () => {
        setError("attendance_participants", "");
        setError("pic_id", "");
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
            attendance_participants: attendance.attendance_participants,
            pic_id: attendance.pic_id,
            status: attendance.status,
        });
        // restageDefault();
    }, [attendance, open]);

    return (
        <Dialog
            onClose={handleOnClose}
            open={open}
            disableEnforceFocus={false}
            disableAutoFocus={false}
        >
            <DialogTitle>Keep Meeting Attendance</DialogTitle>

            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 3, width: "100%", minWidth: 500, mx: "auto" }}
            >
                <Stack spacing={3} pl={1.3} mx={2}>
                    <Box>
                        {attendance.meeting_invitation.participants?.map(
                            (participant, index) => (
                                <Box
                                    key={index}
                                    display="flex"
                                    justifyContent="space-between"
                                    gap={3}
                                    alignItems="center"
                                >
                                    <Typography>{participant.name}</Typography>
                                    <CustomDropdown
                                        disabled={attendance.status === 1}
                                        width={150}
                                        value={attendanceData[index]?.status}
                                        onChange={(e) =>
                                            handleStatusChange(
                                                index,
                                                Number(e.target.value)
                                            )
                                        }
                                        options={[
                                            { id: 0, name: "Absent" },
                                            { id: 1, name: "Present" },
                                        ]}
                                    />
                                </Box>
                            )
                        )}
                    </Box>

                    {/* PIC */}
                    <CustomDropdown
                        disabled={attendance.status === 1}
                        label="Select PIC"
                        value={data.pic_id ?? ""}
                        onChange={(e) =>
                            setData("pic_id", Number(e.target.value))
                        }
                        options={
                            attendance.meeting_invitation?.participants || []
                        }
                        placeholder="Select options"
                        error={!!errors.pic_id}
                        helperText={errors.pic_id}
                    />
                </Stack>

                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 4,
                        visibility: attendance.status === 1 ? 'hidden' : 'visible'
                    }}
                >
                    <LoadingButton
                        onClick={() => setData("status", 2)}
                        loading={processing}
                        type="submit"
                        loadingPosition="start"
                        startIcon={(data.status === 2 && processing) ? <LoadingCircle /> : <span />}
                        sx={{ mt: 3, mb: 2, bgcolor: "gray" }}
                        variant="contained"
                    >
                        Draft
                    </LoadingButton>
                    <LoadingButton
                        onClick={() => setData("status", 1)}
                        loading={processing}
                        type="submit"
                        loadingPosition="start"
                        startIcon={(data.status === 1 && processing) ? <LoadingCircle /> : <span />}
                        sx={{ mt: 3, mb: 2 }}
                        variant="contained"
                    >
                        Confirm
                    </LoadingButton>
                </Box>
            </Box>
        </Dialog>
    );
};

export default EditMeetingAttendance;
