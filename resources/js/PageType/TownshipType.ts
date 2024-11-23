import { FilterType, PaginateType } from "./ReuseType";

export type TownshipType = {
    id: number;
    region_state_id: number;
    region_state: {
        id: number;
        name: string;
    };
    name: string;
    status?: number;
};

export type TownshipListPropsType = FilterType & {
    townships: PaginateType & {
        data: TownshipType[];
    };
    region_states: TownshipRegionStateListType[];
};

export type TownshipPropsType = {
    townshipData: TownshipType;
    id?: number;
    region_states: TownshipRegionStateListType[];
};

export type TownshipDataType = {
    region_state_id?: number;
    name: string;
    status?: number;
};

export type TownshipRegionStateListType = {
    id: number;
    name: string;
};
