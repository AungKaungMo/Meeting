import { useEffect, FormEventHandler } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { useForm } from "@inertiajs/react";


const Login = () => {
    const { data, setData, post, processing, errors, reset } = useForm({
        company_id: "",
        password: "",
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("company.login"));
    };

    return (
        <GuestLayout>
            <div className="mb-5 font-bold text-2xl">LOGO</div>

            <form onSubmit={submit} className="w-8/12">
                <div>
                    <InputLabel htmlFor="company_id" value="Company ID" />

                    <TextInput
                        id="company_id"
                        type="text"
                        name="company_id"
                        value={data.company_id}
                        className="mt-1 block w-full"
                        autoComplete="company-id"
                        onChange={(e) => setData("company_id", e.target.value)}
                    />

                    <InputError message={errors.company_id} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData("password", e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-center mt-4">
                    <PrimaryButton
                        className="!p-3 !px-12 !text-md !font-bold"
                        disabled={processing}
                    >
                        Log in
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}

export default Login