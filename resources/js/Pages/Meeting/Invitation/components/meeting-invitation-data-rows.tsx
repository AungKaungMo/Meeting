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
import { MeetingInvitationPropsType } from "@/PageType";
import dayjs from "dayjs";
import DeleteDialog from "@/Components/DeleteDialog";
import EditMeetingInvitation from "./EditMeetingInvitation";

const meetingsRows: React.FC<MeetingInvitationPropsType> = ({ meetings, roomLocations, departments, employees, id }) => {
    const { showSnackbar } = useSnackbar();

    const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(
        null
    );
    const [open, setOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

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

    const handleDeleteBox = () => {
        setOpenPopover(null);
        setDeleteOpen(!deleteOpen);
    };

    const handleDeleteAction = () => {
        router.delete("meeting-invitations/" + meetings.id, {
            onSuccess: () => {
                handleDeleteBox();
                showSnackbar("Meeting Invitation deleted successfully.");
            },
        });
    };

    return (
        <>
            <TableRow hover tabIndex={1}>
                <TableCell>{id}.</TableCell>
                <TableCell>{meetings.title}</TableCell>
                <TableCell>{meetings.agenda?.length > 40 ? meetings.agenda.substring(0, 40).concat('...') : meetings.agenda}</TableCell>
                <TableCell>{meetings.host_department.name}</TableCell>
                <TableCell>{meetings.room_location.name}</TableCell>
                <TableCell>{dayjs.unix(meetings.meeting_date)?.format('YYYY-MM-DD')}</TableCell>
                <TableCell>{dayjs.unix(meetings.from)?.format('HH:mm A')}</TableCell>
                <TableCell>{dayjs.unix(meetings.to)?.format('HH:mm A')}</TableCell>

                <TableCell>
                    <Chip
                        label={meetings.status === 0 ? "Waiting" : meetings.status === 1 ? "Confirmed" : "Canceled" }
                        color={meetings.status === 0 ? "info" : meetings.status === 1 ? "success" : "error"}
                    />
                </TableCell>

                <TableCell align="right">
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
                    {meetings.status === 0 && (
                        <MenuItem onClick={handleEditBox}>
                            <Iconify icon="solar:pen-bold" />
                            <p className="ms-3">Edit</p>
                        </MenuItem>
                    )}

                    <MenuItem
                        onClick={handleDeleteBox}
                        sx={{ color: "error.main" }}
                    >
                        <Iconify icon="solar:trash-bin-trash-bold" />
                        <p className="ms-3">Delete</p>
                    </MenuItem>
                </MenuList>
            </Popover>

            <EditMeetingInvitation open={open} onClose={handleEditBox} meetings={meetings} roomLocations={roomLocations} departments={departments} employees={employees} />
            <DeleteDialog open={deleteOpen} onOpenChange={handleDeleteBox} onCancel={handleDeleteBox} onConfirm={handleDeleteAction} />
        </>
    );
};

export default meetingsRows;
