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
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      
      const heroHeight = heroRef.current.offsetHeight;
      const scrollY = window.scrollY;
      const progress = Math.min(scrollY / (heroHeight * 0.8), 1);
      
      setScrollProgress(progress);
      
      // Update current floor based on scroll position
      if (progress < 0.25) setCurrentFloor(1);
      else if (progress < 0.5) setCurrentFloor(2);
      else if (progress < 0.75) setCurrentFloor(3);
      else setCurrentFloor(4);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const heroTransform = {
    transform: `scale(${1 + scrollProgress * 1.5}) translateY(${-scrollProgress * 120}px)`,
    filter: `brightness(${1 - scrollProgress * 0.7}) blur(${scrollProgress * 4}px)`,
  };

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
              <span className="text-sm text-gray-600">Floor {currentFloor}/4</span>
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

      {/* Hero Section - Building Exterior */}
      <section 
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
        style={heroTransform}
      >
        <div className="absolute inset-0">
          <ImageWithFallback
            src="figma:asset/06a706809a776ef95a726ac4de261e17620abf0b.png"
            alt="Modern Glass Building Exterior"
            fill
            className="object-cover"
            fallback={<div className="w-full h-full bg-gradient-to-br from-blue-100 to-cyan-100" />}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
        </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-4">
              🏗️ Enterprise Construction Management
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Build Your
            <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Construction Empire
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
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
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

      {/* Floor 2: Pricing - Executive Lounge */}
      <section className="relative min-h-screen flex items-center py-32">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="figma:asset/06a706809a776ef95a726ac4de261e17620abf0b.png"
            alt="Executive Lounge"
            fill
            className="object-cover opacity-20"
            fallback={<div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50" />}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/40 to-white/60" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Floor 2: <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">Executive Lounge</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Choose the perfect plan for your construction empire
          </p>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl max-w-2xl mx-auto">
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Professional Plan</h3>
              <p className="text-gray-600">Perfect for growing construction companies</p>
            </div>
            
            <div className="mb-8">
              <div className="text-5xl font-bold text-gray-900 mb-2">
                ₹500<span className="text-xl text-gray-600">/user/month</span>
              </div>
              <div className="text-lg text-gray-600">
                + ₹25,000 one-time setup fee
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-left">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Core Features</h4>
                <ul className="space-y-2">
                  {['Project Management', 'Vehicle Tracking', 'Material Inventory', 'Expense Management', 'Vendor Relations', 'Basic Analytics'].map((feature) => (
                    <li key={feature} className="flex items-center text-gray-600">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Advanced Features</h4>
                <ul className="space-y-2">
                  {['Advanced Analytics', 'Custom Reports', 'API Access', 'Priority Support', 'Training Sessions', 'Data Migration'].map((feature) => (
                    <li key={feature} className="flex items-center text-gray-600">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <button
              onClick={onGetStarted}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg text-lg font-semibold hover:shadow-xl transition-all transform hover:scale-105"
            >
              Start 30-Day Free Trial
            </button>
            
            <p className="text-sm text-gray-500 mt-4">
              No credit card required • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Floor 3: Testimonials - Conference Center */}
      <section className="relative min-h-screen flex items-center py-32">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="figma:asset/06a706809a776ef95a726ac4de261e17620abf0b.png"
            alt="Conference Center"
            fill
            className="object-cover opacity-20"
            fallback={<div className="w-full h-full bg-gradient-to-br from-purple-50 to-blue-50" />}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/40 to-white/60" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Floor 3: <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">Conference Center</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from construction leaders who've transformed their businesses
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                content: "The material management system is exceptional. We never run out of critical supplies anymore, and our project timelines have improved significantly.",
                rating: 5
              },
              {
                name: "Amit Patel",
                role: "Site Engineer",
                company: "DEF Industries",
                content: "The vehicle tracking feature helps us optimize our fleet usage and reduce maintenance costs. Highly recommended for any construction company.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}, {testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Floor 4: Contact - Innovation Hub */}
      <section className="relative min-h-screen flex items-center py-32">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="figma:asset/06a706809a776ef95a726ac4de261e17620abf0b.png"
            alt="Innovation Hub"
            fill
            className="object-cover opacity-20"
            fallback={<div className="w-full h-full bg-gradient-to-br from-gray-50 to-blue-50" />}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/40 to-white/60" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Floor 4: <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">Innovation Hub</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Ready to transform your construction business? Let's connect.
          </p>
          
          {/* Business Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl max-w-2xl mx-auto mb-12">
            <div className="flex items-center justify-between">
              <div className="text-left">
                <div className="mb-4">
                  <ImageWithFallback
                    src="figma:asset/06a706809a776ef95a726ac4de261e17620abf0b.png"
                    alt="Gavith Build Logo"
                    width={60}
                    height={60}
                    className="object-contain"
                    fallback={<Building2 className="h-15 w-15 text-blue-600" />}
                  />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent mb-2">
                  Gavith Build
                </h3>
                <p className="text-gray-600 text-sm">Construction Management Excellence</p>
              </div>
              
              <div className="w-px h-20 bg-gray-300 mx-6"></div>
              
              <div className="text-left space-y-3">
                <div className="flex items-center text-gray-700">
                  <Mail className="h-4 w-4 mr-3 text-cyan-500" />
                  <span className="text-sm">contact@gavithbuild.com</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Phone className="h-4 w-4 mr-3 text-cyan-500" />
                  <span className="text-sm">+91 98765 43210</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <MapPin className="h-4 w-4 mr-3 text-cyan-500" />
                  <span className="text-sm">Bangalore, Karnataka</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Globe className="h-4 w-4 mr-3 text-cyan-500" />
                  <span className="text-sm">www.gavithbuild.com</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onGetStarted}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg text-lg font-semibold hover:shadow-xl transition-all transform hover:scale-105"
            >
              Start Free Trial
            </button>
            <button
              onClick={onLogin}
              className="px-8 py-4 border-2 border-cyan-500 text-cyan-600 rounded-lg text-lg font-semibold hover:bg-cyan-50 transition-all"
            >
              Schedule Demo
            </button>
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
