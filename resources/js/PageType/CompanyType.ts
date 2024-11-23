import { FilterType, PaginateType } from "./ReuseType";

type CompanyType = {
    id: number;
    name: string;
    short_name: string;
    profile_image_url: File;
    package_id: number;
    expire_date: number;
    status: number;
    company_id: string;
    package: {
        id: number;
        name: string;
    };
};

export type CompanyListPropsType = FilterType & {
    companies: PaginateType & {
        data: CompanyType[];
    };
    packages: CompanyPackageListType[];
};

export type CompanyPropsType = {
    companyData: CompanyType;
    id?: number;
    packages: CompanyPackageListType[];
};

export type CompanyDataType = {
    name: string;
    short_name: string;
    profile_image_url: File | null;
    package_id?: number;
    expire_date: number;
    status?: number;
};

export type CompanyPackageListType = {
    id: number;
    name: string;
};
