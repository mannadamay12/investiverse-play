import image from "../assets/landing.jpg";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen overflow-hidden" 
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
      <main className="container mx-auto px-4 py-8 md:py-16 relative">
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Welcome to Investiverse
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl">
            Learn, invest, and compete in a risk-free environment
          </p>
          <div className="space-x-4">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90"
              asChild
            >
              <Link to="/signup">Get Started</Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white/10 hover:bg-white/20 text-white border-white"
              asChild
            >
              <Link to="/login">Login</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;