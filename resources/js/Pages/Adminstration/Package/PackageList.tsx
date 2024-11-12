import { useState } from "react";
import { router } from "@inertiajs/react";
import Datatable from "@/Components/table/Datatable";
import PackageDataRows from "./components/package-data-rows";
import { Box, Button, Typography } from "@mui/material";
import { Iconify } from "@/Components/iconify";
import Nodata from "../../../Components/table/Nodata";
import { useTable } from "@/Hooks/use-table";
import { PackageListPropsType } from "@/PageType";
import NewPackage from "./components/NewPackage";


const PackageList = ({ packages, direction, sort, filter }: PackageListPropsType) => {
    const { order, orderBy, filterName, handleSort, handleFilterNameChange, handlePageChange, handlePerPageChange } = useTable({
        order: direction,
        orderBy: sort,
        filterName: filter,
        routePath: "/packages"
    });
    const [open, setOpen] = useState(false);

    const columns = [
        { id: "id", label: "ID", width: "10%" },
        { id: "name", label: "Name", width: "30%" },
        { id: "limit_employee", label: "Limit Employee", width: "15%" },
        { id: "max_employee", label: "Max Employee", width: "30%" },
        { id: "status", label: "Status", width: "10%" },
        { id: "Action" },
    ];

    const onClose = () => {
        setOpen(!open);
    };

    return (
        <>
            <Box display="flex" alignItems="center" marginTop={2}>
                <Typography flexGrow={1} fontWeight='bold'>Packages</Typography>
                <Button
                    onClick={onClose}
                    variant="contained"
                    color="inherit"
                    startIcon={<Iconify icon="mingcute:add-line" />}
                >
                    New Package
                </Button>
            </Box>

            <NewPackage open={open} onClose={onClose} />

            <Datatable
                columns={columns}
                data={
                    packages.data && packages.data.length > 0 ? (
                        packages.data.map((item, index) => (
                            <PackageDataRows key={item.id} id={(packages.current_page - 1) * packages.per_page + (index + 1)} packageData={item} />
                        ))
                    ) : (
                        <Nodata searchQuery={filterName} />
                    )
                }
                refreshPath="/packages"
                total={packages.total}
                page={packages.current_page - 1}
                rowsPerPage={packages.per_page}
                onPageChange={(event, newPage) => handlePageChange(event, newPage, packages.per_page)}
                onRowsPerPageChange={(event) => handlePerPageChange(event, packages.current_page)}
                onSort={handleSort}
                orderBy={orderBy}
                order={order}
                filterName={filterName}
                onFilterNameChange={handleFilterNameChange}
            />
        </>
    );
};

export default PackageList;
