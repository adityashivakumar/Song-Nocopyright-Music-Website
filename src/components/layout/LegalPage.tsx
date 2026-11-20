export default function LegalPage({ title, updated, children }: { title: string; updated?: string; children: React.ReactNode }) {
  return (
    <article className="mx-auto max-w-3xl space-y-4 py-4 text-sm leading-7 text-txt [&_h2]:mt-6 [&_h2]:text-lg [&_h2]:font-bold [&_a]:text-link [&_ul]:list-disc [&_ul]:pl-5 [&_p]:text-mute [&_li]:text-mute">
      <h1 className="text-2xl font-bold">{title}</h1>
      {updated && <p className="text-xs">Last updated: {updated}</p>}
      {children}
    </article>
  );
}