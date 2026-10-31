import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { SchemaMermaid } from "@/components/schema-mermaid";

// Un bloc ```mermaid devient un schéma ; tout autre bloc de code reste du code.
const composants: Components = {
  pre({ node, children, ...props }) {
    const bloc = node?.children[0];
    const classes =
      bloc?.type === "element" && bloc.tagName === "code"
        ? bloc.properties.className
        : undefined;
    if (
      bloc?.type === "element" &&
      Array.isArray(classes) &&
      classes.includes("language-mermaid")
    ) {
      const source = bloc.children
        .map((enfant) => (enfant.type === "text" ? enfant.value : ""))
        .join("");
      return <SchemaMermaid code={source.trim()} />;
    }
    return <pre {...props}>{children}</pre>;
  },
};

// Rendu côté serveur : le HTML est produit au build, react-markdown n'est pas
// envoyé au navigateur. Seuls les schémas sont dessinés côté client.
export function Markdown({ children }: { children: string }) {
  return (
    <div className="markdown">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={composants}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
