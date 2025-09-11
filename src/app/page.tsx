import { redirect } from 'next/navigation';

export default function Home() {
  // Always redirect to landing page first
  redirect('/landing');
}
