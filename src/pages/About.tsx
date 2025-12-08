import React from 'react';
import { BookOpen, Users, Target, Award, Lightbulb, Rocket } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="page-bg-clean">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-10 sm:mb-12 animate-slide-up">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-3">
            About SABL
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Student-Based Learning (SABL) is an innovative educational approach that places students at the center of learning.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 mb-12 sm:mb-16">
          <div className="space-y-6 sm:space-y-8">
            <div className="clean-card p-6 sm:p-8 border-primary/20 animate-slide-up">
              <div className="flex items-center mb-4 sm:mb-6">
                <Target className="h-6 w-6 sm:h-8 sm:w-8 text-primary mr-2 sm:mr-3" />
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">What is SABL?</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base md:text-lg">
                Student-Based Learning (SABL) encourages active participation, critical thinking, and collaborative skills. 
                Through SABL, students take ownership of their education, fostering a deeper understanding of subjects and 
                developing essential life skills.
              </p>
            </div>
            
            <div className="stats-card-navy rounded-2xl p-6 sm:p-8 text-white shadow-elevated animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center mb-4 sm:mb-6">
                <Award className="h-6 w-6 sm:h-8 sm:w-8 text-white mr-2 sm:mr-3" />
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">SABL at Aditya University</h2>
              </div>
              <p className="text-white/90 leading-relaxed text-sm sm:text-base md:text-lg mb-4 sm:mb-6">
                Aditya University has embraced Student-Based Learning (SABL) to provide a dynamic and engaging educational experience. 
                Our SABL activities are designed to complement the traditional curriculum, offering students opportunities to apply 
                their knowledge in practical scenarios.
              </p>
              <a href="/SABL_Grading_Points_Overview.pdf" download>
                <button className="bg-white text-primary hover:bg-white/90 border-2 border-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg text-sm sm:text-base w-full sm:w-auto">
                  📄 Download Grading Points Overview
                </button>
              </a>
            </div>
          </div>
          
          <div className="space-y-4 sm:space-y-6">
            <img 
              src="https://adityauniversity.in/static/media/Placements.2a379859f890ac6bfad1.webp" 
              alt="Students collaborating in SABL activities" 
              className="rounded-2xl shadow-elevated w-full h-48 sm:h-64 object-cover animate-slide-up"
            />
            <img 
              src="https://cms-resources.prd.timeshighereducation.com/sites/default/files/styles/featured_image/public/2024-09/Aditya-supplied-campus-photo.jpg?h=1851c7f5&itok=UIvPELyF" 
              alt="Interactive learning session" 
              className="rounded-2xl shadow-elevated w-full h-48 sm:h-64 object-cover animate-slide-up" style={{ animationDelay: '0.1s' }}
            />
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 text-gradient-navy animate-slide-up px-4">
            SABL Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="stats-card-navy hover:scale-105 transition-all duration-300 animate-slide-up">
              <Users className="h-10 w-10 sm:h-12 sm:w-12 mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Collaborative Learning</h3>
              <p className="text-white/90 text-sm sm:text-base">Students work together in teams, sharing knowledge and building strong interpersonal skills.</p>
            </div>
            
            <div className="stats-card-light hover:scale-105 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <Lightbulb className="h-10 w-10 sm:h-12 sm:w-12 mb-3 sm:mb-4 text-primary" />
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-primary">Critical Thinking</h3>
              <p className="text-primary/80 text-sm sm:text-base">Encouraging analytical thinking and problem-solving through hands-on activities and challenges.</p>
            </div>
            
            <div className="stats-card-navy hover:scale-105 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Rocket className="h-10 w-10 sm:h-12 sm:w-12 mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Practical Application</h3>
              <p className="text-white/90 text-sm sm:text-base">Real-world projects and case studies that bridge the gap between theory and practice.</p>
            </div>
          </div>
        </div>

        {/* Activities Gallery */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 text-gradient-navy animate-slide-up px-4">
            SABL Activities in Action
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="relative group overflow-hidden rounded-2xl shadow-elevated animate-slide-up">
              <img 
                src="https://in8cdn.npfs.co/uploads/template/6102/1652/publish/images/images/admissioimages/S1.jpg?1747130168" 
                alt="SABL Project Work" 
                className="w-full h-48 sm:h-56 md:h-64 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex items-end hover:from-accent/80 transition-colors duration-300">
                <div className="p-4 sm:p-6 text-white">
                  <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Project-Based Learning</h3>
                  <p className="text-white/90 text-sm sm:text-base">Students work on real-world projects</p>
                </div>
              </div>
            </div>
            
            <div className="relative group overflow-hidden rounded-2xl shadow-elevated animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <img 
                src="https://adityaedu.net/wp-content/uploads/2025/02/WhatsApp-Image-2024-05-24-at-12.30.57-PM-1.jpeg" 
                alt="Group Discussion" 
                className="w-full h-48 sm:h-56 md:h-64 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex items-end hover:from-accent/80 transition-colors duration-300">
                <div className="p-4 sm:p-6 text-white">
                  <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Interactive Discussions</h3>
                  <p className="text-white/90 text-sm sm:text-base">Collaborative problem-solving sessions</p>
                </div>
              </div>
            </div>
            
            <div className="relative group overflow-hidden rounded-2xl shadow-elevated animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <img 
                src="https://images.unsplash.com/photo-1573164713712-03790a178651?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Workshop" 
                className="w-full h-48 sm:h-56 md:h-64 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex items-end hover:from-accent/80 transition-colors duration-300">
                <div className="p-4 sm:p-6 text-white">
                  <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Hands-on Workshops</h3>
                  <p className="text-white/90 text-sm sm:text-base">Practical skill development sessions</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Impact Section */}
        <div className="stats-card-navy rounded-3xl p-6 sm:p-8 md:p-12 text-white text-center shadow-elevated animate-slide-up">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">SABL Impact</h2>
          <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
            Our SABL approach has transformed the learning experience, creating more engaged, confident, and skilled graduates 
            ready to tackle real-world challenges.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">95%</div>
              <div className="text-white/80 text-xs sm:text-sm md:text-base">Student Satisfaction</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">80%</div>
              <div className="text-white/80 text-xs sm:text-sm md:text-base">Improved Performance</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">50+</div>
              <div className="text-white/80 text-xs sm:text-sm md:text-base">Activities Conducted</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">500+</div>
              <div className="text-white/80 text-xs sm:text-sm md:text-base">Students Engaged</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
