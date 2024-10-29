import { useTheme } from '@mui/material';
import Container, { ContainerProps } from '@mui/material/Container';
import type { Breakpoint } from '@mui/material/styles';
import { layoutClasses } from '@/Layouts/classes';

type DashboardContentProps = ContainerProps & {
    disablePadding?: boolean;
  };
  
  export function DashboardContent({
    sx,
    children,
    disablePadding,
    ...other
  }: DashboardContentProps) {
    const theme = useTheme();
  
    const layoutQuery: Breakpoint = 'lg';
  
    return (
      <Container
        className={layoutClasses.content}
        sx={{
          display: 'flex',
          flex: '1 1 auto',
          flexDirection: 'column',
          pb: 'var(--layout-dashboard-content-pb)',
          [theme.breakpoints.up(layoutQuery)]: {
          },
          ...(disablePadding && {
            p: {
              xs: 0,
              sm: 0,
              md: 0,
              lg: 0,
              xl: 0,
            },
          }),
          ...sx,
        }}
        {...other}
      >
        {children}
      </Container>
    );
  }
  