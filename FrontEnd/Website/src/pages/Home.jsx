import React from 'react';
import Navbar from '../components/Navbar';

const Home = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#E8EDDF' }}>
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center" style={{ color: '#242423' }}>
          Welcome to PC Builder
        </h1>
      </div>
    </div>
  );
};

export default Home;
