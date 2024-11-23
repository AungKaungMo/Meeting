import { useState } from "react";
import Datatable from "@/Components/table/Datatable";
import { Box, Button, Typography } from "@mui/material";
import { Iconify } from "@/Components/iconify";
import Nodata from "../../../Components/table/Nodata";
import { useTable } from "@/Hooks/use-table";
import { MeetingInvitationListPropsType } from "@/PageType";
import MeetingInvitationDataRows from "./components/meeting-invitation-data-rows";
import NewMeetingInvitation from "./components/NewMeetingInvitation";
// import NewRoomLocation from "./components/NewRoomLocation";

const MeetingInvitationList = ({ meetings, direction, sort, filter, roomLocations, employees, departments }: MeetingInvitationListPropsType) => {
    const { order, orderBy, filterName, handleSort, handleFilterNameChange, handlePageChange, handlePerPageChange } = useTable({
        order: direction,
        orderBy: sort,
        filterName: filter,
        routePath: "/meeting-invitations"
    });
    const [open, setOpen] = useState(false);

    const columns = [
        { id: "id", label: "ID", width: "5%", sorting: true },
        { id: "title", label: "Title", width: "10%", sorting: true },
        { id: "agenda", label: "Agenda", width: "10%", sorting: true },
        { id: "host_department", label: "Host Department", width: "15%", sorting: false },
        { id: "room_location", label: "Room Location", width: "15%", sorting: false },
        { id: "meeting_date", label: "Date", width: "10%", sorting: true },
        { id: "from", label: "From", width: "10%", sorting: true },
        { id: "to", label: "To", width: "10%", sorting: true },
        { id: "status", label: "Status", width: "10%", sorting: true },
        { id: "Action" },
    ];

    const onClose = () => {
        setOpen(!open);
    };

    return (
        <>
            <Box display="flex" alignItems="center" marginTop={2}>
                <Typography flexGrow={1} fontWeight='bold'>Meeting Invitations</Typography>
                <Button
                    onClick={onClose}
                    variant="contained"
                    // color="inherit"
                    startIcon={<Iconify icon="mingcute:add-line" />}
                >
                    New Invitation
                </Button>
            </Box>

            <NewMeetingInvitation open={open} onClose={onClose} roomLocations={roomLocations} departments={departments} employees={employees} />

            <Datatable
                columns={columns}
                data={
                    meetings.data && meetings.data.length > 0 ? (
                        meetings.data.map((item, index) => (
                            <MeetingInvitationDataRows key={item.id} id={(meetings.current_page - 1) * meetings.per_page + (index + 1)} meetings={item} roomLocations={roomLocations} employees={employees} departments={departments} />
                        ))
                    ) : (
                        <Nodata searchQuery={filterName} />
                    )
                }
                refreshPath="/meeting-invitations"
                total={meetings.total}
                page={meetings.current_page - 1}
                rowsPerPage={meetings.per_page}
                onPageChange={(event, newPage) => handlePageChange(event, newPage, meetings.per_page)}
                onRowsPerPageChange={(event) => handlePerPageChange(event, meetings.current_page)}
                onSort={handleSort}
                orderBy={orderBy}
                order={order}
                filterName={filterName}
                onFilterNameChange={handleFilterNameChange}
            />
        </>
    );
};

export default MeetingInvitationList;
