import { FilterType, PaginateType } from "./ReuseType";

export type MeetingAttendanceType = {
    id: number;
    status: number;
    updated_by_id?: number;
    pic_id?: number;
    pic: EmployeeType;
    updated_by: EmployeeType;
    attendance_participants?: {
        employee_id: number;
        status: number;
    }[];
    meeting_invitation: {
        title: string;
        meeting_date: number;
        from: number;
        to: number;
        host_department: EmployeeType;
        room_location: EmployeeType;
        participants: EmployeeType[];
    };
};

export type MeetingAttendanceListPropsType = FilterType & {
    attendances: PaginateType & {
        data: MeetingAttendanceType[];
    };
};

export type MeetingAttendancePropsType = {
    attendance: MeetingAttendanceType;
    id?: number;
};

export type MeetingAttendanceDataType = {
    id?: number;
    attendance_participants?: {
        employee_id: number;
        status: number;
    }[];
    pic_id?: number;
    status: number;
};

type EmployeeType = {
    id: number;
    name: string;
};
