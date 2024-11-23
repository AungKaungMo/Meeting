import {
    Box,
    Button,
    Card,
    IconButton,
    InputAdornment,
    OutlinedInput,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Toolbar,
    Tooltip,
} from "@mui/material";
import { Iconify } from "@/Components/iconify";
import TablePagination from "@mui/material/TablePagination";
import "./style.css";
import { router } from "@inertiajs/react";
import { useState } from "react";
import ExcelImportDialog from "../ExcelImportDialog";

type ReusableTableProps = {
    columns: Record<string, any>[];
    data: any;
    total: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number
    ) => void;
    onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSort: (columnId: string) => void;
    orderBy: string;
    order: "asc" | "desc";
    filterName: string;
    onFilterNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    refreshPath: string;
    excelImport?: boolean;
    excel_url?: string;
    example_excel_formats?: any,
    example_excel_header_formats?: any,
    notes?: any
};

const Datatable = ({
    columns,
    data,
    total,
    page,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
    onSort,
    orderBy,
    order,
    filterName,
    onFilterNameChange,
    refreshPath,
    excelImport = false,
    excel_url,
    example_excel_formats,
    example_excel_header_formats,
    notes
}: ReusableTableProps) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Card sx={{ marginTop: 4, marginBottom: 8 }}>
                <Toolbar
                    sx={{
                        height: 96,
                        display: "flex",
                        justifyContent: "space-between",
                        p: (theme) => theme.spacing(0, 1, 0, 3),
                    }}
                >
                    <OutlinedInput
                        value={filterName || ""}
                        onChange={onFilterNameChange}
                        placeholder="Search..."
                        startAdornment={
                            <InputAdornment position="start">
                                <Iconify
                                    icon="eva:search-fill"
                                    width={20}
                                    sx={{ color: "text.disabled" }}
                                />
                            </InputAdornment>
                        }
                        sx={{ maxWidth: 320 }}
                    />
                    <Box>
                        <Tooltip title="Refresh">
                            <IconButton onClick={() => router.get(refreshPath)}>
                                <Iconify icon="ic:baseline-refresh" />
                            </IconButton>
                        </Tooltip>

                        {excelImport && (
                            <Button
                                onClick={() => setOpen(true)}
                                sx={{ marginLeft: 2 }}
                                variant="contained"
                                startIcon={
                                    <Iconify icon="lets-icons:import-light" />
                                }
                            >
                                Excel Import
                            </Button>
                        )}
                    </Box>
                </Toolbar>

                <TableContainer>
                    <Table sx={{ width: "100%" }}>
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align="left"
                                        sortDirection={
                                            orderBy === column.id
                                                ? order
                                                : false
                                        }
                                        sx={{
                                            width: column.width,
                                            minWidth: column.minWidth,
                                        }}
                                    >
                                        {column.sorting ? (
                                            <TableSortLabel
                                                active={orderBy === column.id}
                                                direction={
                                                    orderBy === column.id
                                                        ? order
                                                        : "asc"
                                                }
                                                onClick={() =>
                                                    onSort(column.id)
                                                }
                                            >
                                                {column.label}
                                            </TableSortLabel>
                                        ) : (
                                            column.label
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>{data}</TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    component="div"
                    count={total}
                    page={page}
                    onPageChange={onPageChange}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={onRowsPerPageChange}
                    rowsPerPageOptions={[5, 10, 25]}
                />
            </Card>

            {excel_url && excelImport && example_excel_formats && example_excel_header_formats && (
                <ExcelImportDialog
                    example_excel_header_formats={example_excel_header_formats}
                    example_excel_formats={example_excel_formats}
                    notes={notes}
                    url={excel_url}
                    open={open}
                    handleOpen={() => setOpen(!open)}
                />
            )}
        </>
    );
};

export default Datatable;
