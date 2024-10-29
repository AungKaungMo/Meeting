import type { Theme, SxProps, Breakpoint } from "@mui/material/styles";

import { useState } from "react";

import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import { useTheme } from "@mui/material/styles";
import { _langs } from "../data/user-data";
// import { _langs, _notifications } from 'src/_mock';

import { Iconify } from "@/Components/iconify";

// import { Main } from './main';
import { layoutClasses } from "../classes";
import { NavDesktop, NavMobile } from "./nav";
import { navData } from "../data/config-nav";
// import { Searchbar } from '../components/searchbar';
import { _workspaces } from "../data/config-workspace";
import { MenuButton } from "../components/menu-button";
import { LayoutSection } from "../core/layout-section";
import { HeaderSection } from "../core/header-section";
import { AccountPopover } from "../components/account-popover";
import { LanguagePopover } from "../components/language-popover";
import { NotificationsPopover } from "../components/notifications-popover";
import { DashboardContent } from "./content";

// ----------------------------------------------------------------------

export type DashboardLayoutProps = {
    sx?: SxProps<Theme>;
    children: React.ReactNode;
    header?: {
        sx?: SxProps<Theme>;
    };
};

export function DashboardLayout({
    sx,
    children,
    header,
}: DashboardLayoutProps) {
    const theme = useTheme();
    const [navOpen, setNavOpen] = useState(false);
    const layoutQuery: Breakpoint = "lg";

    return (
        <LayoutSection
            /** **************************************
             * Header
             *************************************** */
            headerSection={
                <HeaderSection
                    layoutQuery={layoutQuery}
                    slotProps={{
                        container: {
                            maxWidth: false,
                            sx: { px: { [layoutQuery]: 5 } },
                        },
                    }}
                    sx={header?.sx}
                    slots={{
                        topArea: (
                            <Alert
                                severity="info"
                                sx={{ display: "none", borderRadius: 0 }}
                            >
                                This is an info Alert.
                            </Alert>
                        ),
                        leftArea: (
                            <>
                                <MenuButton
                                    onClick={() => setNavOpen(true)}
                                    sx={{
                                        ml: -1,
                                        [theme.breakpoints.up(layoutQuery)]: {
                                            display: "none",
                                        },
                                    }}
                                />
                                <NavMobile
                                    data={navData}
                                    open={navOpen}
                                    onClose={() => setNavOpen(false)}
                                    workspaces={_workspaces}
                                />
                            </>
                        ),
                        rightArea: (
                            <Box gap={1} display="flex" alignItems="center">
                                {/* <Searchbar /> */}
                                <LanguagePopover data={_langs} />
                                <NotificationsPopover />
                                <AccountPopover
                                    data={[
                                        {
                                            label: "Home",
                                            href: "/",
                                            icon: (
                                                <Iconify
                                                    width={22}
                                                    icon="solar:home-angle-bold-duotone"
                                                />
                                            ),
                                        },
                                        {
                                            label: "Profile",
                                            href: "#",
                                            icon: (
                                                <Iconify
                                                    width={22}
                                                    icon="solar:shield-keyhole-bold-duotone"
                                                />
                                            ),
                                        },
                                        {
                                            label: "Settings",
                                            href: "#",
                                            icon: (
                                                <Iconify
                                                    width={22}
                                                    icon="solar:settings-bold-duotone"
                                                />
                                            ),
                                        },
                                    ]}
                                />
                            </Box>
                        ),
                    }}
                />
            }
            /** **************************************
             * Sidebar
             *************************************** */
            sidebarSection={
                <NavDesktop
                    data={navData}
                    layoutQuery={layoutQuery}
                    workspaces={_workspaces}
                />
            }

            cssVars={{
              '--layout-nav-vertical-width': '300px',
            }}
            sx={{
              ...sx,
            }}
        >
            <DashboardContent>{children}</DashboardContent>
        </LayoutSection>
    );
}
