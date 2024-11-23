import { FilterType, PaginateType } from "./ReuseType";

export type DepartmentType = {
    id: number;
    name: string;
    short_name: string;
    company_id: string;
    code: string;
    company: {
        id: number;
        name: string;
    };
    status?: number;
};

export type DepartmentListPropsType = FilterType & {
    departments: PaginateType & {
        data: DepartmentType[];
    };
};

export type DepartmentPropsType = {
    deptData: DepartmentType;
    id?: number;
};

export type DepartmentDataType = {
    name: string;
    short_name: string;
    company_id?: number;
    status?: number;
};
