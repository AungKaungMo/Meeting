import { useState } from "react";
import Datatable from "@/Components/table/Datatable";
import { Box, Button, Typography } from "@mui/material";
import { Iconify } from "@/Components/iconify";
import Nodata from "../../../Components/table/Nodata";
import { useTable } from "@/Hooks/use-table";
import { RegionAndStateListPropsType } from "@/PageType";
import RegionStateDataRows from "./components/region-state-data-rows";
import NewRegionAndState from "./components/NewRegionState";

const RegionAndStateList = ({ region_states, direction, sort, filter }: RegionAndStateListPropsType) => {
    const { order, orderBy, filterName, handleSort, handleFilterNameChange, handlePageChange, handlePerPageChange } = useTable({
        order: direction,
        orderBy: sort,
        filterName: filter,
        routePath: "/region-states"
    });
    const [open, setOpen] = useState(false);

    const columns = [
        { id: "id", label: "ID", width: "20%", sorting: true },
        { id: "name", label: "Name", width: "60%", sorting: true },
        { id: "status", label: "Status", width: "20%", sorting: true },
        { id: "Action" },
    ];

    const onClose = () => {
        setOpen(!open);
    };

    return (
        <>
            <Box display="flex" alignItems="center" marginTop={2}>
                <Typography flexGrow={1} fontWeight='bold'>Regions And States</Typography>
                <Button
                    onClick={onClose}
                    variant="contained"
                    // color="inherit"
                    startIcon={<Iconify icon="mingcute:add-line" />}
                >
                    New Region Or State
                </Button>
            </Box>

            <NewRegionAndState open={open} onClose={onClose} />

            <Datatable
                columns={columns}
                data={
                    region_states.data && region_states.data.length > 0 ? (
                        region_states.data.map((item, index) => (
                            <RegionStateDataRows key={item.id} id={(region_states.current_page - 1) * region_states.per_page + (index + 1)} regionStateData={item} />
                        ))
                    ) : (
                        <Nodata searchQuery={filterName} />
                    )
                }
                refreshPath="/region-states"
                total={region_states.total}
                page={region_states.current_page - 1}
                rowsPerPage={region_states.per_page}
                onPageChange={(event, newPage) => handlePageChange(event, newPage, region_states.per_page)}
                onRowsPerPageChange={(event) => handlePerPageChange(event, region_states.current_page)}
                onSort={handleSort}
                orderBy={orderBy}
                order={order}
                filterName={filterName}
                onFilterNameChange={handleFilterNameChange}
            />
        </>
    );
};

export default RegionAndStateList;
