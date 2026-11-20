import Link from "next/link";
const links = [["/about", "About"], ["/music", "Music"], ["/videos", "Videos"], ["/recommended-products", "Recommended Gear"], ["/contact", "Contact"], ["/privacy-policy", "Privacy Policy"], ["/terms", "Terms"], ["/affiliate-disclosure", "Affiliate Disclosure"], ["/copyright-policy", "Copyright Policy"]];
export default function Footer() {
  return (
    <footer className="mt-12 border-t border-line py-6 text-sm text-mute">
      <div className="flex flex-wrap gap-x-5 gap-y-2">{links.map(([h, l]) => <Link key={h} href={h} className="hover:text-txt">{l}</Link>)}</div>
      <p className="mt-3 text-xs">© {new Date().getFullYear()} SONG – No Copyright Music. As an Amazon Associate I earn from qualifying purchases.</p>
    </footer>
  );
}