import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { GraduationCap, Calendar, History, Trophy, Image, Settings, X, Info } from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { to: '/', label: 'Home', icon: GraduationCap },
    { to: '/upcoming', label: 'Upcoming Activities', icon: Calendar },
    { to: '/previous', label: 'Previous Activities', icon: History },
    { to: '/winners', label: 'Winners', icon: Trophy },
    { to: '/gallery', label: 'Gallery', icon: Image },
    { to: '/about', label: 'About', icon: Info },
    { to: '/admin', label: 'Admin', icon: Settings },
  ];

  return (
    <nav className="bg-background border-b shadow-header sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-start h-16">
          <div className="flex items-center space-x-3 flex-shrink-0">
            <img src="/aditya-removebg-preview (1).png" alt="Aditya Logo" className="h-10 w-10 object-contain" />
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold">
                <span className="text-primary">ADITYA</span> UNIVERSITY
              </h1>
              <p className="text-sm text-muted-foreground">Department of Computer Science and Engineering SABL Activites</p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-lg font-bold">
                <span className="text-primary">ADITYA</span> UNIVERSITY
              </h1>
            </div>
          </div>
          
          <div className="hidden lg:flex space-x-6 ml-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          {/* Mobile hamburger menu */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-muted-foreground hover:text-primary p-2 transition-colors duration-200"
              data-testid="mobile-menu-button"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : (
                <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-background border-t">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
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
