import React, { useState } from 'react';
import './FAQPage.css';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="faq-item">
      <button className="faq-question" onClick={() => setIsOpen(!isOpen)}>
        {question}
        <span className={`arrow ${isOpen ? 'open' : ''}`}>{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && <div className="faq-answer">{answer}</div>}
    </div>
  );
};

const FAQPage = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const faqs = [
    {
      question: "What is Share2Teach?",
      answer: "Share2Teach is an open educational resource (OER) platform where students and educators can share and access teaching materials across various subjects."
    },
    {
      question: "How can I contribute my own resources?",
      answer: "To contribute, you need to create an account. Once logged in, you can upload your resources through the 'Contribute' section accessible from the main menu."
    },
    {
      question: "Are all the resources free to use?",
      answer: "Yes, all resources on Share2Teach are free to use. They are shared under Creative Commons licenses, which allow for free use with proper attribution."
    },
    {
      question: "How do I search for specific resources?",
      answer: "You can use the search bar at the top of the page to look for resources by keywords, subjects, or tags. You can also browse resources by subject from the main menu."
    },
    {
      question: "Can I use these resources in my classroom?",
      answer: "Absolutely! These resources are designed to be used in educational settings. We encourage educators to adapt and use these materials to suit their teaching needs."
    },
    {
      question: "How can I ensure the quality of the resources I'm using?",
      answer: "While we strive to maintain high standards, we recommend critically evaluating all resources. User ratings and comments can also help gauge the quality of a resource."
    },
    {
      question: "Is Share2Teach affiliated with any educational institution?",
      answer: "Share2Teach is an initiative supported by North-West University, but it's an open platform for all educators and students regardless of their institutional affiliation."
    }
  ];

  return (
    <div className="faq-overlay">
      <div className="faq-modal">
        <div className="faq-header">
          <h2>Frequently Asked Questions</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <div className="faq-content">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
