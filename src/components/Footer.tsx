import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-background border-t py-3 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <span>Built with</span>
          <Heart className="h-3 w-3 text-red-500 fill-red-500" />
          <span>by Amar and team</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
