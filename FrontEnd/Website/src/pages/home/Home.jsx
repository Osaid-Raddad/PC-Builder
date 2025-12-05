import React from 'react';
import Navbar from '../../components/user/navbar/Navbar.jsx';
import Footer from '../../components/user/footer/Footer.jsx';
import BlurText from '../../components/animations/BlurText/BlurText.jsx';
import colors from '../../config/colors';

const Home = () => {
  const handleAnimationComplete = () => {
    console.log('Animation completed!');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.mainBeige }}>
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8 mt-10" style={{color: colors.mainBlack}}>
        {/* Hero Text */}
        <div className="flex items-center justify-center mb-8">
          <BlurText
            text="Build ur dream"
            delay={150}
            animateBy="words"
            direction="top"
            onAnimationComplete={handleAnimationComplete}
            className="text-6xl md:text-8xl font-bold text-center"
            style={{ color: colors.mainYellow }}
          />
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12 mb-8">
          <p className="text-xl md:text-2xl mb-6" style={{ color: colors.mainBlack }}>
            Interactive 3D PC Builder - Rotate and Explore
          </p>
          <button 
            onClick={() => window.location.href = '/builder'}
            className="px-8 py-4 text-lg font-semibold rounded-lg transition-all hover:opacity-90 shadow-lg cursor-pointer"
            style={{ backgroundColor: colors.mainYellow, color: colors.mainBlack }}
          >
            Start Building Now
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
