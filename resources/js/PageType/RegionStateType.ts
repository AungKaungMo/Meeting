import { FilterType, PaginateType } from "./ReuseType";

export type RegionAndStateType = {
    id: number;
    name: string;
    status?: number;
};

export type RegionAndStateListPropsType = FilterType & {
    region_states: PaginateType & {
        data: RegionAndStateType[];
    };
};

export type RegionAndStatePropsType = {
    regionStateData: RegionAndStateType;
    id?: number;
};

export type RegionAndStateDataType = {
    name: string;
    status?: number;
};
