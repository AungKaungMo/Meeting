import { FilterType, PaginateType } from "./ReuseType";

export type RoomLocationType = {
    id: number;
    region_state_id: number;
    township_id: number;
    region_state: {
        id: number;
        name: string;
    };
    township: {
        id: number;
        name: string;
    };
    name: string;
    status?: number;
};

export type RoomLocationListPropsType = FilterType & {
    roomLocations: PaginateType & {
        data: RoomLocationType[];
    };
    region_states: RoomLocationRegionStateListType[];
    townships: RoomLocationTownshipListType[];
};

export type RoomLocationPropsType = {
    roomLocationData: RoomLocationType;
    id?: number;
    region_states: RoomLocationRegionStateListType[];
    townships: RoomLocationTownshipListType[];
};

export type RoomLocationDataType = {
    region_state_id?: number;
    township_id?: number;
    name: string;
    status?: number;
};

export type RoomLocationRegionStateListType = {
    id: number;
    name: string;
};

export type RoomLocationTownshipListType = {
    id: number;
    name: string;
    region_state_id: number;
};
