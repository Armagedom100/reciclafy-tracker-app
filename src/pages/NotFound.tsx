
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <div className="text-recyclafy-leaf-green mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="120"
            height="120"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21.79 18l-2.52-9.5a1 1 0 0 0-.61-.67L13.5 6.05a1 1 0 0 0-.68 0L7.82 7.82a1 1 0 0 0-.61.67L4.21 18a1 1 0 0 0 .17.85L6 21.5a1 1 0 0 0 .66.45c.23.03.47-.02.66-.14L12 18.44l4.68 3.37c.2.12.43.17.66.14a1 1 0 0 0 .66-.45l1.62-2.65a1 1 0 0 0 .17-.85Z"></path>
            <path d="m9 9 1.5 1.5"></path>
            <path d="M13 9.5 15 12"></path>
            <path d="M9 12.5 11 15"></path>
          </svg>
        </div>
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Oops! Esta página não foi encontrada
        </p>
        <p className="text-muted-foreground max-w-md mb-8">
          Parece que você está tentando acessar uma página que não existe. Verifique o URL ou volte para a página inicial.
        </p>
        <Button asChild size="lg">
          <Link to="/">Voltar para a página inicial</Link>
        </Button>
      </div>
    </Layout>
  );
};

export default NotFound;
