'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, ArrowRight, Building2, Users, Zap, Shield, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import ImageWithFallback from '@/components/ImageWithFallback';
import SignupModal from '@/components/SignupModal';

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('professional');
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfect for small construction teams',
      price: { monthly: 299, annual: 2990 },
      features: [
        'Up to 5 users',
        'Basic project management',
        'Material tracking',
        'Basic reporting',
        'Email support',
        'Mobile app access'
      ],
      popular: false,
      icon: Building2
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Ideal for growing construction companies',
      price: { monthly: 500, annual: 5000 },
      features: [
        'Up to 25 users',
        'Advanced project management',
        'Vehicle & equipment tracking',
        'Advanced analytics',
        'Vendor management',
        'Priority support',
        'API access',
        'Custom reports'
      ],
      popular: true,
      icon: Users
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For large construction enterprises',
      price: { monthly: 999, annual: 9990 },
      features: [
        'Unlimited users',
        'Full project lifecycle management',
        'Advanced fleet management',
        'Real-time analytics',
        'Multi-site management',
        '24/7 dedicated support',
        'Custom integrations',
        'White-label options',
        'Training sessions'
      ],
      popular: false,
      icon: Zap
    }
  ];

  const handleGetStarted = (planId: string) => {
    setSelectedPlan(planId);
    setIsSignupModalOpen(true);
  };

  const handleSignIn = () => {
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ImageWithFallback
                src="/logo.png"
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
              <Button variant="ghost" onClick={handleSignIn}>
                Sign In
              </Button>
              <Button 
                onClick={() => window.location.href = '/landing'}
                variant="outline"
                className="border-cyan-500 text-cyan-600 hover:bg-cyan-50"
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="py-20 text-center"
      >
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          >
            <Badge variant="secondary" className="mb-6 bg-cyan-100 text-cyan-700">
              🚀 Start Your Free Trial Today
            </Badge>
          </motion.div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Choose Your
            <span className="block bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
              Perfect Plan
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Transform your construction business with our comprehensive management platform. 
            Start with a 30-day free trial, no credit card required.
          </p>

          {/* Billing Toggle */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center space-x-4 mb-12"
          >
            <span className={`text-sm font-medium ${!isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isAnnual ? 'bg-cyan-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
              Annual
            </span>
            {isAnnual && (
              <Badge variant="default" className="bg-green-500 text-white">
                Save 17%
              </Badge>
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* Pricing Cards */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="pb-20"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              const price = isAnnual ? plan.price.annual : plan.price.monthly;
              const monthlyPrice = isAnnual ? Math.round(plan.price.annual / 12) : plan.price.monthly;
              
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="relative"
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <Badge className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-1">
                        <Star className="h-3 w-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <Card className={`h-full flex flex-col transition-all duration-300 ${
                    plan.popular 
                      ? 'border-2 border-cyan-500 shadow-xl' 
                      : 'border border-gray-200 hover:shadow-lg'
                  }`}>
                    <CardHeader className="text-center pb-4">
                      <div className="mx-auto mb-4 p-3 rounded-full bg-gradient-to-r from-cyan-100 to-blue-100 w-fit">
                        <Icon className="h-8 w-8 text-cyan-600" />
                      </div>
                      <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                      <CardDescription className="text-gray-600">
                        {plan.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="text-center pb-6">
                      <div className="mb-4">
                        <span className="text-4xl font-bold text-gray-900">₹{monthlyPrice}</span>
                        <span className="text-gray-600">/user/month</span>
                      </div>
                      {isAnnual && (
                        <p className="text-sm text-green-600 font-medium">
                          Billed annually (₹{price}/user/year)
                        </p>
                      )}
                      {!isAnnual && (
                        <p className="text-sm text-gray-500">
                          Billed monthly
                        </p>
                      )}
                    </CardContent>
                    
                    <CardContent className="pt-0 flex-1">
                      <ul className="space-y-3">
                        {plan.features.map((feature, featureIndex) => (
                          <motion.li 
                            key={featureIndex}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 + index * 0.1 + featureIndex * 0.05 }}
                            className="flex items-center text-sm"
                          >
                            <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                            <span className="text-gray-600">{feature}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </CardContent>
                    
                    <CardFooter className="pt-6 mt-auto">
                      <Button 
                        onClick={() => handleGetStarted(plan.id)}
                        className={`w-full ${
                          plan.popular 
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700' 
                            : 'bg-gray-900 hover:bg-gray-800'
                        }`}
                        size="lg"
                      >
                        Start Free Trial
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="py-20 bg-white/50"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Gavith Build?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built specifically for construction companies with features that matter
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "Enterprise Security",
                description: "Bank-level security with data encryption and regular backups"
              },
              {
                icon: Headphones,
                title: "24/7 Support",
                description: "Round-the-clock support from our construction experts"
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Optimized for speed with real-time updates and sync"
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description: "Seamless collaboration tools for your entire team"
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="text-center"
                >
                  <div className="mx-auto mb-4 p-4 rounded-full bg-gradient-to-r from-cyan-100 to-blue-100 w-fit">
                    <Icon className="h-8 w-8 text-cyan-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="py-20 text-center"
      >
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Construction Business?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of construction companies already using Gavith Build to streamline their operations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => handleGetStarted('professional')}
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-8 py-4 text-lg"
            >
              Start Your Free Trial
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button 
              onClick={handleSignIn}
              variant="outline"
              size="lg"
              className="border-2 border-cyan-500 text-cyan-600 hover:bg-cyan-50 px-8 py-4 text-lg"
            >
              Sign In to Existing Account
            </Button>
          </div>
          
          <p className="text-sm text-gray-500 mt-6">
            No credit card required • 30-day free trial • Cancel anytime
          </p>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Building2 className="h-8 w-8 text-cyan-400" />
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

      {/* Signup Modal */}
      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
        selectedPlan={(() => {
          const plan = plans.find(plan => plan.id === selectedPlan) || plans[1];
          return {
            id: plan.id,
            name: plan.name,
            price: plan.price.monthly, // Use monthly price as default
            features: plan.features
          };
        })()}
      />
    </div>
  );
}
