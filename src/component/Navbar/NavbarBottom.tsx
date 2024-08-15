import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';


const NavbarBottom = () => {
  return (
    <nav className="bg-gray-800 py-2 px-4">
      <div className="container mx-auto flex gap-32">
        <div className="text-white">
          <Link to="/">
            <div className=' flex gap-2'>
                <FaShoppingCart size={24} />
                <p className=' border-r-[2px] border-gray-500 px-2'>SHOP CAREGORIES</p>
            </div>
          </Link>
        </div>

        <div className="flex items-center space-x-4 text-white">
          <a href="/favorites" className="hover:text-yellow-500">
           HOME
          </a>
          <a href="/login" className="hover:text-yellow-500">
            OUR STORES
          </a>
          <a href="/cart" className="hover:text-yellow-500">
            BLOGS
          </a>
          <a href="/cart" className="hover:text-yellow-500">
            CONTACTS
          </a>
        </div>
      </div>
    </nav>
  );
};

export default NavbarBottom;