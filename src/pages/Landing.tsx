import { useState } from "react";
import image from "../assets/landing.jpg";
import AuthModal from "../components/AuthModal";

const Landing = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'signup' | 'login'>('signup');

  const openModal = (mode: 'signup' | 'login') => {
    setModalMode(mode);
    setModalOpen(true);
  };

  return (
    <div className="h-screen fixed inset-0 overflow-hidden" 
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
      <main className="h-full flex items-center justify-center relative">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl md:text-6xl font-pixel text-white mb-6">
            Welcome to Investiverse
          </h1>
          <p className="text-xl md:text-2xl font-pixel text-white/90 mb-8 max-w-2xl leading-relaxed">
            Learn, invest, and compete in a risk-free environment
          </p>
          <div className="space-x-6">
            <button 
              onClick={() => openModal('signup')}
              className="relative inline-block w-[140px] h-[50px] group"
            >
              <div className="absolute inset-0 bg-[#e6d9bf] clip-button" />
              <div className="absolute inset-[10%] bg-[#ef623c]" />
              <span className="absolute inset-0 flex items-center justify-center font-pixel text-sm text-white uppercase tracking-wider">
                Sign Up
              </span>
            </button>
            <button 
              onClick={() => openModal('login')}
              className="relative inline-block w-[140px] h-[50px] group"
            >
              <div className="absolute inset-0 bg-[#e6d9bf] clip-button" />
              <div className="absolute inset-[10%] bg-[#ef623c]" />
              <span className="absolute inset-0 flex items-center justify-center font-pixel text-sm text-white uppercase tracking-wider">
                Login
              </span>
            </button>
          </div>
        </div>
      </main>

      <AuthModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
      />

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
