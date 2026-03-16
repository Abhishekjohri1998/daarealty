import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { 
  LayoutDashboard, 
  Database, 
  Plus, 
  Trash2, 
  LogOut, 
  Settings, 
  ImageIcon, 
  ChevronRight, 
  MapPin, 
  ArrowRight,
  TrendingUp,
  Star,
  CheckCircle2,
  Twitter,
  Instagram,
  Facebook,
  Menu,
  X,
  Phone,
  Mail,
  Edit as EditIcon,
  Plus as PlusIcon,
  Briefcase,
  Sun,
  Moon,
  Upload,
  Crosshair,
  Map as MapIcon,
  Navigation
} from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';

// --- AWS / Deployment Constants ---
const IS_PROD = !window.location.hostname.includes('localhost');
const API_BASE_URL = IS_PROD ? 'https://api.daarealty.in' : '';
const IS_ADMIN_SUBDOMAIN = window.location.hostname.startsWith('admin.');

const getApiUrl = (path: string) => `${API_BASE_URL}${path}`;

const getImageUrl = (url?: string) => {
  if (!url) return '/assets/placeholder.png';
  if (url.startsWith('http')) return url;
  if (url.startsWith('/uploads')) return getApiUrl(url);
  return url;
};

// --- ScrollToTop Component ---

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// --- Theme Constants ---
const THEME_KEY = 'daa_theme_preference';

