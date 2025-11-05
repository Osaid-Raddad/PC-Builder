import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import colors from '../config/colors';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.mainBeige }}>
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
      </div>

      <Footer />
    </div>
  );
};

export default Home;
