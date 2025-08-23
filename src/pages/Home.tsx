import { Button } from '@/components/ui/button';
import WinnerCard from '@/components/WinnerCard';
import { thisWeekWinners } from '@/data/mockData';
import { Calendar, History, Trophy, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import universityBanner from '@/assets/university-banner.jpg';

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center bg-gradient-hero overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${universityBanner})` }}
        />
        <div className="relative z-10 text-center text-primary-foreground px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
  <span style={{ color: "#F2722C" }}>ADITYA</span> UNIVERSITY
</h1>

          <h2 className="text-2xl md:text-3xl font-semibold mb-4 opacity-90">
            CSE Department SABL Activities
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-80 max-w-2xl mx-auto">
            Fostering innovation, creativity, and excellence in computer science education through engaging activities and competitions.
          </p>
          <Button size="lg" variant="secondary" asChild className="animate-fade-in">
            <Link to="/upcoming">
              Explore Activities
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* This Week's Winners Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              🏆 This Week's Winners
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Celebrating our outstanding students who have excelled in recent SABL activities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            {thisWeekWinners.map((winner) => (
              <WinnerCard key={winner.id} winner={winner} featured={true} />
            ))}
          </div>
          
          <div className="text-center">
            <Button variant="outline" asChild>
              <Link to="/winners">
                View All Winners
                <Trophy className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Navigation Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Quick Navigation
            </h2>
            <p className="text-muted-foreground text-lg">
              Explore different sections of our SABL activities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Link to="/upcoming-activities" className="group">
              <div className="bg-card rounded-lg p-8 shadow-card hover:shadow-elevated transition-all duration-300 text-center group-hover:scale-105">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-2">Upcoming Activities</h3>
                <p className="text-muted-foreground">Discover exciting events and competitions coming soon</p>
              </div>
            </Link>
            
            <Link to="/previous-activities" className="group">
              <div className="bg-card rounded-lg p-8 shadow-card hover:shadow-elevated transition-all duration-300 text-center group-hover:scale-105">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <History className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-2">Previous Activities</h3>
                <p className="text-muted-foreground">Browse through our successful past events and achievements</p>
              </div>
            </Link>
            
            <Link to="/winners" className="group">
              <div className="bg-card rounded-lg p-8 shadow-card hover:shadow-elevated transition-all duration-300 text-center group-hover:scale-105">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Trophy className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-2">Hall of Fame</h3>
                <p className="text-muted-foreground">Honor roll of all our winners and achievers</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="bg-gradient-primary rounded-2xl p-8 md:p-12 text-primary-foreground">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">SABL Impact</h2>
              <p className="text-lg opacity-90">Measuring our success through student engagement and achievements</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">50+</div>
                <div className="text-sm opacity-80">Events Conducted</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">500+</div>
                <div className="text-sm opacity-80">Student Participants</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">100+</div>
                <div className="text-sm opacity-80">Winners Celebrated</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">25+</div>
                <div className="text-sm opacity-80">Industry Partners</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