const ThemeToggle = ({ theme, toggle }: { theme: 'light' | 'dark', toggle: () => void }) => {
  return (
    <button 
      onClick={toggle}
      className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-[#4A3F35] dark:text-white transition-all hover:scale-110 active:scale-95 shadow-sm border border-stone-200 dark:border-white/10"
      title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
    >
      {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
    </button>
  );
};

const Navbar = ({ theme, toggleTheme }: { theme: 'light' | 'dark', toggleTheme: () => void }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (isAdmin) return null;

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 border-b border-transparent ${scrolled ? 'bg-background/80 backdrop-blur-xl py-4 shadow-lg dark:border-white/5 dark:shadow-[0_4px_20px_rgba(230,94,25,0.05)]' : 'bg-background/40 backdrop-blur-sm py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center text-foreground">
          <Link to="/" className="flex items-center gap-2 group relative z-50">
            <div className="w-10 h-10 bg-[#E65E19] rounded-lg flex items-center justify-center font-bold text-white transition-transform group-hover:rotate-12 uppercase">D</div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-xl leading-none">DAA</span>
              <span className="text-[10px] tracking-[0.2em] font-bold">REALTY</span>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center gap-10">
            <Link to="/" className={`text-xs font-bold tracking-widest hover:text-[#E65E19] transition-colors uppercase ${pathname === '/' ? 'text-[#E65E19]' : ''}`}>Home</Link>
            <Link to="/services" className={`text-xs font-bold tracking-widest hover:text-[#E65E19] transition-colors uppercase ${pathname === '/services' ? 'text-[#E65E19]' : ''}`}>Properties</Link>
            <Link to="/about" className={`text-xs font-bold tracking-widest hover:text-[#E65E19] transition-colors uppercase ${pathname === '/about' ? 'text-[#E65E19]' : ''}`}>About Us</Link>
            <Link to="/contact" className={`text-xs font-bold tracking-widest hover:text-[#E65E19] transition-colors uppercase ${pathname === '/contact' ? 'text-[#E65E19]' : ''}`}>Contact Us</Link>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle theme={theme} toggle={toggleTheme} />
            <Link to="/admin" className="hidden sm:block bg-[#E65E19] text-white px-8 py-3 rounded-md text-xs font-bold tracking-widest hover:bg-stone-800 transition-all transform hover:-translate-y-1 shadow-lg shadow-[#E65E19]/20 uppercase">
              List Property
            </Link>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center text-foreground relative z-50"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[55] bg-background/95 backdrop-blur-xl md:hidden overflow-hidden"
          >
            <div className="flex flex-col h-full pt-32 px-10 gap-8">
              {[
                { name: 'Home', path: '/' },
                { name: 'Properties', path: '/services' },
                { name: 'About Us', path: '/about' },
                { name: 'Contact Us', path: '/contact' }
              ].map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.2 }}
                >
                  <Link 
                    to={link.path} 
                    className={`text-4xl font-serif font-bold ${pathname === link.path ? 'text-[#E65E19]' : 'text-foreground'}`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-12"
              >
                <Link to="/admin" className="inline-block bg-[#E65E19] text-white px-10 py-5 rounded-xl font-bold tracking-widest text-xs uppercase shadow-2xl shadow-[#E65E19]/30">
                  List Your Property
                </Link>
              </motion.div>

              <div className="mt-auto pb-12 opacity-50 space-y-2">
                <p className="text-[10px] tracking-[0.2em] font-bold uppercase">Get In Touch</p>
                <p className="text-sm font-serif">daarealty@outlook.com</p>
                <p className="text-sm">+91 9560752744</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// --- Footer Component ---

const Footer = () => {
  const { pathname } = useLocation();
  if (pathname.startsWith('/admin')) return null;

  return (
    <footer className="bg-background border-t border-border pt-24 pb-12 transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#E65E19] rounded-lg flex items-center justify-center font-bold text-white text-sm uppercase">D</div>
              <div className="flex flex-col text-foreground">
                <span className="font-serif font-bold text-lg leading-none">DAA</span>
                <span className="text-[8px] tracking-[0.2em] font-bold uppercase">REALTY</span>
              </div>
            </Link>
            <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed max-w-xs">
              Leading the way in premium residential and commercial real estate through innovation and unwavering trust.
            </p>
          </div>

          <div>
            <h4 className="text-[10px] tracking-[0.2em] font-bold text-stone-400 mb-8 uppercase">Company</h4>
            <ul className="space-y-4">
              {['About Us', 'Our Team', 'Careers', 'News'].map(item => (
                <li key={item}><Link to="/about" className="text-stone-600 dark:text-stone-400 hover:text-[#E65E19] text-sm transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] tracking-[0.2em] font-bold text-stone-400 mb-8 uppercase">Developments</h4>
            <ul className="space-y-4">
              {['Residential Dept', 'Commercial Hub', 'Upcoming Projects', 'Completed Sites'].map(item => (
                <li key={item}><Link to="#" className="text-stone-600 dark:text-stone-400 hover:text-[#E65E19] text-sm transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] tracking-[0.2em] font-bold text-stone-400 mb-8 uppercase">Connect</h4>
            <div className="flex gap-4 mb-8">
              <a href="#" className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-foreground hover:bg-[#E65E19] hover:text-white transition-all border border-border"><Twitter className="w-4 h-4"/></a>
              <a href="#" className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-foreground hover:bg-[#E65E19] hover:text-white transition-all border border-border"><Instagram className="w-4 h-4"/></a>
            </div>
            <p className="text-stone-500 dark:text-stone-400 text-xs mb-4">Sign up for updates</p>
            <div className="flex">
              <input type="email" placeholder="Your email" className="bg-surface border border-border px-4 py-2 text-sm w-full focus:outline-none focus:border-[#E65E19] text-foreground"/>
              <button className="bg-[#E65E19] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider">Join</button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center py-8 border-t border-border gap-4">
          <p className="text-stone-400 text-[10px] tracking-wider uppercase font-bold">© 2024 DAA REALTY GROUP ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
            {['Privacy Policy', 'Terms of Service', 'Sitemap'].map(item => (
              <Link key={item} to="#" className="text-stone-400 text-[10px] tracking-wider uppercase font-bold hover:text-[#E65E19] transition-colors">{item}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- HomePage Component ---

const HomePage = () => {
  const [content, setContent] = useState<any>({});
  const [listings, setListings] = useState<any[]>([]);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);

  useEffect(() => {
    fetch(getApiUrl('/api/content')).then(res => res.json()).then(data => {
      const mapped = data.reduce((acc: any, curr: any) => ({ ...acc, [curr.key]: curr.value }), {});
      setContent(mapped);
    });
    fetch(getApiUrl('/api/listings')).then(res => res.json()).then(data => setListings(data.filter((l: any) => l.featured)));
  }, []);

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: y1 }} className="absolute inset-0">
          <img 
            src="/assets/hero_luxury_interior.png" 
            alt="Hero Background" 
            className="w-full h-full object-cover scale-110"
          />
          <div className="absolute inset-0 bg-stone-900/40 dark:bg-[radial-gradient(circle_at_50%_40%,rgba(230,94,25,0.15),#050505_80%)] backdrop-blur-[1px]" />
        </motion.div>
        
        <div className="container mx-auto px-6 relative z-10 text-center text-white">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[10px] md:text-xs tracking-[0.4em] font-bold uppercase mb-8 opacity-80"
          >
            Building Value • Creating Spaces • Delivering Trust
          </motion.p>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="text-5xl md:text-8xl font-serif font-bold mb-12 leading-tight flex flex-col items-center"
          >
            <span className="flex items-center gap-2 uppercase">Dreams <span className="w-2 h-2 md:w-3 md:h-3 bg-[#E65E19] rounded-full translate-y-1 md:translate-y-2" /></span>
            <span className="flex items-center gap-2 uppercase">Aspirations <span className="w-2 h-2 md:w-3 md:h-3 bg-[#E65E19] rounded-full translate-y-1 md:translate-y-2" /></span>
            <span className="flex items-center gap-2 uppercase">Achievements <span className="w-2 h-2 md:w-3 md:h-3 bg-[#E65E19] rounded-full translate-y-1 md:translate-y-2" /></span>
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-6 justify-center"
          >
            <Link to="/services" className="bg-[#E65E19] text-white px-10 py-5 rounded-md font-bold tracking-widest text-xs hover:bg-stone-800 transition-all transform hover:-translate-y-1 shadow-2xl shadow-[#E65E19]/40 uppercase flex items-center justify-center">
              View Projects
            </Link>
            <Link to="/philosophy" className="bg-white/10 backdrop-blur-md border border-white/20 px-10 py-5 rounded-md text-xs font-bold tracking-widest uppercase hover:bg-white/20 transition-all text-white flex items-center justify-center">
              Our Philosophy
            </Link>
          </motion.div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-40">
           <motion.div 
            animate={{ height: [0, 80, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-[1px] bg-gradient-to-b from-transparent to-white" 
           />
        </div>
      </section>

      {/* Core Pillars Section */}
      <section className="py-32 bg-surface/50">
        <div className="container mx-auto px-6 text-foreground">
          <div className="max-w-3xl mx-auto text-center mb-24">
             <motion.h4 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="text-[10px] tracking-[0.3em] font-bold text-[#E65E19] mb-6 uppercase"
              >
                Our Core Pillars
              </motion.h4>
             <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-5xl font-serif font-bold leading-tight uppercase"
              >
                Every foundation we lay is built on three essential values.
              </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Dreams", icon: <Star className="w-6 h-6 text-[#E65E19]"/>, desc: "We believe in your most ambitious visions, transforming intangibles into reality. Our design philosophy starts with listening to your story and the lifestyle you imagine." },
              { title: "Aspirations", icon: <TrendingUp className="w-6 h-6 text-[#E65E19]"/>, desc: "We are highlighting standards through innovation. We strive for excellence in every brick, ensuring our spaces inspire growth and forward momentum." },
              { title: "Achievements", icon: <CheckCircle2 className="w-6 h-6 text-[#E65E19]"/>, desc: "Delivering lasting trust through proven results. Our portfolio of successfully completed projects stands as a testament to our commitment to quality." }
            ].map((pillar, idx) => (
              <motion.div 
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                viewport={{ once: true }}
                className="bg-background p-12 rounded-3xl shadow-xl shadow-border/50 border border-border orange-border-glow"
              >
                <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center mb-8">{pillar.icon}</div>
                <h3 className="text-2xl font-serif font-bold mb-6 uppercase tracking-wider">{pillar.title}</h3>
                <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">{pillar.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-32 container mx-auto px-6">
        <div className="flex justify-between items-end mb-16">
          <div className="space-y-4 text-foreground">
            <h4 className="text-[10px] tracking-[0.3em] font-bold text-[#E65E19] uppercase">Exclusive Portfolio</h4>
            <h2 className="text-3xl md:text-5xl font-serif font-bold uppercase tracking-tight">Featured <br className="hidden md:block"/> Properties</h2>
          </div>
          <Link to="/services" className="text-stone-400 hover:text-[#E65E19] text-xs font-bold uppercase tracking-widest transition-all mb-2 flex items-center gap-2">View All <ArrowRight className="w-4 h-4"/></Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {listings.map((prop, idx) => (
            <motion.div 
              key={prop._id || idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group bg-surface rounded-[2.5rem] overflow-hidden border border-border shadow-2xl shadow-border/30 hover:shadow-[#E65E19]/10 transition-all"
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <img 
                  src={prop.images?.[0] || '/assets/placeholder.png'} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  alt={prop.title}
                />
                <div className="absolute top-6 left-6 flex gap-2">
                  <span className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-foreground shadow-xl">
                    {prop.type || 'For Sale'}
                  </span>
                </div>
              </div>
              <div className="p-10 space-y-6 text-foreground">
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-tight mb-2 group-hover:text-[#E65E19] transition-colors">{prop.title}</h3>
                  <p className="text-stone-500 dark:text-stone-400 text-sm flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-[#E65E19]" /> {prop.location}
                  </p>
                </div>
                
                <div className="flex justify-between items-center pt-6 border-t border-border">
                  <span className="text-2xl font-serif font-bold text-[#E65E19]">{prop.price}</span>
                  <Link to="/contact" className="w-10 h-10 bg-surface border border-border rounded-full flex items-center justify-center text-stone-400 hover:bg-[#E65E19] hover:text-white transition-all shadow-xl">
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
          {listings.length === 0 && (
            <div className="col-span-3 py-20 text-center border-2 border-dashed border-border rounded-[2.5rem] opacity-50">
              <p className="text-stone-500 dark:text-stone-400 font-serif italic">Curating exceptional properties... Please check back soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* Modern Oasis Section */}
      <section className="py-32 overflow-hidden bg-background text-foreground">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="lg:w-1/2 relative w-full group">
               <div className="absolute -inset-4 border-2 border-[#E65E19]/20 rounded-3xl translate-x-4 translate-y-4 dark:bg-[#E65E19]/5 blur-sm" />
               <motion.img 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                src="/assets/skyscraper.png" 
                className="rounded-3xl shadow-2xl relative z-10 w-full aspect-[4/5] object-cover"
                alt="Skyscraper"
               />
            </div>
            
            <div className="lg:w-1/2 space-y-12">
               <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
               >
                 <h4 className="text-[10px] tracking-[0.3em] font-bold text-[#E65E19] mb-6 uppercase">The Modern Oasis</h4>
                 <h2 className="text-4xl md:text-6xl font-serif font-bold leading-tight uppercase">Sophisticated <br/>Living, Redefined.</h2>
               </motion.div>
               
               <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-stone-500 dark:text-stone-400 leading-relaxed text-lg"
               >
                 At DAA Realty, we don't just build structures; we curate environments that foster well-being and success. Our "Modern Oasis" approach integrates natural elements with cutting-edge architecture.
               </motion.p>

               <motion.ul 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  visible: { transition: { staggerChildren: 0.1 } }
                }}
                className="space-y-4"
               >
                 {["Sustainable architectural practices", "Premium finishes and natural textures", "Intelligent space optimization"].map(item => (
                   <motion.li 
                    variants={{
                      hidden: { opacity: 0, x: -10 },
                      visible: { opacity: 1, x: 0 }
                    }}
                    key={item} 
                    className="flex items-center gap-4 text-stone-700 dark:text-stone-300 font-medium italic"
                   >
                     <span className="w-2 h-2 bg-[#E65E19] rounded-full" /> {item}
                   </motion.li>
                 ))}
               </motion.ul>

               <Link to="/about" className="inline-flex items-center gap-4 text-[#E65E19] font-bold tracking-[0.2em] text-xs uppercase group">
                 Explore Our Design Philosophy <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2"/>
               </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-[#4A3F35] dark:dark-gradient rounded-[3rem] p-16 md:p-32 text-center text-white relative overflow-hidden shadow-2xl transition-colors duration-300 border border-white/5"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#E65E19]/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 space-y-12">
              <h2 className="text-4xl md:text-6xl font-serif font-bold leading-tight uppercase">Ready to realize your aspirations?</h2>
              <p className="text-stone-400 max-w-2xl mx-auto text-lg leading-relaxed">
                Join the hundreds of families and businesses who have found their foundation with DAA Realty.
              </p>
              <Link to="/contact" className="inline-block bg-[#E65E19] text-white px-12 py-5 rounded-md font-bold tracking-widest text-xs hover:bg-stone-800 transition-all transform hover:-translate-y-1 shadow-2xl shadow-[#E65E19]/40 uppercase">
                Start Your Journey Today
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

// --- AboutPage Component ---

const AboutPage = () => {
  return (
    <div className="pt-20 bg-background min-h-screen text-foreground transition-colors duration-300">
      {/* Hero Section */}
      <section className="py-32 text-center container mx-auto px-6">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-7xl font-serif font-bold leading-tight mb-8"
        >
          Building Legacies through <br/>
          <span className="text-[#E65E19]">Integrity</span> and Strategic Vision.
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-stone-500 max-w-2xl mx-auto text-lg leading-relaxed mb-12"
        >
          At DAA Realty, we blend decades of experience with a forward-thinking commitment to sustainable community development.
        </motion.p>
        <div className="w-24 h-1.5 bg-[#E65E19] mx-auto rounded-full" />
      </section>

      {/* Who We Are */}
      <section className="py-24 container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          <div className="lg:w-1/2 space-y-12">
            <div>
              <h4 className="text-[10px] tracking-[0.3em] font-bold text-[#E65E19] mb-4 uppercase">The Foundation</h4>
              <h2 className="text-4xl md:text-6xl font-serif font-bold leading-tight uppercase">Who We Are</h2>
            </div>
            
            <p className="text-stone-500 text-lg leading-relaxed">
              DAA Realty stands as a cornerstone in the real estate industry, built upon a rich history of experience and an unwavering commitment to integrity. We don't just build structures; we cultivate environments where businesses and communities thrive.
            </p>
            <p className="text-stone-500 text-lg leading-relaxed">
              Our team brings together decades of market intelligence and a refined strategic vision that allows us to navigate complex landscapes with precision. Every project we undertake is a testament to our belief that real estate should deliver lasting, sustainable value.
            </p>

            <div className="flex gap-16 pt-8">
              <div>
                <h3 className="text-4xl font-serif font-bold text-[#E65E19] mb-2 uppercase">25+</h3>
                <p className="text-[10px] tracking-[0.2em] font-bold text-stone-400 uppercase">Years Experience</p>
              </div>
              <div>
                <h3 className="text-4xl font-serif font-bold text-[#E65E19] mb-2 uppercase">500+</h3>
                <p className="text-[10px] tracking-[0.2em] font-bold text-stone-400 uppercase">Completed Projects</p>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 relative group">
            <div className="absolute -inset-10 bg-[#FDF8F5] rounded-full scale-0 group-hover:scale-100 transition-transform duration-1000 blur-3xl opacity-50" />
            <motion.img 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              src="/assets/executive_portrait.png"
              className="rounded-[3rem] shadow-2xl relative z-10 w-full object-cover aspect-square grayscale-[20%] hover:grayscale-0 transition-all duration-700"
              alt="Executive Management"
            />
          </div>
        </div>
      </section>

      {/* Vision & Mission Cards */}
      <section className="py-24 bg-surface/30">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { 
              title: "Our Vision", 
              icon: <Star className="w-8 h-8 text-[#E65E19]"/>, 
              desc: "To redefine the landscape of urban living by pioneering developments that harmonize modern luxury with environmental responsibility. We envision communities where every square foot serves a purpose and enhances the quality of life for generations to come." 
            },
            { 
              title: "Our Mission", 
              icon: <TrendingUp className="w-8 h-8 text-[#E65E19]"/>, 
              desc: "Our mission is to create sustainable real estate value through disciplined investment, transparent management, and community-centric design. We commit to excellence in every detail, ensuring that our projects leave a positive and lasting imprint on the world." 
            }
          ].map((card, idx) => (
            <motion.div 
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              className="bg-background p-16 rounded-[3rem] shadow-xl border border-border flex flex-col gap-8"
            >
              <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center">{card.icon}</div>
              <h3 className="text-3xl font-serif font-bold leading-tight uppercase">{card.title}</h3>
              <p className="text-stone-500 leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Core Principles */}
      <section className="py-32 bg-[#E65E19]">
        <div className="container mx-auto px-6 text-white text-center">
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-24 uppercase">Driven by Core Principles</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-20">
            {[
              { num: "01", label: "Integrity", desc: "Uncompromising honesty in every transaction." },
              { num: "02", label: "Sustainability", desc: "Creating value that lasts through green innovation." },
              { num: "03", label: "Community", desc: "Developing spaces that bring people together." },
              { num: "04", label: "Vision", desc: "Strategic thinking that anticipates future needs." }
            ].map((principle, idx) => (
              <motion.div 
                key={principle.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="space-y-6"
              >
                <div className="text-white/20 text-6xl font-serif font-bold leading-none">{principle.num}</div>
                <h3 className="text-2xl font-serif font-bold uppercase">{principle.label}</h3>
                <p className="text-white/70 text-sm italic">{principle.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// --- PhilosophyPage Component ---
const PhilosophyPage = () => {
  return (
    <div className="pt-20 bg-background min-h-screen text-foreground transition-colors duration-300">
      {/* Hero */}
      <section className="py-32 relative overflow-hidden bg-background text-foreground min-h-[60vh] flex items-center">
        <div className="absolute inset-0 opacity-40 dark:bg-[radial-gradient(circle_at_50%_40%,rgba(230,94,25,0.1),#050505_90%)] z-10" />
        <div className="absolute inset-0 opacity-30">
          <img src="/assets/hero_luxury_interior.png" className="w-full h-full object-cover" alt="Philosophy Hero" />
        </div>
        <div className="container mx-auto px-6 relative z-20 text-center">
          <motion.h4 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-[#E65E19] text-[10px] tracking-[0.4em] font-bold uppercase mb-6">Our Foundation</motion.h4>
          <motion.h1 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} className="text-4xl md:text-7xl font-serif font-bold mb-8 uppercase tracking-widest leading-tight">A Legacy <br className="md:hidden" /> of Values</motion.h1>
          <div className="w-24 h-1 bg-[#E65E19] mx-auto rounded-full" />
        </div>
      </section>

      {/* Deep Dive on Pillars */}
      <section className="py-32 container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-24">
          {[
            { 
              title: "Dreams", 
              num: "01",
              text: "Every project begins as a whisper of a dream. We specialize in the architecture of expectations, where the intangible becomes a structure you can touch. Our philosophy is that a home is not just a place, but the physical manifestation of your highest aspirations."
            },
            { 
              title: "Aspirations", 
              num: "02",
              text: "We aspire to go beyond the conventional. For us, innovation is not just about technology, but about the evolution of living. We push the boundaries of design to create spaces that don't just house life, but enhance the way life is lived."
            },
            { 
              title: "Achievements", 
              num: "03",
              text: "Success is measured in the trust of our clients and the longevity of our constructions. Our achievements are the landmarks we've built and the families that have found their sanctuary within them. We build for the future, ensuring value for decades."
            }
          ].map((item, idx) => (
            <motion.div 
              key={item.title} 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="text-7xl font-serif font-bold text-surface dark:text-stone-800">{item.num}</div>
              <h2 className="text-3xl font-serif font-bold border-b border-[#E65E19]/20 pb-4 uppercase tracking-wider">{item.title}</h2>
              <p className="text-stone-500 dark:text-stone-400 leading-relaxed text-lg italic">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Modern Oasis detailed section */}
      <section className="py-32 bg-surface/50 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#E65E19]/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="text-3xl md:text-5xl font-serif font-bold mb-16 uppercase tracking-widest leading-tight"
          >
            The Modern Oasis <br/><span className="text-[#E65E19]">Living Philosophy</span>
          </motion.h2>
          <div className="space-y-12 text-stone-600 dark:text-stone-300 text-lg leading-relaxed text-left md:text-center italic">
            <p>Our "Modern Oasis" design language is a response to the rapid urbanization of our times. We believe that as our cities grow taller and faster, our need for tranquility and connection to nature becomes increasingly vital.</p>
            <p>At DAA Realty, every development integrates the elements of light, air, and greenery. We don't see these as luxuries, but as fundamental rights of the modern dweller. Our architecture seeks to blur the lines between the interior sanctuary and the natural world outside.</p>
          </div>
          <div className="mt-20 flex justify-center">
            <Link to="/contact" className="bg-[#E65E19] text-white px-12 py-5 rounded-xl font-bold tracking-widest text-xs uppercase shadow-2xl shadow-[#E65E19]/20 hover:scale-105 transition-all">
              Join Our Vision
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

// --- Admin Components ---
const AdminLogin = ({ setToken }: { setToken: (t: string) => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(getApiUrl('/api/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (res.ok) {
      setToken(data.token);
      localStorage.setItem('daa_admin_token', data.token);
      navigate('/admin/dashboard');
    } else {
      setError(data.error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 transition-colors duration-300">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-surface w-full max-w-md rounded-3xl p-10 shadow-2xl border border-border">
        <div className="text-center mb-10 text-foreground">
          <div className="w-16 h-16 bg-[#E65E19] text-white flex items-center justify-center rounded-2xl font-bold text-3xl mx-auto mb-4 shadow-lg uppercase">D</div>
          <h1 className="text-2xl font-serif font-bold uppercase tracking-widest">Admin Portal</h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm mt-2">Sign in to manage your vision</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-background border border-border p-4 rounded-xl outline-none focus:ring-2 focus:ring-[#E65E19]/20 transition-all text-foreground" />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-background border border-border p-4 rounded-xl outline-none focus:ring-2 focus:ring-[#E65E19]/20 transition-all text-foreground" />
          </div>
          {error && <p className="text-red-500 text-sm text-center font-bold uppercase tracking-tight">{error}</p>}
          <button className="w-full bg-[#E65E19] text-white py-4 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-lg active:scale-95 uppercase tracking-widest text-xs">Verify & Enter</button>
        </form>
      </motion.div>
    </div>
  );
};
// --- Advanced Admin Components ---

const FileUploader = ({ onUpload, token }: { onUpload: (urls: string[]) => void, token: string }) => {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    setUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
    }

    try {
      const res = await fetch(getApiUrl('/api/upload'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!res.ok) {
        let errorMsg = `Upload failed with status ${res.status}`;
        try {
          const errorData = await res.json();
          errorMsg += `: ${errorData.error || errorData.details || JSON.stringify(errorData)}`;
        } catch (e) {
          const text = await res.text();
          errorMsg += `: ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}`;
        }
        throw new Error(errorMsg);
      }

      const data = await res.json();
      if (data.urls) onUpload(data.urls);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files) handleFiles(e.dataTransfer.files); }}
      onClick={() => fileInputRef.current?.click()}
      className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${dragging ? 'border-[#E65E19] bg-[#E65E19]/5' : 'border-border hover:border-[#E65E19]/50'}`}
    >
      <input type="file" multiple className="hidden" ref={fileInputRef} onChange={(e) => e.target.files && handleFiles(e.target.files)} accept="image/*" />
      <Upload className={`w-10 h-10 mx-auto mb-4 ${uploading ? 'animate-bounce text-[#E65E19]' : 'text-stone-400'}`} />
      <p className="text-sm font-bold uppercase tracking-widest text-foreground">{uploading ? 'Uploading...' : 'Drag & Drop or Tap to Upload'}</p>
      <p className="text-[10px] text-stone-500 mt-2 uppercase tracking-tighter">Support for mobile gallery and camera</p>
    </div>
  );
};

const LocationPicker = ({ coordinates, onChange }: { coordinates: { lat: number, lng: number }, onChange: (coords: { lat: number, lng: number }) => void }) => {
  const pickerRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    // @ts-ignore
    const L = window.L;
    if (!L || !pickerRef.current) return;

    if (!mapInstance.current) {
      const lat = coordinates?.lat || 28.6790;
      const lng = coordinates?.lng || 77.4453;
      mapInstance.current = L.map(pickerRef.current, { center: [lat, lng], zoom: 13, zoomControl: false });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstance.current);

      markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(mapInstance.current);

      markerRef.current.on('dragend', () => {
        const pos = markerRef.current.getLatLng();
        onChange({ lat: pos.lat, lng: pos.lng });
      });

      mapInstance.current.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        markerRef.current.setLatLng([lat, lng]);
        onChange({ lat, lng });
      });
    }

    return () => {
        if (mapInstance.current) {
            mapInstance.current.remove();
            mapInstance.current = null;
        }
    };
  }, []);

  const useMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        onChange({ lat: latitude, lng: longitude });
        if (mapInstance.current) {
          mapInstance.current.setView([latitude, longitude], 16);
          markerRef.current.setLatLng([latitude, longitude]);
        }
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="text-xs font-bold uppercase text-stone-400 tracking-widest">Pin Location</label>
        <button type="button" onClick={useMyLocation} className="text-[10px] font-bold uppercase text-[#E65E19] flex items-center gap-2 hover:underline">
          <Crosshair className="w-3 h-3" /> Get My Location
        </button>
      </div>
      <div ref={pickerRef} className="h-48 rounded-2xl border border-border overflow-hidden z-10" />
      <div className="grid grid-cols-2 gap-4">
        <div className="text-[10px] font-mono text-stone-400">LAT: {coordinates?.lat?.toFixed(6) || 'N/A'}</div>
        <div className="text-[10px] font-mono text-stone-400">LNG: {coordinates?.lng?.toFixed(6) || 'N/A'}</div>
      </div>
    </div>
  );
};

const AdminDashboard = ({ token, logout }: { token: string, logout: () => void }) => {
  const [listings, setListings] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'listings' | 'media'>('dashboard');
  const [newProp, setNewProp] = useState<any>({
    title: '',
    price: '',
    location: '',
    type: 'Sale',
    beds: 3,
    sqft: 2000,
    description: '',
    images: [],
    featured: false,
    coordinates: { lat: 28.6790, lng: 77.4453 }
  });

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = () => {
    fetch(getApiUrl('/api/listings')).then(res => res.json()).then(setListings);
  };

  const addListing = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = isEditing ? `/api/listings/${newProp._id}` : '/api/listings';
    const method = isEditing ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(newProp)
    });
    if (res.ok) {
      setShowAdd(false);
      setIsEditing(false);
      fetchListings();
      setNewProp({ title: '', price: '', location: '', type: 'Sale', beds: 3, sqft: 2000, description: '', images: [], featured: false, coordinates: { lat: 28.6790, lng: 77.4453 } });
    }
  };

  const openEdit = (prop: any) => {
    setNewProp({ ...prop, coordinates: prop.coordinates || { lat: 28.6790, lng: 77.4453 } });
    setIsEditing(true);
    setShowAdd(true);
  };

  const openAdd = () => {
    setNewProp({ title: '', price: '', location: '', type: 'Sale', beds: 3, sqft: 2000, description: '', images: [], featured: false, coordinates: { lat: 28.6790, lng: 77.4453 } });
    setIsEditing(false);
    setShowAdd(true);
  };

  const deleteListing = async (id: string) => {
    if (window.confirm("Delete this listing?")) {
      await fetch(`/api/listings/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      fetchListings();
    }
  };

  return (
    <div className="min-h-screen bg-background flex transition-colors duration-300">
      <aside className="w-64 bg-stone-900 text-white p-8 flex flex-col gap-8 hidden md:flex border-r border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#E65E19] rounded-xl flex items-center justify-center font-bold uppercase">D</div>
          <span className="font-serif font-bold text-xl uppercase tracking-widest">DAA Realty</span>
        </div>
        <nav className="flex-grow space-y-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-3 w-full p-4 rounded-xl transition-all font-bold ${activeTab === 'dashboard' ? 'bg-[#E65E19] shadow-lg text-white' : 'text-stone-400 hover:text-white'}`}
          >
            <LayoutDashboard className="w-5 h-5"/> Dashboard
          </button>
          <button
            onClick={() => setActiveTab('listings')}
            className={`flex items-center gap-3 w-full p-4 rounded-xl transition-all font-bold ${activeTab === 'listings' ? 'bg-[#E65E19] shadow-lg text-white' : 'text-stone-400 hover:text-white'}`}
          >
            <Database className="w-5 h-5"/> Listings
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`flex items-center gap-3 w-full p-4 rounded-xl transition-all font-bold ${activeTab === 'media' ? 'bg-[#E65E19] shadow-lg text-white' : 'text-stone-400 hover:text-white'}`}
          >
            <ImageIcon className="w-5 h-5"/> Media
          </button>
        </nav>
        <button onClick={logout} className="flex items-center gap-3 w-full p-4 rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-bold uppercase"><LogOut className="w-5 h-5"/> Logout</button>
      </aside>

      <div className="md:hidden fixed top-0 left-0 right-0 bg-stone-900 text-white p-4 flex justify-between items-center z-40 shadow-xl">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-[#E65E19] rounded-lg flex items-center justify-center font-bold text-sm uppercase">D</div>
           <span className="font-serif font-bold uppercase">Admin</span>
        </div>
        <button onClick={logout} className="p-2 text-red-400"><LogOut className="w-6 h-6"/></button>
      </div>

      <main className="flex-grow p-8 md:p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <div className="text-foreground">
            <h1 className="text-3xl font-serif font-bold uppercase tracking-tight">
              {activeTab === 'dashboard' ? 'Overview' : activeTab === 'listings' ? 'Listing Management' : 'Media Library'}
            </h1>
            <p className="text-stone-500 dark:text-stone-400">
              {activeTab === 'dashboard' ? 'Welcome to your DAA Realty dashboard' : activeTab === 'listings' ? 'Managing properties on daarealty.in' : 'All property images and assets'}
            </p>
          </div>
          {activeTab === 'listings' && (
            <button onClick={openAdd} className="bg-[#E65E19] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-[#E65E19]/20 active:scale-95 transition-all uppercase tracking-widest text-xs">
              <PlusIcon className="w-5 h-5"/> Add Listing
            </button>
          )}
        </header>

        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-surface p-8 rounded-3xl border border-border">
              <h3 className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-2">Total Listings</h3>
              <p className="text-4xl font-serif font-bold text-foreground">{listings.length}</p>
            </div>
            <div className="bg-surface p-8 rounded-3xl border border-border">
              <h3 className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-2">Featured</h3>
              <p className="text-4xl font-serif font-bold text-foreground">{listings.filter(l => l.featured).length}</p>
            </div>
            <div className="bg-surface p-8 rounded-3xl border border-border">
              <h3 className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-2">Active Inquiries</h3>
              <p className="text-4xl font-serif font-bold text-foreground">12</p>
            </div>
          </div>
        )}

        {activeTab === 'listings' && (
          <div className="grid grid-cols-1 gap-6">
            {listings.map((prop, i) => (
              <div key={i} className="bg-surface p-6 rounded-2xl shadow-sm border border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all hover:shadow-md">
                <div className="flex items-center gap-6 text-foreground">
                  <div className="w-20 h-20 bg-background rounded-xl overflow-hidden shadow-inner border border-border">
                    <img src={prop.images?.[0] || '/assets/placeholder.png'} className="w-full h-full object-cover" alt={prop.title}/>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg uppercase tracking-tight">{prop.title}</h3>
                    <p className="text-stone-500 dark:text-stone-400 text-sm italic">{prop.location} • {prop.price}</p>
                  </div>
                </div>
                  <div className="flex gap-3 w-full md:w-auto">
                    <button onClick={() => openEdit(prop)} className="flex-1 md:flex-none p-3 bg-background text-stone-600 dark:text-stone-400 rounded-xl hover:bg-surface border border-border transition-all flex justify-center"><EditIcon className="w-5 h-5" /></button>
                  <button onClick={() => deleteListing(prop._id)} className="flex-1 md:flex-none p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-all flex justify-center border border-red-500/20"><Trash2 className="w-5 h-5" /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'media' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {listings.flatMap((l, idx) => (l.images || []).map((img: string, i: number) => (
              <div key={`${idx}-${i}`} className="group relative aspect-square bg-surface rounded-2xl overflow-hidden border border-border shadow-sm">
                <img src={getImageUrl(img)} className="w-full h-full object-cover" alt="Property Media" />
                <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <p className="text-[10px] text-white font-bold truncate uppercase">{l.title}</p>
                  <button
                    onClick={() => navigator.clipboard.writeText(img)}
                    className="text-[10px] text-[#E65E19] hover:text-white transition-colors uppercase font-bold text-left"
                  >
                    Copy URL
                  </button>
                </div>
              </div>
            )))}
          </div>
        )}

        <AnimatePresence>
          {showAdd && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm">
              <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-surface w-full max-w-2xl rounded-3xl p-10 overflow-y-auto max-h-[90vh] shadow-2xl border border-border">
                <div className="flex justify-between items-center mb-8 text-foreground">
                  <h2 className="text-2xl font-serif font-bold uppercase tracking-tight">{isEditing ? 'Edit Property Details' : 'New Property Listing'}</h2>
                  <button onClick={() => { setShowAdd(false); setIsEditing(false); }} className="text-stone-400 hover:text-[#E65E19] transition-colors"><X /></button>
                </div>
                <form onSubmit={addListing} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-foreground">
                  <div className="col-span-2">
                    <label className="text-xs font-bold uppercase text-stone-400 block mb-2 tracking-widest">Title</label>
                    <input value={newProp.title} onChange={e => setNewProp({...newProp, title: e.target.value})} className="w-full bg-background border border-border p-4 rounded-xl focus:ring-2 focus:ring-[#E65E19]/20 outline-none transition-all text-foreground" placeholder="Luxurious Beachfront Villa" required />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-stone-400 block mb-2 tracking-widest">Price</label>
                    <input value={newProp.price} onChange={e => setNewProp({...newProp, price: e.target.value})} className="w-full border border-stone-200 p-4 rounded-xl focus:ring-2 focus:ring-[#E65E19]/20 outline-none" placeholder="₹1,200,000" required />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-stone-400 block mb-2 tracking-widest">Location Name</label>
                    <input value={newProp.location} onChange={e => setNewProp({...newProp, location: e.target.value})} className="w-full bg-background border border-border p-4 rounded-xl focus:ring-2 focus:ring-[#E65E19]/20 outline-none text-foreground" placeholder="RDC Rajnagar, Ghaziabad" required />
                  </div>
                  <div className="col-span-2">
                    <LocationPicker
                      coordinates={newProp.coordinates}
                      onChange={(coords) => setNewProp({...newProp, coordinates: coords})}
                    />
                  </div>
                  <div className="col-span-2 grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                      <label className="text-xs font-bold uppercase text-stone-400 block mb-2 tracking-widest">Type</label>
                      <select value={newProp.type} onChange={e => setNewProp({...newProp, type: e.target.value})} className="w-full bg-background border border-border p-4 rounded-xl outline-none text-foreground">
                        <option value="Sale">For Sale</option>
                        <option value="Rent">For Rent</option>
                        <option value="Lease">For Lease</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase text-stone-400 block mb-2 tracking-widest">Beds</label>
                      <input type="number" value={newProp.beds} onChange={e => setNewProp({...newProp, beds: parseInt(e.target.value)})} className="w-full bg-background border border-border p-4 rounded-xl outline-none text-foreground" />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase text-stone-400 block mb-2 tracking-widest">Sqft</label>
                      <input type="number" value={newProp.sqft} onChange={e => setNewProp({...newProp, sqft: parseInt(e.target.value)})} className="w-full bg-background border border-border p-4 rounded-xl outline-none text-foreground" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <label className="text-xs font-bold uppercase text-stone-400 block mb-2 tracking-widest">Featured</label>
                      <input type="checkbox" checked={newProp.featured} onChange={e => setNewProp({...newProp, featured: e.target.checked})} className="w-6 h-6 rounded border-border text-[#E65E19] focus:ring-[#E65E19]/20 transition-all cursor-pointer" />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-bold uppercase text-stone-400 block mb-2 tracking-widest">Description</label>
                    <textarea value={newProp.description} onChange={e => setNewProp({...newProp, description: e.target.value})} className="w-full bg-background border border-border p-4 rounded-xl h-32 focus:ring-2 focus:ring-[#E65E19]/20 outline-none text-foreground" placeholder="Tell the dream..."></textarea>
                  </div>
                  <div className="col-span-2 space-y-4">
                    <label className="text-xs font-bold uppercase text-stone-400 block mb-2 tracking-widest">Property Media</label>
                    <FileUploader
                        token={token}
                        onUpload={(urls) => setNewProp({ ...newProp, images: [...(newProp.images || []), ...urls] })}
                    />
                    {newProp.images.length > 0 && (
                      <div className="grid grid-cols-4 gap-4 mt-6">
                        {newProp.images.map((img: string, i: number) => (
                          <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                            <img src={getImageUrl(img)} className="w-full h-full object-cover" alt="Preview"/>
                            <button
                              type="button"
                              onClick={() => setNewProp({...newProp, images: newProp.images.filter((_: any, idx: number) => idx !== i)})}
                              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3"/>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button className="col-span-2 bg-[#E65E19] text-white py-5 rounded-xl font-bold shadow-xl hover:bg-opacity-90 transition-all uppercase tracking-widest text-xs">{isEditing ? 'Save Changes' : 'Publish Listing'}</button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

const ServicesPage = () => {
  const [listings, setListings] = useState<any[]>([]);

  useEffect(() => {
    fetch(getApiUrl('/api/listings')).then(res => res.json()).then(setListings);
  }, []);

  return (
    <div className="pt-20 bg-background min-h-screen text-foreground transition-colors duration-300">
      {/* Hero Header */}
      <section className="py-32 relative bg-stone-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img src="/assets/hero_luxury_interior.png" className="w-full h-full object-cover" alt="Services Hero" />
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.h4 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-[#E65E19] text-[10px] tracking-[0.4em] font-bold uppercase mb-6">Our Expertise</motion.h4>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-serif font-bold mb-8 uppercase tracking-widest leading-tight"
          >
            Professional <br className="md:hidden" /> Real Estate Services
          </motion.h1>
          <div className="w-24 h-1 bg-[#E65E19] mx-auto rounded-full" />
        </div>
      </section>

      {/* Intro Text */}
      <section className="py-24 bg-surface/30">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-stone-500 dark:text-stone-400 text-xl leading-relaxed italic"
          >
            "Expert guidance and bespoke solutions across the full spectrum of real estate, tailored for efficiency and excellence in every transaction."
          </motion.p>
        </div>
      </section>

      {/* Services Intermersive List */}
      <section className="py-32 container mx-auto px-6 space-y-32 md:space-y-64">
        {[
          {
            title: "Government Contracts",
            img: "/assets/service_government.png",
            desc: "Specialized procurement and property management solutions for federal and local government agencies. We bridge the gap between regulatory requirements and high-performance real estate assets.",
            features: ["Regulatory Compliance", "Asset Management", "Secure Facility Operations"]
          },
          {
            title: "Real Estate Investments",
            img: "/assets/service_investment.png",
            desc: "Strategic portfolio management and deep market analysis to maximize your long-term capital growth and yield. We identify high-potential opportunities before they hit the mainstream market.",
            features: ["Market Intelligence", "Portfolio Diversification", "Yield Optimization"]
          },
          {
            title: "Residential Leasing",
            img: "/assets/service_residential.png",
            desc: "High-end residential property placement for discerning tenants and comprehensive owner representation. Our focus is on lifestyle-driven aesthetics and seamless living experiences.",
            features: ["Discerning Tenant Search", "Premium Property Curation", "Seamless Tenancy Management"]
          },
          {
            title: "Commercial Leasing",
            img: "/assets/service_commercial.png",
            desc: "Tailored office, retail, and industrial space solutions designed to help your business thrive. We create environments that foster productivity and brand prestige.",
            features: ["Strategic Site Selection", "Tenant Representation", "Space Optimization Analysis"]
          }
        ].map((service, idx) => (
          <div key={service.title} className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 md:gap-24 items-center`}>
            {/* Image side */}
            <motion.div
              initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full md:w-1/2 relative group"
            >
              <div className="absolute -inset-4 border border-[#E65E19]/10 rounded-2xl transform translate-x-4 translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500" />
              <div className="relative overflow-hidden rounded-2xl aspect-[4/3] shadow-2xl">
                <img
                  src={service.img}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors duration-500" />
              </div>
            </motion.div>

            {/* Content side */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="w-full md:w-1/2 space-y-8"
            >
              <h2 className="text-4xl md:text-5xl font-serif font-bold leading-tight uppercase tracking-tight">{service.title}</h2>
              <p className="text-stone-500 dark:text-stone-400 text-lg leading-relaxed">{service.desc}</p>

              <div className="space-y-4">
                {service.features.map(feat => (
                  <div key={feat} className="flex items-center gap-4 text-stone-700 dark:text-stone-300 font-medium italic">
                    <div className="w-1.5 h-1.5 bg-[#E65E19] rounded-full" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <Link to="/contact" className="inline-flex items-center gap-4 bg-[#E65E19] text-white px-10 py-5 rounded-md font-bold tracking-widest text-xs uppercase shadow-xl hover:bg-[#4A3F35] transition-all transform hover:-translate-y-1">
                Inquire Details <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        ))}
      </section>

      {/* Available Properties Section */}
      <section className="py-32 bg-surface/30">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mb-16">
            <h4 className="text-[10px] tracking-[0.3em] font-bold text-[#E65E19] mb-4 uppercase">Current Opportunities</h4>
            <h2 className="text-4xl font-serif font-bold uppercase tracking-tight">Active Property <br/> Portfolio</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {listings.map((prop, idx) => (
              <motion.div
                key={prop._id || idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="group bg-background rounded-[2.5rem] overflow-hidden border border-border shadow-xl hover:shadow-[#E65E19]/10 transition-all"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img src={getImageUrl(prop.images?.[0])} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={prop.title}/>
                  <div className="absolute top-4 right-4 bg-[#E65E19] text-white px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest">{prop.type}</div>
                </div>
                <div className="p-8 space-y-4">
                  <h3 className="text-lg font-bold uppercase tracking-tight truncate">{prop.title}</h3>
                  <p className="text-stone-500 text-sm flex items-center gap-2 italic"><MapPin className="w-3 h-3 text-[#E65E19]" /> {prop.location}</p>
                  <p className="text-stone-400 text-xs line-clamp-2 leading-relaxed">{prop.description}</p>
                  <div className="flex justify-between items-center pt-4 border-t border-border">
                    <span className="font-serif font-bold text-[#E65E19] text-lg">{prop.price}</span>
                    <Link to="/contact" className="text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-[#E65E19] transition-colors flex items-center gap-2">Details <ArrowRight className="w-3 h-3"/></Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-[#4A3F35] dark:dark-gradient rounded-[3rem] p-16 md:p-32 text-center text-white relative overflow-hidden shadow-2xl border border-white/5"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#E65E19]/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 space-y-10">
            <h2 className="text-4xl md:text-5xl font-serif font-bold leading-tight uppercase">Ready to find your oasis?</h2>
            <p className="text-stone-400 max-w-2xl mx-auto text-lg leading-relaxed mb-8">
              Contact our professional agents today for a curated selection of properties and bespoke services tailored to your vision.
            </p>
            <Link to="/contact" className="inline-block bg-[#E65E19] text-white px-12 py-5 rounded-md font-bold tracking-widest text-xs hover:bg-stone-800 transition-all transform hover:-translate-y-1 shadow-2xl shadow-[#E65E19]/30 uppercase">
              Consult with Our Team
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

const MapComponent = ({ theme }: { theme: 'light' | 'dark' }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const [viewMode, setViewMode] = useState<'standard' | 'satellite'>('satellite');
  const tileLayerRef = useRef<any>(null);

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      // @ts-ignore
      const L = window.L;
      if (!L) return;

      const coords: [number, number] = [28.6790, 77.4453];

      mapInstance.current = L.map(mapRef.current, {
        center: coords,
        zoom: 16,
        scrollWheelZoom: false,
        zoomControl: false
      });

      // Initialize with Satellite as it was requested last
      tileLayerRef.current = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri'
      }).addTo(mapInstance.current);

      const emojiIcon = L.divIcon({
        html: `<div class="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-2xl border-2 border-[#E65E19] text-2xl animate-bounce">🏢</div>`,
        className: 'custom-div-icon',
        iconSize: [48, 48],
        iconAnchor: [24, 48]
      });

      L.marker(coords, { icon: emojiIcon }).addTo(mapInstance.current)
        .bindPopup('<b class="font-serif">DAA Realty Office</b><br/>B-29, 4th floor, RDC, Ghaziabad')
        .openPopup();

      L.control.zoom({ position: 'bottomright' }).addTo(mapInstance.current);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Handle Layer Switching
  useEffect(() => {
    if (mapInstance.current) {
      // @ts-ignore
      const L = window.L;
      if (tileLayerRef.current) {
        tileLayerRef.current.remove();
      }

      if (viewMode === 'standard') {
        const url = theme === 'dark'
          ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
          : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
        tileLayerRef.current = L.tileLayer(url, {
          attribution: '&copy; OpenStreetMap'
        }).addTo(mapInstance.current);
      } else {
        tileLayerRef.current = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Tiles &copy; Esri'
        }).addTo(mapInstance.current);
      }
    }
  }, [viewMode, theme]);

  return (
    <div className="w-full h-full relative">
      <div ref={mapRef} className="w-full h-full" />

      {/* Premium Toggle Control */}
      <div className="absolute top-6 left-6 z-[1000] flex flex-col gap-1 bg-background/80 dark:bg-stone-900/80 backdrop-blur-md p-1.5 rounded-2xl shadow-2xl border border-border">
        <button
          onClick={() => setViewMode('standard')}
          className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${viewMode === 'standard' ? 'bg-[#E65E19] text-white shadow-lg' : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'}`}
        >
          Modern
        </button>
        <button
          onClick={() => setViewMode('satellite')}
          className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${viewMode === 'satellite' ? 'bg-[#E65E19] text-white shadow-lg' : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'}`}
        >
          Satellite
        </button>
      </div>
    </div>
  );
};

const ContactPage = ({ theme }: { theme: 'light' | 'dark' }) => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', interest: 'Buying Property', message: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Sending...');
    try {
      const res = await fetch(getApiUrl('/api/contact'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setStatus('Message sent successfully!');
        setFormData({ firstName: '', lastName: '', email: '', phone: '', interest: 'Buying Property', message: '' });
      } else {
        setStatus('Error sending message. Please try again.');
      }
    } catch (err) {
      setStatus('Error sending message. Please try again.');
    }
  };

  return (
    <div className="pt-20 bg-background min-h-screen text-foreground transition-colors duration-300">
      {/* Hero Header */}
      <section className="py-24 bg-surface/30">
        <div className="container mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-6 uppercase tracking-wider"
          >
            Let's Find Your <span className="text-[#E65E19]">Perfect Space</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-stone-500 dark:text-stone-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed"
          >
            Whether you're looking to buy, sell, or rent, our team at DAA Realty is here to guide you every step of the way with expertise and care.
          </motion.p>
        </div>
      </section>

      <section className="py-20 container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left: Get In Touch */}
          <div className="lg:w-2/5 space-y-12">
            <h2 className="text-2xl font-serif font-bold uppercase tracking-widest">Get In Touch</h2>

            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-surface rounded-xl flex items-center justify-center shrink-0 border border-border">
                  <MapPin className="w-5 h-5 text-[#E65E19]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-1 uppercase tracking-widest">Our Office</h4>
                  <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">B-29, 4th floor, RDC,<br/>Rajnagar, Ghaziabad</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-surface rounded-xl flex items-center justify-center shrink-0 border border-border">
                  <Phone className="w-5 h-5 text-[#E65E19]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-1 uppercase tracking-widest">Phone Number</h4>
                  <p className="text-stone-500 dark:text-stone-400 text-sm">+91 9560752744</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-surface rounded-xl flex items-center justify-center shrink-0 border border-border">
                  <Mail className="w-5 h-5 text-[#E65E19]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-1 uppercase tracking-widest">Email Address</h4>
                  <p className="text-stone-500 dark:text-stone-400 text-sm">daarealty@outlook.com</p>
                </div>
              </div>
            </div>

            {/* Proper Interactable Map View */}
            <div className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-border/50 border border-border h-[450px] relative group z-0">
                <MapComponent theme={theme} />
                <div className="absolute inset-0 border-[16px] border-white/5 dark:border-white/2 pointer-events-none rounded-[2.5rem]" />
            </div>
          </div>

          {/* Right: Inquiry Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="lg:w-3/5 bg-background rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-border/30 border border-border orange-border-glow"
          >
            <h2 className="text-2xl font-serif font-bold mb-10 uppercase tracking-widest">Send an Inquiry</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">First Name</label>
                  <input
                    type="text"
                    placeholder="John"
                    required
                    value={formData.firstName}
                    onChange={e => setFormData({...formData, firstName: e.target.value})}
                    className="w-full bg-surface border border-border p-4 rounded-xl outline-none focus:ring-2 focus:ring-[#E65E19]/10 transition-all text-sm text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">Last Name</label>
                  <input
                    type="text"
                    placeholder="Doe"
                    required
                    value={formData.lastName}
                    onChange={e => setFormData({...formData, lastName: e.target.value})}
                    className="w-full bg-surface border border-border p-4 rounded-xl outline-none focus:ring-2 focus:ring-[#E65E19]/10 transition-all text-sm text-foreground"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">Email Address</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-surface border border-border p-4 rounded-xl outline-none focus:ring-2 focus:ring-[#E65E19]/10 transition-all text-sm text-foreground"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 00000 00000"
                  required
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-surface border border-border p-4 rounded-xl outline-none focus:ring-2 focus:ring-[#E65E19]/10 transition-all text-sm text-foreground"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">I am Interested In</label>
                <select
                  value={formData.interest}
                  onChange={e => setFormData({...formData, interest: e.target.value})}
                  className="w-full bg-surface border border-border p-4 rounded-xl outline-none focus:ring-2 focus:ring-[#E65E19]/10 transition-all text-sm appearance-none cursor-pointer text-foreground"
                >
                  <option className="bg-background">Buying Property</option>
                  <option className="bg-background">Selling Property</option>
                  <option className="bg-background">Leasing Property</option>
                  <option className="bg-background">Investment Advice</option>
                  <option className="bg-background">Government Tenders</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">Your Message</label>
                <textarea
                  placeholder="Tell us more about what you are looking for..."
                  rows={4}
                  required
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-surface border border-border p-4 rounded-xl outline-none focus:ring-2 focus:ring-[#E65E19]/10 transition-all text-sm resize-none text-foreground"
                />
              </div>

              {status && <p className={`text-xs font-bold ${status.includes('success') ? 'text-green-600' : 'text-[#E65E19]'}`}>{status}</p>}

              <button
                type="submit"
                className="w-full bg-[#E65E19] text-white py-5 rounded-2xl font-bold tracking-[0.1em] text-xs hover:bg-[#D45417] transition-all transform hover:-translate-y-1 shadow-2xl shadow-[#E65E19]/30 uppercase"
              >
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

// --- App Component ---

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('daa_admin_token') || '');
  const [theme, setTheme] = useState<'light' | 'dark'>((localStorage.getItem(THEME_KEY) as 'light' | 'dark') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    // Connectivity Ping with Version Check
    fetch(getApiUrl('/api/ping'))
      .then(async res => {
        const version = res.headers.get('X-Daa-Server-Version');
        const data = await res.json();
        console.log(`[DAA-DIAGNOSTIC] Backend connected! Version: ${version || 'Unknown'}, Data:`, data);
      })
      .catch(err => {
        console.error('[DAA-DIAGNOSTIC] Backend connection failed. Ensure server.ts is running on port 3000:', err);
      });
  }, []);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const logout = () => {
    setToken('');
    localStorage.removeItem('daa_admin_token');
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col font-sans text-foreground selection:bg-[#E65E19]/20 transition-colors duration-300">
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={IS_ADMIN_SUBDOMAIN ? <Navigate to="/admin" replace /> : <HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/contact" element={<ContactPage theme={theme} />} />
              <Route path="/philosophy" element={<PhilosophyPage />} />
              <Route path="/admin" element={token ? <Navigate to="/admin/dashboard" /> : <AdminLogin setToken={setToken} />} />
              <Route path="/admin/dashboard" element={token ? <AdminDashboard token={token} logout={logout} /> : <Navigate to="/admin" />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
