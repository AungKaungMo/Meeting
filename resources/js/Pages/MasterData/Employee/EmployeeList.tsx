import { useState } from "react";
import Datatable from "@/Components/table/Datatable";
import { Box, Button, Typography } from "@mui/material";
import { Iconify } from "@/Components/iconify";
import Nodata from "../../../Components/table/Nodata";
import { useTable } from "@/Hooks/use-table";
import { EmployeeListPropsType } from "@/PageType";
import EmployeeDataRows from "./components/employee-data-rows";
import NewEmployee from "./components/NewEmployee";
import { columns, example_excel_formats, example_excel_header_formats, notes } from "./data";

const EmployeeList = ({ employees, departments, direction, sort, filter }: EmployeeListPropsType) => {
    const { order, orderBy, filterName, handleSort, handleFilterNameChange, handlePageChange, handlePerPageChange } = useTable({
        order: direction,
        orderBy: sort,
        filterName: filter,
        routePath: "/employees"
    });
    const [open, setOpen] = useState(false);

    const onClose = () => {
        setOpen(!open);
    };

    return (
        <>
            <Box display="flex" alignItems="center" marginTop={2}>
                <Typography flexGrow={1} fontWeight='bold'>Employees</Typography>
                <Button
                    onClick={onClose}
                    variant="contained"
                    // color="inherit"
                    startIcon={<Iconify icon="mingcute:add-line" />}
                >
                    New Employee
                </Button>
            </Box>

            <NewEmployee departments={departments} open={open} onClose={onClose} />

            <Datatable
                columns={columns}
                excelImport
                excel_url="/employees/import"
                example_excel_header_formats={example_excel_header_formats}
                notes={notes}
                example_excel_formats={example_excel_formats}
                data={
                    employees.data && employees.data.length > 0 ? (
                        employees.data.map((item, index) => (
                            <EmployeeDataRows key={item.id} departments={departments} id={(employees.current_page - 1) * employees.per_page + (index + 1)} employeeData={item} />
                        ))
                    ) : (
                        <Nodata searchQuery={filterName} />
                    )
                }
                refreshPath="/employees"
                total={employees.total}
                page={employees.current_page - 1}
                rowsPerPage={employees.per_page}
                onPageChange={(event, newPage) => handlePageChange(event, newPage, employees.per_page)}
                onRowsPerPageChange={(event) => handlePerPageChange(event, employees.current_page)}
                onSort={handleSort}
                orderBy={orderBy}
                order={order}
                filterName={filterName}
                onFilterNameChange={handleFilterNameChange}
            />
        </>
    );
};

export default EmployeeList;
