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
import { TownshipPropsType } from "@/PageType";
import DeleteDialog from "@/Components/DeleteDialog";
import EditTownship from "./EditTownship";

const townshipDataRows: React.FC<TownshipPropsType> = ({ townshipData, id, region_states }) => {
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
        router.delete("townships/" + townshipData.id, {
            onSuccess: () => {
                handleDeleteBox();
                showSnackbar("Township deleted successfully.");
            },
        });
    };

    return (
        <>
            <TableRow hover tabIndex={1}>
                <TableCell>{id}.</TableCell>
                <TableCell>{townshipData.name}</TableCell>
                <TableCell>{townshipData.region_state?.name}</TableCell>

                <TableCell>
                    <Chip
                        label={townshipData.status ? "Active" : "Inactive"}
                        color={townshipData.status ? "success" : "error"}
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

            <EditTownship open={open} onClose={handleEditBox} townshipData={townshipData} region_states={region_states}/>
            <DeleteDialog open={deleteOpen} onOpenChange={handleDeleteBox} onCancel={handleDeleteBox} onConfirm={handleDeleteAction} />
        </>
    );
};

export default townshipDataRows;
