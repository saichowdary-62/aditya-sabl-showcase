import { useState, useEffect } from 'react';
import { LoaderCircle } from 'lucide-react';

const quotes = [
  "The secret of getting ahead is getting started.",
  "The best time to plant a tree was 20 years ago. The second best time is now.",
  "It’s not whether you get knocked down, it’s whether you get up.",
  "The only way to do great work is to love what you do.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts."
];

const PageLoader = () => {
  const [quote, setQuote] = useState(quotes[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, 3000); // Change quote every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-background z-[100] flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center text-center">
        <LoaderCircle className="w-12 h-12 animate-spin text-primary mb-6" />
        <p className="text-lg font-semibold text-foreground max-w-md px-4">
          "{quote}"
        </p>
      </div>
    </div>
  );
};

export default PageLoader;
