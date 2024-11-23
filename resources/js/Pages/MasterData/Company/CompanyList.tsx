import { useState } from "react";
import Datatable from "@/Components/table/Datatable";
import { Box, Button, Typography } from "@mui/material";
import { Iconify } from "@/Components/iconify";
import Nodata from "../../../Components/table/Nodata";
import { useTable } from "@/Hooks/use-table";
import { CompanyListPropsType } from "@/PageType";
import CompanyDataRows from "./components/company-data-rows";
import NewCompany from "./components/NewCompany";

const CompanyList = ({ companies, direction, sort, filter, packages }: CompanyListPropsType) => {
    const { order, orderBy, filterName, handleSort, handleFilterNameChange, handlePageChange, handlePerPageChange } = useTable({
        order: direction,
        orderBy: sort,
        filterName: filter,
        routePath: "/companies"
    });
    const [open, setOpen] = useState(false);

    const columns = [
        { id: "company_id", label: "ID", width: "15%" },
        { id: "name", label: "Name", width: "15%" },
        { id: "short_name", label: "Short Name", width: "15%" },
        { id: "package", label: "Package", width: "15%" },
        { id: "expire_date", label: "Expire Date", width: "15%" },
        { id: "status", label: "Status", width: "10%" },
        { id: "Action" },
    ];

    const onClose = () => {
        setOpen(!open);
    };

    return (
        <>
            <Box display="flex" alignItems="center" marginTop={2}>
                <Typography flexGrow={1} fontWeight='bold'>Companies</Typography>
                <Button
                    onClick={onClose}
                    variant="contained"
                    color="inherit"
                    startIcon={<Iconify icon="mingcute:add-line" />}
                >
                    New Company
                </Button>
            </Box>

            <NewCompany open={open} onClose={onClose} packages={packages} />

            <Datatable
                columns={columns}
                data={
                    companies.data && companies.data.length > 0 ? (
                        companies.data.map((item, index) => (
                            <CompanyDataRows packages={packages} key={item.id} companyData={item} />
                        ))
                    ) : (
                        <Nodata searchQuery={filterName} />
                    )
                }
                refreshPath="/companies"
                total={companies.total}
                page={companies.current_page - 1}
                rowsPerPage={companies.per_page}
                onPageChange={(event, newPage) => handlePageChange(event, newPage, companies.per_page)}
                onRowsPerPageChange={(event) => handlePerPageChange(event, companies.current_page)}
                onSort={handleSort}
                orderBy={orderBy}
                order={order}
                filterName={filterName}
                onFilterNameChange={handleFilterNameChange}
            />
        </>
    );
};

export default CompanyList;
