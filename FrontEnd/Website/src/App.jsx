import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AuthLayout from './layouts/AuthLayout';
import Home from './pages/Home';
import Builder from './pages/Builder';
import CPU from './pages/components/CPU';
import CPUCooler from './pages/components/CPUCooler';
import GPU from './pages/components/GPU';
import Motherboard from './pages/components/Motherboard';
import Memory from './pages/components/Memory';
import Storage from './pages/components/Storage';
import Case from './pages/components/Case';
import PowerSupply from './pages/components/PowerSupply';
import Monitor from './pages/components/Monitor';
import Expansion from './pages/components/Expansion';
import Peripherals from './pages/components/Peripherals';
import Accessories from './pages/components/Accessories';

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
      </Routes>
    </Router>
  );
}

export default App;
