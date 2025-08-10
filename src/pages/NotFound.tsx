import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Helmet>
        <title>404 — Page Not Found</title>
        <meta name="description" content="The page you are looking for does not exist." />
        <link rel="canonical" href={location.pathname} />
      </Helmet>
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <p className="text-lg text-muted-foreground mb-6">Oops! Page not found</p>
        <a href="/"><Button variant="hero">Return to Home</Button></a>
      </div>
    </div>
  );
};

export default NotFound;
