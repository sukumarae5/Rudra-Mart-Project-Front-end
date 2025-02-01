import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import googlePlay from '../../assets/images/google.png';
import appStore from '../../assets/images/AppStore.png';
import qrCode from '../../assets/images/QrCode.jpg';

const Footer = () => {
  return (
    <div>
      {/* Footer Section */}
      <footer className="bg-black text-white py-8">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-5 gap-6 px-4">
          {[ 
            {
              title: 'Exclusive',
              content: (
                <>
                  <Link to="/subscribe" className="text-white hover:underline">
                    Subscribe
                  </Link>
                  <p className="mt-1 text-gray-400">Get 10% off with your first order</p>
                  <div className="mt-3 flex items-center border-b border-gray-600">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="bg-black text-white p-2 flex-grow focus:outline-none"
                    />
                    <button className="text-white p-2">
                      <ArrowForwardIcon />
                    </button>
                  </div>
                </>
              ),
            },
            {
              title: 'Support',
              content: (
                <ul className="space-y-1">
                  <li>111 Bijoy Sarani, Dhaka, DH 1515, Bangladesh</li>
                  <li>
                    <a href="mailto:exclusive@gmail.com" className="hover:underline">
                      exclusive@gmail.com
                    </a>
                  </li>
                  <li>
                    <a href="tel:+88015888889999" className="hover:underline">
                      +88015-88888-9999
                    </a>
                  </li>
                </ul>
              ),
            },
            {
              title: 'Account',
              content: (
                <ul className="space-y-1">
                  {['My Account', 'Login/Register', 'Cart', 'Wishlist', 'Shop'].map((text, idx) => (
                    <li key={idx}>
                      <Link to={`/${text.toLowerCase().replace(/\s+/g, '')}`} className="hover:underline">
                        {text}
                      </Link>
                    </li>
                  ))}
                </ul>
              ),
            },
            {
              title: 'Quick Link',
              content: (
                <ul className="space-y-1">
                  {['Privacy Policy', 'Terms of Service', 'FAQ', 'Contact'].map((text, idx) => (
                    <li key={idx}>
                      <Link to={`/${text.toLowerCase().replace(/\s+/g, '')}`} className="hover:underline">
                        {text}
                      </Link>
                    </li>
                  ))}
                </ul>
              ),
            },
            {
              title: 'Download App',
              content: (
                <>
                  <p className="mb-2">Save $3 with App New User Only</p>
                  <div className="flex items-center mb-3">
                    <img src={qrCode} alt="QR Code" className="w-20 h-20 object-contain" />
                    <div className="flex flex-col ml-3">
                      <img src={googlePlay} alt="Google Play" className="w-28 h-8" />
                      <img src={appStore} alt="App Store" className="w-24 h-8 mt-1" />
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    {[Facebook, Twitter, Instagram, LinkedIn].map((Icon, idx) => (
                      <a key={idx} href="#" className="hover:text-gray-400">
                        <Icon fontSize="large" />
                      </a>
                    ))}
                  </div>
                </>
              ),
            },
          ].map((section, idx) => (
            <div key={idx}>
              <h2 className="text-lg font-bold mb-1">{section.title}</h2>
              {section.content}
            </div>
          ))}
        </div>
        <hr className="w-full border-gray-600 my-4" />
        <p className="text-center text-gray-400">
          &copy; {new Date().getFullYear()} Rimel. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default Footer;
