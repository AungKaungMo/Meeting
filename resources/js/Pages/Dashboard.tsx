import { PageProps } from '@/types';

export default function Dashboard({ auth }: PageProps) {

    return (
        <div>helo, {auth.user.name}</div>
    );
}
