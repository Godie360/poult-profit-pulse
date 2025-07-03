import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define available languages
export type Language = 'en' | 'sw';

// Define the context type
type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

// Create the context with default values
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// English translations
const enTranslations: Record<string, string> = {
  // Common
  'app.title': 'Poultry Management System',
  'app.language': 'Language',
  'app.english': 'English',
  'app.swahili': 'Swahili',

  // Home Page
  'home.hero.title': 'Empowering Poultry Farmers With Smart Financial Insights',
  'home.hero.subtitle': 'Track your costs, monitor production, and boost profits with our comprehensive poultry management system.',
  'home.getStarted': 'Get Started',
  'home.goToDashboard': 'Go to Dashboard',
  'home.login': 'Login',
  'home.logout': 'Logout',
  'home.dashboard': 'Dashboard',
  'home.register': 'Register',
  'home.features.title': 'Trusted by Poultry Farmers',
  'home.features.recordKeeping.title': 'Streamlined Record Keeping',
  'home.features.recordKeeping.description': 'Easily record and track all your poultry farm activities',
  'home.features.financialInsights.title': 'Financial Insights',
  'home.features.financialInsights.description': 'Get clear reports on expenses, income, and profitability',
  'home.features.multiUser.title': 'Multi-User System',
  'home.features.multiUser.description': 'Different roles for farmers, workers, and veterinarians',
  'home.testimonials.title': 'Trusted by Poultry Farmers',
  'home.testimonials.1.quote': 'DG Poultry has transformed how I manage my farm, increasing profits by 25%.',
  'home.testimonials.1.name': 'Grace M.',
  'home.testimonials.1.role': 'Layer Farm Owner',
  'home.testimonials.2.quote': 'The reports help me make informed decisions about feed purchases and health management.',
  'home.testimonials.2.name': 'David K.',
  'home.testimonials.2.role': 'Broiler Farmer',
  'home.testimonials.3.quote': 'As a veterinarian, I can easily track treatments and monitor flock health trends.',
  'home.testimonials.3.name': 'Dr. Sarah J.',
  'home.testimonials.3.role': 'Poultry Veterinarian',
  'home.footer.copyright': '© 2025 DG Poultry. All rights reserved.',
  'home.selectLanguage': 'Select Language',

  // Navigation
  'nav.dashboard': 'Dashboard',
  'nav.pens': 'Pens',
  'nav.records': 'Records',
  'nav.reports': 'Reports',
  'nav.team': 'Team',
  'nav.main': 'Main',
  'nav.user': 'User',

  // Dashboard
  'dashboard.welcome': 'Welcome back',
  'dashboard.addRecord': 'Add Record',
  'dashboard.totalRevenue': 'Total Revenue',
  'dashboard.currentPeriod': 'Current period',
  'dashboard.feedMainExpense': 'Feed is main expense',
  'dashboard.totalEggs': 'Total eggs this period',
  'dashboard.lowerIsBetter': 'Lower is better',
  'dashboard.totalExpenses': 'Total Expenses',
  'dashboard.eggProduction': 'Egg Production',
  'dashboard.mortalityRate': 'Mortality Rate',
  'dashboard.farmPerformance': 'Farm Performance',
  'dashboard.daily': 'Daily',
  'dashboard.weekly': 'Weekly',
  'dashboard.monthly': 'Monthly',
  'dashboard.chartDescription': 'This chart shows your farm\'s performance over time. Higher egg production and sales with lower expenses indicate better performance.',
  'dashboard.pensSummary': 'Pens Summary',
  'dashboard.recentExpenses': 'Recent Expenses',
  'dashboard.recentTreatments': 'Recent Treatments',
  'dashboard.recentDailyLogs': 'Recent Daily Logs',
  'dashboard.viewAllPens': 'View All Pens',
  'dashboard.viewAllRecords': 'View All Records',
  'dashboard.viewAllExpenses': 'View all expenses',
  'dashboard.viewVetDashboard': 'View Vet Dashboard',
  'dashboard.viewWorkerDashboard': 'View Worker Dashboard',

  // Auth
  'auth.login': 'Login',
  'auth.register': 'Register',
  'auth.email': 'Email',
  'auth.password': 'Password',
  'auth.forgotPassword': 'Forgot Password?',
  'auth.myAccount': 'My Account',
  'auth.profile': 'Profile',
  'auth.settings': 'Settings',
  'auth.logout': 'Log Out',
  'auth.loginToAccount': 'Login to Your Account',
  'auth.emailOrUsername': 'Email or Username',
  'auth.loggingIn': 'Logging in...',
  'auth.dontHaveAccount': 'Don\'t have an account?',
  'auth.registerNow': 'Register Now',
  'auth.backToHome': 'Back to Home',
  'auth.loginSuccessful': 'Login successful!',
  'auth.welcomeBack': 'Welcome back to DG Poultry',
  'auth.loginFailed': 'Login failed',
  'auth.invalidCredentials': 'Invalid credentials. Please try again.',

  // General
  'general.loading': 'Loading...',
  'general.noData': 'No data found',
  'general.error': 'Error',
  'general.success': 'Success',
  'general.accessRestricted': 'Access Restricted',
  'general.farmerRestriction': 'Farmers can only view the farmer dashboard.',
  'general.workerRestriction': 'Workers can only view the worker dashboard.',
  'general.vetRestriction': 'Veterinarians can only view the vet dashboard.',
  'general.loggedOut': 'Logged out successfully',
  'general.logoutMessage': 'You have been logged out of your account.',
  'general.farmOwner': 'Farm Owner',
  'general.poultryWorker': 'Poultry Worker',
  'general.veterinarian': 'Veterinarian',
};

