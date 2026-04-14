import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, Home } from "lucide-react";
import Layout from "@/components/Layout";

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-accent/5 to-background/0">
        <div className="text-center max-w-md">
          <AlertCircle className="w-20 h-20 text-accent/30 mx-auto mb-6" />
          <h1 className="text-5xl font-bold text-foreground mb-2">404</h1>
          <p className="text-xl text-muted-foreground mb-2">Sahifa topilmadi</p>
          <p className="text-muted-foreground mb-8">
            Kechirasiz, siz qidirgan sahifa mavjud emas. Asosiy sahifaga qayting.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            <Home className="w-4 h-4" />
            Asosiy Sahifaga
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
