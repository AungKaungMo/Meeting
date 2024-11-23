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
import { PackagePropsType } from "@/PageType";
import EditPackage from "./EditPackage";
import DeleteDialog from "@/Components/DeleteDialog";

const PackageDataRows: React.FC<PackagePropsType> = ({ packageData, id }) => {
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
        router.delete("packages/" + packageData.id, {
            onSuccess: () => {
                handleDeleteBox();
                showSnackbar("Package deleted successfully.");
            },
        });
    };

    return (
        <>
            <TableRow hover tabIndex={1}>
                <TableCell>{id}.</TableCell>

                <TableCell>{packageData.name}</TableCell>
                <TableCell>
                    {packageData.limit_employee ? "Yes" : "No"}
                </TableCell>
                <TableCell>{packageData.max_employee}</TableCell>
                <TableCell>
                    <Chip
                        label={packageData.status ? "Active" : "Inactive"}
                        color={packageData.status ? "success" : "error"}
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

            <EditPackage open={open} onClose={handleEditBox} packageData={packageData} />
            <DeleteDialog open={deleteOpen} onOpenChange={handleDeleteBox} onCancel={handleDeleteBox} onConfirm={handleDeleteAction} />
        </>
    );
};

export default PackageDataRows;
