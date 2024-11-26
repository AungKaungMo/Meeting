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
import { MeetingInvitationDropDataListType, MeetingInvitationType, MeetingInvitationDataType } from "@/PageType";
import { MeetingStatus } from "@/Data";
import CustomDropDownMultiple from "@/Components/CustomDropdownMultiple";
import CustomDatePicker from "@/Components/CustomDatePicker";
import CustomTimePicker from "@/Components/CustomTimePicker";
import dayjs, { Dayjs } from "dayjs";

interface EditMeetingInvitationProps {
    open: boolean;
    onClose: () => void;
    meetings: MeetingInvitationType;
    roomLocations: MeetingInvitationDropDataListType[];
    employees: MeetingInvitationDropDataListType[];
    departments: MeetingInvitationDropDataListType[];
}

const EditMeetingInvitation = ({
    open,
    onClose,
    meetings,
    roomLocations,
    employees,
    departments
}: EditMeetingInvitationProps) => {
    const { showSnackbar } = useSnackbar();
    const [meetDate, setMeetDate] = useState<Dayjs>(dayjs.unix(meetings.meeting_date));
    const [fromTime, setFromTime] = useState<Dayjs>(dayjs.unix(meetings.from));
    const [toTime, setToTime] = useState<Dayjs>(dayjs.unix(meetings.to));

    const { data, setData, put, errors, setError, processing, reset } =
        useForm<MeetingInvitationDataType>({
            title: meetings.title,
            agenda: meetings.agenda,
            host_department_id: meetings.host_department_id,
            room_location_id: meetings.room_location_id,
            meeting_date: meetings.meeting_date,
            from: meetings.from,
            to: meetings.to,
            invited_departments: meetings.invited_departments?.map(department => department.id),
            participants: meetings.participants?.map(participant => participant.id),
            host_by_id: meetings.host_by_id,
            remark: meetings.remark,
            status: meetings.status,
            reason: meetings.reason
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        put(`/meeting-invitations/${meetings.id}`, {
            onSuccess: () => {
                handleOnClose();
                showSnackbar("Meeting Invitation updated successfully.");
            },
            onError: (error) => {
                if(error.error) {
                    return showSnackbar(error.error || "Failed to create meeting invitation.", "error");
                }else if (error && typeof error === "object" && !Array.isArray(error)) {
                    const errorKeys = Object.keys(error);
                    if (errorKeys.length > 0) {
                        return;
                    }
                }
                showSnackbar("Failed to update meeting invitation.", "error");
            },
        });
    };

    const clearError = () => {
        setError("title", "");
        setError("agenda", "");
        setError("host_department_id", "");
        setError("room_location_id", "");
        setError("meeting_date", "");
        setError("from", "");
        setError("to", "");
        setError("invited_departments", "");
        setError("participants", "");
        setError("host_by_id", "");
        setError("remark", "");
        setError("status", "");
        setError("reason", "");
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
            title: meetings.title,
            agenda: meetings.agenda,
            host_department_id: meetings.host_department_id,
            room_location_id: meetings.room_location_id,
            meeting_date: meetings.meeting_date,
            from: meetings.from,
            to: meetings.to,
            invited_departments: meetings.invited_departments?.map(participant => participant.id),
            participants: meetings.participants?.map(participant => participant.id),
            host_by_id: meetings.host_by_id,
            remark: meetings.remark,
            status: meetings.status,
            reason: meetings.reason,
        });
        // restageDefault();
    }, [meetings, open]);

    const handleMeetingDate = (newValue: Dayjs | null) => {
        if (newValue) {
            setMeetDate(newValue);
            const formattedExpireDate = newValue
                ? dayjs(newValue).startOf("day").unix()
                : 0;

            setData("meeting_date", formattedExpireDate);
        }
    };

    const handleMeetingTime = (newValue: Dayjs | null, type: "from" | "to") => {
        if (newValue) {
            const formattedTime = newValue ? newValue.unix() : 0;
            if (type === "from") {
                setFromTime(newValue);
                setData("from", formattedTime);
            } else if (type === "to") {
                setToTime(newValue);
                setData("to", formattedTime);
            }
        }
    };

    const filteredEmployees = React.useMemo(() => {
        if (
            (Array.isArray(data.invited_departments) &&
                data.invited_departments.length > 0) ||
            data.host_department_id
        ) {
            return employees.filter(
                (employee) =>
                    employee.department_id &&
                    (employee.department_id === data.host_department_id ||
                        data.invited_departments?.includes(
                            employee.department_id
                        ))
            );
        }
        return [];
    }, [data.invited_departments, data.host_department_id, employees]);

    return (
        <Dialog
            onClose={handleOnClose}
            open={open}
            disableEnforceFocus={false}
            disableAutoFocus={false}
        >
            <DialogTitle>Edit Meeting Invitation</DialogTitle>

            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 3, width: "100%", minWidth: 500, mx: "auto" }}
            >
                <Stack spacing={3} mx={2}>

                    {/* Title */}
                    <CustomTextField
                        label="Title"
                        value={data.title}
                        onChange={(e) => setData("title", e.target.value)}
                        error={!!errors.title}
                        helperText={errors.title}
                    />

                    {/* Agenda */}
                    <CustomTextField
                        label="Agenda"
                        value={data.agenda}
                        onChange={(e) => setData("agenda", e.target.value)}
                        error={!!errors.agenda}
                        helperText={errors.agenda}
                    />

                    {/* Host Department */}
                    <CustomDropdown
                        label="Select Host Department"
                        value={data.host_department_id ?? ""}
                        onChange={(e) =>
                            setData(
                                "host_department_id",
                                Number(e.target.value)
                            )
                        }
                        options={departments?.map((department) =>
                             data.invited_departments?.includes(department.id)
                                ? { ...department, disabled: true }
                                : { ...department }
                        )}
                        placeholder="Select options"
                        error={!!errors.host_department_id}
                        helperText={errors.host_department_id}
                    />

                    {/* Invited Departments */}
                    <CustomDropDownMultiple
                        label="Select Invited Departments"
                        value={
                            Array.isArray(data.invited_departments)
                                ? data.invited_departments
                                : []
                        }
                        onChange={(e) =>
                            setData(
                                "invited_departments",
                                e.target.value as number[]
                            )
                        }
                        options={departments?.map((department) =>
                            department.id === data.host_department_id
                                ? { ...department, disabled: true }
                                : { ...department }
                        )}
                        placeholder="Select options"
                        error={!!errors.invited_departments}
                        helperText={errors.invited_departments}
                    />

                    {/* Room Location */}
                    <CustomDropdown
                        label="Select Room Location"
                        value={data.room_location_id ?? ""}
                        onChange={(e) =>
                            setData("room_location_id", Number(e.target.value))
                        }
                        options={roomLocations}
                        placeholder="Select options"
                        error={!!errors.room_location_id}
                        helperText={errors.room_location_id}
                    />

                    {/* Meeting Date */}
                    <CustomDatePicker
                        label="Select Date"
                        value={meetDate ?? null}
                        onChange={(newDate) => handleMeetingDate(newDate)}
                        error={!!errors.meeting_date}
                        helperText={errors.meeting_date}
                    />

                    {/* Time From */}
                    <CustomTimePicker
                        label="Select From Time"
                        value={fromTime ?? null}
                        onChange={(newDate) =>
                            handleMeetingTime(newDate, "from")
                        }
                        error={!!errors.from}
                        helperText={errors.from}
                    />

                    {/* Time To */}
                    <CustomTimePicker
                        label="Select To Time"
                        value={toTime ?? null}
                        onChange={(newDate) => handleMeetingTime(newDate, "to")}
                        error={!!errors.to}
                        helperText={errors.to}
                    />

                    {/* Participants */}
                    <CustomDropDownMultiple
                        label="Select Participants"
                        value={
                            Array.isArray(data.participants)
                                ? data.participants
                                : []
                        }
                        onChange={(e) =>
                            setData("participants", e.target.value as number[])
                        }
                        options={filteredEmployees}
                        placeholder="Select options"
                        error={!!errors.participants}
                        helperText={errors.participants}
                    />

                    {/* Host By */}
                    <CustomDropdown
                        label="Select Host By"
                        value={data.host_by_id ?? ""}
                        onChange={(e) =>
                            setData("host_by_id", Number(e.target.value))
                        }
                        options={employees.filter(employee => data.participants?.includes(employee.id)) || []}
                        placeholder="Select options"
                        error={!!errors.host_by_id}
                        helperText={errors.host_by_id}
                    />

                    {/* Remark */}
                    <CustomTextField
                        label="Remark"
                        value={data.remark}
                        onChange={(e) => setData("remark", e.target.value)}
                    />

                    {/* Status */}
                    <CustomDropdown
                        label="Select Status"
                        value={data.status}
                        onChange={(e) =>
                            setData("status", Number(e.target.value))
                        }
                        options={MeetingStatus}
                        placeholder="Select options"
                    />

                    {/* Reason */}
                    {(data.status === 2) && (
                        <CustomTextField
                        label="Reason"
                        value={data.reason}
                        onChange={(e) => setData("reason", e.target.value)}
                        error={!!errors.reason}
                        helperText={errors.reason}
                    />
                    )}

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

export default EditMeetingInvitation;
