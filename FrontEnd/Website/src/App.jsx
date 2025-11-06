import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AuthLayout from './layouts/AuthLayout';
import Home from './pages/home/Home.jsx';
import Builder from './pages/user/builder/Builder.jsx';
import Shops from './pages/user/shops/Shops.jsx';
import CPU from './pages/hardwareComponents/CPU.jsx';
import CPUCooler from './pages/hardwareComponents/CPUCooler';
import GPU from './pages/hardwareComponents/GPU';
import Motherboard from './pages/hardwareComponents/Motherboard';
import Memory from './pages/hardwareComponents/Memory';
import Storage from './pages/hardwareComponents/Storage';
import Case from './pages/hardwareComponents/Case';
import PowerSupply from './pages/hardwareComponents/PowerSupply.jsx';
import Monitor from './pages/hardwareComponents/Monitor';
import Expansion from './pages/hardwareComponents/Expansion.jsx';
import Peripherals from './pages/hardwareComponents/Peripherals';
import Accessories from './pages/hardwareComponents/Accessories';
import ForgotPassword from './pages/user/auth/ForgotPassword.jsx';
import ResetPassword from './pages/user/auth/ResetPassword';
import News from './pages/user/news/News';
function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#242423',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#F5CB5C',
              secondary: '#242423',
            },
          },
        }}
      />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/builder" element={<Builder />} />
        <Route path="/shops" element={<Shops />} />
        <Route path="/builder/cpu" element={<CPU />} />
        <Route path="/builder/cooler" element={<CPUCooler />} />
        <Route path="/builder/motherboard" element={<Motherboard />} />
        <Route path="/builder/memory" element={<Memory />} />
        <Route path="/builder/storage" element={<Storage />} />
        <Route path="/builder/gpu" element={<GPU />} />
        <Route path="/builder/case" element={<Case />} />
        <Route path="/builder/psu" element={<PowerSupply />} />
        <Route path="/builder/monitor" element={<Monitor />} />
        <Route path="/builder/expansion" element={<Expansion />} />
        <Route path="/builder/peripherals" element={<Peripherals />} />
        <Route path="/builder/accessories" element={<Accessories />} />
        <Route path="/signin" element={<AuthLayout />} />
        <Route path="/signup" element={<AuthLayout />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/news" element={<News />} />
        
      </Routes>
    </Router>
  );
}

export default App;
