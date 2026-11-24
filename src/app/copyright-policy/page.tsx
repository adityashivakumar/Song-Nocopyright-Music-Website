import { CONTACT_EMAIL } from "@/lib/site";
import LegalPage from "@/components/layout/LegalPage";
export const metadata = { title: "Copyright Policy" };
export default function Page() {
  return (
    <LegalPage title="Copyright Policy" updated="November 2026">
      <p>We only publish music that we own or have the right to distribute. The licence for each track is shown on its song page.</p>
      <h2>Using our music</h2>
      <p>Read the “Usage &amp; attribution” box on each song page before you use a track in a video, stream or other project. Where credit is required, it is stated there.</p>
      <h2>Report a problem</h2>
      <p>If you believe a track on this website infringes your rights, email <a href={`mailto:${CONTACT_EMAIL}`}>adityasd2006@gmail.com</a> with: the song link, proof that you own the rights, and your contact details. We will review it and remove the track where appropriate.</p>
      <h2>Product images and logos</h2>
      <p>Product images shown on recommendation pages belong to their owners or the affiliate networks and are used as permitted by their programmes. Brand names and logos belong to their respective owners.</p>
    </LegalPage>
  );
}