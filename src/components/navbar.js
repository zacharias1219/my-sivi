import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { jwtDecode } from "jwt-decode";
import { useUsers } from '@/context/UsersContext';

export default function Navbar() {
  const { currentUser, setCurrentUser } = useUsers();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log("Decoded token structure in Navbar:", decodedToken); // Inspect the structure closely here
        setCurrentUser(decodedToken); // Set currentUser to decodedToken
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, [setCurrentUser]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth/login');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto py-4 flex justify-between items-center">
        <div className="text-3xl font-bold text-gray-800">
          <Link href="/home">Mysivi</Link>
        </div>

        <div className="relative">
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2">
            {/* Debugging profilePicture and username extraction */}
            {currentUser?.profilePicture ? (
              <img src={currentUser.profilePicture} alt="User" className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <span className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center">
                {/* Use email as fallback if username is missing */}
                {currentUser?.username?.charAt(0).toUpperCase() || currentUser?.email?.charAt(0).toUpperCase() || 'U'}
              </span>
            )}
            <span className="text-gray-800">{currentUser?.username || currentUser?.email || 'User'}</span>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Profile
              </Link>
              <Link href="/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}