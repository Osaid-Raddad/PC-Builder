import React from 'react';
import BlurText from '../../components/animations/BlurText';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import colors from '../../config/colors';

const Home = () => {
  const handleAnimationComplete = () => {
    console.log('Animation completed!');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.mainBeige }}>
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8 mt-10 flex items-start justify-center" style={{color: colors.mainBlack}}>
        <BlurText
          text="Build ur dream"
          delay={150}
          animateBy="words"
          direction="top"
          onAnimationComplete={handleAnimationComplete}
          className="text-8xl font-bold text-center"
          style={{ color: colors.mainYellow }}
        />
      </div>

      <Footer />
    </div>
  );
};

export default Home;
