import { useState } from "react";
import Datatable from "@/Components/table/Datatable";
import { Box, Button, Typography } from "@mui/material";
import { Iconify } from "@/Components/iconify";
import Nodata from "../../../Components/table/Nodata";
import { useTable } from "@/Hooks/use-table";
import { MeetingMinuteListPropsType } from "@/PageType";
import MeetingMinuteDataRows from "./components/meeting-minute-data-rows";
// import NewRoomLocation from "./components/NewRoomLocation";

const MeetingMinuteList = ({ direction, sort, filter, meeting_minutes }: MeetingMinuteListPropsType) => {
    const { order, orderBy, filterName, handleSort, handleFilterNameChange, handlePageChange, handlePerPageChange } = useTable({
        order: direction,
        orderBy: sort,
        filterName: filter,
        routePath: "/meeting-minutes"
    });

    const columns = [
        { id: "id", label: "ID", width: "10%", sorting: true },
        { id: "title", label: "Title", width: "20%", sorting: false },
        { id: "host_department", label: "Host Department", width: "20%", sorting: false },
        { id: "room_location", label: "Room Location", width: "20%", sorting: false },
        { id: "meeting_date", label: "Date", width: "20%", sorting: false },
        { id: "pic", label: "PIC", width: "20%", sorting: false },
        { id: "status", label: "Status", width: "10%", sorting: true },
        { id: "Action" },
    ];

    return (
        <>
            <Box display="flex" alignItems="center" marginTop={2}>
                <Typography flexGrow={1} fontWeight='bold'>Meeting Minutes</Typography>
            </Box>

            <Datatable
                columns={columns}
                data={
                    meeting_minutes.data && meeting_minutes.data.length > 0 ? (
                        meeting_minutes.data.map((item, index) => (
                            <MeetingMinuteDataRows key={item.id} id={(meeting_minutes.current_page - 1) * meeting_minutes.per_page + (index + 1)} meeting_minute={item} />
                        ))
                    ) : (
                        <Nodata searchQuery={filterName} />
                    )
                }
                refreshPath="/meeting-minutes"
                total={meeting_minutes.total}
                page={meeting_minutes.current_page - 1}
                rowsPerPage={meeting_minutes.per_page}
                onPageChange={(event, newPage) => handlePageChange(event, newPage, meeting_minutes.per_page)}
                onRowsPerPageChange={(event) => handlePerPageChange(event, meeting_minutes.current_page)}
                onSort={handleSort}
                orderBy={orderBy}
                order={order}
                filterName={filterName}
                onFilterNameChange={handleFilterNameChange}
            />
        </>
    );
};

export default MeetingMinuteList;
