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
