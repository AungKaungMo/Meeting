import { FilterType, PaginateType } from "./ReuseType";

export type EmployeeType = {
    id: number;
    name: string;
    employee_id?: string;
    email?: string;
    phone?: string;
    role: string;
    department_id: number;
    department: {
        id: string;
        name: string;
    };
    status?: number;
};

export type EmployeeListPropsType = FilterType & {
    employees: PaginateType & {
        data: EmployeeType[];
    };
    departments: EmployeeDepartmentType[];
};

export type EmployeePropsType = {
    employeeData: EmployeeType;
    id?: number;
    departments: EmployeeDepartmentType[];
};

export type EmployeeDataType = {
    name: string;
    employee_id?: string;
    email?: string;
    phone?: string;
    role: string;
    department_id?: number;
    status?: number;
};

export type EmployeeDepartmentType = {
    id: string;
    name: string;
};
