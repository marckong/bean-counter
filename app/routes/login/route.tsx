import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { FormEvent } from "react";
import cookie from 'cookie';

export async function loader({ request }: LoaderFunctionArgs) {
    const cookies = cookie.parse(request.headers.get('cookie') || '');
    if (cookies['admin-token']) {
      throw redirect('/app');
    }
  
    return null;
}
  

export default function Route() {
    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const payload = {
            password: formData.get('password')
        }
        

        fetch("/api/auth", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            redirect: 'follow',
            body: JSON.stringify(payload),
        }).then(res => {
            if (res.ok) {
                window.location.href = res.url;
                return;
            }

            throw new Error('Authentication failed');
        }).catch(err => {
            console.log({err})
        });
    }
    return (
        <div className="flex justify-center items-center h-full">
            <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                <div className="flex flex-col">
                    <label htmlFor="email">Email</label>
                    <input className="p-2" type="text" readOnly placeholder="Email is not enabled yet" />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="password">Password</label>
                    <input className="p-2" required name="password" type="password" placeholder="Enter your password" />
                </div>
                <button className="p-2 bg-blue-300" type="submit">Login</button>
            </form>
        </div>
    )
}