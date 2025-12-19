import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-background border-t py-3 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <span>Forged by</span>
          <a 
            href="https://ropebit.live/bitpowr" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-bold text-primary hover:text-primary/80 transition-colors"
          >
            BitPowr
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
