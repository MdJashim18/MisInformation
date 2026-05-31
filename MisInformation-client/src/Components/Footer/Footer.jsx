import React from "react";
import { FaFacebook, FaGithub, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white pt-16 pb-8 mt-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

        {/* Company Info */}
        <div>
          <h3 className="text-2xl font-bold mb-4">AI Risk Analyzer</h3>
          <p className="text-indigo-100">
            Advanced AI-powered misinformation risk analysis using DS/ER and BRB algorithms. 
            Helping organizations identify and mitigate AI-generated threats.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xl font-semibold mb-4 border-b border-white/30 pb-2">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <Link className="hover:text-green-400 transition-colors" to="/CalculatedData">Calculated Data</Link>
            </li>
            <li>
              <Link className="hover:text-green-400 transition-colors" to="/InputData">Input Survey</Link>
            </li>
            <li>
              <Link className="hover:text-green-400 transition-colors" to="/AboutProject">About Project</Link>
            </li>
          </ul>
        </div>

        {/* Follow Us / Connect */}
        <div>
          <h4 className="text-xl font-semibold mb-4 border-b border-white/30 pb-2">Connect With Me</h4>
          <p className="text-indigo-100 text-sm mb-3">
            Developed by Mohammad Jashimuddin Rubel
          </p>
          <div className="flex gap-4 mt-2">
            <a 
              href="https://www.linkedin.com/in/mohammadjashimuddinrubel/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-3 bg-indigo-500 rounded-full hover:bg-green-400 transition-all duration-300 shadow-lg"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="w-5 h-5 text-white" />
            </a>
            <a 
              href="https://github.com/MdJashim18" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-3 bg-indigo-500 rounded-full hover:bg-green-400 transition-all duration-300 shadow-lg"
              aria-label="GitHub"
            >
              <FaGithub className="w-5 h-5 text-white" />
            </a>
            <a 
              href="https://www.facebook.com/share/1BEhor8qZ6/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-3 bg-indigo-500 rounded-full hover:bg-green-400 transition-all duration-300 shadow-lg"
              aria-label="Facebook"
            >
              <FaFacebook className="w-5 h-5 text-white" />
            </a>
          </div>
        </div>

      </div>

      <div className="mt-12 border-t border-white/20 pt-6 text-center text-indigo-100 text-sm">
        &copy; {new Date().getFullYear()} AI Misinformation Risk Analysis System. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;