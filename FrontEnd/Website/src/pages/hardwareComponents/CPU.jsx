import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/user/navbar/Navbar.jsx';
import Footer from '../../components/user/footer/Footer.jsx';
import colors from '../../config/colors';
import { BsCpuFill } from 'react-icons/bs';
import { FiArrowLeft } from 'react-icons/fi';


const CPU = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.mainBeige }}>
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-80 transition-opacity cursor-pointer"
            style={{ backgroundColor: colors.mainYellow, color: 'white' }}
          >
            <FiArrowLeft size={20} />
            Back
          </button>
          
          <div className="flex items-center gap-3">
            <BsCpuFill size={32} style={{ color: colors.mainYellow }} />
            <h1 className="text-3xl font-bold" style={{ color: colors.mainBlack }}>
              Choose CPU
            </h1>
          </div>
          
          <div style={{ width: '150px' }}></div>
        </div>

        {/* Empty State - No CPUs Available */}
        <div className="text-center py-20">
          <BsCpuFill size={64} style={{ color: colors.platinum }} className="mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2" style={{ color: colors.mainBlack }}>
            No CPUs Available
          </h2>
          <p style={{ color: colors.jet }}>
            CPU data is not currently loaded.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CPU;
