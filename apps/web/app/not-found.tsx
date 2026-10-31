import Link from "next/link";

export default function PageIntrouvable() {
  return (
    <>
      <h1 className="text-3xl font-semibold">Page introuvable</h1>
      <p className="mt-3 text-muted">Ce contenu n&apos;existe pas, ou plus.</p>
      <Link href="/" className="mt-6 inline-block text-accent hover:underline">
        Retour à l&apos;accueil
      </Link>
    </>
  );
}
