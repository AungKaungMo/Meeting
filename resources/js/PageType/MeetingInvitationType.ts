import { FilterType, PaginateType } from "./ReuseType";

export type MeetingInvitationType = {
    id: number;
    title: string;
    agenda: string;
    host_department_id: number;
    room_location_id: number;
    meeting_date: number;
    from: number;
    to: number;
    host_by_id: number;
    created_by_id: number;
    remark?: string;
    status?: number;
    reason?: string;
    host_department: {
        id: number;
        name: string;
    };
    room_location: {
        id: number;
        name: string;
    };
    host_by: {
        id: number;
        name: string;
    };
    created_by: {
        id: number;
        name: string;
    };
    invited_departments?: {
        id: number;
        name: string;
    }[];
    participants: {
        id: number;
        name: string;
    }[];
};

export type MeetingInvitationListPropsType = FilterType & {
    meetings: PaginateType & {
        data: MeetingInvitationType[];
    };
    roomLocations: MeetingInvitationDropDataListType[];
    departments: MeetingInvitationDropDataListType[];
    employees: MeetingInvitationDropDataListType[];
};

export type MeetingInvitationPropsType = {
    meetings: MeetingInvitationType;
    id?: number;
    roomLocations: MeetingInvitationDropDataListType[];
    departments: MeetingInvitationDropDataListType[];
    employees: MeetingInvitationDropDataListType[];
};

export type MeetingInvitationDataType = {
    title: string;
    agenda: string;
    host_department_id?: number;
    room_location_id?: number;
    meeting_date?: number;
    from?: number;
    to?: number;
    host_by_id?: number;
    invited_departments?: number[];
    participants: number[];
    created_by_id?: number;
    remark?: string;
    status?: number;
    reason?: string;
};

export type MeetingInvitationDropDataListType = {
    id: number;
    name: string;
    department_id?: number;
    code?: string;
};
