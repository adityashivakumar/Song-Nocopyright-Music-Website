import LegalPage from "@/components/layout/LegalPage";
export const metadata = { title: "Privacy Policy" };
export default function Page() {
  return (
    <LegalPage title="Privacy Policy" updated="November 2026">
      <p>This policy explains what information SONG – No Copyright Music collects and how it is used. You do not need an account to listen to or download music.</p>
      <h2>Information we collect</h2>
      <ul>
        <li>Anonymous usage data such as pages viewed, songs played and downloaded, and affiliate link clicks.</li>
        <li>Basic device type (mobile or desktop) and the referring website.</li>
        <li>Messages you send us by email, which we use only to reply.</li>
      </ul>
      <p>We do not sell personal data and we do not store full IP addresses.</p>
      <h2>Cookies and third parties</h2>
      <p>Embedded YouTube videos load from youtube-nocookie.com, and YouTube/Google may set cookies when you play a video. See the <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a> and the <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer">YouTube Terms of Service</a>.</p>
      <p>When you click an affiliate link, the shop (for example Amazon or Meesho) may set its own cookies to track the referral. We do not control these.</p>
      <h2>Your choices</h2>
      <p>You can block cookies in your browser settings. To ask about your data, email <a href="mailto:your-email@example.com">adityasd2006@gmail.com</a>.</p>
      <h2>Changes</h2>
      <p>We may update this policy and will change the date above when we do.</p>
    </LegalPage>
  );
}