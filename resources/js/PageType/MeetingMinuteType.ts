import { FilterType, PaginateType } from "./ReuseType";

export type MeetingMinutetype = {
    id: number;
    detail?: string;
    status: number;
    title: string;
    host_department: string;
    room_location: string;
    pic: string;
    date: number;
    from: number;
    to: number;
};

export type MeetingMinuteListPropsType = FilterType & {
    meeting_minutes: PaginateType & {
        data: MeetingMinutetype[];
    };
};

export type MeetingMinutePropsType = {
    meeting_minute: MeetingMinutetype;
    id?: number;
};

export type MeetingMinuteDataType = {
    meeting_minute: {
        id: number;
        detail?: string;
        status: number;
    };
};
