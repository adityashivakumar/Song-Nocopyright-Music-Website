import { CONTACT_EMAIL } from "@/lib/site";
import LegalPage from "@/components/layout/LegalPage";
export const metadata = { title: "Contact" };
export default function Page() {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "adityasd2006@gmail.com";
  return (
    <LegalPage title="Contact">
      <p>For questions, collaboration, or copyright concerns, email us:</p>
      <p><a href={`mailto:${email}`} className="text-base">{email}</a></p>
      <p>We usually reply within a few days.</p>
    </LegalPage>
  );
}