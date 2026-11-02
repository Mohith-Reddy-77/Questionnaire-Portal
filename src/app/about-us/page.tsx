import { redirect } from 'next/navigation';

// "About Us" now lives on the Our Goal page.
export default function AboutUsPage() {
  redirect('/our-goal');
}
