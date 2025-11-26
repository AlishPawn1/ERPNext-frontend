import { redirect } from 'next/navigation';

const Page = () => {
  redirect('/app/home');
  return null; 
}

export default Page