import { CONTACT_EMAIL } from "@/lib/site";
import LegalPage from "@/components/layout/LegalPage";
export const metadata = { title: "Terms and Conditions" };
export default function Page() {
  return (
    <LegalPage title="Terms and Conditions" updated="November 2026">
      <p>By using this website you agree to these terms.</p>
      <h2>Use of music</h2>
      <p>Each song page shows its usage rights and any attribution required. Follow those instructions when you use a track. If a song asks for credit, you must give it.</p>
      <h2>What you may not do</h2>
      <ul>
        <li>Resell or redistribute the music as your own work.</li>
        <li>Claim ownership of the tracks or register them in content-ID systems.</li>
        <li>Use the site in a way that harms it or other users.</li>
      </ul>
      <h2>Third-party links</h2>
      <p>The site links to YouTube, Amazon, Meesho and other websites. We are not responsible for their content, prices or policies. Purchases are made on those websites, not here.</p>
      <h2>No warranty</h2>
      <p>The website and music are provided “as is”, without warranties of any kind. We are not liable for any loss arising from their use, to the extent allowed by law.</p>
      <h2>Contact</h2>
      <p>Questions about these terms: <a href={`mailto:${CONTACT_EMAIL}`}>adityasd2006@gmail.com</a>.</p>
    </LegalPage>
  );
}