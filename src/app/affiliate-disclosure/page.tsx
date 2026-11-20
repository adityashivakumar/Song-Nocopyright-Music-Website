import LegalPage from "@/components/layout/LegalPage";
export const metadata = { title: "Affiliate Disclosure" };
export default function Page() {
  return (
    <LegalPage title="Affiliate Disclosure" updated="November 2026">
      <p>Some links on this website are affiliate links. If you click one and make a purchase, we may earn a commission at no extra cost to you.</p>
      <p><strong className="text-txt">As an Amazon Associate I earn from qualifying purchases.</strong></p>
      <h2>Programmes we use</h2>
      <ul>
        <li>Amazon Associates India</li>
        <li>Meesho affiliate/creator programme</li>
      </ul>
      <h2>How it works</h2>
      <ul>
        <li>Recommendations are chosen because they are relevant to music listeners and creators.</li>
        <li>You buy on the shop’s own website. We do not sell products, take payments or handle orders.</li>
        <li>Prices and availability can change, so check the shop for the current details.</li>
        <li>We count clicks on our links to see which products are useful. A click does not mean a purchase.</li>
      </ul>
      <p>Our recommendations are not official endorsements by the brands. Questions: <a href="mailto:your-email@example.com">adityasd2006@gmail.com</a>.</p>
    </LegalPage>
  );
}