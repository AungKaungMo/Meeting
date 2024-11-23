import { useState } from "react";
import Datatable from "@/Components/table/Datatable";
import { Box, Button, Typography } from "@mui/material";
import { Iconify } from "@/Components/iconify";
import Nodata from "../../../Components/table/Nodata";
import { useTable } from "@/Hooks/use-table";
import { RoomLocationListPropsType } from "@/PageType";
import RoomLocationDataRows from "./components/room-location-data-rows";
import NewRoomLocation from "./components/NewRoomLocation";

const RoomLocationList = ({ roomLocations, direction, sort, filter, region_states, townships }: RoomLocationListPropsType) => {
    const { order, orderBy, filterName, handleSort, handleFilterNameChange, handlePageChange, handlePerPageChange } = useTable({
        order: direction,
        orderBy: sort,
        filterName: filter,
        routePath: "/room-locations"
    });
    const [open, setOpen] = useState(false);

    const columns = [
        { id: "id", label: "ID", width: "15%", sorting: true },
        { id: "name", label: "Name", width: "20%", sorting: true },
        { id: "region_state", label: "Region & State", width: "20%", sorting: true },
        { id: "township", label: "Township", width: "20%", sorting: true },
        { id: "status", label: "Status", width: "20%", sorting: true },
        { id: "Action" },
    ];

    const onClose = () => {
        setOpen(!open);
    };

    return (
        <>
            <Box display="flex" alignItems="center" marginTop={2}>
                <Typography flexGrow={1} fontWeight='bold'>Room Locations</Typography>
                <Button
                    onClick={onClose}
                    variant="contained"
                    // color="inherit"
                    startIcon={<Iconify icon="mingcute:add-line" />}
                >
                    New Room Location
                </Button>
            </Box>

            <NewRoomLocation open={open} onClose={onClose} region_states={region_states} townships={townships} />

            <Datatable
                columns={columns}
                data={
                    roomLocations.data && roomLocations.data.length > 0 ? (
                        roomLocations.data.map((item, index) => (
                            <RoomLocationDataRows key={item.id} id={(roomLocations.current_page - 1) * roomLocations.per_page + (index + 1)} roomLocationData={item} townships={townships}  region_states={region_states}/>
                        ))
                    ) : (
                        <Nodata searchQuery={filterName} />
                    )
                }
                refreshPath="/room-locations"
                total={roomLocations.total}
                page={roomLocations.current_page - 1}
                rowsPerPage={roomLocations.per_page}
                onPageChange={(event, newPage) => handlePageChange(event, newPage, roomLocations.per_page)}
                onRowsPerPageChange={(event) => handlePerPageChange(event, roomLocations.current_page)}
                onSort={handleSort}
                orderBy={orderBy}
                order={order}
                filterName={filterName}
                onFilterNameChange={handleFilterNameChange}
            />
        </>
    );
};

export default RoomLocationList;
