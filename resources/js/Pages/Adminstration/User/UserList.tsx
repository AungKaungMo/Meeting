import { useState } from "react";
import { router } from "@inertiajs/react";
import Datatable from "@/Components/table/Datatable";
import UserDataRows from "./components/user-data-rows";
import { Box, Button, Typography } from "@mui/material";
import { Iconify } from "@/Components/iconify";
import NewUser from "./components/NewUser";
import Nodata from "../../../Components/table/Nodata";
import { useTable } from "@/Hooks/use-table";

type UserListProps = {
    users: {
        data: {
            id: number;
            name: string;
            email: string;
            profile_image_url: string;
        }[];
        total: number;
        per_page: number;
        current_page: number;
    };
    sort: string;
    direction: "asc" | "desc";
    filter: string;
};

const UserList = ({ users, direction, sort, filter }: UserListProps) => {
    const { order, orderBy, filterName, handleSort, handleFilterNameChange, handlePageChange, handlePerPageChange } = useTable({
        order: direction,
        orderBy: sort,
        filterName: filter,
    });
    const [open, setOpen] = useState(false);

    const columns = [
        { id: "id", label: "ID", width: "10%" },
        { id: "name", label: "Name", width: "30%" },
        { id: "email", label: "Email", width: "30%" },
        { id: "Action" },
    ];

    const onClose = () => {
        setOpen(!open);
    };

    return (
        <>
            <Box display="flex" alignItems="center" marginTop={2}>
                <Typography flexGrow={1} fontWeight='bold'>Users</Typography>
                <Button
                    onClick={onClose}
                    variant="contained"
                    color="inherit"
                    startIcon={<Iconify icon="mingcute:add-line" />}
                >
                    New User
                </Button>
            </Box>

            <NewUser open={open} onClose={onClose} />

            <Datatable
                columns={columns}
                data={
                    users.data && users.data.length > 0 ? (
                        users.data.map((user, index) => (
                            <UserDataRows key={user.id} id={(users.current_page - 1) * users.per_page + (index + 1)} user={user} />
                        ))
                    ) : (
                        <Nodata searchQuery={filterName} />
                    )
                }
                refreshPath="/users"
                total={users.total}
                page={users.current_page - 1}
                rowsPerPage={users.per_page}
                onPageChange={(event, newPage) => handlePageChange(event, newPage, users.per_page)}
                onRowsPerPageChange={(event) => handlePerPageChange(event, users.current_page)}
                onSort={handleSort}
                orderBy={orderBy}
                order={order}
                filterName={filterName}
                onFilterNameChange={handleFilterNameChange}
            />
        </>
    );
};

export default UserList;
