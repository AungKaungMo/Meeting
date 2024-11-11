import type { TableRowProps } from '@mui/material/TableRow';

import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

type TableNoDataProps = TableRowProps & {
  searchQuery: string | null;
};

const Nodata = ({ searchQuery, ...other }: TableNoDataProps) => {
  return (
    <TableRow {...other}>
      <TableCell align="center" colSpan={7}>
        <Box sx={{ py: 15, textAlign: 'center' }}>

          {searchQuery ? (
            <Typography variant="body2">
            No results found for &nbsp;
            <strong>&quot;{searchQuery}&quot;</strong>.
            <br /> Try checking for typos or using complete words.
          </Typography>
          ) : (
            <Typography variant="body2">
              No result found.
            </Typography>
          )}
        </Box>
      </TableCell>
    </TableRow>
  )
}

export default Nodata