'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Check, Star, Phone, Mail, MapPin, Globe } from 'lucide-react';
import ImageWithFallback from './ImageWithFallback';
import { Building2 } from 'lucide-react';

interface SaaSHomepageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export default function SaaSHomepage({ onGetStarted, onLogin }: SaaSHomepageProps) {
  const [currentFloor, setCurrentFloor] = useState(1);
  const [scrollProgress, setScrollProgress] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      const progress = Math.min(scrollTop / 800, 1);
      
      setScrollProgress(progress);
      
      // Update current floor based on scroll position
      if (progress < 0.3) setCurrentFloor(1);
      else if (progress < 0.7) setCurrentFloor(2);
      else setCurrentFloor(3);
    };

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial call
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Hero transform is now applied directly to the image

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ImageWithFallback
                src="/Logo Horizontal.png"
                alt="Gavith Build Logo"
                width={40}
                height={40}
                className="object-contain"
                fallback={<Building2 className="h-10 w-10 text-blue-600" />}
              />
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                  Gavith Build
                </h1>
                <p className="text-xs text-gray-600">Construction Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Floor {currentFloor}/3</span>
              <span className="text-xs text-gray-500">Scroll: {Math.round(scrollProgress * 100)}%</span>
              <button
                onClick={onLogin}
                className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={onGetStarted}
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Simple Scroll Zoom Effect */}
      <section 
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background Image with Zoom Effect */}
        <div className="absolute inset-0">
          <div 
            className="w-full h-full"
            style={{
              transform: `scale(${1 + scrollProgress * 1.5})`,
              transformOrigin: 'center center',
              willChange: 'transform',
            }}
          >
            <ImageWithFallback
              src="/home.jpg"
              alt="Construction Site Home"
              fill
              className="object-cover"
              fallback={<div className="w-full h-full bg-gradient-to-br from-blue-100 to-cyan-100" />}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
        </div>
        

        {/* Text Content */}
        <div 
          className="relative z-10 text-center text-white max-w-4xl mx-auto px-6"
          style={{
            transform: `translateY(${scrollProgress * 50}px)`,
            opacity: 1 - scrollProgress * 0.8,
            willChange: 'transform, opacity',
          }}
        >
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-4">
              🏗️ Enterprise Construction Management
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            scale your operations
            <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              like never before.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Transform your construction business with our comprehensive management platform. 
            Track projects, manage resources, and scale your operations like never before.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onGetStarted}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg text-lg font-semibold hover:shadow-xl transition-all transform hover:scale-105"
            >
              Start Free Trial
            </button>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-center animate-bounce">
          <p className="text-sm mb-2 font-semibold">Scroll down to see zoom effect!</p>
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center mx-auto">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>


      {/* Floor 1: Features - Grand Glass Atrium */}
      <section className="relative min-h-screen flex items-center py-32">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="figma:asset/06a706809a776ef95a726ac4de261e17620abf0b.png"
            alt="Grand Glass Atrium"
            fill
            className="object-cover opacity-20"
            fallback={<div className="w-full h-full bg-gradient-to-br from-cyan-50 to-blue-50" />}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/40 to-white/60" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Floor 1: <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">Reception & Features</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the powerful tools that will revolutionize your construction management
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🏗️",
                title: "Project Management",
                description: "Complete project lifecycle management with real-time tracking and milestone monitoring."
              },
              {
                icon: "🚛",
                title: "Vehicle & Equipment",
                description: "Track fleet operations, maintenance schedules, and equipment utilization across all sites."
              },
              {
                icon: "📦",
                title: "Material Management",
                description: "Smart inventory tracking with automated alerts and supplier management."
              },
              {
                icon: "💰",
                title: "Expense Tracking",
                description: "Comprehensive financial management with budget control and cost analysis."
              },
              {
                icon: "👥",
                title: "Vendor Relations",
                description: "Centralized vendor management with performance tracking and payment processing."
              },
              {
                icon: "📊",
                title: "Analytics & Reports",
                description: "Advanced reporting and analytics for data-driven decision making."
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Floor 2: Testimonials & Contact - Combined Section */}
      <section className="relative py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Floor 2: <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">What Our Clients Say</span>
            </h2>
            <p className="text-lg text-gray-600">
              Trusted by construction leaders across India
            </p>
          </div>
          
          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              {
                name: "Rajesh Kumar",
                role: "CEO",
                company: "ABC Construction",
                content: "Gavith Build has revolutionized how we manage our projects. The real-time tracking and automated alerts have saved us countless hours.",
                rating: 5
              },
              {
                name: "Priya Sharma",
                role: "Operations Director",
                company: "XYZ Builders",
                content: "The material management system is exceptional. We never run out of critical supplies anymore.",
                rating: 5
              },
              {
                name: "Amit Patel",
                role: "Site Engineer",
                company: "DEF Industries",
                content: "The vehicle tracking feature helps us optimize our fleet usage and reduce maintenance costs.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all"
              >
                <div className="flex items-center mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm mb-4">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{testimonial.name}</div>
                  <div className="text-xs text-gray-600">{testimonial.role}, {testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Contact Section */}
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to Get Started?</h3>
              <p className="text-gray-600">Transform your construction business today</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Contact Info */}
              <div className="space-y-4">
                <div className="flex items-center text-gray-700">
                  <Mail className="h-5 w-5 mr-3 text-cyan-500" />
                  <span>contact@gavithbuild.com</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Phone className="h-5 w-5 mr-3 text-cyan-500" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <MapPin className="h-5 w-5 mr-3 text-cyan-500" />
                  <span>Bangalore, Karnataka</span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col gap-4">
                <button
                  onClick={onGetStarted}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Start Free Trial
                </button>
                <button
                  onClick={onLogin}
                  className="px-6 py-3 border-2 border-cyan-500 text-cyan-600 rounded-lg font-semibold hover:bg-cyan-50 transition-all"
                >
                  Schedule Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <ImageWithFallback
              src="figma:asset/06a706809a776ef95a726ac4de261e17620abf0b.png"
              alt="Gavith Build Logo"
              width={32}
              height={32}
              className="object-contain"
              fallback={<Building2 className="h-8 w-8 text-cyan-400" />}
            />
            <span className="text-xl font-bold">Gavith Build</span>
          </div>
          <p className="text-gray-400 mb-4">
            Transforming construction management with innovative technology
          </p>
          <p className="text-sm text-gray-500">
            © 2024 Gavith Build. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
