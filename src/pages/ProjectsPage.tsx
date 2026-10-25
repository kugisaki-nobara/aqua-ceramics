import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  Phone, 
  Mail,
  Sparkles
} from 'lucide-react';
import { Project } from '../types';

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/projects');
        if (res.ok) {
          const data = await res.json();
          setProjects(data.projects || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const categories = ['All', 'Hospitality', 'Residential', 'Commercial', 'Healthcare'];

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter((p) => p.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold uppercase tracking-wider mb-4">
            Architectural Installations & Case Studies
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-slate-900 tracking-tight">
            Projects Powered by Aqua Ceramics
          </h1>
          <p className="text-slate-600 mt-4 text-base leading-relaxed">
            From 5-star seaside resorts to premium high-rise towers, our sanitaryware solutions combine heavy-duty longevity with understated minimalist elegance.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex justify-center items-center gap-2 overflow-x-auto pb-4 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-3xl h-96 animate-pulse p-4 border border-slate-200">
                <div className="bg-slate-200 h-64 rounded-2xl mb-4"></div>
                <div className="h-5 bg-slate-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-lg mx-auto">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800">No projects found in this category</h3>
            <p className="text-slate-500 text-xs mt-1">Please check back soon or browse all projects.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-72 overflow-hidden bg-slate-100">
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {project.category}
                    </div>
                    {project.location && (
                      <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-md text-slate-800 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                        <MapPin className="w-3.5 h-3.5 text-sky-600" /> {project.location}
                      </div>
                    )}
                  </div>

                  <div className="p-6 sm:p-8">
                    <h3 className="text-2xl font-serif font-bold text-slate-900 mb-3 group-hover:text-sky-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                      {project.description}
                    </p>

                    {project.products_used && (
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                        <div className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                          Aqua Fixtures Deployed:
                        </div>
                        <div className="text-slate-600 font-medium">{project.products_used}</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 sm:p-8 pt-0 flex justify-between items-center border-t border-slate-100 mt-4">
                  <span className="text-xs text-slate-400">Project Completed & Verified</span>
                  <Link
                    to="/request-quote"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700"
                  >
                    Enquire for Similar Spec <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Commercial Partnership Banner */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl">
          <div className="max-w-3xl">
            <span className="text-sky-400 font-bold text-xs uppercase tracking-widest">Architects & Builders Desk</span>
            <h3 className="text-3xl font-serif font-bold mt-2 mb-4">
              Equip Your Upcoming Development with Aqua Ceramics
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Our project engineering division provides bespoke bulk pricing, fast-track container logistics, CAD/BIM model libraries, and dedicated on-site installation audits.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/request-quote"
                className="bg-sky-600 hover:bg-sky-500 text-white px-6 py-3 rounded-xl font-semibold text-xs shadow-lg transition-all"
              >
                Submit Project Specification
              </Link>
              <a
                href="tel:7019254016"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-xl font-semibold text-xs transition-all"
              >
                <Phone className="w-4 h-4" /> Call 7019254016
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
