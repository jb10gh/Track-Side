---
@skills: content-creator, doc-coauthoring, ui-ux-pro-max
context_priority: critical
document_type: brand-standards
execution_date: 2024-01-27
reviewers: [human, ai-assistant]
---

# 🎯 Track Side Brand Standards

## 🤖 AI Assistant Instructions
**Primary Skills:**
- @skills:content-creator for comprehensive brand documentation
- @skills:doc-coauthoring for structured brand standards
- @skills:ui-ux-pro-max for visual design guidelines

## 📋 **Brand Identity**

### **🏷️ Brand Name**
- **Primary**: Track Side
- **Tagline**: Professional Sports Analytics
- **Domain**: track-side.vercel.app

### **🎨 Visual Identity**
- **Primary Color**: Hot Pink (#FF1493)
- **Secondary Color**: Modern Pink (#FF007F)
- **Accent Color**: Neon Pink (#FF69B4)
- **Background**: Pure Black (#000000)
- **Text**: Pure White (#FFFFFF)

## 🎨 **Design System**

### **🌸 Color Palette**

#### **Primary Colors**
```css
--trackside-hot-pink: #FF1493;      /* Primary brand color */
--trackside-neon-pink: #FF69B4;     /* Accent color */
--trackside-deep-pink: #C71585;     /* Dark variant */
--trackside-electric-pink: #FF007F; /* Modern variant */
```

#### **Background Colors**
```css
--bg-primary: #000000;              /* Pure black */
--bg-secondary: #000000;           /* Pure black */
--bg-accent: #0a0a0a;               /* Dark black */
--bg-card: #000000;                 /* Pure black */
```

#### **Text Colors**
```css
--text-primary: #FFFFFF;            /* Pure white */
--text-secondary: #FF1493;          /* Hot pink */
--text-muted: #E0E0E0;              /* Light gray */
--text-dim: #B0B0B0;                /* Muted gray */
```

### **📐 Typography**

#### **Font Families**
- **Primary**: Space Grotesk (modern, clean)
- **Monospace**: JetBrains Mono (for timers and data)
- **Weights**: 300, 400, 500, 600, 700

#### **Font Sizes**
- **Headings**: 2xl, 3xl, 4xl
- **Body**: base, lg
- **Small**: sm, xs
- **Micro**: 10px, 8px

### **🎯 Component Standards**

#### **🔘 Buttons**
```css
/* Primary Button - Pink Gradient */
.btn-primary {
  background: linear-gradient(135deg, #FF1493, #FF007F);
  color: #FFFFFF;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 6px 30px rgba(255, 20, 147, 0.6);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #FF69B4, #FF1493);
  transform: scale(1.05);
  box-shadow: 0 0 40px rgba(255, 20, 147, 0.9);
}
```

#### **📱 Cards**
```css
/* Card - Black with Pink Border */
.card {
  background: #000000;
  border: 2px solid #FF1493;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 6px 30px rgba(255, 20, 147, 0.6);
}
```

#### **⏰ Timers**
```css
/* Timer - Pink Accent */
.timer {
  color: #FFFFFF;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
}

.timer-active {
  color: #FF1493;
  text-shadow: 0 0 20px rgba(255, 20, 147, 0.8);
}
```

#### **📊 Scores**
```css
/* Score Display - Pink Dominant */
.score {
  color: #FF1493;
  font-size: 4rem;
  font-weight: 900;
  font-family: 'JetBrains Mono', monospace;
  text-shadow: 0 0 30px rgba(255, 20, 147, 0.8);
}
```

## 🎭 **Interaction Standards**

### **👆 Hover Effects**
- **Buttons**: Pink glow effect with scale transform
- **Cards**: Pink border glow
- **Text**: Pink color shift
- **Icons**: Pink color change

### **🎯 Active States**
- **Buttons**: Scale transform (0.95)
- **Navigation**: Pink background
- **Timers**: Pink text glow
- **Scores**: Enhanced pink glow

### **🔄 Transitions**
- **Duration**: 0.3s ease
- **Easing**: cubic-bezier(0.4, 0, 0.2, 1)
- **Transform**: Scale and glow effects
- **Color**: Smooth color transitions

## 📱 **Layout Standards**

### **🏗️ Grid System**
- **Container**: Max-width 1200px
- **Columns**: 12-column grid
- **Gutters**: 16px, 24px, 32px
- **Spacing**: 8px, 16px, 24px, 32px, 48px

### **📐 Component Spacing**
- **Section Margin**: 48px
- **Component Margin**: 24px
- **Element Margin**: 16px
- **Text Margin**: 8px

### **📱 Responsive Design**
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+
- **Large**: 1440px+

## 🎨 **Visual Effects**

### **✨ Glow Effects**
```css
/* Hot Pink Glow */
.glow-hot-pink {
  box-shadow: 0 0 40px rgba(255, 20, 147, 0.9);
}

/* Neon Pink Glow */
.glow-neon-pink {
  box-shadow: 0 0 50px rgba(255, 105, 180, 0.8);
}
```

### **🌈 Gradients**
```css
/* Primary Gradient */
.gradient-primary {
  background: linear-gradient(135deg, #FF1493, #FF007F);
}

/* Hover Gradient */
.gradient-hover {
  background: linear-gradient(135deg, #FF69B4, #FF1493);
}
```

### **🎭 Animations**
```css
/* Pulse Animation */
@keyframes pulse-pink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* Glow Animation */
@keyframes glow-pink {
  0%, 100% { box-shadow: 0 0 20px rgba(255, 20, 147, 0.8); }
  50% { box-shadow: 0 0 40px rgba(255, 20, 147, 1); }
}
```

## 📱 **Component Library**

### **🎯 Header**
- **Background**: Pure black
- **Text**: White with pink accents
- **Logo**: Pink gradient
- **Navigation**: Pink hover effects

### **⏰ Timer Display**
- **Background**: Black with pink border
- **Text**: White monospace
- **Active State**: Pink glow
- **Button**: Pink gradient

### **📊 Score Board**
- **Background**: Black with pink border
- **Scores**: Pink with glow effect
- **Labels**: White text
- **Timer**: White monospace

### **🎮 Action Grid**
- **Buttons**: Pink gradient
- **Icons**: White
- **Hover**: Scale and glow
- **Active**: Pink glow

### **📝 Event Timeline**
- **Background**: Black
- **Events**: Pink borders
- **Text**: White with pink accents
- **Hover**: Pink glow

## 🎯 **Application Guidelines**

### **🏆 Match Screen Design**
- **Header**: Track Side branding with pink logo
- **Timer**: Pink accent with monospace font
- **Scores**: Large pink numbers with glow
- **Actions**: Pink gradient buttons
- **Events**: Pink borders and accents

### **📧 Email Templates**
- **Header**: Track Side branding
- **Colors**: Pink accents on black background
- **Typography**: Clean, modern fonts
- **Layout**: Minimal, data-focused

### **📊 Export Components**
- **Modal**: Black background with pink border
- **Buttons**: Pink gradient
- **Text**: White with pink accents
- **Icons**: Pink when active

## 🚀 **Implementation Checklist**

### **✅ Color Application**
- [ ] All backgrounds use pure black (#000000)
- [ ] Primary buttons use pink gradient
- [ ] Text uses white with pink accents
- [ ] Borders use pink color
- [ ] Glow effects use pink colors

### **✅ Typography**
- [ ] Headings use Space Grotesk
- [ ] Monospace uses JetBrains Mono
- [ ] Font weights follow hierarchy
- [ ] Text colors follow standards

### **✅ Component Consistency**
- [ ] Buttons use gradient and hover effects
- [ ] Cards use black background with pink borders
- [ ] Timers use monospace with pink accents
- [ ] Scores use pink with glow effects

### **✅ Interaction Design**
- [ ] Hover effects use pink glow
- [ ] Active states use scale transform
- [ ] Transitions are smooth (0.3s ease)
- [ ] Animations use pink colors

## 🎯 **Quality Standards**

### **🔍 Visual Consistency**
- **100%** color accuracy across components
- **100%** typography consistency
- **100%** interaction pattern consistency
- **95%** visual hierarchy adherence

### **🎨 Design Excellence**
- **100%** modern design principles
- **100%** accessibility compliance
- **95%** user preference satisfaction
- **90%** brand recognition

### **⚡ Performance**
- **100%** optimized CSS
- **95%** fast loading times
- **90%** smooth animations
- **85%** efficient rendering

---

## 🎯 **Brand Standards Summary**

**Track Side** represents professional sports analytics with a dominant black and pink theme. The brand emphasizes:

- **Visual Impact**: Strong pink contrast on pure black
- **Professional Polish**: Clean, modern design
- **User Experience**: Intuitive, responsive interactions
- **Brand Consistency**: Unified application across all components

The brand standards ensure every interaction reinforces the Track Side identity while maintaining excellent usability and performance.

---

*Brand standards maintained with @skills:content-creator, @skills:doc-coauthoring, and @skills:ui-ux-pro-max. Comprehensive brand guidelines for Track Side professional sports analytics platform.*
