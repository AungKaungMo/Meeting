import { useState } from "react";
import Datatable from "@/Components/table/Datatable";
import { Box, Button, Typography } from "@mui/material";
import { Iconify } from "@/Components/iconify";
import Nodata from "../../../Components/table/Nodata";
import { useTable } from "@/Hooks/use-table";
import { TownshipListPropsType } from "@/PageType";
import TownshipDataRows from "./components/township-state-data-rows";
import NewTownship from "./components/NewTownship";

const TownshipList = ({ townships, direction, sort, filter, region_states }: TownshipListPropsType) => {
    const { order, orderBy, filterName, handleSort, handleFilterNameChange, handlePageChange, handlePerPageChange } = useTable({
        order: direction,
        orderBy: sort,
        filterName: filter,
        routePath: "/townships"
    });
    const [open, setOpen] = useState(false);

    const columns = [
        { id: "id", label: "ID", width: "15%", sorting: true },
        { id: "name", label: "Name", width: "30%", sorting: true },
        { id: "region_state", label: "Region & State", width: "30%", sorting: true },
        { id: "status", label: "Status", width: "20%", sorting: true },
        { id: "Action" },
    ];

    const onClose = () => {
        setOpen(!open);
    };

    return (
        <>
            <Box display="flex" alignItems="center" marginTop={2}>
                <Typography flexGrow={1} fontWeight='bold'>Townships</Typography>
                <Button
                    onClick={onClose}
                    variant="contained"
                    // color="inherit"
                    startIcon={<Iconify icon="mingcute:add-line" />}
                >
                    New Township
                </Button>
            </Box>

            <NewTownship open={open} onClose={onClose} region_states={region_states} />

            <Datatable
                columns={columns}
                data={
                    townships.data && townships.data.length > 0 ? (
                        townships.data.map((item, index) => (
                            <TownshipDataRows key={item.id} id={(townships.current_page - 1) * townships.per_page + (index + 1)} townshipData={item}  region_states={region_states}/>
                        ))
                    ) : (
                        <Nodata searchQuery={filterName} />
                    )
                }
                refreshPath="/townships"
                total={townships.total}
                page={townships.current_page - 1}
                rowsPerPage={townships.per_page}
                onPageChange={(event, newPage) => handlePageChange(event, newPage, townships.per_page)}
                onRowsPerPageChange={(event) => handlePerPageChange(event, townships.current_page)}
                onSort={handleSort}
                orderBy={orderBy}
                order={order}
                filterName={filterName}
                onFilterNameChange={handleFilterNameChange}
            />
        </>
    );
};

export default TownshipList;
