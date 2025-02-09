import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'signup' | 'login';
}

const AuthModal = ({ isOpen, onClose, mode }: AuthModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://fastapi-project-production-fc1c.up.railway.app/${mode}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          mode: 'cors', // Add explicit CORS mode
          credentials: 'same-origin',
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        if (response.status === 0) {
          throw new Error('Network error - CORS issue or server unavailable');
        }
        const data = await response.json().catch(() => null);
        throw new Error(data?.detail || `Error: ${response.status}`);
      }

      const data = await response.json();
      // Success
      navigate('/home');
    } catch (err) {
      console.error('Auth error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] p-8 rounded-lg w-96">
        <h2 className="text-2xl font-pixel text-white mb-6">
          {mode === 'signup' ? 'Sign Up' : 'Login'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 bg-[#2a2a2a] text-white rounded"
              required
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 bg-[#2a2a2a] text-white rounded"
              required
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm mb-4">{error}</div>
          )}
          <div className="flex justify-between">
            <button
              type="submit"
              disabled={isLoading}
              className="relative inline-block w-[140px] h-[50px] group"
            >
              <div className="absolute inset-0 bg-[#e6d9bf] clip-button" />
              <div className="absolute inset-[10%] bg-[#ef623c]" />
              <span className="absolute inset-0 flex items-center justify-center font-pixel text-sm text-white uppercase tracking-wider">
                {isLoading ? 'Loading...' : mode === 'signup' ? 'Sign Up' : 'Login'}
              </span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="relative inline-block w-[140px] h-[50px] group"
            >
              <div className="absolute inset-0 bg-[#e6d9bf] clip-button" />
              <div className="absolute inset-[10%] bg-[#2a2a2a]" />
              <span className="absolute inset-0 flex items-center justify-center font-pixel text-sm text-white uppercase tracking-wider">
                Cancel
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
