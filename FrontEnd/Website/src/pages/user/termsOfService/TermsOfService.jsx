import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/user/navbar/Navbar.jsx';
import Footer from '../../../components/user/footer/Footer.jsx';
import colors from '../../../config/colors';
import { FiArrowLeft } from 'react-icons/fi';

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.mainBeige }}>
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-80 transition-opacity cursor-pointer"
            style={{ backgroundColor: colors.mainYellow, color: 'white' }}
          >
            <FiArrowLeft size={20} />
            Back
          </button>
          
          <h1 className="text-4xl font-bold" style={{ color: colors.mainBlack }}>
            Terms of Service
          </h1>
          <div style={{ width: '100px' }}></div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-lg">
          <p className="text-gray-600 mb-6">Last Updated: December 15, 2025</p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: colors.mainYellow }}>
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              By accessing and using PC Builder, you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to these Terms of Service, please do not use our platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: colors.mainYellow }}>
              2. Use of Service
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our platform allows users to build custom PC configurations, compare components, and connect with retailers. 
              You agree to use our service only for lawful purposes and in accordance with these Terms.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>You must be at least 13 years old to use this service</li>
              <li>You are responsible for maintaining the confidentiality of your account</li>
              <li>You agree not to misuse or abuse the platform</li>
              <li>You will not attempt to gain unauthorized access to any part of the service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: colors.mainYellow }}>
              3. User Content
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Users may submit builds, reviews, and other content to our platform. By submitting content, you grant us 
              a worldwide, non-exclusive, royalty-free license to use, reproduce, and display your content.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              You retain all rights to your content and are responsible for ensuring that your content does not violate 
              any third-party rights or applicable laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: colors.mainYellow }}>
              4. Product Information and Pricing
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We strive to provide accurate product information and pricing. However, we do not guarantee the accuracy, 
              completeness, or reliability of any product information displayed on our platform. Prices and availability 
              are subject to change without notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: colors.mainYellow }}>
              5. Limitation of Liability
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              PC Builder is provided "as is" without any warranties, express or implied. We are not liable for any 
              damages arising from the use of our service, including but not limited to direct, indirect, incidental, 
              or consequential damages.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: colors.mainYellow }}>
              6. Compatibility Checking
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              While we provide compatibility checking features, we cannot guarantee that all components will work together 
              perfectly. Users are responsible for verifying compatibility before making purchases.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: colors.mainYellow }}>
              7. Third-Party Links
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our platform may contain links to third-party websites or services. We are not responsible for the content, 
              privacy policies, or practices of any third-party sites.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: colors.mainYellow }}>
              8. Modifications to Service
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We reserve the right to modify or discontinue the service at any time without notice. We will not be 
              liable to you or any third party for any modification, suspension, or discontinuation of the service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: colors.mainYellow }}>
              9. Termination
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may terminate or suspend your account and access to the service immediately, without prior notice, 
              for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: colors.mainYellow }}>
              10. Contact Information
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about these Terms of Service, please contact us through our support channels.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TermsOfService;
