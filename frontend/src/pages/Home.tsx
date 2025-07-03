
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, ChevronRight, BarChart2, Shield, Users, Star, TrendingUp, Award, CheckCircle } from "lucide-react";

// Custom hook for typing animation
const useTypingAnimation = (text: string, speed: number = 50) => {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Reset animation when text changes (e.g., language switch)
    setDisplayText("");
    setCurrentIndex(0);
    setIsTyping(true);
  }, [text]);

  useEffect(() => {
    if (!isTyping) return;

    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
    }
  }, [currentIndex, isTyping, speed, text]);

  return { displayText, isTyping };
};

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();

  // CSS for blinking cursor animation
  const cursorStyle = {
    animation: 'blink 1s step-end infinite',
    position: 'relative'
  };

  // Add keyframes for the blinking cursor
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes blink {
        from, to { opacity: 1; }
        50% { opacity: 0; }
      }

      .cursor-i-beam::before, .cursor-i-beam::after {
        content: '';
        position: absolute;
        left: -1px;
        right: -1px;
        height: 1px;
        background-color: #16a34a;
      }

      .cursor-i-beam::before {
        top: 0;
      }

      .cursor-i-beam::after {
        bottom: 0;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    // Check if user is logged in
    const userInfo = localStorage.getItem('dgpoultry_user');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      setIsLoggedIn(true);

      // Determine user role based on flags
      if (user.isWorker) {
        setUserRole("worker");
      } else if (user.isVet) {
        setUserRole("vet");
      } else {
        setUserRole("farmer");
      }
    }
  }, []);

  const handleGetStarted = () => {
    if (isLoggedIn) {
      // Redirect to appropriate dashboard based on role
      if (userRole === "worker") {
        navigate("/worker");
      } else if (userRole === "vet") {
        navigate("/vet");
      } else {
        navigate("/dashboard");
      }
    } else {
      navigate("/register");
    }
  };

  const handleLogin = () => {
    if (isLoggedIn) {
      // Redirect to appropriate dashboard based on role
      if (userRole === "worker") {
        navigate("/worker");
      } else if (userRole === "vet") {
        navigate("/vet");
      } else {
        navigate("/dashboard");
      }
    } else {
      navigate("/login");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('dgpoultry_user');
    setIsLoggedIn(false);
    setUserRole("");
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-green-50 via-green-50 to-white">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-green-100 to-green-200 rounded-bl-full opacity-50 -z-10 animate-pulse" style={{ animationDuration: '15s' }}></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-gradient-to-tr from-green-100 to-green-200 rounded-tr-full opacity-50 -z-10 animate-pulse" style={{ animationDuration: '20s' }}></div>
      <div className="absolute top-1/3 left-10 w-16 h-16 bg-gradient-to-r from-yellow-100 to-green-100 rounded-full opacity-30 -z-10 animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute bottom-1/4 right-10 w-24 h-24 bg-gradient-to-l from-yellow-100 to-green-100 rounded-full opacity-30 -z-10 animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }}></div>

      {/* Additional decorative elements */}
      <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-gradient-to-tr from-green-200 to-green-300 rounded-full opacity-20 -z-10 animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }}></div>
      <div className="absolute bottom-1/3 left-1/4 w-20 h-20 bg-gradient-to-bl from-green-200 to-green-300 rounded-full opacity-20 -z-10 animate-pulse" style={{ animationDuration: '18s', animationDelay: '3s' }}></div>

      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-md py-4 px-4 md:px-8 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Logo size="lg" className="transition-transform duration-300 hover:scale-105" />
          </div>
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-green-50 transition-colors duration-300">
                  <Globe className="h-5 w-5 text-green-600" />
                  <span className="sr-only">{t('app.language')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="animate-in fade-in-80 zoom-in-95">
                <DropdownMenuItem onClick={() => setLanguage('en')} className={language === 'en' ? 'bg-green-50' : ''}>
                  {t('app.english')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('sw')} className={language === 'sw' ? 'bg-green-50' : ''}>
                  {t('app.swahili')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {isLoggedIn ? (
              <>
                <Button 
                  variant="outline" 
                  className="border-green-600 text-green-700 hover:bg-green-50 transition-all duration-300 hover:scale-105"
                  onClick={handleLogout}
                >
                  {t('home.logout')}
                </Button>
                <Button 
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                  onClick={() => handleGetStarted()}
                >
                  {t('home.dashboard')}
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="border-green-600 text-green-700 hover:bg-green-50 transition-all duration-300 hover:scale-105"
                  onClick={handleLogin}
                >
                  {t('home.login')}
                </Button>
                <Link to="/register">
                  <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                    {t('home.register')}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-24">
        <div className="relative">
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-gradient-to-br from-green-200 to-green-300 rounded-full opacity-50 animate-pulse"></div>
          <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-gradient-to-bl from-green-200 to-green-300 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-8 relative">
            {/* Decorative line */}
            <div className="absolute left-0 top-0 h-16 w-1 bg-gradient-to-b from-green-400 to-green-600 rounded-full hidden md:block"></div>

            <div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent">
                  {t('home.hero.title')}
                </span>
              </h1>
              <div className="mt-4 text-lg text-gray-600 leading-relaxed h-16 md:h-12">
                {(() => {
                  const subtitleText = t('home.hero.subtitle');
                  const { displayText, isTyping } = useTypingAnimation(subtitleText, 40);
                  return (
                    <p>
                      {displayText}
                      {isTyping && (
                        <span className="inline-block w-0.5 h-5 bg-green-600 ml-0.5 rounded-sm cursor-i-beam" style={cursorStyle}></span>
                      )}
                    </p>
                  );
                })()}
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button 
                className="group bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-6 py-2 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={handleGetStarted}
              >
                <span>{isLoggedIn ? t('home.goToDashboard') : t('home.getStarted')}</span>
                <ChevronRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
              {!isLoggedIn && (
                <Button 
                  variant="outline" 
                  className="border-green-600 text-green-700 hover:bg-green-50 px-6 py-2 text-lg transition-all duration-300 transform hover:scale-105"
                  onClick={handleLogin}
                >
                  {t('home.login')}
                </Button>
              )}
            </div>

          </div>

          <div className="flex justify-center relative">
            {/* Decorative dots */}
            <div className="absolute -top-6 -left-6 grid grid-cols-3 gap-2 opacity-20 hidden md:grid">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="h-2 w-2 rounded-full bg-green-500"></div>
              ))}
            </div>

            <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 max-w-md border border-green-100 transform hover:-rotate-1 hover:scale-105">
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full blur opacity-30 animate-pulse"></div>
                  <Logo size="lg" className="relative" />
                </div>
              </div>

              <div className="space-y-5">
                <div className="p-5 bg-gradient-to-r from-green-50 to-white rounded-lg hover:shadow-md transition-all duration-300 transform hover:translate-y-[-2px] border border-green-100">
                  <div className="flex items-start">
                    <div className="mr-4 bg-green-100 p-2 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 text-lg">{t('home.features.recordKeeping.title')}</h3>
                      <p className="text-gray-600 mt-1">{t('home.features.recordKeeping.description')}</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-gradient-to-r from-green-50 to-white rounded-lg hover:shadow-md transition-all duration-300 transform hover:translate-y-[-2px] border border-green-100">
                  <div className="flex items-start">
                    <div className="mr-4 bg-green-100 p-2 rounded-lg">
                      <BarChart2 className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 text-lg">{t('home.features.financialInsights.title')}</h3>
                      <p className="text-gray-600 mt-1">{t('home.features.financialInsights.description')}</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-gradient-to-r from-green-50 to-white rounded-lg hover:shadow-md transition-all duration-300 transform hover:translate-y-[-2px] border border-green-100">
                  <div className="flex items-start">
                    <div className="mr-4 bg-green-100 p-2 rounded-lg">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 text-lg">{t('home.features.multiUser.title')}</h3>
                      <p className="text-gray-600 mt-1">{t('home.features.multiUser.description')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 py-8 px-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-green-100">
          <h2 className="text-2xl font-bold text-center mb-8">
            <span className="bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent">
              Empowering Poultry Farmers Worldwide
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { value: "10K+", label: "Active Users", icon: <Users className="h-6 w-6 text-green-600" /> },
              { value: "98%", label: "Satisfaction Rate", icon: <Star className="h-6 w-6 text-green-600" /> },
              { value: "25%", label: "Profit Increase", icon: <TrendingUp className="h-6 w-6 text-green-600" /> },
              { value: "24/7", label: "Support Available", icon: <Shield className="h-6 w-6 text-green-600" /> }
            ].map((stat, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-white to-green-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 text-center border border-green-100"
              >
                <div className="flex justify-center mb-2">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-green-700">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mt-20 relative">
          {/* Decorative elements */}
          <div className="absolute -top-10 right-10 w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full opacity-30 -z-10"></div>
          <div className="absolute -bottom-10 left-10 w-16 h-16 bg-gradient-to-tr from-green-100 to-green-200 rounded-full opacity-30 -z-10"></div>

          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            <span className="bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent">
              {t('home.testimonials.title')}
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: t('home.testimonials.1.quote'),
                name: t('home.testimonials.1.name'),
                role: t('home.testimonials.1.role'),
                rating: 5,
                image: "https://randomuser.me/api/portraits/women/44.jpg"
              },
              {
                quote: t('home.testimonials.2.quote'),
                name: t('home.testimonials.2.name'),
                role: t('home.testimonials.2.role'),
                rating: 5,
                image: "https://randomuser.me/api/portraits/men/32.jpg"
              },
              {
                quote: t('home.testimonials.3.quote'),
                name: t('home.testimonials.3.name'),
                role: t('home.testimonials.3.role'),
                rating: 5,
                image: "https://randomuser.me/api/portraits/women/68.jpg"
              }
            ].map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-gradient-to-b from-white to-green-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border border-green-100 relative"
              >
                {/* Quote mark */}
                <div className="absolute top-4 right-4 text-green-200">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="currentColor" strokeWidth="0">
                    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
                    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
                  </svg>
                </div>

                {/* Rating stars */}
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                <p className="text-gray-700 text-lg leading-relaxed mb-6">{testimonial.quote}</p>

                <div className="flex items-center mt-auto">
                  <div className="h-12 w-12 rounded-full overflow-hidden mr-4 border-2 border-green-100 shadow-sm">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        // Fallback if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.classList.add('bg-green-100', 'flex', 'items-center', 'justify-center');
                        target.parentElement!.innerHTML = `<span class="text-green-700 font-bold text-lg">${testimonial.name.charAt(0)}</span>`;
                      }}
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{testimonial.name}</p>
                    <p className="text-green-700 text-sm">{testimonial.role}</p>
                  </div>

                  {/* Decorative element */}
                  <div className="ml-auto bg-green-100 h-8 w-8 rounded-full flex items-center justify-center">
                    <Award className="h-4 w-4 text-green-600" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to action */}
          <div className="mt-12 text-center">
            <Button 
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-full"
              onClick={handleGetStarted}
            >
              {isLoggedIn ? t('home.goToDashboard') : t('home.getStarted')}
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-white to-green-50 mt-24 border-t border-green-100 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute bottom-0 right-0 w-1/4 h-1/4 bg-gradient-to-tl from-green-100 to-transparent rounded-tl-full opacity-50 -z-10"></div>
        <div className="absolute top-0 left-0 w-1/5 h-1/5 bg-gradient-to-br from-green-100 to-transparent rounded-br-full opacity-50 -z-10"></div>

        <div className="max-w-7xl mx-auto pt-12 pb-8 px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <Logo size="lg" className="transition-transform duration-300 hover:scale-105" />
              </div>
              <p className="text-gray-600 mb-6 max-w-md">
                Our state-of-the-art poultry management system helps farmers track costs, monitor production, and boost profits with comprehensive analytics and insights.
              </p>
              <div className="flex space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="text-sm border-green-200 hover:bg-green-50 transition-colors duration-300">
                      <Globe className="h-4 w-4 mr-2 text-green-600" />
                      {t('home.selectLanguage')}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="animate-in fade-in-80 zoom-in-95">
                    <DropdownMenuItem onClick={() => setLanguage('en')} className={language === 'en' ? 'bg-green-50' : ''}>
                      {t('app.english')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLanguage('sw')} className={language === 'sw' ? 'bg-green-50' : ''}>
                      {t('app.swahili')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-4 text-lg">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/" className="text-gray-600 hover:text-green-700 transition-colors duration-300 flex items-center">
                    <ChevronRight className="h-4 w-4 mr-1 text-green-500" />
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-gray-600 hover:text-green-700 transition-colors duration-300 flex items-center">
                    <ChevronRight className="h-4 w-4 mr-1 text-green-500" />
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-gray-600 hover:text-green-700 transition-colors duration-300 flex items-center">
                    <ChevronRight className="h-4 w-4 mr-1 text-green-500" />
                    Register
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-4 text-lg">Features</h3>
              <ul className="space-y-3">
                <li className="text-gray-600 flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-1 flex-shrink-0" />
                  <span>Record Keeping</span>
                </li>
                <li className="text-gray-600 flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-1 flex-shrink-0" />
                  <span>Financial Insights</span>
                </li>
                <li className="text-gray-600 flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-1 flex-shrink-0" />
                  <span>Multi-User System</span>
                </li>
                <li className="text-gray-600 flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-1 flex-shrink-0" />
                  <span>Performance Analytics</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-green-100 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 mb-4 md:mb-0">
              {t('home.footer.copyright')}
            </p>
            <div className="flex space-x-6">
              <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50 rounded-full p-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </Button>
              <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50 rounded-full p-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </Button>
              <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50 rounded-full p-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
