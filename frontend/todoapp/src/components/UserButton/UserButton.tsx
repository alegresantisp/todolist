'use client'
import { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const UserButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigate = (path: string) => {
    router.push(path);
    setIsOpen(false); 
  };

  return (
    <div className="relative">
      <div onClick={toggleMenu} className="cursor-pointer">
        <FaUserCircle className="text-white text-3xl" />
      </div>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
          <button
            onClick={() => handleNavigate('/register')}
            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200"
          >
            Registrarse
          </button>
          <button
            onClick={() => handleNavigate('/login')}
            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200"
          >
            Ingresar
          </button>
        </div>
      )}
    </div>
  );
};

export default UserButton;