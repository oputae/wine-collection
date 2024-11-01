'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Wine, Heart, GlassWater, Menu, X } from 'lucide-react';

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="h-screen flex flex-col relative overflow-hidden">
      {/* Navigation Bar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}>
        <div className="w-full px-8 lg:px-12">
          <div className="flex justify-between items-center h-16">
            {/* Left Nav Items */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/collection" className="text-white hover:text-[#722F37] font-semibold text-lg transition-colors duration-200 relative group">
                <span>Collection</span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#722F37] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
              </Link>
              <Link href="/world-map" className="text-white hover:text-[#722F37] font-semibold text-lg transition-colors duration-200 relative group">
                <span>World Map</span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#722F37] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
              </Link>
            </div>

            {/* Center Logo */}
            <div className="flex items-center">
              <Wine className="h-8 w-8 text-[#722F37]" />
              <span className="ml-2 text-xl font-semibold text-white">
                {process.env.NEXT_PUBLIC_SITE_NAME}
              </span>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 pt-16">
          <div className="p-4">
            <Link 
              href="/collection" 
              className="block py-2 text-white text-lg font-semibold hover:text-[#722F37] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Collection
            </Link>
            <Link 
              href="/world-map" 
              className="block py-2 text-white text-lg font-semibold hover:text-[#722F37] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              World Map
            </Link>
            <Link 
              href="/favorites" 
              className="block py-2 text-white text-lg font-semibold hover:text-[#722F37] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Favorites
            </Link>
            <Link 
              href="/bartender" 
              className="block py-2 text-white text-lg font-semibold hover:text-[#722F37] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Bartender
            </Link>
          </div>
        </div>
      )}

      {/* Full-screen background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/wine-background.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 z-10">
        <div className="text-center text-white max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to My Wine Journey
          </h1>
          <p className="text-xl md:text-2xl">
            Exploring the world through exceptional wines
          </p>
        </div>
      </div>

      {/* Bottom Navigation - Just Favorites and Bartender's Pick */}
      <div className="absolute bottom-12 w-full px-12 lg:px-16 flex justify-between items-center z-10">
        <Link 
          href="/favorites"
          className="flex items-center space-x-2 bg-[#722F37]/90 hover:bg-[#722F37] text-white px-6 py-3 rounded-lg transition-colors duration-200"
        >
          <Heart className="h-5 w-5" />
          <span className="font-semibold">Favorites</span>
        </Link>
        <Link 
          href="/bartender"
          className="flex items-center space-x-2 bg-[#722F37]/90 hover:bg-[#722F37] text-white px-6 py-3 rounded-lg transition-colors duration-200"
        >
          <GlassWater className="h-5 w-5" />
          <span className="font-semibold">Bartender's Pick</span>
        </Link>
      </div>
    </main>
  );
}