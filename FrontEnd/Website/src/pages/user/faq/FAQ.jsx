import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/user/navbar/Navbar.jsx';
import Footer from '../../../components/user/footer/Footer.jsx';
import colors from '../../../config/colors';
import { FiArrowLeft, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const FAQ = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        {
          question: 'How do I start building a PC?',
          answer: 'Click on the "Launch Builder" button on the homepage. You\'ll be guided through selecting each component step by step. Our system will automatically check compatibility as you build.'
        },
        {
          question: 'Do I need an account to use the PC Builder?',
          answer: 'You can use the basic builder features without an account, but creating an account allows you to save your builds, share them with others, and access advanced features like build comparisons and personalized recommendations.'
        },
        {
          question: 'Is the PC Builder really free?',
          answer: 'Yes! Our PC Builder tool is completely free to use. We earn revenue through affiliate partnerships with retailers when you purchase components through our links.'
        }
      ]
    },
    {
      category: 'Compatibility',
      questions: [
        {
          question: 'How does the compatibility checker work?',
          answer: 'Our compatibility checker analyzes multiple factors including socket types, power requirements, physical dimensions, and technical specifications. It cross-references these with our extensive database to ensure all selected components will work together.'
        },
        {
          question: 'What if I choose incompatible parts?',
          answer: 'The system will alert you immediately with a warning message explaining the incompatibility. You\'ll be given suggestions for compatible alternatives before you can proceed.'
        },
        {
          question: 'Can I override compatibility warnings?',
          answer: 'Advanced users can choose to proceed with warnings, but we strongly recommend following compatibility guidelines to avoid purchasing components that won\'t work together.'
        }
      ]
    },
    {
      category: 'Pricing and Shopping',
      questions: [
        {
          question: 'Are the prices shown accurate?',
          answer: 'We update prices regularly from our retail partners, but prices can change. Always verify the final price on the retailer\'s website before purchasing. We display the last update time for each price.'
        },
        {
          question: 'Can I purchase directly through PC Builder?',
          answer: 'We don\'t sell components directly. Instead, we provide links to trusted retailers where you can purchase the components. This allows you to compare prices and choose the best deals.'
        },
        {
          question: 'Do you offer price alerts?',
          answer: 'Yes! With an account, you can set up price alerts for specific components. We\'ll notify you when prices drop below your target threshold.'
        }
      ]
    },
    {
      category: 'Builds and Sharing',
      questions: [
        {
          question: 'How do I save my build?',
          answer: 'Click the "Save Build" button in the builder. If you\'re logged in, your build will be saved to your account. You can access all your saved builds from your profile page.'
        },
        {
          question: 'Can I share my build with others?',
          answer: 'Absolutely! Each saved build gets a unique shareable link. You can also export your build as a PDF or share it directly to social media platforms.'
        },
        {
          question: 'How do I find community builds?',
          answer: 'Navigate to the "Completed Builds" section to browse builds shared by other users. You can filter by budget, performance tier, or purpose (gaming, workstation, etc.).'
        }
      ]
    },
    {
      category: 'Technical Support',
      questions: [
        {
          question: 'I\'m having trouble with the 3D viewer. What should I do?',
          answer: 'The 3D viewer requires WebGL support. Make sure you\'re using an updated browser (Chrome, Firefox, Safari, or Edge). If issues persist, try clearing your browser cache or disabling browser extensions.'
        },
        {
          question: 'Can I get help choosing components?',
          answer: 'Yes! Use our AI chatbot for instant assistance, submit a request to our technical support team, or join our community forums where experienced builders can provide guidance.'
        },
        {
          question: 'What if a component I want isn\'t in your database?',
          answer: 'We\'re constantly updating our database. You can request new components through the "Suggest Component" feature, and our team will review and add it if it meets our criteria.'
        }
      ]
    },
    {
      category: 'Account and Privacy',
      questions: [
        {
          question: 'What information do you collect?',
          answer: 'We collect only essential information needed to provide our services: email, username, and your saved builds. We never sell your data to third parties. See our Privacy Policy for complete details.'
        },
        {
          question: 'How do I delete my account?',
          answer: 'You can delete your account from the Settings page. All your personal data will be permanently removed within 30 days, though anonymized build data may be retained for statistical purposes.'
        },
        {
          question: 'Can I change my username?',
          answer: 'Yes, you can change your username once every 30 days from your profile settings. Your saved builds and shared links will automatically update with the new username.'
        }
      ]
    }
  ];

  const toggleQuestion = (categoryIndex, questionIndex) => {
    const index = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === index ? null : index);
  };

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
            Frequently Asked Questions
          </h1>
          <div style={{ width: '100px' }}></div>
        </div>

        {/* Intro */}
        <div className="max-w-4xl mx-auto mb-8 text-center">
          <p className="text-lg text-gray-700">
            Find answers to common questions about using PC Builder. Can't find what you're looking for? Contact our support team!
          </p>
        </div>

        {/* FAQ Content */}
        <div className="max-w-4xl mx-auto space-y-6">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h2 className="text-2xl font-bold mb-4" style={{ color: colors.mainYellow }}>
                {category.category}
              </h2>
              <div className="space-y-3">
                {category.questions.map((faq, questionIndex) => {
                  const isOpen = openIndex === `${categoryIndex}-${questionIndex}`;
                  return (
                    <div
                      key={questionIndex}
                      className="bg-white rounded-xl shadow-md overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-left font-semibold text-gray-800">
                          {faq.question}
                        </span>
                        {isOpen ? (
                          <FiChevronUp size={24} style={{ color: colors.mainYellow }} />
                        ) : (
                          <FiChevronDown size={24} style={{ color: colors.mainYellow }} />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-4">
                          <p className="text-gray-700 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="max-w-4xl mx-auto mt-12 bg-white rounded-2xl p-8 shadow-lg text-center">
          <h3 className="text-2xl font-bold mb-4" style={{ color: colors.mainYellow }}>
            Still Have Questions?
          </h3>
          <p className="text-gray-700 mb-6">
            Our support team is here to help! Reach out to us and we'll get back to you as soon as possible.
          </p>
          <button
            onClick={() => navigate('/contact')}
            className="px-8 py-3 rounded-lg font-semibold transition-all hover:opacity-90"
            style={{ backgroundColor: colors.mainYellow, color: 'white' }}
          >
            Contact Support
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FAQ;
