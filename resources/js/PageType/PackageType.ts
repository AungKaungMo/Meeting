import { FilterType, PaginateType } from "./ReuseType";

type PackageType = {
    id: number;
    name: string;
    limit_employee: number;
    max_employee: number;
    status: number;
    description: any;
};

export type PackageListPropsType = FilterType & {
    packages: PaginateType & {
        data: PackageType[];
    };
};

export type PackagePropsType = {
    packageData: PackageType;
    id: number;
};

export type PackageDataType = {
    name: string;
    limit_employee: number;
    max_employee: number | null;
    status: number;
    description: any;
};
