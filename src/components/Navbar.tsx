import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Shield, LayoutDashboard, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { to: '/', label: 'Home', icon: LayoutDashboard },
    { to: '/admin', label: 'Admin Dashboard', icon: Shield },
  ];

  return (
    <nav className="bg-background border-b shadow-header sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3 flex-shrink-0">
            <img src="/aditya-removebg-preview (1).png" alt="Aditya Logo" className="h-10 w-10 object-contain" />
            <div>
              <h1 className="text-lg font-bold">
                <span className="text-[#F2722C]">ADMIN</span>{' '}
                <span className="text-primary">PANEL</span>
              </h1>
            </div>
          </div>
          
          <div className="hidden lg:flex space-x-6">
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

          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-muted-foreground hover:text-primary p-2 transition-colors duration-200"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-background border-t">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${
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
