import React, { useState, useCallback } from "react";
import { Chip, IconButton, TableCell, TableRow } from "@mui/material";
import { Iconify } from "@/Components/iconify";
import { MeetingMinutePropsType } from "@/PageType";
import dayjs from "dayjs";
import { router } from "@inertiajs/react";

const attendanceRows: React.FC<MeetingMinutePropsType> = ({
    meeting_minute,
    id,
}) => {
    return (
        <>
            <TableRow hover tabIndex={1}>
                <TableCell>{id}.</TableCell>
                <TableCell>{meeting_minute.title}</TableCell>
                <TableCell>{meeting_minute.host_department}</TableCell>
                <TableCell>{meeting_minute.room_location}</TableCell>
                <TableCell>
                    {dayjs.unix(meeting_minute.date)?.format("YYYY-MM-DD") +
                        " ( " +
                        dayjs.unix(meeting_minute.from)?.format("HH:mm A") +
                        " - " +
                        dayjs.unix(meeting_minute.to)?.format("HH:mm A") +
                        " )"}
                </TableCell>
                <TableCell>{meeting_minute.pic}</TableCell>
                <TableCell>
                    <Chip
                        label={
                            meeting_minute.status === 0
                                ? "Waiting"
                                : meeting_minute.status === 2
                                ? "Drafted"
                                : "Confirmed"
                        }
                        color={
                            meeting_minute.status === 0
                                ? "info"
                                : meeting_minute.status === 2
                                ? "default"
                                : "success"
                        }
                    />
                </TableCell>

                <TableCell align="right">
                    <IconButton onClick={() => router.get('meeting-minutes/' + meeting_minute.id + '/edit')}>
                        <Iconify icon="hugeicons:quill-write-02" />
                    </IconButton>
                </TableCell>
            </TableRow>
        </>
    );
};

export default attendanceRows;
