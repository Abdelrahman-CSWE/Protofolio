# Abdelrahman Okasha — Portfolio Website

A professional, animated, and 3D portfolio website for Mechanical & Mechatronics Design Engineer specializing in chassis design, FEA simulation, and high-performance prototyping.

## 🚀 Features

- **Modern Engineering Aesthetic**: Blueprint-inspired patterns, technical grids, and industrial design
- **Interactive 3D Elements**: Rotating gear animation using Three.js
- **Smooth Animations**: Scroll-based reveals, hover effects, and line-drawing animations
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Project Portfolio**: Modal-based project details with image galleries
- **Photo Chassis Library**: Lightbox gallery for chassis images
- **Contact Form**: Integrated mailto functionality
- **Performance Optimized**: Lazy loading, WebP support, and optimized assets

## 📁 File Structure

```
portfolio/
├── index.html          # Main website file (self-contained)
├── README.md          # This documentation
└── assets/            # (Optional) Folder for your images
    ├── projects/      # Project images
    ├── chassis/       # Chassis photo library
    └── hero/          # Hero section images
```

## 🎨 Customization Guide

### 1. Updating Personal Information

**Contact Information:**
- Line 298: Update email address in the contact section
- Line 299: Update LinkedIn profile URL
- Line 315: Update email in the contact form handler

**Personal Details:**
- Line 89: Update role/position tag
- Line 91-93: Update name and title
- Line 94: Update tagline
- Line 96-100: Update certifications and achievements

### 2. Adding Real Project Images

**Step 1: Prepare Your Images**
- Create an `assets/projects/` folder
- Optimize images: 2000px (desktop), 1200px (tablet), 800px (mobile)
- Convert to WebP format for better performance
- Name consistently: `project-name-hero.webp`, `project-name-1.webp`, etc.

**Step 2: Update Project Data (Line 380-420)**
```javascript
const projects = [
  {
    id: 'fs-uk',
    title: 'Formula Student UK — Electric Chassis',
    large: true,
    hero: 'assets/projects/fs-uk-hero.webp',
    images: [
      'assets/projects/fs-uk-cad.webp',
      'assets/projects/fs-uk-fea.webp',
      'assets/projects/fs-uk-assembly.webp',
      // Add more images...
    ],
    challenge: 'Your challenge description...',
    approach: 'Your approach description...',
    outcome: 'Your outcome description...',
    tools: ['solidworks', 'ansys', 'keyshot'],
    results: ['-15% mass', '+22% torsional stiffness', 'Ready for manufacturing']
  },
  // Add more projects...
];
```

### 3. Adding Chassis Photo Library

**Step 1: Prepare Chassis Images**
- Create an `assets/chassis/` folder
- Use consistent naming: `competition-name-description.webp`
- Optimize for web (800-1200px width recommended)

**Step 2: Update Chassis Data (Line 440-450)**
```javascript
const chassisPhotos = [
  {file: 'assets/chassis/fs-uk-chassis.webp', caption: 'Formula Student UK'},
  {file: 'assets/chassis/shell-eco-prototype.webp', caption: 'Shell Eco-Marathon'},
  // Add more chassis images...
];
```

### 4. Customizing the 3D Sketchfab Viewer

**Replace the Sketchfab Model (Line 180):**
1. Upload your 3D chassis model to Sketchfab
2. Get the embed code from your model page
3. Replace the model ID in the iframe src:
```html
<iframe src="https://sketchfab.com/models/YOUR-MODEL-ID/embed?ui_theme=light&camera=0">
```

### 5. Styling Customization

**Color Scheme (Line 12-22):**
```css
:root {
  --accent: #0ea5b9;        /* Primary cyan/steel-blue */
  --accent-2: #d97706;      /* Secondary copper/orange */
  --bg: #f5f7fa;           /* Background color */
  --panel: #ffffff;        /* Panel/card background */
  --ink: #0f172a;          /* Primary text color */
  --muted: #334155;        /* Secondary text color */
}
```

**Typography:**
- Primary font: Inter (technical, clean)
- Heading font: Orbitron (futuristic, engineering-style)
- Both fonts are loaded from Google Fonts

## 🌐 Deployment Options

### Option 1: GitHub Pages (Recommended)

1. **Create a GitHub Repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/portfolio.git
   git push -u origin main
   ```

2. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: main / (root)
   - Your site will be available at: `https://yourusername.github.io/portfolio`

### Option 2: Netlify

1. **Drag and Drop:**
   - Go to [netlify.com](https://netlify.com)
   - Drag your project folder to the deploy area
   - Get instant deployment with custom domain options

2. **Git Integration:**
   - Connect your GitHub repository
   - Automatic deployments on every commit

### Option 3: Vercel

1. **Import Project:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Automatic deployments and optimizations

## 🔧 Technical Features

### Performance Optimizations
- **Lazy Loading**: Images load only when needed
- **WebP Support**: Modern image format with fallbacks
- **Minified Assets**: Optimized CSS and JavaScript
- **CDN Resources**: Three.js loaded from reliable CDN

### Accessibility Features
- **Semantic HTML**: Proper heading structure and landmarks
- **ARIA Labels**: Screen reader friendly
- **Keyboard Navigation**: Full keyboard support
- **Alt Text**: Descriptive image alternatives

### Browser Support
- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile Browsers**: iOS Safari, Chrome Mobile, Samsung Internet
- **Fallbacks**: Graceful degradation for older browsers

## 📱 Responsive Breakpoints

- **Desktop**: 1200px+ (full layout)
- **Tablet**: 768px - 1199px (adapted grid)
- **Mobile**: < 768px (stacked layout)

## 🛡️ Security Features

- **Image Protection**: Right-click and drag disabled on images
- **Form Security**: Basic XSS protection in contact form
- **External Links**: `rel="noreferrer noopener"` for security

## 🎯 SEO Optimization

- **Meta Tags**: Proper title, description, and viewport
- **Structured Data**: Semantic HTML structure
- **Performance**: Fast loading times
- **Mobile-First**: Responsive design

## 📞 Support

For technical issues or customization help:
1. Check browser console for JavaScript errors
2. Validate HTML/CSS syntax
3. Test on multiple devices and browsers
4. Ensure all image paths are correct

## 🔄 Updates and Maintenance

**Regular Updates:**
- Update project portfolio as you complete new work
- Refresh chassis photo library
- Update certifications and achievements
- Keep contact information current

**Performance Monitoring:**
- Use Google PageSpeed Insights
- Monitor Core Web Vitals
- Optimize images as needed
- Update dependencies periodically

---

**© 2025 Abdelrahman Okasha** • High-res CAD/FEA files available on request under NDA