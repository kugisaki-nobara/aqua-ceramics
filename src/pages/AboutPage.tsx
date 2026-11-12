import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Layers, 
  Sparkles, 
  Droplets, 
  Flame, 
  Sun, 
  PackageCheck, 
  Truck, 
  CheckCircle2, 
  ShieldCheck, 
  TrendingUp, 
  Phone, 
  Mail, 
  ArrowRight,
  Boxes,
  Compass,
  Users,
  Target,
  GraduationCap,
  Award
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const productDivisions = [
    { title: "Quartz Surfaces", desc: "Engineered quartz countertops, slabs, and architectural surface solutions.", icon: Layers },
    { title: "CP Fittings", desc: "High-grade faucets, taps, mixers, and coordinated bathroom hardware.", icon: Sparkles },
    { title: "Sanitaryware", desc: "Water closets, washbasins, cisterns, and coordinated ceramic fixtures.", icon: Droplets },
    { title: "Adhesives & Grouts", desc: "Tile fixing adhesives, epoxy grouts, and technical chemical solutions.", icon: Boxes },
    { title: "Heat Pumps", desc: "Energy-efficient centralized and domestic hot water heating systems.", icon: Flame },
    { title: "Water Softeners", desc: "Advanced water conditioning and residential/commercial softeners.", icon: Droplets },
    { title: "Solar Solutions", desc: "Sustainable solar thermal and rooftop clean energy solutions.", icon: Sun }
  ];

  const supplySteps = [
    { step: "01", title: "Product Sourcing", desc: "Direct partnerships with verified domestic & international manufacturers." },
    { step: "02", title: "Warehouse Verification", desc: "Thorough quality checks upon receiving and stringent condition inspection." },
    { step: "03", title: "Inventory Management", desc: "Structured stock management ensuring high availability for urgent site demands." },
    { step: "04", title: "Order Processing", desc: "Accurate item-by-item verification matching contractor and project specs." },
    { step: "05", title: "Packing & Dispatch", desc: "Protective transit-safe palleting and secure dispatch coordination." },
    { step: "06", title: "Delivery & Support", desc: "Timely site delivery, transparent billing, and proactive after-sales assistance." }
  ];

  const valuesList = [
    {
      title: "Integrity in Every Business Transaction",
      desc: "Transparent dealings, reliable pricing, and ethical business conduct across every trade relationship.",
      icon: ShieldCheck
    },
    {
      title: "Commitment to Customer Satisfaction",
      desc: "Prioritizing client schedules, specification accuracy, and responsive order fulfilment.",
      icon: Target
    },
    {
      title: "Respect for People and Teamwork",
      desc: "Fostering mutual respect, clear communication, and collaborative teamwork across our network.",
      icon: Users
    },
    {
      title: "Accountability for Responsibilities",
      desc: "Taking ownership of orders, warehouse accuracy, delivery commitments, and customer care.",
      icon: CheckCircle2
    },
    {
      title: "Continuous Learning and Improvement",
      desc: "Constantly enhancing our knowledge of modern building materials and distribution techniques.",
      icon: GraduationCap
    },
    {
      title: "Operational Excellence Through Processes",
      desc: "Well-defined logistics, inventory tracking, and standardized dispatch workflows.",
      icon: PackageCheck
    },
    {
      title: "Quality in Products, Services, & Communication",
      desc: "Uncompromising standards in curated brands, customer service, and trade coordination.",
      icon: Award
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold tracking-wider uppercase mb-6 border border-sky-400/30">
            About Aqua Ceramics LLP
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white mb-6">
            Building &amp; Plumbing Solutions, <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-cyan-200">
              Supplied with Care
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed mb-8">
            Aqua Ceramics LLP connects trusted manufacturers with dealers, retailers, wholesalers, project customers, and other business partners. We supply products for bathrooms, construction, plumbing, water management, and home improvement, supported by organized inventory, coordinated logistics, and customer-focused service.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white px-7 py-3.5 rounded-xl font-semibold shadow-lg shadow-sky-600/30 transition-all"
            >
              View Catalog <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/request-quote"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-7 py-3.5 rounded-xl font-semibold backdrop-blur-sm transition-all"
            >
              Request Quotation
            </Link>
          </div>
        </div>
      </section>

      {/* 2. OUR COMPANY SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block text-sky-600 font-semibold text-sm tracking-wider uppercase mb-3">
                Our Company
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 mb-6 leading-tight">
                Connecting Quality Products with the People Who Need Them
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed text-base">
                <p>
                  Aqua Ceramics LLP is a trading and distribution company specializing in building and plumbing solutions. We source products from manufacturers and suppliers, manage them through a structured warehouse and inventory process, and coordinate orders and delivery to meet customer requirements.
                </p>
                <p>
                  Our role is to help make the right products available at the right place and time. From sourcing and stock coordination to dispatch and after-sales coordination, our teams work together to support a dependable customer experience.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600 flex-shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">Trading &amp; Distribution</h4>
                    <p className="text-xs text-slate-500 mt-1">Connecting premium manufacturers with dealers, architects &amp; sites.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600 flex-shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">Organized Logistics</h4>
                    <p className="text-xs text-slate-500 mt-1">Structured stock management, order handling and reliable delivery.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-100">
                <img
                  src="/images/hero_sanitaryware_banner.jpg"
                  alt="Aqua Ceramics Distribution Network"
                  className="w-full h-[460px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 p-6 rounded-xl bg-white/95 backdrop-blur-md shadow-lg border border-white/50 text-slate-900">
                  <div className="text-xs uppercase font-bold tracking-wider text-sky-600">Trading &amp; Supply Partner</div>
                  <div className="text-xl font-serif font-bold mt-1 text-slate-900">
                    Dependable Building &amp; Plumbing Solutions
                  </div>
                  <div className="text-xs text-slate-500 mt-2">
                    Commercial Desk: <a href="tel:7019254016" className="text-sky-600 font-semibold hover:underline">7019254016</a> &bull; <a href="mailto:business@aquaceramics.in" className="text-sky-600 font-semibold hover:underline">business@aquaceramics.in</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHAT WE SUPPLY (PRODUCT DIVISIONS) */}
      <section className="py-20 bg-slate-100/70 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sky-600 font-semibold text-sm uppercase tracking-wider">What We Supply</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 mt-2">
              Product Divisions
            </h2>
            <p className="text-slate-600 mt-4 leading-relaxed">
              Our business divisions include quartz surfaces, CP fittings, sanitary ware, adhesives, heat pumps, water softeners, and solar solutions. Product availability and specifications vary by brand and product; see the relevant product listings for details.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productDivisions.map((div, idx) => {
              const IconComp = div.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-white p-7 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md hover:border-sky-300 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-5 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{div.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">{div.desc}</p>
                  <Link 
                    to="/products" 
                    className="inline-flex items-center text-xs font-semibold text-sky-600 hover:text-sky-800 gap-1"
                  >
                    View Products &rarr;
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. HOW WE SERVE (A COORDINATED SUPPLY PROCESS) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sky-600 font-semibold text-sm uppercase tracking-wider">How We Serve</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 mt-2">
              A Coordinated Supply Process
            </h2>
            <p className="text-slate-600 mt-4 leading-relaxed">
              We coordinate product sourcing, warehouse receiving and verification, inventory management, order processing, packing, dispatch, delivery, billing, and customer support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {supplySteps.map((step, idx) => (
              <div 
                key={idx} 
                className="relative bg-slate-50 p-8 rounded-2xl border border-slate-200/80 hover:bg-white hover:shadow-md transition-all"
              >
                <div className="text-3xl font-serif font-bold text-sky-600/40 mb-3">{step.step}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. OUR VALUES (HOW WE WORK) */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sky-400 font-semibold text-sm uppercase tracking-wider">Our Values</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-2">
              How We Work
            </h2>
            <p className="text-slate-400 mt-4 leading-relaxed">
              Our core principles guide every dealer relationship, procurement contract, and project fulfillment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {valuesList.map((val, idx) => {
              const ValIcon = val.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-white/5 backdrop-blur-sm border border-white/10 p-7 rounded-2xl hover:border-sky-400/50 hover:bg-white/10 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center mb-5 border border-sky-400/30">
                    <ValIcon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{val.title}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. OUR VISION (GROWING WITH PURPOSE) */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 mb-6">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div className="text-sky-600 font-semibold text-sm uppercase tracking-wider mb-2">Our Vision</div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 mb-6">
            Growing with Purpose
          </h2>
          <p className="text-lg sm:text-xl text-slate-700 font-light leading-relaxed max-w-3xl mx-auto">
            Aqua Ceramics LLP aims to expand its operations, strengthen its distribution network, improve customer service, develop efficient internal systems, and become one of the most trusted distribution companies in the building materials industry.
          </p>
        </div>
      </section>

      {/* 7. COMMERCIAL ENQUIRIES SECTION */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 font-serif">Have a Commercial or Bulk Requirement?</h3>
              <p className="text-slate-600 mt-2 max-w-xl text-sm">
                Contact the Aqua Ceramics commercial desk for project and bulk enquiries.
              </p>
              <div className="mt-4 flex flex-wrap gap-6 text-sm font-semibold">
                <a href="tel:7019254016" className="flex items-center gap-2 text-sky-600 hover:text-sky-700">
                  <Phone className="w-4 h-4" /> 7019254016
                </a>
                <a href="mailto:business@aquaceramics.in" className="flex items-center gap-2 text-sky-600 hover:text-sky-700">
                  <Mail className="w-4 h-4" /> business@aquaceramics.in
                </a>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/request-quote"
                className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-md transition-all whitespace-nowrap"
              >
                Request Quotation
              </Link>
              <Link
                to="/products"
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-6 py-3 rounded-xl font-semibold text-sm transition-all whitespace-nowrap"
              >
                View Catalog
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
