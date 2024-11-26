import { useState } from "react";
import Datatable from "@/Components/table/Datatable";
import { Box, Button, Typography } from "@mui/material";
import { Iconify } from "@/Components/iconify";
import Nodata from "../../../Components/table/Nodata";
import { useTable } from "@/Hooks/use-table";
import { MeetingAttendanceListPropsType } from "@/PageType/AttendanceType";
import MeetingAttendanceDataRows from "./components/meeting-attendance-data-rows";
// import NewRoomLocation from "./components/NewRoomLocation";

const MeetingAttendanceList = ({ direction, sort, filter, attendances }: MeetingAttendanceListPropsType) => {
    const { order, orderBy, filterName, handleSort, handleFilterNameChange, handlePageChange, handlePerPageChange } = useTable({
        order: direction,
        orderBy: sort,
        filterName: filter,
        routePath: "/meeting-attendances"
    });

    const columns = [
        { id: "id", label: "ID", width: "10%", sorting: true },
        { id: "title", label: "Title", width: "20%", sorting: false },
        { id: "host_department", label: "Host Department", width: "20%", sorting: false },
        { id: "room_location", label: "Room Location", width: "20%", sorting: false },
        { id: "meeting_date", label: "Date", width: "20%", sorting: false },
        { id: "status", label: "Status", width: "10%", sorting: true },
        { id: "Action" },
    ];

    return (
        <>
            <Box display="flex" alignItems="center" marginTop={2}>
                <Typography flexGrow={1} fontWeight='bold'>Meeting Attendances</Typography>
            </Box>

            <Datatable
                columns={columns}
                data={
                    attendances.data && attendances.data.length > 0 ? (
                        attendances.data.map((item, index) => (
                            <MeetingAttendanceDataRows key={item.id} id={(attendances.current_page - 1) * attendances.per_page + (index + 1)} attendance={item} />
                        ))
                    ) : (
                        <Nodata searchQuery={filterName} />
                    )
                }
                refreshPath="/meeting-attendances"
                total={attendances.total}
                page={attendances.current_page - 1}
                rowsPerPage={attendances.per_page}
                onPageChange={(event, newPage) => handlePageChange(event, newPage, attendances.per_page)}
                onRowsPerPageChange={(event) => handlePerPageChange(event, attendances.current_page)}
                onSort={handleSort}
                orderBy={orderBy}
                order={order}
                filterName={filterName}
                onFilterNameChange={handleFilterNameChange}
            />
        </>
    );
};

export default MeetingAttendanceList;
