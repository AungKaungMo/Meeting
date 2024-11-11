import "./bootstrap";
import "../css/app.css";

import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { CustomThemeProvider } from "./theme/theme-provider";
import { ComponentType } from "react";
import LayoutProvider from "./Layouts/LayoutProvider";
import { SnackbarProvider } from "./Context/SnackbarProvider";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

type PageComponent = {
    default: ComponentType & {
        layout?: (page: JSX.Element) => JSX.Element;
    };
};

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: async (name) => {
        const pages = import.meta.glob("./Pages/**/*.tsx");
        const pagePath = `./Pages/${name}.tsx`;
        if (!pages[pagePath]) {
            const NotFound = await import("./Pages/NotFound");
            return { default: NotFound.default };
        }

        const page = (await resolvePageComponent(
            `./Pages/${name}.tsx`,
            pages
        )) as PageComponent;

        if (!page.default.layout) {
            page.default.layout = (page) => (
                <LayoutProvider page={page}></LayoutProvider>
            );
        }

        return page;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <SnackbarProvider>
                <CustomThemeProvider>
                    <App {...props} />
                </CustomThemeProvider>
            </SnackbarProvider>
        );
    },
    progress: {
        color: "#4B5563",
    },
});
