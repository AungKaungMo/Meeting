import { usePage } from "@inertiajs/react"
import { DashboardLayout } from "./dashboard/layout"

type User = {
    id: number;
    name: string;
    email: string;
};

type PageProps = {
    auth?: {
        user?: User;
    };
};

const LayoutProvider = ({page} : {page: any}) => {
  const { auth } = usePage<PageProps>().props;

  return auth && auth.user ? (
    <DashboardLayout>
        {page}
    </DashboardLayout>
  ) : <>{page}</>
}

export default LayoutProvider