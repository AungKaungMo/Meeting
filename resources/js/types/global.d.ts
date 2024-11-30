import { AxiosInstance } from "axios";
import { route as ziggyRoute, RouteName } from "ziggy-js";

declare global {
    interface Window {
        axios: AxiosInstance;
    }

    var route: (name: RouteName, params?: any, absolute?: boolean) => string; // Adjusted type signature
}
