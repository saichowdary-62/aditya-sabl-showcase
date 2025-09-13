import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { GraduationCap, Calendar, History, Trophy, Image, Settings, X, Info, Menu } from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { to: '/', label: 'Home', icon: GraduationCap },
    { to: '/upcoming', label: 'Upcoming', icon: Calendar },
    { to: '/previous', label: 'Previous', icon: History },
    { to: '/winners', label: 'Winners', icon: Trophy },
    { to: '/gallery', label: 'Gallery', icon: Image },
    { to: '/about', label: 'About', icon: Info },
    { to: '/admin', label: 'Admin', icon: Settings },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-card border-b shadow-header">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <img 
              src="/aditya-removebg-preview (1).png" 
              alt="Aditya Logo" 
              className="h-10 w-10 object-contain transition-transform duration-300 hover:scale-110" 
            />
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold leading-tight">
                <span className="gradient-text-vibrant">ADITYA</span>{' '}
                <span className="gradient-text-vibrant">UNIVERSITY</span>
              </h1>
              <p className="text-xs text-muted-foreground font-medium">CSE Department - SABL Activities</p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-lg font-bold">
                <span className="gradient-text-vibrant">ADITYA</span>{' '}
                <span className="gradient-text-vibrant">UNIVERSITY</span>
              </h1>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center flex-1 max-w-4xl mx-8">
            <div className="flex items-center space-x-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `navbar-item-clean relative flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'text-primary active'
                        : 'text-foreground/80 hover:text-primary'
                    }`
                  }
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-foreground/70 hover:text-primary p-2 transition-colors duration-200 hover:bg-primary/5 rounded-lg focus-ring-tech"
              data-testid="mobile-menu-button"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-card border-t">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-foreground/80 hover:text-primary hover:bg-primary/10'
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;