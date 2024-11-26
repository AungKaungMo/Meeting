import React, { useState, useCallback } from "react";
import {
    Chip,
    IconButton,
    MenuItem,
    MenuList,
    Popover,
    TableCell,
    TableRow,
} from "@mui/material";
import { Iconify } from "@/Components/iconify";
import { router } from "@inertiajs/react";
import { useSnackbar } from "@/Context/SnackbarProvider";
import { MeetingAttendancePropsType } from "@/PageType";
import dayjs from "dayjs";
import EditMeetingAttendance from "./EditMeetingAttendance";

const attendanceRows: React.FC<MeetingAttendancePropsType> = ({
    attendance,
    id,
}) => {
    const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(
        null
    );
    const [open, setOpen] = useState(false);

    const handleOpenPopover = useCallback(
        (event: React.MouseEvent<HTMLButtonElement>) => {
            setOpenPopover(event.currentTarget);
        },
        []
    );

    const handleClosePopover = useCallback(() => {
        setOpenPopover(null);
    }, []);

    const handleEditBox = () => {
        setOpenPopover(null);
        setOpen(!open);
    };

    return (
        <>
            <TableRow hover tabIndex={1}>
                <TableCell>{id}.</TableCell>
                <TableCell>{attendance.meeting_invitation.title}</TableCell>
                <TableCell>
                    {attendance.meeting_invitation.host_department.name}
                </TableCell>
                <TableCell>
                    {attendance.meeting_invitation.room_location.name}
                </TableCell>
                <TableCell>
                    {dayjs
                        .unix(attendance.meeting_invitation.meeting_date)
                        ?.format("YYYY-MM-DD") +
                        " ( " +
                        dayjs
                            .unix(attendance.meeting_invitation.from)
                            ?.format("HH:mm A") +
                        " - " +
                        dayjs
                            .unix(attendance.meeting_invitation.to)
                            ?.format("HH:mm A") +
                        " )"}
                </TableCell>

                <TableCell>
                    <Chip
                        label={
                            attendance.status === 0
                                ? "Waiting"
                                : attendance.status === 2
                                ? "Drafted"
                                : "Confirmed"
                        }
                        color={
                            attendance.status === 0
                                ? "info"
                                : attendance.status === 2
                                ? "default"
                                : "success"
                        }
                    />
                </TableCell>

                <TableCell align="right" >
                    <IconButton onClick={handleOpenPopover}>
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                </TableCell>
            </TableRow>

                <Popover
                    open={!!openPopover}
                    anchorEl={openPopover}
                    onClose={handleClosePopover}
                    anchorOrigin={{
                        vertical: "top",
                        horizontal: "left",
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                    }}
                >
                    <MenuList disablePadding>
                        <MenuItem onClick={handleEditBox}>
                            <Iconify icon="hugeicons:note-03" />
                            <p className="ms-3">Attendance</p>
                        </MenuItem>
                    </MenuList>
                </Popover>

            <EditMeetingAttendance
                open={open}
                onClose={handleEditBox}
                attendance={attendance}
            />
        </>
    );
};

export default attendanceRows;
