# writtenexpressa3d

# Written Expressa — 3D Web Platform
**Your Creative & Academic Partner**

A modern, high-performance web experience featuring an interactive 3D canvas hero journey, comprehensive service catalog, client testimonial moderation, offline push notification service worker, and unified administrative control center.

---

## Key Features
- **Cinematic 3D Hero Experience**: 150-frame smooth physics canvas sequence with damping and device pixel ratio adaptation.
- **Admin Control Center (`/admin`)**:
  - Multi-role team authentication (**Super Admin**, **Admin**, **Moderator**)
  - Dynamic service catalog, pricing matrix, and portfolio management
  - Order & CRM pipeline tracking
  - Testimonials moderation and social proof display
  - Interactive 3D physics parameter configuration
  - System activity audit logs & real-time analytics
- **Offline Web Push Notifications**: Registered background Service Worker (`/sw.js`) supporting broadcast notifications even when users are not active on the website.
- **SEO & Answer Engine Optimization (AEO)**: Complete schema markup, `robots.txt`, `sitemap.xml`, and `llms.txt` for ChatGPT, Google, and Bing discoverability.
- **Mobile Responsive Design**: Optimized for smartphones, tablets, and desktops with touch targets and iOS auto-zoom prevention.

---

## Getting Started

### Prerequisites
- Node.js 18+ or 20+
- npm, pnpm, or yarn

### Installation
```bash
npm install
```

### Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm start
```

---

## Project Structure
- `src/app/` — Next.js App Router (Public routes & `/admin` control center)
- `src/components/` — UI components, 3D Hero canvas, and Admin shell
- `src/lib/` — Database helpers, offline notification engine, and WhatsApp message builder
- `data/` — Persisted JSON database tables (Orders, Services, Pricing, Team, Testimonials, Logs)
- `public/` — Static assets, 3D frame sequences, and Service Worker (`sw.js`)
