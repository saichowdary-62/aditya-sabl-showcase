import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import WinnerCard from '@/components/WinnerCard';
import WinnerDetailsModal from '@/components/WinnerDetailsModal';
import { getWinners, Winner } from '@/lib/data-service';
import { useData } from '@/contexts/DataContext';
import { Calendar, History, Trophy, ArrowRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [thisWeekWinners, setThisWeekWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWinner, setSelectedWinner] = useState<Winner | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { dataChanged } = useData();

  const handleWinnerClick = (winner: Winner) => {
    setSelectedWinner(winner);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedWinner(null);
  };

  useEffect(() => {
    const fetchWinners = async () => {
      setLoading(true);
      try {
        const allWinners = await getWinners();
        setThisWeekWinners(allWinners.filter(w => w.isThisWeekWinner));
      } catch (error) {
        console.error('Error fetching winners:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchWinners();
  }, [dataChanged]);

  return (
    <div className="page-bg-clean">
      {/* Hero Section */}
      <section className="relative min-h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden hero-gradient">
        {/* Background Image */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-blue-600/90 to-primary/90">
          <img 
            src="https://ik.imagekit.io/lhb4hvprkpz/img8_7aJkuzpeF.jpg?updatedAt=1627472961687" 
            alt="Students collaborating" 
            className="w-full h-full object-cover mix-blend-overlay opacity-30"
          />
        </div>

        {/* Bubbles Animation */}
        <div className="bubbles-container">
          <div className="bubble bubble-orange bubble-1"></div>
          <div className="bubble bubble-navy bubble-2"></div>
          <div className="bubble bubble-white bubble-3"></div>
          <div className="bubble bubble-orange bubble-4"></div>
          <div className="bubble bubble-navy bubble-5"></div>
          <div className="bubble bubble-white bubble-6"></div>
          <div className="bubble bubble-orange bubble-7"></div>
          <div className="bubble bubble-navy bubble-8"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 animate-slide-up">
           <span className="text-orange-500">ADITYA</span>{' '}
<span style={{ color: '#0C3C7C' }}>UNIVERSITY</span>

          </h1>
 <h2 className="text-lg sm:text-2xl md:text-3xl font-semibold mb-4 opacity-90 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Department of Computer Science and Engineering
            <br />
            SABL Activities
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-8 opacity-80 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.4s' }}>
            Fostering innovation, creativity, and excellence in computer science education through engaging activities and competitions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <Button size="lg" asChild className="btn-orange-accent w-full sm:w-auto">
              <Link to="/upcoming">
                Explore Activities
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" asChild className="bg-white text-primary border-2 border-white hover:bg-primary hover:text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto">
              <Link to="/performance">
                <TrendingUp className="mr-2 h-5 w-5" />
                Check Performance
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* This Week's Winners Section */}
      <section className="section-clean">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 animate-slide-up">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-3 sm:mb-4">
              🏆 Top Performers of the Week
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto px-4">
              Celebrating our outstanding students who have excelled in recent SABL activities
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-8">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="clean-card p-6 animate-pulse">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-muted rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-muted rounded mb-2"></div>
                      <div className="h-3 bg-muted rounded mb-1"></div>
                      <div className="h-3 bg-muted rounded"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : thisWeekWinners.length > 0 ? (
              thisWeekWinners
                .sort((a, b) => (a.position || 1) - (b.position || 1))
                .map((winner, index) => (
                  <div key={winner.id} className="animate-slide-up relative celebration-container" style={{ animationDelay: `${index * 0.1}s` }}>
                    {/* Celebration particles */}
                    <div className="celebration-particles">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className={`celebration-particle celebration-particle-${i + 1}`}></div>
                      ))}
                    </div>
                    
                    {/* Floating emojis */}
                    <div className="floating-emojis">
                      <div className="floating-emoji floating-emoji-1">🎉</div>
                      <div className="floating-emoji floating-emoji-2">✨</div>
                      <div className="floating-emoji floating-emoji-3">🏆</div>
                      <div className="floating-emoji floating-emoji-4">🎊</div>
                    </div>
                    
                    <WinnerCard 
                      winner={winner} 
                      featured={true} 
                      onClick={() => handleWinnerClick(winner)}
                    />
                  </div>
                ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No winners selected for this week yet.</p>
              </div>
            )}
          </div>
          
          <div className="text-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Button variant="outline" asChild className="btn-navy-outline">
              <Link to="/winners">
                View All Winners
                <Trophy className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="section-clean bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="stats-card-navy rounded-2xl p-6 sm:p-8 md:p-12 text-white animate-slide-up shadow-elevated">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">SABL Impact</h2>
              <p className="text-sm sm:text-base md:text-lg opacity-90">Measuring our success through student engagement and achievements</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center">
              <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">10+</div>
                <div className="text-xs sm:text-sm opacity-80">Events Conducted</div>
              </div>
              <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">600+</div>
                <div className="text-xs sm:text-sm opacity-80">Student Participants</div>
              </div>
              <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">60+</div>
                <div className="text-xs sm:text-sm opacity-80">Winners Celebrated</div>
              </div>
              <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">25+</div>
                <div className="text-xs sm:text-sm opacity-80">Industry Partners</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Navigation Section */}
      <section className="section-clean">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 animate-slide-up">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-3 sm:mb-4">
              Quick Navigation
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg px-4">
              Explore different sections of our SABL activities
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto">
            <Link to="/upcoming" className="group" onClick={() => setTimeout(() => window.scrollTo(0, 0), 100)}>
              <div className="clean-card clean-card-hover p-6 sm:p-8 text-center border-primary/20 group-hover:border-primary/40 transition-all duration-300">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 transition-all group-hover:scale-110">
                  <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-primary mb-2">Upcoming Activities</h3>
                <p className="text-sm sm:text-base text-muted-foreground">Discover exciting events and competitions coming soon</p>
              </div>
            </Link>
            
            <Link to="/previous" className="group" onClick={() => setTimeout(() => window.scrollTo(0, 0), 100)}>
              <div className="clean-card clean-card-hover p-6 sm:p-8 text-center border-primary/20 group-hover:border-primary/40 transition-all duration-300">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 transition-all group-hover:scale-110">
                  <History className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-primary mb-2">Previous Activities</h3>
                <p className="text-sm sm:text-base text-muted-foreground">Browse through our successful past events and achievements</p>
              </div>
            </Link>
            
            <Link to="/winners" className="group sm:col-span-2 md:col-span-1" onClick={() => setTimeout(() => window.scrollTo(0, 0), 100)}>
              <div className="clean-card clean-card-hover p-6 sm:p-8 text-center border-primary/20 group-hover:border-primary/40 transition-all duration-300">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 transition-all group-hover:scale-110">
                  <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-primary mb-2">Hall of Fame</h3>
                <p className="text-sm sm:text-base text-muted-foreground">Honor roll of all our winners and achievers</p>
              </div>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Winner Details Modal */}
      <WinnerDetailsModal 
        winner={selectedWinner}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Home;
