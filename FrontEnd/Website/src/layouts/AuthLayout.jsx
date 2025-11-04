import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import colors from '../config/colors';

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
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center" style={{ backgroundColor: colors.mainBlack }}>
      {/* Wave Background */}
      <div className="absolute inset-0 z-0">
        <svg
          className="absolute bottom-0 w-full h-full"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          style={{ height: '100%' }}
        >
          <path
            fill={colors.mainYellow}
            fillOpacity="0.3"
            d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,197.3C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
          <path
            fill={colors.mainYellow}
            fillOpacity="0.5"
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,197.3C672,192,768,160,864,154.7C960,149,1056,171,1152,165.3C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
          <path
            fill={colors.mainYellow}
            fillOpacity="0.7"
            d="M0,256L48,234.7C96,213,192,171,288,170.7C384,171,480,213,576,229.3C672,245,768,235,864,208C960,181,1056,139,1152,138.7C1248,139,1344,181,1392,202.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>

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
