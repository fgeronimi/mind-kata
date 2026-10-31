import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Rendu côté serveur : le HTML est produit au build, react-markdown n'est pas
// envoyé au navigateur.
export function Markdown({ children }: { children: string }) {
  return (
    <div className="markdown">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}
