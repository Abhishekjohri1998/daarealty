import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, Navigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import {
  LayoutDashboard,
  Database,
  Users,
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
            <Link to="/services" className={`text-xs font-bold tracking-widest hover:text-[#E65E19] transition-colors uppercase ${pathname === '/services' ? 'text-[#E65E19]' : ''}`}>Services</Link>
            <Link to="/about" className={`text-xs font-bold tracking-widest hover:text-[#E65E19] transition-colors uppercase ${pathname === '/about' ? 'text-[#E65E19]' : ''}`}>About Us</Link>
            <Link to="/contact" className={`text-xs font-bold tracking-widest hover:text-[#E65E19] transition-colors uppercase ${pathname === '/contact' ? 'text-[#E65E19]' : ''}`}>Contact Us</Link>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle theme={theme} toggle={toggleTheme} />
            {localStorage.getItem('daa_admin_token') && (
              <Link to="/admin" className="hidden sm:block bg-[#E65E19] text-white px-8 py-3 rounded-md text-xs font-bold tracking-widest hover:bg-stone-800 transition-all transform hover:-translate-y-1 shadow-lg shadow-[#E65E19]/20 uppercase">
                List Project
              </Link>
            )}
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
                {localStorage.getItem('daa_admin_token') && (
                  <Link to="/admin" className="inline-block bg-[#E65E19] text-white px-10 py-5 rounded-xl font-bold tracking-widest text-xs uppercase shadow-2xl shadow-[#E65E19]/30">
                    List Your Project
                  </Link>
                )}
              </motion.div>
              <div className="mt-auto pb-12 opacity-50 space-y-2">
                <p className="text-[10px] tracking-[0.2em] font-bold uppercase">Get In Touch</p>
                <p className="text-sm font-serif">daarealty@outlook.com</p>
                <p className="text-sm">9560752744 / 7011792465</p>
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
            <p className="text-stone-500 dark:text-stone-400 text-[10px] tracking-[0.3em] font-bold uppercase mb-4">
              Dreams • Aspirations • Achievements
            </p>
            <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed max-w-xs italic">
              Building Value. Creating Spaces. Delivering Trust.
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
            <div className="flex gap-4 mb-10">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-foreground hover:bg-[#E65E19] hover:text-white transition-all border border-border"><Facebook className="w-4 h-4" /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-foreground hover:bg-[#E65E19] hover:text-white transition-all border border-border"><Instagram className="w-4 h-4" /></a>
              <a href="https://wa.me/919560752744" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-foreground hover:bg-[#E65E19] hover:text-white transition-all border border-border">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.148-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
            <div className="space-y-4 mb-8">
              <div className="flex gap-3 items-start">
                <MapPin className="w-4 h-4 text-[#E65E19] shrink-0 mt-0.5" />
                <p className="text-stone-500 dark:text-stone-400 text-[11px] leading-relaxed">
                  B-29, 4th floor, RDC, Rajnagar, <br />
                  Ghaziabad Pincode-201002
                </p>
              </div>
              <div className="flex gap-3 items-center">
                <Phone className="w-4 h-4 text-[#E65E19] shrink-0" />
                <p className="text-stone-500 dark:text-stone-400 text-[11px] font-bold tracking-tighter">9560752744 , 7011792465</p>
              </div>
              <div className="flex gap-3 items-center">
                <Mail className="w-4 h-4 text-[#E65E19] shrink-0" />
                <p className="text-stone-500 dark:text-stone-400 text-[11px]">daarealty@outlook.com</p>
              </div>
            </div>
            <p className="text-stone-500 dark:text-stone-400 text-xs mb-4">Sign up for updates</p>
            <NewsletterSignup />
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
const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    try {
      const res = await fetch(getApiUrl('/api/newsletter'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('Success! Thank you for joining.');
        setEmail('');
      } else {
        setStatus(data.error || 'Signup failed. Please try again.');
      }
    } catch (err) {
      setStatus('Server connection failed.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSignup} className="space-y-2">
      <div className="flex">
        <input
          type="email"
          placeholder="Your email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="bg-surface border border-border px-4 py-2 text-sm w-full focus:outline-none focus:border-[#E65E19] text-foreground"
        />
        <button
          disabled={loading}
          className="bg-[#E65E19] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider disabled:opacity-50"
        >
          {loading ? '...' : 'Join'}
        </button>
      </div>
      {status && <p className={`text-[10px] uppercase font-bold tracking-tight ${status.includes('Success') ? 'text-green-500' : 'text-[#E65E19]'}`}>{status}</p>}
    </form>
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
            Dreams • Aspirations • Achievements
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="text-5xl md:text-8xl font-serif font-bold mb-12 leading-tight flex flex-col items-center"
          >
            <span>Building Value.</span>
            <span>Creating Spaces.</span>
            <span className="text-[#E65E19]">Delivering Trust.</span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-6 justify-center"
          >
            <Link to="/services" className="bg-[#E65E19] text-white px-10 py-5 rounded-md font-bold tracking-widest text-xs hover:bg-stone-800 transition-all transform hover:-translate-y-1 shadow-2xl shadow-[#E65E19]/40 uppercase flex items-center justify-center">
              Our Services
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
              { title: "Dreams", icon: <Star className="w-6 h-6 text-[#E65E19]" />, desc: "Understanding the aspirations of people and businesses." },
              { title: "Aspirations", icon: <TrendingUp className="w-6 h-6 text-[#E65E19]" />, desc: "Transforming ideas into real spaces and opportunities." },
              { title: "Achievements", icon: <CheckCircle2 className="w-6 h-6 text-[#E65E19]" />, desc: "Delivering projects and investments that stand the test of time." }
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mt-16 text-center max-w-4xl mx-auto"
          >
            <p className="text-stone-500 dark:text-stone-400 text-lg md:text-xl font-serif italic leading-relaxed">
              "From residential properties to commercial assets and from infrastructure projects to rental portfolios, we believe in responsible growth and reliable execution."
            </p>
          </motion.div>
        </div>
      </section>
      {/* Featured Properties Section */}
      <section className="py-32 container mx-auto px-6">
        <div className="flex justify-between items-end mb-16">
          <div className="space-y-4 text-foreground">
            <h4 className="text-[10px] tracking-[0.3em] font-bold text-[#E65E19] uppercase">Exclusive Portfolio</h4>
            <h2 className="text-3xl md:text-5xl font-serif font-bold uppercase tracking-tight">Our Existing <br className="hidden md:block" /> Projects</h2>
          </div>
          <Link to="/services" className="text-stone-400 hover:text-[#E65E19] text-xs font-bold uppercase tracking-widest transition-all mb-2 flex items-center gap-2">View All <ArrowRight className="w-4 h-4" /></Link>
        </div>
        <div className="flex gap-10 overflow-x-auto pb-10 snap-x hide-scrollbar">
          {listings.map((prop, idx) => (
            <Link
              to={`/project/${prop._id}`}
              key={prop._id || idx}
              className="group bg-surface rounded-[2.5rem] overflow-hidden border border-border shadow-2xl shadow-border/30 hover:shadow-[#E65E19]/10 transition-all min-w-[320px] md:min-w-[400px] snap-start"
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <img
                  src={getImageUrl(prop.images?.[0])}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  alt={prop.title}
                />
                <div className="absolute top-6 left-6 flex gap-2">
                  <span className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-foreground shadow-xl">
                    {prop.type || 'Sell'}
                  </span>
                </div>
              </div>
              <div className="p-10 space-y-6 text-foreground">
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-tight mb-2 group-hover:text-[#E65E19] transition-colors truncate">{prop.title}</h3>
                  <p className="text-stone-500 dark:text-stone-400 text-sm flex items-center gap-2 truncate">
                    <MapPin className="w-3 h-3 text-[#E65E19]" /> {prop.location}
                  </p>
                </div>
                <div className="flex justify-between items-center pt-6 border-t border-border">
                  <span className="text-2xl font-serif font-bold text-[#E65E19] text-lg">Price on Request</span>
                  <div className="w-10 h-10 bg-surface border border-border rounded-full flex items-center justify-center text-stone-400 group-hover:bg-[#E65E19] group-hover:text-white transition-all shadow-xl">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {listings.length === 0 && (
            <div className="col-span-3 py-20 text-center border-2 border-dashed border-border rounded-[2.5rem] opacity-50">
              <p className="text-stone-500 dark:text-stone-400 font-serif italic">Curating exceptional properties... Please check back soon.</p>
            </div>
          )}
        </div>
      </section>
      {/* Intro Section */}
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
                <p className="text-stone-500 dark:text-stone-400 leading-relaxed text-lg italic uppercase tracking-widest mb-4">
                  Welcome
                </p>
                <h2 className="text-4xl md:text-6xl font-serif font-bold leading-tight uppercase">DAA <br />Realty</h2>
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-stone-500 dark:text-stone-400 leading-relaxed text-xl mb-6"
              >
                Welcome to DAA Realty, a company driven by a long-term vision of creating sustainable value through real estate investments, infrastructure development and property solutions.
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-stone-500 dark:text-stone-400 leading-relaxed text-lg"
              >
                With a strong presence in real estate investments and property leasing, DAA Realty focuses on building assets that generate lasting value for communities, investors and businesses.
              </motion.p>
              <Link to="/about" className="inline-flex items-center gap-4 text-[#E65E19] font-bold tracking-[0.2em] text-xs uppercase group">
                Discover Who We Are <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
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
  const [founderImage, setFounderImage] = useState<string>('/assets/executive_portrait.png');
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  useEffect(() => {
    fetch(getApiUrl('/api/content')).then(res => res.json()).then(data => {
      const img = data.find((c: any) => c.key === 'founder_image');
      if (img && img.value) setFounderImage(img.value);
    }).catch(() => { });
    fetch(getApiUrl('/api/team')).then(res => res.json()).then(setTeamMembers).catch(() => { });
  }, []);
  return (
    <div className="pt-20 bg-background min-h-screen text-foreground transition-colors duration-300">
      {/* Hero Section */}
      <section className="py-32 text-center container mx-auto px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-7xl font-serif font-bold leading-tight mb-8"
        >
          Building Value. <br />
          <span className="text-[#E65E19]">Creating Spaces.</span> Delivering Trust.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-stone-500 max-w-3xl mx-auto text-lg leading-relaxed mb-12"
        >
          DAA Realty is a diversified real estate and infrastructure enterprise engaged in property investments, government contracts and leasing solutions across residential and commercial sectors.
        </motion.p>
        <div className="w-24 h-1.5 bg-[#E65E19] mx-auto rounded-full" />
      </section>
      {/* About Us Detail */}
      <section className="py-24 container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          <div className="lg:w-1/2 space-y-12">
            <div>
              <h4 className="text-[10px] tracking-[0.3em] font-bold text-[#E65E19] mb-4 uppercase">The Foundation</h4>
              <h2 className="text-4xl md:text-6xl font-serif font-bold leading-tight uppercase">About Us</h2>
            </div>
            <p className="text-stone-500 text-lg leading-relaxed">
              The company is built on a foundation of experience, integrity and strategic vision. Our activities range from participating in public infrastructure projects to developing and managing real estate assets for long-term value creation.
            </p>
            <p className="text-stone-500 text-lg leading-relaxed">
              We believe real estate is not just about buildings—it is about creating spaces where people live, work, and grow.
            </p>
            <p className="text-stone-500 text-lg leading-relaxed">
              Through disciplined investments and responsible development, DAA Realty aims to build a portfolio of assets that contribute to economic growth and community development.
            </p>
          </div>
          <div className="lg:w-1/2 relative group">
            <div className="absolute -inset-10 bg-[#FDF8F5] rounded-full scale-0 group-hover:scale-100 transition-transform duration-1000 blur-3xl opacity-50" />
            <motion.img
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              src={founderImage}
              className="rounded-[3rem] shadow-2xl relative z-10 w-full object-cover aspect-square grayscale-[20%] hover:grayscale-0 transition-all duration-700"
              alt="Executive Management"
            />
          </div>
        </div>
      </section>
      {/* Who We Are */}
      <section className="py-24 bg-surface/50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <h4 className="text-[10px] tracking-[0.3em] font-bold text-[#E65E19] mb-6 uppercase">Our Expertise</h4>
            <h2 className="text-4xl md:text-6xl font-serif font-bold leading-tight uppercase mb-12">Who We Are</h2>
            <p className="text-stone-500 text-lg leading-relaxed mb-12 italic">
              DAA Realty represents a commitment to excellence in real estate and infrastructure development.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {[
                { title: "Government Contracts", desc: "Participation in infrastructure and public works through government tenders." },
                { title: "Real Estate Investments", desc: "Strategic acquisition and development of land and property assets." },
                { title: "Residential Leasing", desc: "Providing quality rental spaces for families and individuals." },
                { title: "Commercial Leasing", desc: "Offering spaces suited for offices, retail businesses and emerging enterprises." }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="w-10 h-10 bg-[#E65E19] text-white flex items-center justify-center rounded-lg font-bold shrink-0 shadow-lg">•</div>
                  <div>
                    <h3 className="text-xl font-bold uppercase tracking-tight mb-2">{item.title}</h3>
                    <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-16 space-y-6">
              <p className="text-stone-500 text-lg leading-relaxed">
                Our strength lies in combining construction expertise with real estate insight, enabling us to identify opportunities and execute projects efficiently.
              </p>
              <p className="text-stone-500 text-lg leading-relaxed">
                At DAA Realty, every project reflects our commitment to quality, transparency and long-term value creation.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Vision & Mission Cards */}
      <section className="py-24 bg-surface/30">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: "Our Vision",
              icon: <Star className="w-8 h-8 text-[#E65E19]" />,
              desc: "To become a trusted and respected real estate enterprise known for responsible investments, quality infrastructure development and sustainable asset creation. We aim to build a portfolio that not only generates value but also contributes positively to communities and urban development."
            },
            {
              title: "Our Mission",
              icon: <TrendingUp className="w-8 h-8 text-[#E65E19]" />,
              desc: "Our mission is guided by the principles represented by DAA – Dreams, Aspirations, Achievements."
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
              {card.title === "Our Mission" && (
                <ul className="space-y-3">
                  {[
                    "To create reliable real estate assets through strategic investments.",
                    "To participate in infrastructure development through government projects with integrity and professionalism.",
                    "To provide quality residential and commercial spaces for modern living and business needs.",
                    "To build long-term relationships based on trust, transparency and consistent delivery."
                  ].map(m => (
                    <li key={m} className="flex gap-2 text-sm text-stone-500"><span className="text-[#E65E19]">•</span> {m}</li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      </section>
      {/* Team Section */}
      {teamMembers.length > 0 && (
        <section className="py-24 bg-background">
          <div className="container mx-auto px-6">
            <h4 className="text-[10px] tracking-[0.3em] font-bold text-[#E65E19] mb-4 uppercase text-center">Leadership</h4>
            <h2 className="text-4xl md:text-5xl font-serif font-bold leading-tight uppercase mb-16 text-center">Meet The Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
              {teamMembers.map((member, idx) => (
                <motion.div
                  key={member._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group cursor-pointer"
                >
                  <div className="rounded-[2rem] overflow-hidden mb-6 aspect-[4/5] bg-surface relative shadow-xl border border-border">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6 text-white text-left">
                      <h3 className="text-2xl font-serif font-bold uppercase tracking-tight leading-tight">{member.name}</h3>
                      <p className="text-[#E65E19] text-xs font-bold tracking-widest uppercase mt-2 opacity-90">{member.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
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
          <motion.h1 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} className="text-4xl md:text-7xl font-serif font-bold mb-8 uppercase tracking-tight leading-tight">
            Dreams <br /> Aspirations <br /> <span className="text-[#E65E19]">Achievements</span>
          </motion.h1>
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
              text: "Understanding the aspirations of people and businesses. We listen to the quietest whispers of ambition to build the loudest statements of success."
            },
            {
              title: "Aspirations",
              num: "02",
              text: "Transforming ideas into real spaces and opportunities. We bridge the gap between imagination and infrastructure with precision and care."
            },
            {
              title: "Achievements",
              num: "03",
              text: "Delivering projects and investments that stand the test of time. Our landmarks are the evidence of our commitment to quality and longevity."
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
      {/* Vision Statement */}
      <section className="py-32 bg-surface/50 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#E65E19]/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="text-3xl md:text-5xl font-serif font-bold mb-16 uppercase tracking-widest leading-tight"
          >
            Our <br /><span className="text-[#E65E19]">Vision</span>
          </motion.h2>
          <div className="space-y-8 text-stone-600 dark:text-stone-300 text-lg leading-relaxed text-left md:text-center italic">
            <p>To become a trusted and respected real estate enterprise known for responsible investments, quality infrastructure development and sustainable asset creation.</p>
            <p>We aim to build a portfolio that not only generates value but also contributes positively to communities and urban development.</p>
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
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFiles = async (files: FileList) => {
    setUploading(true);
    // Create local previews immediately
    const localPreviews = Array.from(files).map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...localPreviews]);
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
      if (data.urls) {
        onUpload(data.urls);
        // Clear previews once uploaded
        setPreviews([]);
      }
    } catch (err) {
      console.error("Upload failed:", err);
      // Remove previews on failure
      setPreviews([]);
    } finally {
      setUploading(false);
    }
  };
  return (
    <div className="space-y-4">
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
      {previews.length > 0 && (
        <div className="grid grid-cols-4 gap-4 animate-pulse">
          {previews.map((src, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-[#E65E19]/20 grayscale">
              <img src={src} className="w-full h-full object-cover opacity-50" alt="Uploading preview" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-[#E65E19] border-t-transparent rounded-full animate-spin" />
              </div>
            </div>
          ))}
        </div>
      )}
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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'listings' | 'media' | 'inquiries' | 'newsletters' | 'team'>('dashboard');
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [newsletters, setNewsletters] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [founderImage, setFounderImage] = useState<string>('');
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [isEditingTeam, setIsEditingTeam] = useState(false);
  const [newTeamMember, setNewTeamMember] = useState<any>({ name: '', role: '', image: '', order: 0 });
  const [dragActiveTeam, setDragActiveTeam] = useState(false);
  const [newProp, setNewProp] = useState<any>({ title: '', price: '₹', location: '', type: 'Sell', beds: 3, sqft: 2000, description: '', images: [], featured: false, coordinates: { lat: 28.6790, lng: 77.4453 }, topology: '', propertyStatus: '', superArea: '', carpetArea: '', possession: '', amenities: [], floorPlans: [], reraNo: '', reraProjectName: '', reraQrCode: '', aboutDeveloper: '', developerName: '', faq: [], brochureUrl: '', locationMapUrl: '' });
  useEffect(() => {
    fetchListings();
    fetchInquiries();
    fetchNewsletters();
    fetchTeam();
    fetchContent();
  }, []);
  const fetchListings = () => {
    fetch(getApiUrl('/api/listings')).then(res => res.json()).then(setListings);
  };
  const fetchInquiries = () => {
    fetch(getApiUrl('/api/admin/inquiries'), {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json()).then(setInquiries).catch(() => { });
  };
  const fetchNewsletters = () => {
    fetch(getApiUrl('/api/admin/newsletters'), {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json()).then(setNewsletters).catch(() => { });
  };
  const fetchTeam = () => {
    fetch(getApiUrl('/api/team'))
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setTeamMembers(data);
        else setTeamMembers([]);
      })
      .catch(() => setTeamMembers([]));
  };
  const fetchContent = () => {
    fetch(getApiUrl('/api/content')).then(res => res.json()).then((data: any) => {
      const img = data.find((c: any) => c.key === 'founder_image');
      if (img) setFounderImage(img.value);
    }).catch(() => { });
  };
  const updateFounderImage = async (url: string) => {
    try {
      await fetch(getApiUrl('/api/content/founder_image'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ value: url })
      });
      setFounderImage(url);
    } catch (err) { console.error('Failed to update founder image'); }
  };
  const addListing = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isEditing ? `/api/listings/${newProp._id}` : '/api/listings';
    const res = await fetch(getApiUrl(endpoint), {
      method: isEditing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(newProp)
    });
    if (res.ok) {
      setShowAdd(false);
      setIsEditing(false);
      fetchListings();
      setNewProp({ title: '', price: '₹', location: '', type: 'Sell', beds: 3, sqft: 2000, description: '', images: [], featured: false, coordinates: { lat: 28.6790, lng: 77.4453 }, topology: '', propertyStatus: '', superArea: '', carpetArea: '', possession: '', amenities: [], floorPlans: [], reraNo: '', reraProjectName: '', reraQrCode: '', aboutDeveloper: '', developerName: '', faq: [], brochureUrl: '', locationMapUrl: '' });
    }
  };
  const openEdit = (prop: any) => {
    setNewProp({ ...prop, coordinates: prop.coordinates || { lat: 28.6790, lng: 77.4453 } });
    setIsEditing(true);
    setShowAdd(true);
  };
  const openAdd = () => {
    setNewProp({ title: '', price: '₹', location: '', type: 'Sell', beds: 3, sqft: 2000, description: '', images: [], featured: false, coordinates: { lat: 28.6790, lng: 77.4453 }, topology: '', propertyStatus: '', superArea: '', carpetArea: '', possession: '', amenities: [], floorPlans: [], reraNo: '', reraProjectName: '', reraQrCode: '', aboutDeveloper: '', developerName: '', faq: [], brochureUrl: '', locationMapUrl: '' });
    setIsEditing(false);
    setShowAdd(true);
  };
  const deleteListing = async (id: string) => {
    if (window.confirm("Delete this listing?")) {
      await fetch(getApiUrl(`/api/listings/${id}`), { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      fetchListings();
    }
  };
  const uploadTeamImage = async (file: File) => {
    const formData = new FormData();
    formData.append('images', file);
    const res = await fetch(getApiUrl('/api/upload'), {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    if (res.ok) {
      const data = await res.json();
      if (data.urls?.length) setNewTeamMember({ ...newTeamMember, image: data.urls[0] });
    }
  };
  const handleTeamDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveTeam(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await uploadTeamImage(e.dataTransfer.files[0]);
    }
  };
  const handleTeamFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await uploadTeamImage(e.target.files[0]);
    }
  };
  const addTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isEditingTeam ? `/api/team/${newTeamMember._id}` : '/api/team';
    const res = await fetch(getApiUrl(endpoint), {
      method: isEditingTeam ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(newTeamMember)
    });
    if (res.ok) {
      setShowAddTeam(false);
      setIsEditingTeam(false);
      fetchTeam();
      setNewTeamMember({ name: '', role: '', image: '', order: 0 });
    }
  };
  const openEditTeam = (member: any) => {
    setNewTeamMember({ ...member });
    setIsEditingTeam(true);
    setShowAddTeam(true);
  };
  const openAddTeam = () => {
    setNewTeamMember({ name: '', role: '', image: '', order: 0 });
    setIsEditingTeam(false);
    setShowAddTeam(true);
  };
  const deleteTeamMember = async (id: string) => {
    if (window.confirm("Delete this team member?")) {
      await fetch(getApiUrl(`/api/team/${id}`), { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      fetchTeam();
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
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </button>
          <button
            onClick={() => setActiveTab('listings')}
            className={`flex items-center gap-3 w-full p-4 rounded-xl transition-all font-bold ${activeTab === 'listings' ? 'bg-[#E65E19] shadow-lg text-white' : 'text-stone-400 hover:text-white'}`}
          >
            <Database className="w-5 h-5" /> Listings
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`flex items-center gap-3 w-full p-4 rounded-xl transition-all font-bold ${activeTab === 'media' ? 'bg-[#E65E19] shadow-lg text-white' : 'text-stone-400 hover:text-white'}`}
          >
            <ImageIcon className="w-5 h-5" /> Media
          </button>
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`flex items-center gap-3 w-full p-4 rounded-xl transition-all font-bold ${activeTab === 'inquiries' ? 'bg-[#E65E19] shadow-lg text-white' : 'text-stone-400 hover:text-white'}`}
          >
            <Mail className="w-5 h-5" /> Inquiries
          </button>
          <button
            onClick={() => setActiveTab('newsletters')}
            className={`flex items-center gap-3 w-full p-4 rounded-xl transition-all font-bold ${activeTab === 'newsletters' ? 'bg-[#E65E19] shadow-lg text-white' : 'text-stone-400 hover:text-white'}`}
          >
            <Phone className="w-5 h-5" /> Newsletters
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`flex items-center gap-3 w-full p-4 rounded-xl transition-all font-bold ${activeTab === 'team' ? 'bg-[#E65E19] shadow-lg text-white' : 'text-stone-400 hover:text-white'}`}
          >
            <Users className="w-5 h-5" /> Team
          </button>
        </nav>
        <button onClick={logout} className="flex items-center gap-3 w-full p-4 rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-bold uppercase"><LogOut className="w-5 h-5" /> Logout</button>
      </aside>
      <div className="md:hidden fixed top-0 left-0 right-0 bg-stone-900 text-white p-4 flex justify-between items-center z-40 shadow-xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#E65E19] rounded-lg flex items-center justify-center font-bold text-sm uppercase">D</div>
          <span className="font-serif font-bold uppercase">Admin</span>
        </div>
        <button onClick={logout} className="p-2 text-red-400"><LogOut className="w-6 h-6" /></button>
      </div>
      <main className="flex-grow p-8 md:p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <div className="text-foreground">
            <h1 className="text-3xl font-serif font-bold uppercase tracking-tight">
              {activeTab === 'dashboard' ? 'Overview' : activeTab === 'listings' ? 'Listing Management' : activeTab === 'media' ? 'Media Library' : activeTab === 'inquiries' ? 'Inquiries' : activeTab === 'team' ? 'Team Management' : 'Newsletter Subscribers'}
            </h1>
            <p className="text-stone-500 dark:text-stone-400">
              {activeTab === 'dashboard' ? 'Welcome to your DAA Realty dashboard' : activeTab === 'listings' ? 'Managing properties on daarealty.in' : activeTab === 'media' ? 'All property images and assets' : activeTab === 'inquiries' ? 'Active inquiries and leads' : activeTab === 'team' ? 'Manage founder image and team members' : 'List of users signed up for updates'}
            </p>
          </div>
          <div className="flex gap-4">
            {activeTab === 'inquiries' && inquiries.length > 0 && (
              <button onClick={() => {
                const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Interest', 'Message', 'Date'];
                const csvData = inquiries.map(inq => [
                  `"${inq.firstName}"`, `"${inq.lastName}"`, `"${inq.email}"`, `"${inq.phone}"`, `"${inq.interest}"`, `"${inq.message.replace(/"/g, '""')}"`, `"${new Date(inq.createdAt).toLocaleString()}"`
                ].join(','));
                const blob = new Blob([headers.join(',') + '\n' + csvData.join('\n')], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.setAttribute('hidden', '');
                a.setAttribute('href', url);
                a.setAttribute('download', 'inquiries.csv');
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              }} className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-green-700 active:scale-95 transition-all uppercase tracking-widest text-xs">
                Export to Excel
              </button>
            )}
            {activeTab === 'team' && (
              <button onClick={openAddTeam} className="bg-[#E65E19] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-[#E65E19]/20 active:scale-95 transition-all uppercase tracking-widest text-xs">
                <PlusIcon className="w-5 h-5" /> Add Member
              </button>
            )}
            {activeTab === 'listings' && (
              <button onClick={openAdd} className="bg-[#E65E19] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-[#E65E19]/20 active:scale-95 transition-all uppercase tracking-widest text-xs">
                <PlusIcon className="w-5 h-5" /> Add Listing
              </button>
            )}
          </div>
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
              <p className="text-4xl font-serif font-bold text-foreground">{inquiries.length}</p>
            </div>
          </div>
        )}
        {activeTab === 'listings' && (
          <div className="grid grid-cols-1 gap-6">
            {listings.map((prop, i) => (
              <div key={i} className="bg-surface p-6 rounded-2xl shadow-sm border border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all hover:shadow-md">
                <div className="flex items-center gap-6 text-foreground">
                  <div className="w-20 h-20 bg-background rounded-xl overflow-hidden shadow-inner border border-border">
                    <img src={prop.images?.[0] || '/assets/placeholder.png'} className="w-full h-full object-cover" alt={prop.title} />
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
        {activeTab === 'inquiries' && (
          <div className="space-y-6">
            {inquiries.map((inq, i) => (
              <div key={i} className="bg-surface p-8 rounded-3xl border border-border space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold uppercase tracking-tight">{inq.firstName} {inq.lastName}</h3>
                    <p className="text-stone-500 text-sm">{inq.email} • {inq.phone}</p>
                  </div>
                  <span className="bg-[#E65E19]/10 text-[#E65E19] px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    {inq.interest}
                  </span>
                </div>
                <div className="bg-background p-6 rounded-2xl border border-border">
                  <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed italic">"{inq.message}"</p>
                </div>
                <div className="text-[10px] text-stone-400 uppercase font-bold tracking-[0.2em]">
                  Received: {new Date(inq.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
            {inquiries.length === 0 && (
              <div className="text-center py-20 opacity-50 italic">No inquiries found yet.</div>
            )}
          </div>
        )}
        {activeTab === 'newsletters' && (
          <div className="bg-surface rounded-3xl border border-border overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-background/50">
                  <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-stone-400">Email Address</th>
                  <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-stone-400">Signup Date</th>
                </tr>
              </thead>
              <tbody>
                {newsletters.map((sub, i) => (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-background/20">
                    <td className="p-6 text-sm font-bold text-foreground">{sub.email}</td>
                    <td className="p-6 text-sm text-stone-500">{new Date(sub.signedUpAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {newsletters.length === 0 && (
              <div className="p-20 text-center opacity-50 italic">No newsletter subscribers yet.</div>
            )}
          </div>
        )}
        {activeTab === 'team' && (
          <div className="space-y-12">
            <div className="bg-surface p-8 rounded-3xl border border-border">
              <h2 className="text-xl font-bold uppercase mb-6 text-foreground">Founder / Executive Image</h2>
              <div className="flex items-center gap-8">
                <div className="w-32 h-32 rounded-2xl overflow-hidden bg-background border border-border shadow-inner">
                  {founderImage ? <img src={founderImage} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-stone-400"><ImageIcon /></div>}
                </div>
                <div>
                  <label className="bg-white border border-border px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs cursor-pointer hover:bg-stone-50 transition-colors text-stone-900 inline-block">
                    Upload New Image
                    <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                      if (!e.target.files?.length) return;
                      const formData = new FormData();
                      formData.append('images', e.target.files[0]);
                      const res = await fetch(getApiUrl('/api/upload'), {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${token}` },
                        body: formData
                      });
                      if (res.ok) {
                        const data = await res.json();
                        if (data.urls?.length) updateFounderImage(data.urls[0]);
                      }
                    }} />
                  </label>
                  <p className="text-stone-500 text-xs mt-4">This image is displayed prominently on the About Us page.</p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold uppercase mb-6 text-foreground">Team Members</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamMembers.map((member, i) => (
                  <div key={i} className="bg-surface p-6 rounded-2xl shadow-sm border border-border flex items-center gap-6">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-background border border-border flex-shrink-0">
                      <img src={member.image} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold text-lg uppercase tracking-tight text-foreground">{member.name}</h3>
                      <p className="text-[#E65E19] text-sm font-bold tracking-widest uppercase">{member.role}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button onClick={() => openEditTeam(member)} className="p-3 bg-background text-stone-600 rounded-xl hover:bg-stone-100 border border-border flex justify-center"><EditIcon className="w-4 h-4" /></button>
                      <button onClick={() => deleteTeamMember(member._id)} className="p-3 bg-red-500/10 text-red-500 rounded-xl flex justify-center hover:bg-red-500/20"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
          {showAddTeam && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm" onClick={() => { setShowAddTeam(false); setIsEditingTeam(false); }}>
              <motion.div onClick={(e) => e.stopPropagation()} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-surface w-full max-w-lg rounded-3xl p-10 shadow-2xl border border-border">
                <div className="flex justify-between items-center mb-8 text-foreground">
                  <h2 className="text-2xl font-serif font-bold uppercase tracking-tight">{isEditingTeam ? 'Edit Team Member' : 'New Team Member'}</h2>
                  <button onClick={() => { setShowAddTeam(false); setIsEditingTeam(false); }} className="text-stone-400 hover:text-[#E65E19] transition-colors"><X /></button>
                </div>
                <form onSubmit={addTeamMember} className="space-y-6 text-foreground">
                  <div>
                    <label className="text-xs font-bold uppercase text-stone-400 block mb-2 tracking-widest">Name</label>
                    <input value={newTeamMember.name} onChange={e => setNewTeamMember({ ...newTeamMember, name: e.target.value })} className="w-full bg-background border border-border p-4 rounded-xl focus:ring-2 focus:ring-[#E65E19]/20 outline-none transition-all text-foreground" required />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-stone-400 block mb-2 tracking-widest">Role</label>
                    <input value={newTeamMember.role} onChange={e => setNewTeamMember({ ...newTeamMember, role: e.target.value })} className="w-full bg-background border border-border p-4 rounded-xl outline-none text-foreground" required />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-stone-400 block mb-2 tracking-widest">Image</label>
                    <div
                      className={`w-full h-32 border-2 border-dashed rounded-xl flex items-center justify-center relative transition-colors ${dragActiveTeam ? 'border-[#E65E19] bg-[#E65E19]/10' : 'border-border bg-background hover:bg-surface'}`}
                      onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setDragActiveTeam(true); }}
                      onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setDragActiveTeam(false); }}
                      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                      onDrop={handleTeamDrop}
                    >
                      <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" onChange={handleTeamFileInput} />
                      {newTeamMember.image ? (
                        <img src={newTeamMember.image} className="w-full h-full object-contain rounded-xl p-1 pointer-events-none" />
                      ) : (
                        <div className="flex flex-col items-center pointer-events-none">
                          <ImageIcon className="w-6 h-6 text-stone-400 mb-2" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Click or Drag Image Here</span>
                        </div>
                      )}
                    </div>
                    {newTeamMember.image && (
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-[10px] text-stone-500 truncate max-w-[200px]">{newTeamMember.image.split('/').pop()}</span>
                        <button type="button" onClick={() => setNewTeamMember({ ...newTeamMember, image: '' })} className="text-[10px] text-red-500 font-bold uppercase tracking-widest hover:underline">Remove</button>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-stone-400 block mb-2 tracking-widest">Order (Sort)</label>
                    <input type="number" value={newTeamMember.order} onChange={e => setNewTeamMember({ ...newTeamMember, order: parseInt(e.target.value) || 0 })} className="w-full bg-background border border-border p-4 rounded-xl outline-none text-foreground" />
                  </div>
                  <button type="submit" className="w-full bg-[#E65E19] text-white p-4 rounded-xl font-bold uppercase tracking-widest shadow-lg hover:shadow-[#E65E19]/20 active:scale-95 transition-all">
                    {isEditingTeam ? 'Save Changes' : 'Add Member'}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showAdd && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm" onClick={() => { setShowAdd(false); setIsEditing(false); }}>
              <motion.div onClick={(e) => e.stopPropagation()} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-surface w-full max-w-3xl rounded-3xl p-10 overflow-y-auto max-h-[90vh] shadow-2xl border border-border">
                <div className="flex justify-between items-center mb-8 text-foreground">
                  <h2 className="text-2xl font-serif font-bold uppercase tracking-tight">{isEditing ? 'Edit Property Details' : 'New Property Listing'}</h2>
                  <button onClick={() => { setShowAdd(false); setIsEditing(false); }} className="text-stone-400 hover:text-[#E65E19] transition-colors"><X /></button>
                </div>
                <form onSubmit={addListing} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-foreground">
                  {/* ── BASIC INFO ── */}
                  <div className="col-span-2 border-b border-border pb-2 mb-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#E65E19]">Basic Information</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-bold uppercase text-stone-400 block mb-2 tracking-widest">Title *</label>
                    <input value={newProp.title} onChange={e => setNewProp({ ...newProp, title: e.target.value })} className="w-full bg-background border border-border p-4 rounded-xl focus:ring-2 focus:ring-[#E65E19]/20 outline-none text-foreground" placeholder="Rishita Mulberry Heights" required />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-stone-400 block mb-2 tracking-widest">Price *</label>
                    <input value={newProp.price} onChange={e => { const val = e.target.value; if (val === '' || val === '₹' || /^₹/.test(val)) setNewProp({ ...newProp, price: val || '₹' }); }} className="w-full bg-background border border-border p-4 rounded-xl focus:ring-2 focus:ring-[#E65E19]/20 outline-none text-foreground" placeholder="₹1,20,00,000 / On Request" required />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-stone-400 block mb-2 tracking-widest">Location *</label>
                    <input value={newProp.location} onChange={e => setNewProp({ ...newProp, location: e.target.value })} className="w-full bg-background border border-border p-4 rounded-xl outline-none text-foreground" placeholder="Sushant Golf City, Lucknow" required />
                  </div>
                  <div className="col-span-2">
                    <LocationPicker coordinates={newProp.coordinates} onChange={(coords) => setNewProp({ ...newProp, coordinates: coords })} />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-stone-400 block mb-2 tracking-widest">Type</label>
                    <select value={newProp.type} onChange={e => setNewProp({ ...newProp, type: e.target.value })} className="w-full bg-background border border-border p-4 rounded-xl outline-none text-foreground">
                      <option value="Plot">Plot</option>
                      <option value="Sell">Sell</option>
                      <option value="Freehold">Freehold</option>
                      <option value="Flat">Flat</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-4 pt-6">
                    <input type="checkbox" checked={newProp.featured} onChange={e => setNewProp({ ...newProp, featured: e.target.checked })} className="w-6 h-6 rounded border-border text-[#E65E19] cursor-pointer" />
                    <label className="text-xs font-bold uppercase text-stone-400 tracking-widest">Mark as Featured</label>
                  </div>
                  {/* ── PROPERTY SPECS ── */}
                  <div className="col-span-2 border-b border-border pb-2 mt-4 mb-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#E65E19]">Property Specifications</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-stone-400 block mb-2 tracking-widest">Topology (e.g. 2 BHK, 3 BHK)</label>
                    <input value={newProp.topology} onChange={e => setNewProp({ ...newProp, topology: e.target.value })} className="w-full bg-background border border-border p-4 rounded-xl outline-none text-foreground" placeholder="2 BHK, 3 BHK" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-stone-400 block mb-2 tracking-widest">Property Status</label>
                    <input value={newProp.propertyStatus} onChange={e => setNewProp({ ...newProp, propertyStatus: e.target.value })} className="w-full bg-background border border-border p-4 rounded-xl outline-none text-foreground" placeholder="Ready to move in" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-stone-400 block mb-2 tracking-widest">Beds</label>
                    <input type="number" value={newProp.beds} onChange={e => setNewProp({ ...newProp, beds: parseInt(e.target.value) || 0 })} className="w-full bg-background border border-border p-4 rounded-xl outline-none text-foreground" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-stone-400 block mb-2 tracking-widest">Baths</label>
                    <input type="number" value={newProp.baths || ''} onChange={e => setNewProp({ ...newProp, baths: parseInt(e.target.value) || 0 })} className="w-full bg-background border border-border p-4 rounded-xl outline-none text-foreground" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-stone-400 block mb-2 tracking-widest">Super Area (sqft)</label>
                    <input value={newProp.superArea} onChange={e => setNewProp({ ...newProp, superArea: e.target.value })} className="w-full bg-background border border-border p-4 rounded-xl outline-none text-foreground" placeholder="1323 - 2250 sq.ft." />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-stone-400 block mb-2 tracking-widest">Carpet Area (sqft)</label>
                    <input value={newProp.carpetArea} onChange={e => setNewProp({ ...newProp, carpetArea: e.target.value })} className="w-full bg-background border border-border p-4 rounded-xl outline-none text-foreground" placeholder="833 - 1473 sq.ft." />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-stone-400 block mb-2 tracking-widest">Plot/Unit Size (sqft)</label>
                    <input type="number" value={newProp.sqft} onChange={e => setNewProp({ ...newProp, sqft: parseInt(e.target.value) || 0 })} className="w-full bg-background border border-border p-4 rounded-xl outline-none text-foreground" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-stone-400 block mb-2 tracking-widest">Possession</label>
                    <input value={newProp.possession} onChange={e => setNewProp({ ...newProp, possession: e.target.value })} className="w-full bg-background border border-border p-4 rounded-xl outline-none text-foreground" placeholder="Ready To Move / Dec 2025" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-bold uppercase text-stone-400 block mb-2 tracking-widest">Description *</label>
                    <textarea value={newProp.description} onChange={e => setNewProp({ ...newProp, description: e.target.value })} className="w-full bg-background border border-border p-4 rounded-xl h-28 focus:ring-2 focus:ring-[#E65E19]/20 outline-none text-foreground" placeholder="Full project description..."></textarea>
                  </div>
                  {/* ── AMENITIES ── */}
                  <div className="col-span-2 border-b border-border pb-2 mt-4 mb-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#E65E19]">Amenities</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-bold uppercase text-stone-400 block mb-2 tracking-widest">Amenities (one per line)</label>
                    <textarea value={(newProp.amenities || []).join('\n')} onChange={e => setNewProp({ ...newProp, amenities: e.target.value.split('\n').filter((a: string) => a.trim()) })} className="w-full bg-background border border-border p-4 rounded-xl h-28 focus:ring-2 focus:ring-[#E65E19]/20 outline-none text-foreground" placeholder={"Bank & ATM\nCCTV Security\nClub House\nPower Backup\nKids Play Area\nJogging Track\nParking Security"} />
                    <p className="text-[10px] text-stone-400 mt-1">Enter each amenity on a new line</p>
                  </div>
                  {/* ── FLOOR PLANS ── */}
                  <div className="col-span-2 border-b border-border pb-2 mt-4 mb-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#E65E19]">Floor Plans</p>
                  </div>
                  <div className="col-span-2 space-y-4">
                    <label className="text-xs font-bold uppercase text-stone-400 block mb-2 tracking-widest">Floor Plan Images</label>
                    <FileUploader token={token} onUpload={(urls) => setNewProp({ ...newProp, floorPlans: [...(newProp.floorPlans || []), ...urls] })} />
                    {(newProp.floorPlans || []).length > 0 && (
                      <div className="grid grid-cols-4 gap-4 mt-4">
                        {newProp.floorPlans.map((img: string, i: number) => (
                          <div key={i} className="relative aspect-square rounded-xl overflow-hidden group border border-border">
                            <img src={getImageUrl(img)} className="w-full h-full object-cover" alt="Floor Plan" />
                            <button type="button" onClick={() => setNewProp({ ...newProp, floorPlans: newProp.floorPlans.filter((_: any, idx: number) => idx !== i) })} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* ── RERA DETAILS ── */}
                  <div className="col-span-2 border-b border-border pb-2 mt-4 mb-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#E65E19]">RERA Details</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-stone-400 block mb-2 tracking-widest">RERA Project Name</label>
                    <input value={newProp.reraProjectName} onChange={e => setNewProp({ ...newProp, reraProjectName: e.target.value })} className="w-full bg-background border border-border p-4 rounded-xl outline-none text-foreground" placeholder="Project Phase 3" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-stone-400 block mb-2 tracking-widest">RERA Number</label>
                    <input value={newProp.reraNo} onChange={e => setNewProp({ ...newProp, reraNo: e.target.value })} className="w-full bg-background border border-border p-4 rounded-xl outline-none text-foreground" placeholder="UPRERAPRJ308470" />
                  </div>
                  <div className="col-span-2 space-y-4">
                    <label className="text-xs font-bold uppercase text-stone-400 block mb-2 tracking-widest">RERA QR Code Image</label>
                    <FileUploader token={token} onUpload={(urls) => setNewProp({ ...newProp, reraQrCode: urls[0] })} />
                    {newProp.reraQrCode && (
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-border group">
                        <img src={getImageUrl(newProp.reraQrCode)} className="w-full h-full object-cover" alt="RERA QR" />
                        <button type="button" onClick={() => setNewProp({ ...newProp, reraQrCode: '' })} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
                      </div>
                    )}
                  </div>
                  {/* ── ABOUT DEVELOPER ── */}
                  <div className="col-span-2 border-b border-border pb-2 mt-4 mb-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#E65E19]">Developer Information</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-stone-400 block mb-2 tracking-widest">Developer Name</label>
                    <input value={newProp.developerName} onChange={e => setNewProp({ ...newProp, developerName: e.target.value })} className="w-full bg-background border border-border p-4 rounded-xl outline-none text-foreground" placeholder="Rishita Developers Pvt. Ltd." />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-bold uppercase text-stone-400 block mb-2 tracking-widest">About Developer</label>
                    <textarea value={newProp.aboutDeveloper} onChange={e => setNewProp({ ...newProp, aboutDeveloper: e.target.value })} className="w-full bg-background border border-border p-4 rounded-xl h-28 outline-none text-foreground" placeholder="Developer background and description..."></textarea>
                  </div>
                  {/* ── FAQ ── */}
                  <div className="col-span-2 border-b border-border pb-2 mt-4 mb-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#E65E19]">FAQ</p>
                  </div>
                  <div className="col-span-2 space-y-4">
                    {(newProp.faq || []).map((item: any, i: number) => (
                      <div key={i} className="bg-background border border-border rounded-xl p-4 space-y-3 relative">
                        <button type="button" onClick={() => setNewProp({ ...newProp, faq: newProp.faq.filter((_: any, idx: number) => idx !== i) })} className="absolute top-2 right-2 p-1 bg-red-500/10 text-red-500 rounded-lg"><X className="w-3 h-3" /></button>
                        <input value={item.question} onChange={e => { const faq = [...newProp.faq]; faq[i] = { ...faq[i], question: e.target.value }; setNewProp({ ...newProp, faq }); }} className="w-full bg-surface border border-border p-3 rounded-lg text-sm outline-none text-foreground" placeholder="Question..." />
                        <textarea value={item.answer} onChange={e => { const faq = [...newProp.faq]; faq[i] = { ...faq[i], answer: e.target.value }; setNewProp({ ...newProp, faq }); }} className="w-full bg-surface border border-border p-3 rounded-lg text-sm h-20 outline-none text-foreground" placeholder="Answer..." />
                      </div>
                    ))}
                    <button type="button" onClick={() => setNewProp({ ...newProp, faq: [...(newProp.faq || []), { question: '', answer: '' }] })} className="flex items-center gap-2 text-[#E65E19] text-xs font-bold uppercase tracking-widest hover:opacity-70 transition-opacity">
                      <Plus className="w-4 h-4" /> Add FAQ Item
                    </button>
                  </div>
                  {/* ── LINKS & MEDIA ── */}
                  <div className="col-span-2 border-b border-border pb-2 mt-4 mb-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#E65E19]">Links & Downloads</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-stone-400 block mb-2 tracking-widest">Brochure URL (PDF or link)</label>
                    <input value={newProp.brochureUrl} onChange={e => setNewProp({ ...newProp, brochureUrl: e.target.value })} className="w-full bg-background border border-border p-4 rounded-xl outline-none text-foreground" placeholder="https://..." />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-stone-400 block mb-2 tracking-widest">Location Map Image URL</label>
                    <input value={newProp.locationMapUrl} onChange={e => setNewProp({ ...newProp, locationMapUrl: e.target.value })} className="w-full bg-background border border-border p-4 rounded-xl outline-none text-foreground" placeholder="https://... or upload below" />
                  </div>
                  {/* ── GALLERY IMAGES ── */}
                  <div className="col-span-2 border-b border-border pb-2 mt-4 mb-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#E65E19]">Property Gallery Images</p>
                  </div>
                  <div className="col-span-2 space-y-4">
                    <FileUploader token={token} onUpload={(urls) => setNewProp({ ...newProp, images: [...(newProp.images || []), ...urls] })} />
                    {newProp.images.length > 0 && (
                      <div className="grid grid-cols-4 gap-4 mt-4">
                        {newProp.images.map((img: string, i: number) => (
                          <div key={i} className="relative aspect-square rounded-xl overflow-hidden group border border-border">
                            <img src={getImageUrl(img)} className="w-full h-full object-cover" alt="Preview" />
                            <button type="button" onClick={() => setNewProp({ ...newProp, images: newProp.images.filter((_: any, idx: number) => idx !== i) })} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button type="submit" className="col-span-2 bg-[#E65E19] text-white py-5 rounded-xl font-bold shadow-xl hover:bg-opacity-90 transition-all uppercase tracking-widest text-xs mt-4">
                    {isEditing ? 'Save Changes' : 'Publish Listing'}
                  </button>
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
            "Our strength lies in combining construction expertise with real estate insight, enabling us to identify opportunities and execute projects efficiently."
          </motion.p>
        </div>
      </section>
      {/* Services Intermersive List */}
      <section className="py-32 container mx-auto px-6 space-y-32 md:space-y-64">
        {[
          {
            title: "Government Contracts",
            img: "/assets/service_government.png",
            desc: "Participation in infrastructure and public works through government tenders.",
            features: ["Infrastructure Development", "Public Works", "Tender Execution"]
          },
          {
            title: "Real Estate Investments",
            img: "/assets/service_investment.png",
            desc: "Strategic acquisition and development of land and property assets.",
            features: ["Strategic Acquisition", "Land Development", "Property Assets"]
          },
          {
            title: "Residential Leasing",
            img: "/assets/service_residential.png",
            desc: "Providing quality rental spaces for families and individuals.",
            features: ["Quality Spaces", "Family Rentals", "Individual Housing"]
          },
          {
            title: "Commercial Leasing",
            img: "/assets/service_commercial.png",
            desc: "Offering spaces suited for offices, retail businesses and emerging enterprises.",
            features: ["Office Spaces", "Retail Businesses", "Emerging Enterprises"]
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
            <h2 className="text-4xl font-serif font-bold uppercase tracking-tight">Active Property <br /> Portfolio</h2>
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
                  <img src={getImageUrl(prop.images?.[0])} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={prop.title} />
                  <div className="absolute top-4 right-4 bg-[#E65E19] text-white px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest">{prop.type}</div>
                </div>
                <div className="p-8 space-y-4">
                  <h3 className="text-lg font-bold uppercase tracking-tight truncate">{prop.title}</h3>
                  <p className="text-stone-500 text-sm flex items-center gap-2 italic"><MapPin className="w-3 h-3 text-[#E65E19]" /> {prop.location}</p>
                  <p className="text-stone-400 text-xs line-clamp-2 leading-relaxed">{prop.description}</p>
                  <div className="flex justify-between items-center pt-4 border-t border-border">
                    <span className="font-serif font-bold text-[#E65E19] text-lg">Price on Request</span>
                    <Link to="/contact" className="text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-[#E65E19] transition-colors flex items-center gap-2">Details <ArrowRight className="w-3 h-3" /></Link>
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
      const coords: [number, number] = [28.673510, 77.443491];
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
        setStatus('Thank you! Your inquiry has been sent successfully.');
        setFormData({ firstName: '', lastName: '', email: '', phone: '', interest: 'Buying Property', message: '' });
      } else {
        setStatus('Failed to send inquiry. Please try again.');
      }
    } catch (err) {
      setStatus('Server connection failed.');
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
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-surface rounded-xl flex items-center justify-center shrink-0 border border-border">
                <MapPin className="w-5 h-5 text-[#E65E19]" />
              </div>
              <div>
                <h4 className="font-bold text-sm mb-1 uppercase tracking-widest">Registered Office</h4>
                <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">B-29, 4th floor, RDC,<br />Rajnagar, Ghaziabad Pincode-201002</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-surface rounded-xl flex items-center justify-center shrink-0 border border-border">
                <Phone className="w-5 h-5 text-[#E65E19]" />
              </div>
              <div>
                <h4 className="font-bold text-sm mb-1 uppercase tracking-widest">Phone</h4>
                <p className="text-stone-500 dark:text-stone-400 text-sm">9560752744 , 7011792465</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-surface rounded-xl flex items-center justify-center shrink-0 border border-border">
                <Mail className="w-5 h-5 text-[#E65E19]" />
              </div>
              <div>
                <h4 className="font-bold text-sm mb-1 uppercase tracking-widest">Email</h4>
                <p className="text-stone-500 dark:text-stone-400 text-sm">daarealty@outlook.com</p>
              </div>
            </div>
            <div className="pt-8 border-t border-border">
              <h4 className="font-bold text-sm mb-4 uppercase tracking-widest text-[#E65E19]">Business Inquiries</h4>
              <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed italic">
                For partnerships, leasing opportunities, or project discussions, please contact us and our team will respond promptly.
              </p>
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
                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
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
                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
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
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
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
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-surface border border-border p-4 rounded-xl outline-none focus:ring-2 focus:ring-[#E65E19]/10 transition-all text-sm text-foreground"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">I am Interested In</label>
                <select
                  value={formData.interest}
                  onChange={e => setFormData({ ...formData, interest: e.target.value })}
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
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
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

const AMENITY_ICONS: Record<string, string> = { 'bank': '🏦', 'atm': '🏦', 'cctv': '📹', 'security': '🔒', 'club': '🏛️', 'earthquake': '🏗️', 'garden': '🌸', 'flower': '🌸', 'wifi': '📶', 'internet': '📶', 'jogging': '🏃', 'strolling': '🏃', 'kids': '🎠', 'play': '🎠', 'parking': '🅿️', 'power': '⚡', 'backup': '⚡', 'rain': '💧', 'water': '💧', 'swimming': '🏊', 'pool': '🏊', 'gym': '💪', 'lift': '🛗', 'elevator': '🛗', 'fire': '🧯', 'temple': '🛕', 'hospital': '🏥', 'school': '🏫', 'shopping': '🛒', 'library': '📚', 'solar': '☀️', 'green': '🌿', 'intercom': '📞', };
const getAmenityIcon = (name: string) => {
  const lower = name.toLowerCase();
  for (const key in AMENITY_ICONS) {
    if (lower.includes(key)) return AMENITY_ICONS[key];
  }
  return '✅';
};
const ProjectDetailsPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('description');
  const [galleryOpen, setGalleryOpen] = useState<number | null>(null);
  const [leadForm, setLeadForm] = useState({ name: '', phone: '', email: '' });
  const [leadSent, setLeadSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  useEffect(() => {
    fetch(getApiUrl('/api/listings')).then(res => res.json()).then(data => {
      if (Array.isArray(data)) {
        const found = data.find((l: any) => l._id === id);
        setProject(found);
      }
    }).catch(err => console.error("Failed to fetch project details:", err));
  }, [id]);
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(getApiUrl('/api/contact'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName: leadForm.name.split(' ')[0] || leadForm.name, lastName: leadForm.name.split(' ').slice(1).join(' ') || '-', email: leadForm.email || 'not-provided@daarealty.in', phone: leadForm.phone, interest: project?.title || 'Property Inquiry', message: `Interested in: ${project?.title} - ${project?.location}` })
    });
    setLeadSent(true);
  };
  if (!project) return (<div className="min-h-screen flex items-center justify-center pt-20"> <div className="w-10 h-10 border-4 border-[#E65E19] border-t-transparent rounded-full animate-spin"></div> </div>);
  const tabs = [
    { id: 'description', label: 'Description' },
    ...(project.amenities?.length ? [{ id: 'amenities', label: 'Amenities' }] : []),
    ...(project.floorPlans?.length ? [{ id: 'floorplans', label: 'Floor Plans' }] : []),
    ...((project.reraNo || project.reraProjectName) ? [{ id: 'rera', label: 'RERA Details' }] : []),
    ...(project.developerName || project.aboutDeveloper ? [{ id: 'builder', label: 'Builder' }] : []),
    ...(project.images?.length > 1 ? [{ id: 'gallery', label: 'Gallery' }] : []),
    ...((project.locationMapUrl || project.coordinates) ? [{ id: 'map', label: 'Location Map' }] : []),
    ...(project.faq?.length ? [{ id: 'faq', label: 'FAQ' }] : []),
    ...(project.brochureUrl ? [{ id: 'brochure', label: 'Download Brochure' }] : []),
  ];
  return (
    <div className="pt-20 bg-background min-h-screen text-foreground transition-colors duration-300">
      {/* Breadcrumb */}
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-stone-500">
          <Link to="/" className="hover:text-[#E65E19] transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/services" className="hover:text-[#E65E19] transition-colors">Property</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium truncate max-w-xs">{project.title}</span>
        </div>
      </div>
      {/* Title */}
      <div className="container mx-auto px-6 pb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">{project.title}</h1>
        <p className="flex items-center gap-1 text-stone-500 mt-1">
          <MapPin className="w-4 h-4 text-[#E65E19]" />{project.location}
          {project.coordinates && (
            <a href={`https://maps.google.com/?q=${project.coordinates.lat},${project.coordinates.lng}`} target="_blank" rel="noopener noreferrer" className="text-[#E65E19] text-sm ml-2 hover:underline">See Location</a>
          )}
        </p>
      </div>
      {/* Hero Image Grid */}
      <div className="container mx-auto px-6 mb-8">
        <div className="grid grid-cols-3 gap-2 rounded-2xl overflow-hidden h-[420px]">
          <div className="col-span-2 row-span-2 relative group cursor-pointer" onClick={() => setGalleryOpen(0)}>
            <img src={getImageUrl(project.images?.[0])} className="w-full h-full object-cover" alt={project.title} loading="lazy" />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-sm font-bold bg-black/50 px-4 py-2 rounded-full">View Gallery</span>
            </div>
          </div>
          {[1, 2, 3, 4].map((idx) => project.images?.[idx] ? (
            <div key={idx} className="relative group cursor-pointer overflow-hidden" onClick={() => setGalleryOpen(idx)}>
              <img src={getImageUrl(project.images[idx])} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt={`${project.title} ${idx}`} loading="lazy" />
            </div>
          ) : (
            <div key={idx} className="bg-stone-100 dark:bg-stone-800" />
          ))}
        </div>
      </div>
      {/* Main Layout: Content + Sticky Lead Form */}
      <div className="container mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* LEFT CONTENT */}
          <div className="lg:col-span-2 space-y-8">
            {/* Price + Quick Summary Card */}
            <div className="border border-border rounded-2xl overflow-hidden">
              <div className="p-6 flex flex-wrap gap-6 items-center justify-between border-b border-border">
                <div>
                  <p className="text-xs text-stone-400 uppercase tracking-widest mb-1">Price</p>
                  <p className="text-2xl font-bold text-[#E65E19]">{project.price}</p>
                </div>
                <div className="flex flex-wrap gap-6">
                  {project.topology && <div><p className="text-xs text-stone-400 tracking-widest uppercase mb-1">Topology</p><p className="font-bold text-sm">{project.topology}</p></div>}
                  {project.propertyStatus && <div><p className="text-xs text-stone-400 tracking-widest uppercase mb-1">Status</p><p className="font-bold text-sm">{project.propertyStatus}</p></div>}
                </div>
                <div className="flex gap-3">
                  {project.reraNo && <a href={`https://www.rera.up.nic.in`} target="_blank" rel="noopener noreferrer" className="border border-[#E65E19] text-[#E65E19] px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#E65E19] hover:text-white transition-all">RERA Updates →</a>}
                  <a href="tel:+919560752744" className="border border-stone-300 dark:border-stone-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-stone-100 dark:hover:bg-stone-800 transition-all flex items-center gap-2"><Phone className="w-3 h-3" /> Instant Call Back</a>
                </div>
              </div>
              <div className="p-6 bg-stone-50 dark:bg-stone-900/50">
                <h3 className="text-lg font-bold mb-4">Quick Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div><p className="text-stone-400 text-xs">Property Category</p><p className="font-semibold">Residential Properties</p></div>
                  <div><p className="text-stone-400 text-xs">Property Type</p><p className="font-semibold">{project.type === 'Flat' ? 'Apartments' : project.type}</p></div>
                  {project.possession && <div><p className="text-stone-400 text-xs">Possession</p><p className="font-semibold">{project.possession}</p></div>}
                  {project.superArea && <div><p className="text-stone-400 text-xs">Super Area</p><p className="font-semibold">{project.superArea}</p></div>}
                  {project.carpetArea && <div><p className="text-stone-400 text-xs">Carpet Area</p><p className="font-semibold">{project.carpetArea}</p></div>}
                  {project.beds > 0 && <div><p className="text-stone-400 text-xs">Bedrooms</p><p className="font-semibold">{project.beds} BHK</p></div>}
                  {project.sqft > 0 && <div><p className="text-stone-400 text-xs">Area</p><p className="font-semibold">{project.sqft} sqft</p></div>}
                </div>
              </div>
            </div>
            {/* Sticky Tab Bar */}
            <div className="sticky top-20 z-30 bg-background pt-2 pb-0 -mx-6 px-6 border-b border-border">
              <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-0">
                {tabs.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-shrink-0 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all border-b-2 ${activeTab === tab.id ? 'border-[#E65E19] text-[#E65E19]' : 'border-transparent text-stone-500 hover:text-foreground'}`}>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            {/* Tab Content */}
            <div className="min-h-[300px]">
              {/* DESCRIPTION */}
              {activeTab === 'description' && (
                <div className="space-y-6">
                  <div className="bg-surface border border-border rounded-2xl p-6">
                    <div className="bg-gradient-to-r from-[#1e3a5f] to-[#a02060] text-white px-5 py-3 rounded-xl mb-5 -mx-6 -mt-6 rounded-t-2xl rounded-b-none">
                      <h2 className="font-bold text-lg">About {project.title}</h2>
                    </div>
                    <h3 className="text-xl font-bold text-[#E65E19] mb-4 text-center">{project.title} – {project.topology} for Sale in {project.location}</h3>
                    <p className="text-stone-600 dark:text-stone-300 leading-relaxed whitespace-pre-line">{project.description}</p>
                  </div>
                </div>
              )}
              {/* AMENITIES */}
              {activeTab === 'amenities' && (
                <div className="bg-surface border border-border rounded-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-[#1e3a5f] to-[#a02060] text-white px-5 py-3">
                    <h2 className="font-bold text-lg">{project.title} Amenities</h2>
                  </div>
                  <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                    {(project.amenities || []).map((amenity: string, i: number) => (
                      <div key={i} className="flex flex-col items-center text-center gap-3 p-4 rounded-xl hover:bg-background transition-colors">
                        <span className="text-4xl">{getAmenityIcon(amenity)}</span>
                        <p className="text-xs font-semibold text-stone-600 dark:text-stone-300 leading-tight">{amenity}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* FLOOR PLANS */}
              {activeTab === 'floorplans' && (
                <div className="bg-surface border border-border rounded-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-[#1e3a5f] to-[#a02060] text-white px-5 py-3">
                    <h2 className="font-bold text-lg">{project.title} Floor Plans</h2>
                  </div>
                  <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {(project.floorPlans || []).map((img: string, i: number) => (
                      <div key={i} className="rounded-xl overflow-hidden border border-border cursor-pointer" onClick={() => setGalleryOpen(-(i + 1))}>
                        <img src={getImageUrl(img)} className="w-full object-contain max-h-80" alt={`Floor Plan ${i + 1}`} loading="lazy" />
                        <p className="text-center text-xs font-bold uppercase p-3 bg-stone-50 dark:bg-stone-900 text-stone-500">Floor Plan {i + 1}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* RERA DETAILS */}
              {activeTab === 'rera' && (
                <div className="bg-surface border border-border rounded-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-[#1e3a5f] to-[#a02060] text-white px-5 py-3">
                    <h2 className="font-bold text-lg">{project.title} RERA Details</h2>
                  </div>
                  <div className="p-8 flex flex-col sm:flex-row items-start gap-8">
                    <div className="space-y-4 flex-grow">
                      {project.reraProjectName && (
                        <div>
                          <p className="text-xs text-stone-400 uppercase tracking-widest font-bold">Project Name</p>
                          <p className="font-semibold text-foreground mt-1">{project.reraProjectName}</p>
                        </div>
                      )}
                      {project.reraNo && (
                        <div>
                          <p className="text-xs text-stone-400 uppercase tracking-widest font-bold">RERA No.</p>
                          <p className="font-mono font-bold text-foreground mt-1 text-lg">{project.reraNo}</p>
                        </div>
                      )}
                    </div>
                    {project.reraQrCode && (
                      <div className="flex-shrink-0">
                        <img src={getImageUrl(project.reraQrCode)} className="w-36 h-36 object-contain border border-border rounded-xl p-2" alt="RERA QR Code" />
                      </div>
                    )}
                  </div>
                </div>
              )}
              {/* BUILDER */}
              {activeTab === 'builder' && (
                <div className="space-y-6">
                  {project.developerName && (
                    <div className="bg-surface border border-border rounded-2xl overflow-hidden">
                      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#a02060] text-white px-5 py-3">
                        <h2 className="font-bold text-lg">About Developer</h2>
                      </div>
                      <div className="p-6">
                        {project.developerName && <h3 className="text-xl font-bold mb-4 text-foreground">{project.developerName}</h3>}
                        {project.aboutDeveloper && <p className="text-stone-600 dark:text-stone-300 leading-relaxed">{project.aboutDeveloper}</p>}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {/* GALLERY */}
              {activeTab === 'gallery' && (
                <div className="bg-surface border border-border rounded-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-[#1e3a5f] to-[#a02060] text-white px-5 py-3">
                    <h2 className="font-bold text-lg">Gallery</h2>
                  </div>
                  <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {(project.images || []).map((img: string, i: number) => (
                      <div key={i} className="aspect-video rounded-xl overflow-hidden cursor-pointer group relative" onClick={() => setGalleryOpen(i)}>
                        <img src={getImageUrl(img)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={`Gallery ${i + 1}`} loading="lazy" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* LOCATION MAP */}
              {activeTab === 'map' && (
                <div className="bg-surface border border-border rounded-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-[#1e3a5f] to-[#a02060] text-white px-5 py-3">
                    <h2 className="font-bold text-lg">Location Map</h2>
                  </div>
                  <div className="p-6">
                    {project.locationMapUrl ? (
                      <img src={getImageUrl(project.locationMapUrl)} className="w-full rounded-xl border border-border" alt="Location Map" loading="lazy" />
                    ) : (
                      <iframe src={`https://maps.google.com/maps?q=${project.coordinates?.lat},${project.coordinates?.lng}&z=15&output=embed`} className="w-full h-80 rounded-xl border border-border" loading="lazy" title="Location Map" />
                    )}
                    <p className="text-stone-500 text-sm mt-3 flex items-center gap-2"><MapPin className="w-4 h-4 text-[#E65E19]" />{project.location}</p>
                  </div>
                </div>
              )}
              {/* FAQ */}
              {activeTab === 'faq' && (
                <div className="bg-surface border border-border rounded-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-[#1e3a5f] to-[#a02060] text-white px-5 py-3">
                    <h2 className="font-bold text-lg">Frequently Asked Questions</h2>
                  </div>
                  <div className="p-6 divide-y divide-border">
                    {(project.faq || []).map((item: any, i: number) => (
                      <div key={i} className="py-4">
                        <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex justify-between items-center text-left gap-4">
                          <p className="font-bold text-foreground">{item.question}</p>
                          <ChevronRight className={`w-5 h-5 flex-shrink-0 text-[#E65E19] transition-transform ${openFaq === i ? 'rotate-90' : ''}`} />
                        </button>
                        {openFaq === i && <p className="text-stone-500 text-sm leading-relaxed mt-3">{item.answer}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* BROCHURE */}
              {activeTab === 'brochure' && (
                <div className="bg-surface border border-border rounded-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-[#1e3a5f] to-[#a02060] text-white px-5 py-3">
                    <h2 className="font-bold text-lg">Download Brochure</h2>
                  </div>
                  <div className="p-10 text-center space-y-6">
                    <div className="text-6xl">📄</div>
                    <p className="text-stone-500">Download the official brochure for {project.title} with complete details, floor plans and specifications.</p>
                    <a href={project.brochureUrl} target="_blank" rel="noopener noreferrer" className="inline-block bg-[#E65E19] text-white px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-sm shadow-lg hover:bg-stone-800 transition-all"> Download Now </a>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* RIGHT: STICKY LEAD FORM */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-surface border border-border rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-foreground mb-6">Interested To Buy Property</h3>
              {leadSent ? (
                <div className="text-center py-8 space-y-3">
                  <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
                  <p className="font-bold text-foreground">Thank you!</p>
                  <p className="text-stone-500 text-sm">Our team will contact you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="space-y-4">
                  <input value={leadForm.name} onChange={e => setLeadForm({ ...leadForm, name: e.target.value })} className="w-full bg-background border border-border p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#E65E19]/20 text-foreground" placeholder="Name" required />
                  <div className="flex gap-2">
                    <span className="bg-background border border-border p-3 rounded-xl text-sm text-stone-400 font-bold">IN</span>
                    <input value={leadForm.phone} onChange={e => setLeadForm({ ...leadForm, phone: e.target.value })} className="flex-1 bg-background border border-border p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#E65E19]/20 text-foreground" placeholder="Phone Number*" required />
                  </div>
                  <input value={leadForm.email} onChange={e => setLeadForm({ ...leadForm, email: e.target.value })} type="email" className="w-full bg-background border border-border p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#E65E19]/20 text-foreground" placeholder="Email (optional)" />
                  <button type="submit" className="w-full bg-[#E65E19] text-white py-4 rounded-xl font-bold text-sm uppercase tracking-widest shadow-lg hover:bg-stone-800 transition-all active:scale-95"> Send Inquiry </button>
                  <p className="text-[10px] text-stone-400 text-center">By submitting you agree to our terms of use</p>
                </form>
              )}
              <div className="mt-6 pt-6 border-t border-border space-y-3">
                <a href="tel:+919560752744" className="flex items-center gap-3 text-sm font-bold hover:text-[#E65E19] transition-colors">
                  <Phone className="w-4 h-4 text-[#E65E19]" /> 9560752744
                </a>
                <a href="mailto:daarealty@outlook.com" className="flex items-center gap-3 text-sm font-bold hover:text-[#E65E19] transition-colors">
                  <Mail className="w-4 h-4 text-[#E65E19]" /> daarealty@outlook.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* LIGHTBOX GALLERY */}
      <AnimatePresence>
        {galleryOpen !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" onClick={() => setGalleryOpen(null)}>
            <button className="absolute top-6 right-6 text-white hover:text-[#E65E19] transition-colors" onClick={() => setGalleryOpen(null)}><X className="w-8 h-8" /></button>
            <motion.img key={galleryOpen} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} src={getImageUrl(galleryOpen < 0 ? project.floorPlans?.[Math.abs(galleryOpen) - 1] : project.images?.[galleryOpen])} className="max-w-5xl max-h-[85vh] object-contain rounded-2xl" alt="Gallery" onClick={e => e.stopPropagation()} />
            {galleryOpen >= 0 && project.images?.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {project.images.map((_: any, i: number) => (
                  <button key={i} onClick={e => { e.stopPropagation(); setGalleryOpen(i); }} className={`w-2 h-2 rounded-full transition-all ${i === galleryOpen ? 'bg-[#E65E19] w-6' : 'bg-white/50'}`} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
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
              <Route path="/project/:id" element={<ProjectDetailsPage />} />
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