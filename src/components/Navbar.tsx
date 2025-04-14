import React, { useState, useEffect } from 'react';
import {
  Instagram,
  Home,
  Settings,
  Bell,
  Menu,
  X,
  LogIn,
  LogOut,
} from 'lucide-react';
import Cookies from 'js-cookie';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const token = Cookies.get('insta_token');

  const handleLogout = () => {
    Cookies.remove('insta_token');
    setIsMobileMenuOpen(false); // close mobile menu if open
    window.location.href = '/'; // Or use router.push('/') if using Next.js
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-gray-900/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <div className="flex items-center gap-2 group cursor-pointer">
              <Instagram className="w-8 h-8 text-pink-500 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
              <span className="text-white font-bold text-xl hidden sm:block">
                InstaSuite
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <NavItem icon={Home} text="Home" />
            <NavItem icon={Bell} text="Notifications" />
            <NavItem icon={Settings} text="Settings" />
            {token ? (
              <NavItem icon={LogOut} text="Logout" onClick={handleLogout} />
            ) : (
              <NavItem icon={LogIn} text="Login" href="/login" />
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen
            ? 'max-h-64 opacity-100'
            : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900/95 backdrop-blur-sm">
          <MobileNavItem icon={Home} text="Home" />
          <MobileNavItem icon={Bell} text="Notifications" />
          <MobileNavItem icon={Settings} text="Settings" />
          {token ? (
            <MobileNavItem
              icon={LogOut}
              text="Logout"
              onClick={handleLogout}
            />
          ) : (
            <MobileNavItem
              icon={LogIn}
              text="Login"
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
        </div>
      </div>
    </nav>
  );
};

const NavItem: React.FC<{
  icon: React.ElementType;
  text: string;
  onClick?: () => void;
  href?: string;
}> = ({ icon: Icon, text, onClick, href }) => {
  return (
    <a
      href={href || '#'}
      onClick={onClick}
      className="flex items-center gap-2 text-gray-400 hover:text-white px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-800 group"
    >
      <Icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
      <span>{text}</span>
    </a>
  );
};

const MobileNavItem: React.FC<{
  icon: React.ElementType;
  text: string;
  onClick?: () => void;
  href?: string;
}> = ({ icon: Icon, text, onClick, href }) => {
  return (
    <a
      href={href || '#'}
      onClick={onClick}
      className="flex items-center gap-3 text-gray-400 hover:text-white px-3 py-3 rounded-lg transition-all duration-200 hover:bg-gray-800"
    >
      <Icon className="w-5 h-5" />
      <span>{text}</span>
    </a>
  );
};

export default Navbar;
