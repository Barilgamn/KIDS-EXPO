import React, { useState, useEffect } from 'react';
import { 
  auth, 
  db, 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  deleteDoc, 
  doc,
  signInWithGoogle,
  signOut
} from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { 
  Users, 
  Search, 
  Download, 
  Trash2, 
  LogOut, 
  ArrowLeft,
  Calendar,
  Phone,
  Mail,
  User as UserIcon,
  MessageSquare,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Registration {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'visitor' | 'exhibitor';
  message: string;
  createdAt: any;
}

export default function AdminPanel({ onBack }: { onBack: () => void }) {
  const [user, setUser] = useState<User | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        fetchRegistrations();
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "registrations"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Registration[];
      setRegistrations(data);
    } catch (err) {
      console.error("Error fetching registrations:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Энэ бүртгэлийг устгахдаа итгэлтэй байна уу?')) {
      try {
        await deleteDoc(doc(db, "registrations", id));
        setRegistrations(prev => prev.filter(r => r.id !== id));
      } catch (err) {
        console.error("Error deleting:", err);
      }
    }
  };

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error("Login failed:", err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Type', 'Message', 'Date'];
    const rows = registrations.map(r => [
      r.name,
      r.email,
      r.phone,
      r.type,
      `"${r.message.replace(/"/g, '""')}"`,
      r.createdAt?.toDate?.()?.toLocaleString() || ''
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `kids_expo_registrations_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRegistrations = registrations.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.phone.includes(searchTerm)
  );

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Loader2 className="w-8 h-8 text-brand-pink animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl max-w-md w-full text-center border border-gray-100"
        >
          <div className="w-20 h-20 bg-brand-pink/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <ShieldCheck className="w-10 h-10 text-brand-pink" />
          </div>
          <h1 className="text-3xl font-black text-brand-dark mb-4">Admin Access</h1>
          <p className="text-gray-500 font-medium mb-10">Бүртгүүлсэн хэрэглэгчдийн мэдээллийг харахын тулд нэвтэрнэ үү.</p>
          
          <button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="w-full flex items-center justify-center gap-3 bg-brand-dark text-white py-4 rounded-2xl font-bold hover:bg-brand-dark/90 transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoggingIn ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
            )}
            Google-ээр нэвтрэх
          </button>
          
          <button 
            onClick={onBack}
            className="mt-6 text-gray-400 font-bold hover:text-brand-dark transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Буцах
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Top Header */}
      <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500"
              title="Back to site"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-black text-brand-dark flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-pink" />
                DASHBOARD
              </h1>
              <p className="text-xs font-bold text-gray-400">ADMIN PANEL V1.0</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-sm font-bold text-brand-dark">{user.displayName || 'Admin'}</span>
              <span className="text-[10px] text-gray-400 font-mono">{user.email}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2.5 bg-gray-100 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all text-gray-500"
              title="Гарах"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-5"
          >
            <div className="w-14 h-14 bg-brand-blue/10 rounded-2xl flex items-center justify-center">
              <Users className="w-7 h-7 text-brand-blue" />
            </div>
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Нийт бүртгэл</p>
              <h2 className="text-3xl font-black text-brand-dark">{registrations.length}</h2>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-5"
          >
            <div className="w-14 h-14 bg-brand-green/10 rounded-2xl flex items-center justify-center">
              <UserIcon className="w-7 h-7 text-brand-green" />
            </div>
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Үзэгчид</p>
              <h2 className="text-3xl font-black text-brand-dark">{registrations.filter(r => r.type === 'visitor').length}</h2>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-5"
          >
            <div className="w-14 h-14 bg-brand-pink/10 rounded-2xl flex items-center justify-center">
              <ArrowUp className="w-7 h-7 text-brand-pink" />
            </div>
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Оролцогчид</p>
              <h2 className="text-3xl font-black text-brand-dark">{registrations.filter(r => r.type === 'exhibitor').length}</h2>
            </div>
          </motion.div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 md:p-8 overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
              <input 
                type="text"
                placeholder="Нэр, имэйл, утсаар хайх..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:bg-white focus:border-brand-blue outline-none transition-all font-medium"
              />
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button 
                onClick={fetchRegistrations}
                className="p-4 bg-gray-50 text-gray-500 rounded-2xl hover:bg-gray-100 transition-all flex items-center justify-center"
                title="Сэргээх"
              >
                <Loader2 className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button 
                onClick={exportToCSV}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-brand-blue text-white rounded-2xl font-bold hover:shadow-lg hover:shadow-brand-blue/20 transition-all active:scale-95"
              >
                <Download className="w-5 h-5" />
                CSV Татах
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-5 px-4 text-xs font-black text-gray-400 uppercase tracking-wider">Мэдээлэл</th>
                  <th className="text-left py-5 px-4 text-xs font-black text-gray-400 uppercase tracking-wider hidden sm:table-cell">Холбоо барих</th>
                  <th className="text-left py-5 px-4 text-xs font-black text-gray-400 uppercase tracking-wider hidden md:table-cell">Төрөл</th>
                  <th className="text-left py-5 px-4 text-xs font-black text-gray-400 uppercase tracking-wider hidden lg:table-cell">Мессеж</th>
                  <th className="text-right py-5 px-4 text-xs font-black text-gray-400 uppercase tracking-wider">Үйлдэл</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredRegistrations.length > 0 ? (
                    filteredRegistrations.map((reg) => (
                      <motion.tr 
                        key={reg.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="group hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                      >
                        <td className="py-5 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-white ${reg.type === 'exhibitor' ? 'bg-brand-pink' : 'bg-brand-blue'}`}>
                              {reg.name.substring(0, 1).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-brand-dark leading-none mb-1">{reg.name}</p>
                              <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase">
                                <Calendar className="w-3 h-3" />
                                {reg.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'}
                              </div>
                            </div>
                          </div>
                          
                          {/* Mobile compact info */}
                          <div className="mt-2 sm:hidden space-y-1">
                             <div className="flex items-center gap-2 text-xs text-gray-500">
                               <Phone className="w-3 h-3" /> {reg.phone}
                             </div>
                             <div className="flex items-center gap-2 text-xs text-gray-500 overflow-hidden text-ellipsis">
                               <Mail className="w-3 h-3" /> {reg.email}
                             </div>
                          </div>
                        </td>
                        
                        <td className="py-5 px-4 hidden sm:table-cell">
                          <div className="space-y-1">
                            <a href={`tel:${reg.phone}`} className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-brand-blue transition-colors">
                              <Phone className="w-4 h-4 text-gray-300" />
                              {reg.phone}
                            </a>
                            <a href={`mailto:${reg.email}`} className="flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-brand-blue transition-colors">
                              <Mail className="w-4 h-4 text-gray-200" />
                              {reg.email}
                            </a>
                          </div>
                        </td>
                        
                        <td className="py-5 px-4 hidden md:table-cell">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            reg.type === 'exhibitor' 
                              ? 'bg-brand-pink/10 text-brand-pink border border-brand-pink/20' 
                              : 'bg-brand-blue/10 text-brand-blue border border-brand-blue/20'
                          }`}>
                            {reg.type === 'exhibitor' ? 'Оролцогч' : 'Үзэгч'}
                          </span>
                        </td>
                        
                        <td className="py-5 px-4 hidden lg:table-cell max-w-xs">
                          <div className="flex items-start gap-2 group">
                            <MessageSquare className="w-4 h-4 text-gray-200 mt-0.5 shrink-0" />
                            <p className="text-sm text-gray-500 font-medium line-clamp-2 italic truncate">
                              {reg.message || 'Хоосон'}
                            </p>
                          </div>
                        </td>
                        
                        <td className="py-5 px-4 text-right">
                          <button 
                            onClick={() => handleDelete(reg.id)}
                            className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            title="Устгах"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-20 text-center">
                        <div className="flex flex-col items-center">
                          <Users className="w-12 h-12 text-gray-200 mb-4" />
                          <p className="text-gray-400 font-bold">Бүртгэл олдсонгүй</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
