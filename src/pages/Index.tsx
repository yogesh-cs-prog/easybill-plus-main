import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Helmet>
        <title>Bill Management System | Invoices, Customers, GST</title>
        <meta name="description" content="Create GST-compliant invoices, manage customers, and track revenue with charts. Download professional PDFs." />
        <link rel="canonical" href="/" />
      </Helmet>
      {/* <div className="absolute inset-0 bg-gradient-to-b from-background to-accent/40" aria-hidden /> */}
      <section className="container mx-auto grid md:grid-cols-2 gap-10 items-center py-20">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Smart, GST-ready billing for growing businesses
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Create invoices in seconds, manage customers, and visualize your growth with interactive charts. Export beautiful PDFs with your branding.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/register"><Button variant="hero" size="lg">Get Started</Button></Link>
            <Link to="/dashboard"><Button variant="outline" size="lg">Live Demo</Button></Link>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="aspect-[4/3] rounded-lg bg-muted grid place-items-center text-muted-foreground">
            <div className="text-center">
              <div className="text-6xl mb-2">📄</div>
              <p>Preview of your invoice and analytics</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
