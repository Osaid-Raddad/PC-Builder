import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { BuildProvider } from './context/BuildContext';
import { CompareProvider } from './context/CompareContext';
import AuthLayout from './layouts/AuthLayout';
import Home from './pages/home/Home.jsx';
import Builder from './pages/user/builder/Builder.jsx';
import Shops from './pages/user/shops/Shops.jsx';
import ContactUs from './pages/user/contact/ContactUs.jsx';
import CompletedBuilds from './pages/user/completedBuilds/CompletedBuilds.jsx';
import SubmitBuild from './pages/user/submitBuild/SubmitBuild.jsx';
import BuildDetail from './pages/user/completedBuilds/BuildDetail.jsx';
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
import ChatBot from './components/common/chatbot/ChatBot.jsx';
import Chat from './pages/user/chat/Chat';
import ProductDetails from './pages/hardwareComponents/productDetails/ProductDetails.jsx';
import Posts from './pages/user/posts/Posts';
import TechSupport from './pages/techSupport/TechSupport.jsx';  
import Profile from './pages/user/profile/Profile.jsx';
import TechSupportProfile from './pages/TechSupport/TechProfile/TechSupportProfile';
import ProtectedRoute from './components/protected/ProtectedRoute.jsx';
import Comparator from './pages/user/comparator/Comparator.jsx';
import TermsOfService from './pages/user/termsOfService/TermsOfService.jsx';
import FAQ from './pages/user/faq/FAQ.jsx';
import BuildingGuides from './pages/user/buildingGuides/BuildingGuides.jsx';
import AIHardwareCalculator from './pages/aiCalculator/AIHardwareCalculator.jsx';

// Admin Imports
import AdminDashboard from './pages/admin/AdminDashboard';
import Overview from './pages/admin/Overview';
import ShopRequests from './pages/admin/ShopRequests';
import TechSupportRequests from './pages/admin/TechSupportRequests';
import ChangeRoles from './pages/admin/ChangeRoles';
import PostManagement from './pages/admin/PostManagement';
import UserManagement from './pages/admin/UserManagement';
import ProductManagement from './pages/admin/ProductManagement';
import Settings from './pages/admin/Settings';
import QuantumComputing from './pages/user/quantumComputing/QuantumComputing.jsx';

function AppContent() {
  const location = useLocation();
  
  // Check if current page is news page or chat page
  const isNewsPage = location.pathname.includes('/news');
  const isChatPage = location.pathname.includes('/chat');
  const isAdminPage = location.pathname.includes('/admin');

  return (
    <div>
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
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/completed-builds" element={<CompletedBuilds />} />
          <Route path="/completed-builds/:id" element={<BuildDetail />} />
          <Route path="/completed-builds/submit-build" element={<SubmitBuild />} />
          <Route path="/news" element={<News />} />
          <Route path="/signin" element={<AuthLayout />} />
          <Route path="/signup" element={<AuthLayout />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/tech-support" element={<TechSupport />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/tech-support/profile" element={<TechSupportProfile />} />
          <Route path="/comparator" element={<Comparator />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/building-guides" element={<BuildingGuides />} />
          <Route path="/quantum-computing" element={<QuantumComputing />} />
          <Route path="/ai-calculator" element={<AIHardwareCalculator />} />
          {/* Product Category Routes */}
          <Route path="/products/cpu" element={<CPU />} />
          <Route path="/products/gpu" element={<GPU />} />
          <Route path="/products/memory" element={<Memory />} />
          <Route path="/products/motherboard" element={<Motherboard />} /> 
          <Route path="/products/storage" element={<Storage />} />
          <Route path="/products/power-supply" element={<PowerSupply />} />
          <Route path="/products/case" element={<Case />} /> 
          <Route path="/products/monitor" element={<Monitor />} />
          <Route path="/products/accessories" element={<Accessories />} />
          <Route path="/products/cooler" element={<CPUCooler />} />
          <Route path="/products/expansion" element={<Expansion/>} />
          <Route path="/products/peripherals" element={<Peripherals />} />
          {/* Product Details Route - Dynamic */}
          <Route path="/product/:category/:id" element={<ProductDetails />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute isAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<Overview />} />
            <Route path="shop-requests" element={<ShopRequests />} />
            <Route path="tech-support" element={<TechSupportRequests />} />
            <Route path="change-roles" element={<ChangeRoles />} />
            <Route path="posts" element={<PostManagement />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="settings" element={<Settings />} />
          </Route>
      </Routes>

      {/* Show ChatBot on all pages except news and chat */}
      {!isNewsPage && !isChatPage && !isAdminPage && <ChatBot />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <BuildProvider>
        <CompareProvider>
          <AppContent />
        </CompareProvider>
      </BuildProvider>
    </Router>
  );
}

export default App;
