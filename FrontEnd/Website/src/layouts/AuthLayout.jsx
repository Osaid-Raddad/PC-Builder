import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Meteors from '../components/ui/meteors';

const AuthLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(location.pathname === '/signup');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsSignUp(location.pathname === '/signup');
  }, [location.pathname]);

  const handleSwitchToSignUp = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      navigate('/signup');
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const handleSwitchToSignIn = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      navigate('/signin');
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center">
      <Meteors number={30} />
      
      <div className="relative z-10 w-full overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            width: '200%',
            transform: isSignUp ? 'translateX(-50%)' : 'translateX(0)',
          }}
        >
          <div className="w-1/2 flex items-center justify-center p-4">
            <SignIn onSwitchToSignUp={handleSwitchToSignUp} />
          </div>
          <div className="w-1/2 flex items-center justify-center p-4">
            <SignUp onSwitchToSignIn={handleSwitchToSignIn} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
