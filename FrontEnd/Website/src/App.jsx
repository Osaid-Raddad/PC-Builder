import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AuthLayout from './layouts/AuthLayout';
import Home from './pages/Home';

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
        <Route path="/signin" element={<AuthLayout />} />
        <Route path="/signup" element={<AuthLayout />} />
      </Routes>
    </Router>
  );
}

export default App;
