import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import SignupForm from './SignupForm';

export default async function SignupPage() {
  const cookieStore = await cookies();

  const possibleCookieNames = [
    'sid',
    'sessionid',
    'session',
    'token',
    'frappe.sid',
    'frappe_session',
    'csrftoken',
  ];

  for (const name of possibleCookieNames) {
    if (cookieStore.get(name)) {
      redirect('/dashboard');
    }
  }

  return (
    <div style={{maxWidth: 520, margin: '40px auto', padding: 16}}>
      <h1>Create account</h1>
      <SignupForm />
    </div>
  );
}
