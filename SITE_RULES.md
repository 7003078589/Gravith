# Gravith Construction Management System - Site Rules

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Code Standards](#code-standards)
3. [UI/UX Design Guidelines](#uiux-design-guidelines)
4. [Responsive Design Rules](#responsive-design-rules)
5. [Component Architecture](#component-architecture)
6. [File Organization](#file-organization)
7. [Deployment Guidelines](#deployment-guidelines)
8. [Performance Standards](#performance-standards)
9. [Accessibility Requirements](#accessibility-requirements)
10. [Testing Standards](#testing-standards)

---

## 🏗️ Project Overview

**Project Name**: Gravith Construction Management System  
**Framework**: Next.js 14 with TypeScript  
**Styling**: Tailwind CSS  
**Deployment**: Static Export (GitHub Pages + Hostinger)  
**Target Devices**: Mobile, Tablet, Desktop  

---

## 💻 Code Standards

### **General Rules**
- ✅ **Always use TypeScript** - No JavaScript files allowed
- ✅ **Use functional components** with React hooks
- ✅ **Follow ESLint rules** - No warnings or errors allowed
- ✅ **Use meaningful variable names** - Avoid abbreviations
- ✅ **Add comments for complex logic** - Explain business rules
- ✅ **Use const/let** - Never use var
- ✅ **Import order**: React imports first, then third-party, then local

### **File Naming Conventions**
```
Components: PascalCase (e.g., SiteManagement.tsx)
Pages: lowercase (e.g., page.tsx)
Utilities: camelCase (e.g., formatCurrency.ts)
Constants: UPPER_SNAKE_CASE (e.g., API_ENDPOINTS.ts)
```

### **Code Structure**
```typescript
// 1. Imports
import React, { useState, useEffect } from 'react';
import { ComponentName } from 'lucide-react';

// 2. Types/Interfaces
interface ComponentProps {
  // Define props
}

// 3. Constants
const CONSTANT_VALUE = 'value';

// 4. Component
export default function ComponentName({ prop }: ComponentProps) {
  // 5. State declarations
  const [state, setState] = useState();
  
  // 6. Effects
  useEffect(() => {
    // Effect logic
  }, []);
  
  // 7. Event handlers
  const handleEvent = () => {
    // Handler logic
  };
  
  // 8. Render
  return (
    // JSX
  );
}
```

---

## 🎨 UI/UX Design Guidelines

### **Design System**
- **Primary Color**: Blue (#2563eb) - `bg-blue-600`
- **Secondary Color**: Gray (#6b7280) - `text-gray-600`
- **Success Color**: Green (#059669) - `bg-green-600`
- **Warning Color**: Orange (#ea580c) - `bg-orange-600`
- **Error Color**: Red (#dc2626) - `bg-red-600`
- **Background**: Light Gray (#f9fafb) - `bg-gray-50`

### **Typography Rules**
```css
/* Headings */
h1: text-2xl sm:text-3xl font-bold text-gray-900
h2: text-xl sm:text-2xl font-bold text-gray-900
h3: text-lg font-semibold text-gray-900
h4: text-base font-medium text-gray-900

/* Body Text */
Primary: text-sm sm:text-base text-gray-900
Secondary: text-sm text-gray-600
Caption: text-xs text-gray-500
```

### **Spacing Standards**
```css
/* Container Padding */
Mobile: p-4
Desktop: sm:p-6

/* Element Spacing */
Small: space-y-2 sm:space-y-4
Medium: space-y-4 sm:space-y-6
Large: space-y-6 sm:space-y-8

/* Grid Gaps */
Small: gap-2 sm:gap-4
Medium: gap-4 sm:gap-6
Large: gap-6 sm:gap-8
```

### **Component Styling Rules**
- **Cards**: `bg-white rounded-lg border border-gray-200 shadow-sm`
- **Buttons**: `px-4 py-2 rounded-lg font-medium transition-colors`
- **Inputs**: `w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500`
- **Modals**: `fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4`

---

## 📱 Responsive Design Rules

### **Breakpoint Strategy**
```css
/* Mobile First Approach */
Default: Mobile (< 640px)
sm: Small devices (≥ 640px)
md: Medium devices (≥ 768px)
lg: Large devices (≥ 1024px)
xl: Extra large (≥ 1280px)
```

### **Grid Layout Rules**
```css
/* Responsive Grids */
1 Column: grid-cols-1
2 Columns: grid-cols-1 sm:grid-cols-2
3 Columns: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
4 Columns: grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
6 Columns: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6
```

### **Mobile Navigation Rules**
- **Sidebar**: Overlay on mobile, collapsible on desktop
- **Header**: Hide non-essential elements on small screens
- **Tabs**: Horizontal scroll with `overflow-x-auto`
- **Tables**: Horizontal scroll with `min-w-[800px]`
- **Modals**: Full-screen on mobile, centered on desktop

### **Touch Target Requirements**
- **Minimum Size**: 44px × 44px
- **Spacing**: 8px minimum between touch targets
- **Button Padding**: `px-4 py-2` minimum

---

## 🧩 Component Architecture

### **Component Structure**
```typescript
// 1. Component Declaration
'use client'; // Only for client components

// 2. Imports
import { useState, useEffect } from 'react';
import { IconName } from 'lucide-react';

// 3. Types
interface ComponentProps {
  // Props definition
}

// 4. Component
export default function ComponentName({ prop }: ComponentProps) {
  // State management
  const [state, setState] = useState();
  
  // Event handlers
  const handleEvent = () => {
    // Handler logic
  };
  
  // Render
  return (
    <div className="responsive-classes">
      {/* Component content */}
    </div>
  );
}
```

### **State Management Rules**
- **Local State**: Use `useState` for component-specific state
- **Form State**: Create form objects with all fields
- **Modal State**: Boolean state for modal visibility
- **Tab State**: String state for active tab tracking

### **Event Handling**
```typescript
// Form Input Changes
const handleFormInputChange = (field: string, value: string) => {
  setFormData(prev => ({
    ...prev,
    [field]: value
  }));
};

// Modal Toggle
const toggleModal = () => {
  setShowModal(prev => !prev);
};

// Form Submission
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  // Submission logic
};
```

---

## 📁 File Organization

### **Directory Structure**
```
src/
├── app/                    # Next.js app router pages
│   ├── (auth)/            # Authentication pages
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # Basic UI components
│   ├── forms/            # Form components
│   └── layout/           # Layout components
├── lib/                  # Utility functions
├── types/                # TypeScript type definitions
└── hooks/                # Custom React hooks
```

### **Component Naming**
- **Pages**: Match route name (e.g., `SiteManagement.tsx`)
- **UI Components**: Descriptive name (e.g., `DataTable.tsx`)
- **Layout Components**: Layout purpose (e.g., `Header.tsx`, `Sidebar.tsx`)

---

## 🚀 Deployment Guidelines

### **Build Process**
1. **Development**: `npm run dev`
2. **Build**: `npm run build`
3. **Static Export**: Configured in `next.config.js`
4. **Deploy**: Push to `deploy` branch for Hostinger

### **Branch Strategy**
- **main**: Source code and development
- **deploy**: Built static files only
- **Feature branches**: For new features

### **Deployment Checklist**
- [ ] Build succeeds without errors
- [ ] All TypeScript types are correct
- [ ] No console errors or warnings
- [ ] Responsive design works on all devices
- [ ] All forms are functional
- [ ] Navigation works correctly

---

## ⚡ Performance Standards

### **Bundle Size Limits**
- **Page Size**: < 100KB gzipped
- **Total JS**: < 500KB gzipped
- **Images**: Optimized and compressed

### **Loading Performance**
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

### **Code Splitting**
- Use dynamic imports for large components
- Lazy load non-critical components
- Split vendor and app bundles

---

## ♿ Accessibility Requirements

### **WCAG 2.1 AA Compliance**
- **Color Contrast**: Minimum 4.5:1 ratio
- **Keyboard Navigation**: All interactive elements accessible
- **Screen Reader**: Proper ARIA labels and roles
- **Focus Management**: Visible focus indicators

### **Implementation Rules**
```typescript
// Proper ARIA labels
<button aria-label="Close modal">
  <X className="h-5 w-5" />
</button>

// Form labels
<label htmlFor="email" className="block text-sm font-medium">
  Email Address
</label>
<input id="email" type="email" />

// Semantic HTML
<main role="main">
  <section aria-labelledby="section-title">
    <h2 id="section-title">Section Title</h2>
  </section>
</main>
```

---

## 🧪 Testing Standards

### **Component Testing**
- **Unit Tests**: Test individual functions
- **Integration Tests**: Test component interactions
- **Visual Tests**: Test responsive layouts

### **Browser Testing**
- **Chrome**: Latest version
- **Firefox**: Latest version
- **Safari**: Latest version
- **Edge**: Latest version

### **Device Testing**
- **Mobile**: iPhone, Android (various sizes)
- **Tablet**: iPad, Android tablets
- **Desktop**: 1920x1080, 1366x768

---

## 🔧 Development Workflow

### **Before Starting Work**
1. Pull latest changes from `main`
2. Create feature branch: `git checkout -b feature/feature-name`
3. Review existing code patterns
4. Check component library for reusable elements

### **During Development**
1. Follow naming conventions
2. Write clean, readable code
3. Test on multiple devices
4. Ensure responsive design
5. Validate accessibility

### **Before Committing**
1. Run `npm run build` - must succeed
2. Test on mobile and desktop
3. Check for console errors
4. Validate form functionality
5. Test navigation flow

### **Commit Message Format**
```
type: brief description

Detailed description of changes:
- Specific change 1
- Specific change 2
- Bug fixes
- Performance improvements
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

---

## 📋 Code Review Checklist

### **Functionality**
- [ ] Component works as expected
- [ ] All forms submit correctly
- [ ] Navigation flows properly
- [ ] Modals open/close correctly
- [ ] Data displays accurately

### **Design**
- [ ] Matches design specifications
- [ ] Responsive on all devices
- [ ] Consistent with design system
- [ ] Proper spacing and typography
- [ ] Accessible color contrast

### **Code Quality**
- [ ] TypeScript types are correct
- [ ] No console errors or warnings
- [ ] Clean, readable code
- [ ] Proper error handling
- [ ] Performance optimized

### **Mobile Experience**
- [ ] Touch targets are adequate
- [ ] Horizontal scrolling works
- [ ] Forms are mobile-friendly
- [ ] Navigation is intuitive
- [ ] No content overflow

---

## 🚨 Common Mistakes to Avoid

### **Responsive Design**
- ❌ Don't use fixed widths
- ❌ Don't forget mobile breakpoints
- ❌ Don't use `px` for responsive spacing
- ✅ Use Tailwind responsive classes
- ✅ Test on actual devices

### **Component Structure**
- ❌ Don't mix server and client components
- ❌ Don't use inline styles
- ❌ Don't forget TypeScript types
- ✅ Use proper component structure
- ✅ Follow naming conventions

### **Performance**
- ❌ Don't load unnecessary libraries
- ❌ Don't use large images without optimization
- ❌ Don't forget to handle loading states
- ✅ Optimize bundle size
- ✅ Use proper image formats

---

## 📞 Support and Resources

### **Documentation**
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [React Documentation](https://react.dev)

### **Tools**
- **Development**: VS Code with TypeScript extension
- **Testing**: Browser DevTools
- **Performance**: Lighthouse
- **Accessibility**: axe DevTools

### **Contact**
- **Project Lead**: Aman Kumar
- **Repository**: https://github.com/7003078589/Gravith.git
- **Deployment**: GitHub Pages + Hostinger

---

**Last Updated**: December 2024  
**Version**: 1.0  
**Status**: Active Development
