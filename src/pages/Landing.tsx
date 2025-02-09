
import image from "../assets/landing.jpg";
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
          <div className="space-x-6">
            {/* Pixel art style buttons */}
            <Link 
              to="/signup" 
              className="relative inline-block w-[140px] h-[50px] group"
            >
              <div className="absolute inset-0 bg-[#e6d9bf] clip-button" />
              <div className="absolute inset-[10%] bg-[#ef623c]" />
              <span className="absolute inset-0 flex items-center justify-center font-bold text-white uppercase tracking-wider font-mono">
                Sign Up
              </span>
            </Link>
            <Link 
              to="/login" 
              className="relative inline-block w-[140px] h-[50px] group"
            >
              <div className="absolute inset-0 bg-[#e6d9bf] clip-button" />
              <div className="absolute inset-[10%] bg-[#ef623c]" />
              <span className="absolute inset-0 flex items-center justify-center font-bold text-white uppercase tracking-wider font-mono">
                Login
              </span>
            </Link>
          </div>
        </div>
      </main>
      <style>
        {`
          .clip-button {
            clip-path: polygon(
              0 10%, 5% 10%, 5% 0, 95% 0, 95% 10%, 100% 10%,
              100% 90%, 95% 90%, 95% 100%, 5% 100%, 5% 90%, 0 90%
            );
          }
        `}
      </style>
    </div>
  );
};

export default Landing;
