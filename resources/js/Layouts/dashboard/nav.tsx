import { useTheme, Theme, SxProps, Breakpoint } from "@mui/material/styles";
import { useEffect } from "react";

import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Drawer, { drawerClasses } from "@mui/material/Drawer";
import { WorkspacesPopover } from "../components/workspaces-popover";
import type { WorkspacesPopoverProps } from "../components/workspaces-popover";
import { varAlpha } from "@/theme/styles";
import { Link } from "@inertiajs/react";
import { List, ListSubheader } from "@mui/material";

export type NavContentProps = {
    data: {
        title: string;
        data: {
            path: string;
            title: string;
            icon: React.ReactNode;
            info?: React.ReactNode;
        }[];
    }[];
    slots?: {
        topArea?: React.ReactNode;
        bottomArea?: React.ReactNode;
    };
    workspaces: WorkspacesPopoverProps["data"];
    sx?: SxProps<Theme>;
};

export function NavDesktop({
    sx,
    data,
    slots,
    workspaces,
    layoutQuery,
}: NavContentProps & { layoutQuery: Breakpoint }) {
    const theme = useTheme();

    return (
        <Box
            sx={{
                pt: 2.5,
                px: 2.5,
                top: 0,
                left: 0,
                height: 1,
                display: "none",
                position: "fixed",
                flexDirection: "column",
                bgcolor: "var(--layout-nav-bg)",
                zIndex: "var(--layout-nav-zIndex)",
                width: "var(--layout-nav-vertical-width)",
                borderRight: `1px solid var(--layout-nav-border-color, ${varAlpha(
                    theme.palette.grey["500Channel"],
                    0.12
                )})`,
                [theme.breakpoints.up(layoutQuery)]: {
                    display: "flex",
                },
                ...sx,
            }}
        >
            <NavContent data={data} slots={slots} workspaces={workspaces} />
        </Box>
    );
}

// ----------------------------------------------------------------------

export function NavMobile({
    sx,
    data,
    open,
    slots,
    onClose,
    workspaces,
}: NavContentProps & { open: boolean; onClose: () => void }) {
    // const pathname = usePathname();

    //     useEffect(() => {
    //       if (open) {
    //         onClose();
    //       }
    //       // eslint-disable-next-line react-hooks/exhaustive-deps
    //     }, [pathname]
    // );

    return (
        <Drawer
            open={open}
            onClose={onClose}
            sx={{
                [`& .${drawerClasses.paper}`]: {
                    pt: 2.5,
                    px: 2.5,
                    overflow: "unset",
                    bgcolor: "var(--layout-nav-bg)",
                    width: "var(--layout-nav-mobile-width)",
                    ...sx,
                },
            }}
        >
            <NavContent data={data} slots={slots} workspaces={workspaces} />
        </Drawer>
    );
}

// ----------------------------------------------------------------------

export function NavContent({ data, slots, workspaces, sx }: NavContentProps) {
    return (
        <>
            {/* <Logo /> */}
            <div>LOGO</div>

            {slots?.topArea}

            <WorkspacesPopover data={workspaces} sx={{ my: 2 }} />

            {/* <Scrollbar fillContent> */}
            <Box
                component="nav"
                display="flex"
                flex="1 1 auto"
                flexDirection="column"
                sx={sx}
            >
                <Box component="ul" display="flex" flexDirection="column">
                    {data.map((main, index) => (
                        <List
                            key={index}
                            subheader={
                                main.title && (
                                <ListSubheader
                                    component="div"
                                    sx={{
                                        fontWeight: 'bold'
                                    }}
                                    id={"nested-list-subheader" + index}
                                >
                                    {main.title}
                                </ListSubheader>
                                )
                            }
                        >
                            {main.data?.map((item, ind) => (
                                <ListItem
                                    disableGutters
                                    disablePadding
                                    key={ind}
                                >
                                    <ListItemButton
                                        disableGutters
                                        component={Link}
                                        href={item.path}
                                        sx={{
                                            pl: 2,
                                            mb: 0.3,
                                            py: 2,
                                            gap: 2,
                                            pr: 1.5,
                                            borderRadius: 0.75,
                                            typography: "body2",
                                            fontWeight: "fontWeightMedium",
                                            color: "var(--layout-nav-item-color)",
                                            minHeight:
                                                "var(--layout-nav-item-height)",
                                            ...(item.path == "/" && {
                                                fontWeight:
                                                    "fontWeightSemiBold",
                                                bgcolor:
                                                    "var(--layout-nav-item-active-bg)",
                                                color: "var(--layout-nav-item-active-color)",
                                                "&:hover": {
                                                    bgcolor:
                                                        "var(--layout-nav-item-hover-bg)",
                                                },
                                            }),
                                        }}
                                    >
                                        <Box
                                            component="span"
                                            sx={{ width: 24, height: 24 }}
                                        >
                                            {item.icon}
                                        </Box>

                                        <Box component="span" flexGrow={1}>
                                            {item.title}
                                        </Box>
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    ))}
                    {/* })} */}
                </Box>
            </Box>
            {/* </Scrollbar> */}

            {slots?.bottomArea}

            {/* <NavUpgrade /> */}
        </>
    );
}
