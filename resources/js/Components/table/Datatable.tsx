import {
    Box,
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
    refreshPath: string
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
}: ReusableTableProps) => {
    

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
                    <Tooltip title="Refresh">
                        <IconButton onClick={() => router.get(refreshPath)}>
                            <Iconify icon="ic:baseline-refresh" />
                        </IconButton>
                    </Tooltip>
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
                                        <TableSortLabel
                                            active={orderBy === column.id}
                                            direction={
                                                orderBy === column.id
                                                    ? order
                                                    : "asc"
                                            }
                                            onClick={() => onSort(column.id)}
                                        >
                                            {column.label}
                                            
                                        </TableSortLabel>
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
        </>
    );
};

export default Datatable;
