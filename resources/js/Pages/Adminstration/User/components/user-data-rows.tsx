import React, { useState, useCallback, useEffect } from "react";
import {
    Avatar,
    Box,
    IconButton,
    MenuItem,
    MenuList,
    Popover,
    TableCell,
    TableRow,
} from "@mui/material";
import { Iconify } from "@/Components/iconify";
import EditUser from "./EditUser";
import DeleteDialog from "@/Components/DeleteDialog";
import { router } from "@inertiajs/react";
import { useSnackbar } from "@/Context/SnackbarProvider";

type UserProps = {
    user: {
        id: number;
        name: string;
        email: string;
        profile_image_url: string;
    };
    id: number
};

const UserDataRows: React.FC<UserProps> = ({ user ,id }) => {

    const { showSnackbar } = useSnackbar();

    const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
    const [open, setOpen] = useState(false)
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
        setOpen(!open)
    }

    const handleDeleteBox = () => {
        setOpenPopover(null);
        setDeleteOpen(!deleteOpen);
    }

    const handleDeleteAction = () => {
        router.delete('users/'+user.id, {
            onSuccess: () => {
                handleDeleteBox();
                showSnackbar('User deleted successfully.')
            },
        })
    }

    return (
        <>
            <TableRow hover tabIndex={1}>

                <TableCell>{id}.</TableCell>

                <TableCell component="th" scope="row">
                    <Box gap={2} display="flex" alignItems="center">
                        <Avatar alt={user.name} src={'storage/' + user.profile_image_url} />
                        {user.name}
                    </Box>
                </TableCell>

                <TableCell>{user.email}</TableCell>

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
                    <MenuItem onClick={handleEditBox}>
                        <Iconify icon="solar:pen-bold" />
                        <p className="ms-3">Edit</p>
                    </MenuItem>

                    <MenuItem
                        onClick={handleDeleteBox}
                        sx={{ color: "error.main" }}
                    >
                        <Iconify icon="solar:trash-bin-trash-bold" />
                        <p className="ms-3">Delete</p>
                    </MenuItem>
                </MenuList>
            </Popover>

            <EditUser open={open} onClose={handleEditBox} user={user} />
            <DeleteDialog open={deleteOpen} onOpenChange={handleDeleteBox} onCancel={handleDeleteBox} onConfirm={handleDeleteAction} />
        </>
    );
};

export default UserDataRows;
