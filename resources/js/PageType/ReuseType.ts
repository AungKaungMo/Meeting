export type FilterType = {
    sort: string;
    direction: "asc" | "desc";
    filter: string;
};

export type PaginateType = {
    total: number;
    per_page: number;
    current_page: number;
};