// Swahili translations
const swTranslations: Record<string, string> = {
  // Common
  'app.title': 'Mfumo wa Usimamizi wa Kuku',
  'app.language': 'Lugha',
  'app.english': 'Kiingereza',
  'app.swahili': 'Kiswahili',

  // Home Page
  'home.hero.title': 'Kuwasaidia Wafugaji wa Kuku Kupata Ufahamu wa Kifedha',
  'home.hero.subtitle': 'Fuatilia gharama zako, angalia uzalishaji, na ongeza faida na mfumo wetu kamili wa usimamizi wa kuku.',
  'home.getStarted': 'Anza Sasa',
  'home.goToDashboard': 'Nenda kwenye Dashibodi',
  'home.login': 'Ingia',
  'home.logout': 'Toka',
  'home.dashboard': 'Dashibodi',
  'home.register': 'Jisajili',
  'home.features.title': 'Inaaminiwa na Wafugaji wa Kuku',
  'home.features.recordKeeping.title': 'Uwekaji Kumbukumbu Rahisi',
  'home.features.recordKeeping.description': 'Rekodi na fuatilia shughuli zote za shamba lako la kuku kwa urahisi',
  'home.features.financialInsights.title': 'Ufahamu wa Kifedha',
  'home.features.financialInsights.description': 'Pata ripoti wazi kuhusu matumizi, mapato, na faida',
  'home.features.multiUser.title': 'Mfumo wa Watumiaji Wengi',
  'home.features.multiUser.description': 'Majukumu tofauti kwa wakulima, wafanyakazi, na madaktari wa mifugo',
  'home.testimonials.title': 'Inaaminiwa na Wafugaji wa Kuku',
  'home.testimonials.1.quote': 'DG Poultry imebadilisha jinsi ninavyosimamia shamba langu, ikiongeza faida kwa 25%.',
  'home.testimonials.1.name': 'Grace M.',
  'home.testimonials.1.role': 'Mmiliki wa Shamba la Mayai',
  'home.testimonials.2.quote': 'Ripoti zinasaidia kufanya maamuzi sahihi kuhusu ununuzi wa chakula na usimamizi wa afya.',
  'home.testimonials.2.name': 'David K.',
  'home.testimonials.2.role': 'Mfugaji wa Kuku wa Nyama',
  'home.testimonials.3.quote': 'Kama daktari wa mifugo, ninaweza kufuatilia matibabu na kuangalia mienendo ya afya ya kuku kwa urahisi.',
  'home.testimonials.3.name': 'Dkt. Sarah J.',
  'home.testimonials.3.role': 'Daktari wa Kuku',
  'home.footer.copyright': '© 2025 DG Poultry. Haki zote zimehifadhiwa.',
  'home.selectLanguage': 'Chagua Lugha',

  // Navigation
  'nav.dashboard': 'Dashibodi',
  'nav.pens': 'Mabanda',
  'nav.records': 'Kumbukumbu',
  'nav.reports': 'Ripoti',
  'nav.team': 'Timu',
  'nav.main': 'Kuu',
  'nav.user': 'Mtumiaji',

  // Dashboard
  'dashboard.welcome': 'Karibu tena',
  'dashboard.addRecord': 'Ongeza Kumbukumbu',
  'dashboard.totalRevenue': 'Mapato Yote',
  'dashboard.currentPeriod': 'Kipindi cha sasa',
  'dashboard.feedMainExpense': 'Chakula ni gharama kubwa',
  'dashboard.totalEggs': 'Mayai yote kipindi hiki',
  'dashboard.lowerIsBetter': 'Chini ni bora',
  'dashboard.totalExpenses': 'Gharama Zote',
  'dashboard.eggProduction': 'Uzalishaji wa Mayai',
  'dashboard.mortalityRate': 'Kiwango cha Vifo',
  'dashboard.farmPerformance': 'Utendaji wa Shamba',
  'dashboard.daily': 'Kila Siku',
  'dashboard.weekly': 'Kila Wiki',
  'dashboard.monthly': 'Kila Mwezi',
  'dashboard.chartDescription': 'Chati hii inaonyesha utendaji wa shamba lako kwa muda. Uzalishaji wa juu wa mayai na mauzo na gharama za chini zinaonyesha utendaji bora.',
  'dashboard.pensSummary': 'Muhtasari wa Mabanda',
  'dashboard.recentExpenses': 'Gharama za Hivi Karibuni',
  'dashboard.recentTreatments': 'Matibabu ya Hivi Karibuni',
  'dashboard.recentDailyLogs': 'Kumbukumbu za Kila Siku',
  'dashboard.viewAllPens': 'Tazama Mabanda Yote',
  'dashboard.viewAllRecords': 'Tazama Kumbukumbu Zote',
  'dashboard.viewAllExpenses': 'Tazama gharama zote',
  'dashboard.viewVetDashboard': 'Tazama Dashibodi ya Daktari',
  'dashboard.viewWorkerDashboard': 'Tazama Dashibodi ya Mfanyakazi',

  // Auth
  'auth.login': 'Ingia',
  'auth.register': 'Jisajili',
  'auth.email': 'Barua pepe',
  'auth.password': 'Nywila',
  'auth.forgotPassword': 'Umesahau Nywila?',
  'auth.myAccount': 'Akaunti Yangu',
  'auth.profile': 'Wasifu',
  'auth.settings': 'Mipangilio',
  'auth.logout': 'Toka',
  'auth.loginToAccount': 'Ingia kwenye Akaunti Yako',
  'auth.emailOrUsername': 'Barua pepe au Jina la mtumiaji',
  'auth.loggingIn': 'Inaingia...',
  'auth.dontHaveAccount': 'Huna akaunti?',
  'auth.registerNow': 'Jisajili Sasa',
  'auth.backToHome': 'Rudi Nyumbani',
  'auth.loginSuccessful': 'Umeingia kikamilifu!',
  'auth.welcomeBack': 'Karibu tena kwenye DG Poultry',
  'auth.loginFailed': 'Kuingia kumeshindikana',
  'auth.invalidCredentials': 'Taarifa si sahihi. Tafadhali jaribu tena.',

  // General
  'general.loading': 'Inapakia...',
  'general.noData': 'Hakuna data iliyopatikana',
  'general.error': 'Hitilafu',
  'general.success': 'Mafanikio',
  'general.accessRestricted': 'Ufikiaji Umezuiliwa',
  'general.farmerRestriction': 'Wakulima wanaweza kuona dashibodi ya mkulima tu.',
  'general.workerRestriction': 'Wafanyakazi wanaweza kuona dashibodi ya mfanyakazi tu.',
  'general.vetRestriction': 'Madaktari wa mifugo wanaweza kuona dashibodi ya daktari tu.',
  'general.loggedOut': 'Umetoka kwa mafanikio',
  'general.logoutMessage': 'Umetoka kwenye akaunti yako.',
  'general.farmOwner': 'Mmiliki wa Shamba',
  'general.poultryWorker': 'Mfanyakazi wa Kuku',
  'general.veterinarian': 'Daktari wa Mifugo',
};

// Create a translations object with all languages
const translations: Record<Language, Record<string, string>> = {
  en: enTranslations,
  sw: swTranslations,
};

// Provider component
type LanguageProviderProps = {
  children: ReactNode;
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Get initial language from localStorage or default to English
  const getInitialLanguage = (): Language => {
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage as Language) || 'en';
  };

  const [language, setLanguage] = useState<Language>(getInitialLanguage());

  // Function to change language
  const handleSetLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const value = {
    language,
    setLanguage: handleSetLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
