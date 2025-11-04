import React from 'react';
import Navbar from '../components/Navbar';
import colors from '../config/colors';

const Home = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.mainBeige }}>
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center" style={{ color: colors.mainBlack }}>
          Welcome to PC Builder
        </h1>
      </div>
    </div>
  );
};

export default Home;
