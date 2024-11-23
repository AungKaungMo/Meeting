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
import { EmployeePropsType } from "@/PageType";
import DeleteDialog from "@/Components/DeleteDialog";
import EditEmployee from "./EditEmployee";

const employeeDataRows: React.FC<EmployeePropsType> = ({ employeeData, departments, id }) => {
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
        router.delete("employees/" + employeeData.id, {
            onSuccess: () => {
                handleDeleteBox();
                showSnackbar("Employee deleted successfully.");
            },
        });
    };

    console.log(employeeData, 'emp')

    return (
        <>
            <TableRow hover tabIndex={1}>
                <TableCell>{employeeData.employee_id}</TableCell>
                <TableCell>{employeeData.name}</TableCell>

                <TableCell>{employeeData.email || " - "}</TableCell>
                <TableCell>{employeeData.phone || " - "}</TableCell>
                <TableCell>{employeeData.role}</TableCell>
                <TableCell>{employeeData.department?.name}</TableCell>

                <TableCell>
                    <Chip
                        label={employeeData.status ? "Active" : "Inactive"}
                        color={employeeData.status ? "success" : "error"}
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

            <EditEmployee open={open} onClose={handleEditBox} employeeData={employeeData} departments={departments} />
            <DeleteDialog open={deleteOpen} onOpenChange={handleDeleteBox} onCancel={handleDeleteBox} onConfirm={handleDeleteAction} />
        </>
    );
};

export default employeeDataRows;
