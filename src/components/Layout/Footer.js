import React from 'react';
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#0e1525] text-white">
      {/* Main Footer Grid */}
      <div className="max-w-screen-xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        
        {/* Company Info */}
        <div style={{ position: "relative", right: "100px" }}>
          <h2 className="text-2xl font-bold text-white mb-2">
            <span className="text-[#1b59f8]">Rudra</span>
            <span className="text-yellow-400">E-Mart</span>
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Quality products across groceries, electronics, clothing and more delivered to your doorstep in Vijayawada.
          </p>
          <div className="flex items-center mt-3 text-sm text-gray-300">
            <FaMapMarkerAlt className="mr-2" />
            Vijayawada, Andhra Pradesh
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
          <ul className="space-y-3 text-sm text-gray-300">
            <li className="flex items-center">
              <FaPhoneAlt className="mr-2 text-blue-400" />
              <a href="tel:+919876543210" className="hover:underline">+91 9876543210</a>
            </li>
            <li className="flex items-center">
              <FaEnvelope className="mr-2 text-blue-400" />
              <a href="mailto:support@rudramart.com" className="hover:underline">support@rudramart.com</a>
            </li>
            <li className="flex items-start">
              <FaMapMarkerAlt className="mr-2 text-blue-400 mt-1" />
              <span>123 Main Street, Vijayawada, Andhra Pradesh 520001</span>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link to="/track-orders" className="hover:underline">Track Orders</Link></li>
            <li><Link to="/manage-addresses" className="hover:underline">Manage Addresses</Link></li>
            <li><Link to="/groceries" className="hover:underline">Fresh Groceries</Link></li>
            <li><Link to="/electronics" className="hover:underline">Electronics</Link></li>
            <li><Link to="/fashion" className="hover:underline">Fashion</Link></li>
          </ul>
        </div>

        {/* Store Hours */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Store Hours</h3>
          <ul className="space-y-1 text-sm text-gray-300">
            <li className="flex justify-between">
              <span>Mon - Sat:</span>
              <span>8:00 AM - 10:00 PM</span>
            </li>
            <li className="flex justify-between">
              <span>Sunday:</span>
              <span>9:00 AM - 9:00 PM</span>
            </li>
            <li className="text-green-400 mt-1 flex items-center">
              <FaClock className="mr-1" />
              Currently Open
            </li>
          </ul>
        </div>
      </div>

      {/* Delivery Banner */}
      <div className="bg-[#1b4fff] text-white text-center py-5 px-6">
        <h4 className="font-semibold text-lg mb-1">Free Delivery in Vijayawada</h4>
        <p className="text-sm">
          Get free delivery on orders above ₹199. Only ₹30 delivery charge for orders below ₹199.
        </p>
        <p className="text-sm mt-1 text-white/80">
          Serving areas: 520001, 520002, 520003, 520004, 520005 and more...
        </p>
      </div>

      {/* Social Media & Bottom Bar */}
      <div className="bg-[#0e1525] text-white border-t border-gray-700">
        <div className="max-w-screen-xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center text-sm">
          <p
            className="text-gray-400 mb-2 md:mb-0 text-center md:text-left"
            style={{ position: "relative", right: "100px" }}
          >
            © 2024 Rudra E-Mart. All rights reserved.
          </p>
          <div
            className="flex items-center space-x-8 ml-[20px]"
            style={{ position: "relative", left: "100px" }}
          >
            <span className="text-gray-400">Follow us:</span>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
              <FaFacebookF />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
              <FaTwitter />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
