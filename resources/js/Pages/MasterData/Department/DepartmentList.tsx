import { useState } from "react";
import Datatable from "@/Components/table/Datatable";
import { Box, Button, Typography } from "@mui/material";
import { Iconify } from "@/Components/iconify";
import Nodata from "../../../Components/table/Nodata";
import { useTable } from "@/Hooks/use-table";
import { DepartmentListPropsType } from "@/PageType";
import DepartmentDataRows from "./components/department-data-rows";
import NewDepartment from "./components/NewDepartment";

const DepartmentList = ({ departments, direction, sort, filter }: DepartmentListPropsType) => {
    const { order, orderBy, filterName, handleSort, handleFilterNameChange, handlePageChange, handlePerPageChange } = useTable({
        order: direction,
        orderBy: sort,
        filterName: filter,
        routePath: "/departments"
    });
    const [open, setOpen] = useState(false);

    const columns = [
        { id: "id", label: "ID", width: "10%", sorting: true },
        { id: "code", label: "Code", width: "10%", sorting: true },
        { id: "name", label: "Name", width: "20%", sorting: true },
        { id: "short_name", label: "Short Name", width: "20%", sorting: true },
        { id: "company", label: "Company", width: "20%", sorting: false },
        { id: "status", label: "Status", width: "20%", sorting: true },
        { id: "Action" },
    ];

    const example_excel_formats = [
        {
            id: 1, name: 'Corporate Information Division', short_name: 'CID'
        },
        {
            id: 2, name: 'Human Origanization Line', short_name: 'HOL'
        },
        {
            id: 3, name: 'Personal Technology Set', short_name: 'PTS'
        },
    ]

    const onClose = () => {
        setOpen(!open);
    };

    return (
        <>
            <Box display="flex" alignItems="center" marginTop={2}>
                <Typography flexGrow={1} fontWeight='bold'>Departments</Typography>
                <Button
                    onClick={onClose}
                    variant="contained"
                    // color="inherit"
                    startIcon={<Iconify icon="mingcute:add-line" />}
                >
                    New Department
                </Button>
            </Box>

            <NewDepartment open={open} onClose={onClose} />

            <Datatable
                columns={columns}
                excelImport
                excel_url="/departments/import"
                example_excel_formats={example_excel_formats}
                data={
                    departments.data && departments.data.length > 0 ? (
                        departments.data.map((item, index) => (
                            <DepartmentDataRows key={item.id} id={(departments.current_page - 1) * departments.per_page + (index + 1)} deptData={item} />
                        ))
                    ) : (
                        <Nodata searchQuery={filterName} />
                    )
                }
                refreshPath="/departments"
                total={departments.total}
                page={departments.current_page - 1}
                rowsPerPage={departments.per_page}
                onPageChange={(event, newPage) => handlePageChange(event, newPage, departments.per_page)}
                onRowsPerPageChange={(event) => handlePerPageChange(event, departments.current_page)}
                onSort={handleSort}
                orderBy={orderBy}
                order={order}
                filterName={filterName}
                onFilterNameChange={handleFilterNameChange}
            />
        </>
    );
};

export default DepartmentList;
