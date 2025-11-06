import React, { useState } from 'react';
import Navbar from '../../../components/user/navbar/Navbar';
import Footer from '../../../components/user/footer/Footer';
import colors from '../../../config/colors';
import { FiMail, FiPhone, FiMapPin, FiSend, FiUser, FiMessageSquare } from 'react-icons/fi';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // TODO: Send form data to backend
    console.log('Form submitted:', formData);
    toast.success('Message sent successfully! We will get back to you soon.');
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  const contactInfo = [
    {
      icon: <FiMail size={24} />,
      title: 'Email',
      content: 'support@pcbuilder.ps',
      link: 'mailto:support@pcbuilder.ps'
    },
    {
      icon: <FiPhone size={24} />,
      title: 'Phone',
      content: '+972 52 275 8700',
      link: 'tel:+972 52 275 8700'
    },
    {
      icon: <FiMapPin size={24} />,
      title: 'Location',
      content: 'Rafidia St, Almajeen, Nablus',
      link: null
    }
  ];

  const socialLinks = [
    { icon: <FaFacebook size={24} />, name: 'Facebook', url: '#', color: '#1877F2' },
    { icon: <FaTwitter size={24} />, name: 'Twitter', url: '#', color: '#1DA1F2' },
    { icon: <FaInstagram size={24} />, name: 'Instagram', url: '#', color: '#E4405F' },
    { icon: <FaLinkedin size={24} />, name: 'LinkedIn', url: '#', color: '#0A66C2' }
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.mainBeige }}>
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4" style={{ color: colors.mainBlack }}>
            Contact Us
          </h1>
          <p className="text-xl" style={{ color: colors.jet }}>
            Have a question or need help? We're here for you!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div 
              className="bg-white rounded-lg shadow-lg p-8"
              style={{ border: `2px solid ${colors.platinum}` }}
            >
              <h2 className="text-3xl font-bold mb-6" style={{ color: colors.mainBlack }}>
                Send us a Message
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label 
                    htmlFor="name" 
                    className="block text-sm font-semibold mb-2"
                    style={{ color: colors.mainBlack }}
                  >
                    Your Name
                  </label>
                  <div className="relative">
                    <FiUser 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2"
                      style={{ color: colors.mainYellow }}
                      size={20}
                    />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{ 
                        border: `2px solid ${colors.platinum}`,
                        color: colors.mainBlack
                      }}
                      onFocus={(e) => e.target.style.borderColor = colors.mainYellow}
                      onBlur={(e) => e.target.style.borderColor = colors.platinum}
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label 
                    htmlFor="email" 
                    className="block text-sm font-semibold mb-2"
                    style={{ color: colors.mainBlack }}
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <FiMail 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2"
                      style={{ color: colors.mainYellow }}
                      size={20}
                    />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      className="w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{ 
                        border: `2px solid ${colors.platinum}`,
                        color: colors.mainBlack
                      }}
                      onFocus={(e) => e.target.style.borderColor = colors.mainYellow}
                      onBlur={(e) => e.target.style.borderColor = colors.platinum}
                    />
                  </div>
                </div>

                {/* Subject Field */}
                <div>
                  <label 
                    htmlFor="subject" 
                    className="block text-sm font-semibold mb-2"
                    style={{ color: colors.mainBlack }}
                  >
                    Subject
                  </label>
                  <div className="relative">
                    <FiMessageSquare 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2"
                      style={{ color: colors.mainYellow }}
                      size={20}
                    />
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What is this about?"
                      className="w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{ 
                        border: `2px solid ${colors.platinum}`,
                        color: colors.mainBlack
                      }}
                      onFocus={(e) => e.target.style.borderColor = colors.mainYellow}
                      onBlur={(e) => e.target.style.borderColor = colors.platinum}
                    />
                  </div>
                </div>

                {/* Message Field */}
                <div>
                  <label 
                    htmlFor="message" 
                    className="block text-sm font-semibold mb-2"
                    style={{ color: colors.mainBlack }}
                  >
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    rows="7"
                    className="w-full px-4 py-3 mb-3 rounded-lg focus:outline-none focus:ring-2 transition-all resize-none"
                    style={{ 
                      border: `2px solid ${colors.platinum}`,
                      color: colors.mainBlack
                    }}
                    onFocus={(e) => e.target.style.borderColor = colors.mainYellow}
                    onBlur={(e) => e.target.style.borderColor = colors.platinum}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-4 rounded-lg font-bold text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-lg"
                  style={{ backgroundColor: colors.mainYellow }}
                >
                  <FiSend size={20} />
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Info Cards */}
            <div 
              className="bg-white rounded-lg shadow-lg p-6"
              style={{ border: `2px solid ${colors.platinum}` }}
            >
              <h3 className="text-2xl font-bold mb-6" style={{ color: colors.mainBlack }}>
                Get in Touch
              </h3>
              
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div 
                      className="p-3 rounded-lg shrink-0"
                      style={{ backgroundColor: colors.mainYellow + '20' }}
                    >
                      <span style={{ color: colors.mainYellow }}>
                        {info.icon}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1" style={{ color: colors.mainBlack }}>
                        {info.title}
                      </h4>
                      {info.link ? (
                        <a 
                          href={info.link}
                          className="text-sm hover:underline"
                          style={{ color: colors.jet }}
                        >
                          {info.content}
                        </a>
                      ) : (
                        <p className="text-sm" style={{ color: colors.jet }}>
                          {info.content}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media */}
            <div 
              className="bg-white rounded-lg shadow-lg p-6"
              style={{ border: `2px solid ${colors.platinum}` }}
            >
              <h3 className="text-2xl font-bold mb-6" style={{ color: colors.mainBlack }}>
                Follow Us
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 p-4 rounded-lg transition-all hover:shadow-md"
                    style={{ 
                      border: `2px solid ${colors.platinum}`,
                      color: colors.mainBlack
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = social.color;
                      e.currentTarget.style.color = social.color;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = colors.platinum;
                      e.currentTarget.style.color = colors.mainBlack;
                    }}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Business Hours */}
            <div 
              className="bg-white rounded-lg shadow-lg p-6"
              style={{ border: `2px solid ${colors.platinum}` }}
            >
              <h3 className="text-2xl font-bold mb-6" style={{ color: colors.mainBlack }}>
                Business Hours
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span style={{ color: colors.jet }}>Sunday - Thursday</span>
                  <span className="font-semibold" style={{ color: colors.mainBlack }}>
                    9:00 AM - 6:00 PM
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: colors.jet }}>Saturday</span>
                  <span className="font-semibold" style={{ color: colors.mainBlack }}>
                    10:00 AM - 4:00 PM
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div 
          className="bg-white rounded-lg shadow-lg p-8"
          style={{ border: `2px solid ${colors.mainYellow}` }}
        >
          <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: colors.mainBlack }}>
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold mb-2" style={{ color: colors.mainYellow }}>
                How long does it take to get a response?
              </h4>
              <p className="text-sm" style={{ color: colors.jet }}>
                We typically respond within 24-48 hours during business days.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-2" style={{ color: colors.mainYellow }}>
                Do you offer technical support?
              </h4>
              <p className="text-sm" style={{ color: colors.jet }}>
                Yes! Our team is here to help you with any PC building questions or issues.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-2" style={{ color: colors.mainYellow }}>
                Can you help me choose components?
              </h4>
              <p className="text-sm" style={{ color: colors.jet }}>
                Absolutely! We provide expert advice on component compatibility and selection.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-2" style={{ color: colors.mainYellow }}>
                Do you work with local shops?
              </h4>
              <p className="text-sm" style={{ color: colors.jet }}>
                Yes, we partner with trusted local computer shops across West Bank.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactUs;
