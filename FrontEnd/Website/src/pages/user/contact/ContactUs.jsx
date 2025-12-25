import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Navbar from '../../../components/user/navbar/Navbar';
import Footer from '../../../components/user/footer/Footer';
import colors from '../../../config/colors';
import { FiMail, FiPhone, FiMapPin, FiSend, FiUser, FiMessageSquare } from 'react-icons/fi';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ContactUs = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/Public/Public/ContactUs`,
        {
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message
        }
      );

      toast.success('Message sent successfully! We will get back to you soon.');
      reset(); // Reset form after successful submission
    } catch (error) {
      console.error('Error sending message:', error);
      
      if (error.response) {
        // Server responded with error
        const errorMessage = error.response.data?.message || 
                           error.response.data?.title || 
                           'Failed to send message. Please try again.';
        toast.error(errorMessage);
      } else if (error.request) {
        // Request made but no response
        toast.error('Network error. Please check your connection and try again.');
      } else {
        // Other errors
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
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
      <div className="flex-1 w-full px-4 py-8 pb-12" style={{ maxWidth: '100%', margin: '0 auto' }}>
        <div className="container mx-auto">
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
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                      {...register('name', { 
                        required: 'Name is required',
                        minLength: {
                          value: 2,
                          message: 'Name must be at least 2 characters'
                        }
                      })}
                      placeholder="Enter your full name"
                      className="w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{ 
                        border: `2px solid ${errors.name ? '#ef4444' : colors.platinum}`,
                        color: colors.mainBlack
                      }}
                      onFocus={(e) => !errors.name && (e.target.style.borderColor = colors.mainYellow)}
                      onBlur={(e) => !errors.name && (e.target.style.borderColor = colors.platinum)}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
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
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Please enter a valid email address'
                        }
                      })}
                      placeholder="your.email@example.com"
                      className="w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{ 
                        border: `2px solid ${errors.email ? '#ef4444' : colors.platinum}`,
                        color: colors.mainBlack
                      }}
                      onFocus={(e) => !errors.email && (e.target.style.borderColor = colors.mainYellow)}
                      onBlur={(e) => !errors.email && (e.target.style.borderColor = colors.platinum)}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
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
                      {...register('subject', {
                        required: 'Subject is required',
                        minLength: {
                          value: 3,
                          message: 'Subject must be at least 3 characters'
                        }
                      })}
                      placeholder="What is this about?"
                      className="w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{ 
                        border: `2px solid ${errors.subject ? '#ef4444' : colors.platinum}`,
                        color: colors.mainBlack
                      }}
                      onFocus={(e) => !errors.subject && (e.target.style.borderColor = colors.mainYellow)}
                      onBlur={(e) => !errors.subject && (e.target.style.borderColor = colors.platinum)}
                    />
                  </div>
                  {errors.subject && (
                    <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
                  )}
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
                    {...register('message', {
                      required: 'Message is required',
                      minLength: {
                        value: 10,
                        message: 'Message must be at least 10 characters'
                      }
                    })}
                    placeholder="Write your message here..."
                    rows="7"
                    className="w-full px-4 py-3 mb-3 rounded-lg focus:outline-none focus:ring-2 transition-all resize-none"
                    style={{ 
                      border: `2px solid ${errors.message ? '#ef4444' : colors.platinum}`,
                      color: colors.mainBlack
                    }}
                    onFocus={(e) => !errors.message && (e.target.style.borderColor = colors.mainYellow)}
                    onBlur={(e) => !errors.message && (e.target.style.borderColor = colors.platinum)}
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-lg font-bold text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: colors.mainYellow }}
                >
                  <FiSend size={20} />
                  {isSubmitting ? 'Sending...' : 'Send Message'}
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
                          className="text-sm hover:underline cursor-pointer"
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
                    className="flex items-center justify-center gap-2 p-4 rounded-lg transition-all hover:shadow-md cursor-pointer"
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
          className="bg-white rounded-lg shadow-lg p-8 mb-0"
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
      </div>

      <Footer />
    </div>
  );
};

export default ContactUs;
