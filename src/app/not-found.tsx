import Link from "next/link";
export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="mt-2 text-mute">The page you are looking for does not exist.</p>
      <Link href="/" className="pill mt-4 bg-white text-black">Back to home</Link>
    </div>
  );
}