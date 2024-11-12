import { useState, useRef } from "react";
import { router } from "@inertiajs/react";

export const useTable = (initialState: {
    order: "asc" | "desc";
    orderBy: string;
    filterName: string | null;
    routePath: string;
}) => {
    const [order, setOrder] = useState<"asc" | "desc">(initialState.order);
    const [orderBy, setOrderBy] = useState<string>(initialState.orderBy);
    const [filterName, setFilterName] = useState<string>(
        initialState.filterName || ""
    );

    const debounceRef = useRef<any>(null);

    const debounceFilterNameChange = (value: string) => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            router.get(initialState.routePath, {
                filterName: value,
                sort: orderBy,
                direction: order,
            });
        }, 700);
    };

    const handleSort = (columnId: string) => {
        const isAsc = orderBy === columnId && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(columnId);
        router.get(initialState.routePath, {
            filterName,
            sort: columnId,
            direction: isAsc ? "desc" : "asc",
        });
    };

    const handleFilterNameChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = event.target.value;
        setFilterName(value || "");
        debounceFilterNameChange(value);
    };

    const handlePageChange = (event: any, newPage: number, perPage: number) => {
        router.get(initialState.routePath, {
            page: newPage + 1,
            per_page: perPage,
            filterName,
            sort: orderBy,
            direction: order,
        });
    };

    const handlePerPageChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        page: number
    ) => {
        router.get(initialState.routePath, {
            page: page,
            per_page: event.target.value,
            filterName,
            sort: orderBy,
            direction: order,
        });
    };

    return {
        order,
        orderBy,
        filterName,
        setOrder,
        setOrderBy,
        setFilterName,
        handleSort,
        handleFilterNameChange,
        handlePageChange,
        handlePerPageChange,
    };
};
