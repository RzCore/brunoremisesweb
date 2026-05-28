'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function AdminNavLink() {
  const { user } = useAuth();
  
  if (user?.role !== 'ADMIN') return null;
  
  return (
    <Link 
      href="/admin" 
      className="text-accent-gold hover:text-white font-bold uppercase tracking-wider text-sm transition-colors"
    >
      Admin
    </Link>
  );
}
