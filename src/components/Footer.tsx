import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-background border-t py-3 mt-auto w-full">
      <div className="w-full px-4">
        <p className="text-xs text-muted-foreground text-center w-full">
          Forged by{' '}
          <a 
            href="#" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-bold text-primary hover:text-primary/80 transition-colors"
          >
            
            
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
