# AQUA CERAMICS LLP — Architectural Showcase & 3D Bathroom Studio

[![Node.js](https://img.shields.io/badge/Node.js-v20%2B%20%7C%20v24-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL%203D-black?logo=three.js&logoColor=white)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![SQLite](https://img.shields.io/badge/Database-SQLite%20(node%3Asqlite)-003B57?logo=sqlite&logoColor=white)](https://nodejs.org/api/sqlite.html)
[![Design](https://img.shields.io/badge/Style-Glassmorphism-3d84ae)](#)

> **"DESIGNED FOR COMFORT BUILT FOR LIFE"**  
> Premium Sanitaryware, Vitreous Architectural Ceramic Solutions & B2B Commercial Lead Generation Hub.

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Design System & Aesthetics: Glassmorphism](#-design-system--aesthetics-glassmorphism)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Key Features](#-key-features)
  - [Interactive 3D WebGL Bathroom Studio](#1-interactive-3d-webgl-bathroom-studio)
  - [Commercial Enquiry & Lead Generation Drawer](#2-commercial-enquiry--lead-generation-drawer)
  - [Architectural Catalogue & Specifications](#3-architectural-catalogue--specifications)
  - [Staff CRM & Leads Control Center](#4-staff-crm--leads-control-center)
- [How to Run It Yourself](#-how-to-run-it-yourself)
- [API Reference](#-api-reference)
- [Corporate Identity](#-corporate-identity)

---

## 🏛️ Overview

**Aqua Ceramics LLP** is an architectural digital showcase and lead generation platform built specifically for luxury sanitaryware distribution, architectural consultants, hotel builders, and commercial project inquiries.

The solution features:
- **Glassmorphism Aesthetic**: Multi-layered translucent frosted surfaces (`backdrop-filter: blur()`), glowing specular borders, ambient floating orbs, and official brand colors (`#3d84ae` Ceramic Ocean Blue and `#fef4e9` Porcelain Cream).
- **Official Brand Logo Integration**: High-resolution brand mark deployed across headers, footers, favicons, enquiry drawers, and admin portals.
- **Interactive Three.js 3D WebGL Bathroom Studio**: Real-time camera orbital controls, material finish variations (Alpine White, Matte Black, Gloss Ivory, Slate), and interactive fixture hot-spot inspection.
- **B2B Commercial Enquiry Engine**: Floating action drawer and direct enquiry triggers capturing leads into an SQLite CRM backend.
- **Staff CRM & Leads Control Center**: Secure staff dashboard (`/admin`) for inspecting incoming project quotations, dealership applications, and client specifications.

---

## 🎨 Design System & Aesthetics: Glassmorphism

The platform is designed with a modern **Glassmorphism** visual hierarchy:
- **Color Palette**:
  - Primary Brand Blue: `#3d84ae`
  - Deep Navy Accent: `#1b3d54` / `#265979`
  - Porcelain Cream Background: `#fef4e9`
- **Frosted Translucent Layers**: High-precision `backdrop-blur-2xl` with subtle white borders (`border-white/70` and `border-white/20`).
- **Ambient Lighting**: Floating blurred gradient glow orbs in the background that shimmer behind cards and navigation.

---

## 💻 Architecture & Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Build Tool**: [Vite 6](https://vitejs.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with modern typography (*Plus Jakarta Sans* & *Playfair Display*)
- **3D Graphics Engine**: [Three.js](https://threejs.org/) (WebGL PBR materials, orbit controls, procedural meshes, hotspot raycasting)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Context (`CartContext`, `AuthContext`, `WishlistContext`)

### Backend & Storage
- **Runtime**: [Node.js](https://nodejs.org/) (v20+ or v24)
- **Web Framework**: [Express.js](https://expressjs.com/)
- **Database**: Native Node.js SQLite (`node:sqlite` via `DatabaseSync` — zero external native C++ compile dependencies)
- **Security**: [Helmet](https://helmetjs.github.io/), [CORS](https://github.com/expressjs/cors), [Express Rate Limit](https://github.com/express-rate-limit/express-rate-limit)
- **Authentication**: JWT (JSON Web Tokens) with [bcryptjs](https://github.com/dcodeIO/bcrypt.js) password hashing

---

## 🌟 Key Features

### 1. Interactive 3D WebGL Bathroom Showroom (`/bathroom-3d`)
- Custom-built procedural 3D bathroom environment powered by **Three.js**.
- Real-time material finish switcher:
  - *Alpine White*
  - *Matte Black*
  - *Gloss Ivory*
- Raycasted 3D hotspots pointing to installed sanitary fixtures (Wall-Hung EWCs, Countertop Basins, Urinals, and Diverters) with live spec modals.

### 2. Architectural Catalogue & Specifications (`/products`)
- Search by SKU model codes, product name, or category (*Water Closets / EWC*, *Wash Basins*, *Other Sanitaryware*).
- Filter by price slider and in-stock toggle.
- Comprehensive technical matrix on product pages:
  - Dimensions ($L \times W \times H$)
  - Water absorption rates ($< 0.5\%$)
  - Static load capacity (up to 400kg)
  - Nano-Glaze anti-bacterial coating metrics
  - Direct spec-sheet download (`.txt`)
  - Instant B2B custom quote request trigger

### 3. E-Commerce & Cart Engine (`/cart`, `/checkout`)
- Client-side reactive basket with inventory ceiling guards.
- Transparent 18% GST calculation and freight allowance indicators.
- Coupon engine supporting promotional discounts:
  - `AQUA10` — 10% off consumer orders
  - `ARCHITECT5` — 5% trade discount
- Multiple payment modes:
  - *Razorpay Gateway (Sandbox Mock)*
  - *Direct Corporate Bank Transfer (NEFT / RTGS)*
  - *Cash / Pay on Unloading Verification*
- Atomic server-side validation: Prices and stock levels are re-checked against SQLite before committing transactions.

### 4. Real-Time 6-Stage Consignment Tracking (`/track-order`)
Enter any order reference (`AQUA-ORD-YYYYMMDD-XXXX`) to track its lifecycle across 6 milestones:
1. `Order Placed`
2. `Order Confirmed`
3. `Processing & Ceramic Quality Inspection`
4. `Dispatched from Depot`
5. `Out for Delivery`
6. `Delivered`

Includes docket numbers, carrier notes, and timestamped audit logs.

### 5. B2B Commercial Quotations (`/request-quote`)
- Institutional portal for developers, hotels, and infrastructure projects.
- Upload project scope requirements and sanitaryware counts.
- Generates a traceable quote reference (`AQUA-QT-YYYYMMDD-XXXX`).

### 6. Enterprise Admin Portal (`/admin`)
- **Dashboard**: Real-time KPIs (Gross Revenue, Consignment Volume, Active RFPs, SKUs in Stock, Open Leads).
- **Product Management (`/admin/products`)**: Create, update, toggle featured status, and archive SKUs.
- **Order Dispatcher (`/admin/orders`)**: Advance order fulfillment stages, assign courier dockets, and record remarks.
- **Quotation Console (`/admin/quotations`)**: Review incoming requests, assign negotiated contract pricing, and record trade notes.
- **Content & Corporate Editor (`/admin/content`)**: Manage company identity placeholders (GSTIN, headquarters, warranty terms).

---

## 📂 Project Directory Structure

```text
Aqua Ceramics/
├── backend/
│   ├── database/
│   │   ├── db.js             # SQLite DatabaseSync connection & schema creation
│   │   ├── seed.js           # Pre-seeded catalog, admin accounts, and sample orders
│   │   └── aqua.db           # SQLite database file (created on runtime)
│   ├── routes/
│   │   ├── admin.js          # Back-office statistics & operations
│   │   ├── auth.js           # Customer & Admin authentication / registration
│   │   ├── content.js        # Company profile & legal content
│   │   ├── enquiries.js      # General contact & dealer applications
│   │   ├── orders.js         # Order placement, atomic inventory commit & tracking
│   │   ├── partners.js       # Dealership inquiry handling
│   │   ├── payment.js        # Razorpay & bank transfer checkout verifications
│   │   ├── products.js       # Product catalog CRUD & filtering
│   │   ├── projects.js       # Architecture case studies
│   │   └── quotations.js     # B2B quotation submissions & reviews
│   └── server.js             # Express API server entrypoint & static serving
├── public/
│   ├── images/               # High-res ceramic product & architectural photography
│   └── favicon.ico
├── src/
│   ├── components/           # Navigation, Footer, 3D Canvas, Modals, QuickView
│   ├── context/              # CartContext, AuthContext, WishlistContext
│   ├── pages/                # Route views (Home, Products, Showroom, Cart, Admin, etc.)
│   ├── App.tsx               # Main application routing tree
│   ├── main.tsx              # React DOM root mounting
│   └── index.css             # Tailwind v4 configuration & theme tokens
├── dist/                     # Optimized production bundle (created via npm run build)
├── start-server.bat          # 1-click Windows automated startup launcher
├── start-server.ps1          # PowerShell automation script
├── test_e2e.ps1              # Automated end-to-end API test suite
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v20.0.0 or higher (v24 recommended with built-in `node:sqlite`)
- **npm**: v9.0.0 or higher

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/kugisaki-nobara/aqua-ceramics.git
   cd aqua-ceramics
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Configuration

Create a `.env` file in the root directory (or copy from `.env.example` if available):

```env
PORT=3000
JWT_SECRET=aqua_ceramics_jwt_secret_key_2026_secure
NODE_ENV=development
```

### Running the App

#### Option 1: Fast One-Click Launch (Windows)
Double-click `start-server.bat` or run:
```cmd
start-server.bat
```

#### Option 2: PowerShell Script
```powershell
.\start-server.ps1
```

#### Option 3: Manual Command Line
```bash
# 1. Build the frontend production bundle
npm run build

# 2. Start the unified Express server (serves both API & Frontend)
npm start
```

Access the application in your browser at:  
👉 **`http://localhost:3000`**

---

## 📡 API Reference

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/products` | Retrieve all products (supports category & search query) | No |
| `GET` | `/api/products/:id` | Get detailed product specifications | No |
| `POST` | `/api/auth/login` | User or Admin login | No |
| `POST` | `/api/auth/register` | Register new customer account | No |
| `POST` | `/api/orders` | Place an order with atomic stock decrement | Optional |
| `GET` | `/api/orders/track/:orderNumber` | Retrieve real-time consignment milestone progress | No |
| `POST` | `/api/quotations` | Submit B2B project quotation request | No |
| `POST` | `/api/enquiries` | Submit corporate contact inquiry | No |
| `POST` | `/api/partners` | Submit authorized dealer application | No |
| `GET` | `/api/admin/stats` | Retrieve executive KPI summary | Admin JWT |
| `PATCH` | `/api/admin/orders/:id/status`| Update consignment milestone & dispatch notes | Admin JWT |

---

## 🔑 Demo Credentials & Test Data

### Access Accounts

| Role | Username / Email | Password | Access Portal |
|---|---|---|---|
| **System Administrator** | `admin` | `AquaAdmin2026!` | [`/admin/login`](http://localhost:3000/admin/login) |
| **Sample Customer** | `customer@example.com` | `Customer123!` | [`/login`](http://localhost:3000/login) |

### Test Order Reference
- **Pre-seeded Tracking Number**: `AQUA-ORD-20261012-7019`  
  *(Use on [`/track-order`](http://localhost:3000/track-order) to test the live milestone visualizer)*

### Promotional Discount Codes
- `AQUA10`: 10% off retail orders
- `ARCHITECT5`: 5% trade discount on specifications

---

## 🧪 Testing & Quality Assurance

Run the automated PowerShell end-to-end test suite to verify all backend API endpoints and data flows:

```powershell
powershell -ExecutionPolicy Bypass -File .\test_e2e.ps1
```

The test validates:
- API server responsiveness
- Product catalog query integrity
- Consignment tracking lookup
- B2B quotation submission
- Dealership inquiry generation
- Admin authentication & JWT token issuance
- Admin metrics reporting

---

## 🏢 Corporate Identity

- **Company Name**: AQUA CERAMICS LLP
- **Tagline**: *DESIGNED FOR COMFORT BUILT FOR LIFE*
- **Category**: Luxury Sanitaryware & Architectural Vitrified Ceramics
- **Contact Phone**: +91 7019254016
- **Contact Email**: business@aquaceramics.in