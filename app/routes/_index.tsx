import { type LoaderFunctionArgs, redirect } from "@remix-run/node";
import cookie from 'cookie';

export async function loader({ request }: LoaderFunctionArgs) {
  const cookies = cookie.parse(request.headers.get('cookie') || '');
  if (cookies['admin-token']) {
    throw redirect('/app');
  }

  throw redirect('/login');
}
