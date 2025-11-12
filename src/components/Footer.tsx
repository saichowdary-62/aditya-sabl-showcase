import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-background border-t py-4 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span></span>
          <Heart className="h-4 w-4 text-red-500 fill-red-500" />
          <span>Every event needs your energy</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
