const db = require('../database/db');

function seedCatalogProducts() {
  console.log('Seeding products from source PDF documents...');

  // Ensure categories exist
  const insertCat = db.prepare(`
    INSERT INTO categories (name, slug, description, image_url)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(name) DO UPDATE SET
      slug=excluded.slug,
      description=excluded.description,
      image_url=excluded.image_url
  `);

  const categories = [
    {
      name: 'Western Toilets / EWC',
      slug: 'ewc-toilets',
      description: 'Rimless wall-hung EWCs, one-piece siphon closets, and ergonomic floor models.',
      image_url: '/images/category_ewc_toilets.jpg'
    },
    {
      name: 'Wash Basins',
      slug: 'wash-basins',
      description: 'Architectural table-top, pedestal, and wall-mounted ceramic basins.',
      image_url: '/images/category_wash_basins.jpg'
    },
    {
      name: 'Other Sanitaryware',
      slug: 'other-sanitaryware',
      description: 'Concealed cisterns, ceramic urinals, bidet fixtures, and accessories.',
      image_url: '/images/category_other_sanitaryware.jpg'
    },
    {
      name: 'Bath Fittings & Faucets',
      slug: 'bath-fittings-faucets',
      description: 'Architectural basin mixers, concealed thermostatic diverters, bath spouts, and sensor taps.',
      image_url: '/images/products/source_extracted/agl_nero_basin_mixer.png'
    },
    {
      name: 'Showers & Drain Systems',
      slug: 'showers-drain-systems',
      description: 'SS 304 channel gratings, tile insert floor drains, 4-function ceiling showers, and health faucets.',
      image_url: '/images/products/source_extracted/freshco_ceiling_shower_prism.png'
    },
    {
      name: 'Sintered Stone & Porcelain Slabs',
      slug: 'sintered-stone-slabs',
      description: 'Ultra-durable 1600x3200mm sintered porcelain architectural slabs in 20mm thickness.',
      image_url: '/images/products/source_extracted/alito_metalic_grey_slab.png'
    },
    {
      name: 'Tile Adhesives & Chemical Grouts',
      slug: 'tile-adhesives-grouts',
      description: 'Polymer-modified tile adhesives, sparkling epoxy grouts, stone sealers, and ceramic cleaners.',
      image_url: '/images/products/source_extracted/bal_masofix_tile_adhesive.png'
    },
    {
      name: 'Water Treatment & Softeners',
      slug: 'water-treatment-softeners',
      description: 'Automated residential water softeners and heat pump energy-saving water heaters.',
      image_url: '/images/products/source_extracted/zerob_autosoft_as2_main.png'
    }
  ];

  for (const cat of categories) {
    insertCat.run(cat.name, cat.slug, cat.description, cat.image_url);
  }

  // Insert or Update products
  const upsertProduct = db.prepare(`
    INSERT INTO products (
      code, name, category, brand, price, promotional_price, stock, availability,
      description, dimensions, color_variants, material_finish,
      key_features, image_url, source_ref, is_featured, is_published
    ) VALUES (
      @code, @name, @category, @brand, @price, @promotional_price, @stock, @availability,
      @description, @dimensions, @color_variants, @material_finish,
      @key_features, @image_url, @source_ref, @is_featured, 1
    )
    ON CONFLICT(code) DO UPDATE SET
      name=excluded.name,
      category=excluded.category,
      brand=excluded.brand,
      price=excluded.price,
      promotional_price=excluded.promotional_price,
      stock=excluded.stock,
      availability=excluded.availability,
      description=excluded.description,
      dimensions=excluded.dimensions,
      color_variants=excluded.color_variants,
      material_finish=excluded.material_finish,
      key_features=excluded.key_features,
      image_url=excluded.image_url,
      source_ref=excluded.source_ref,
      is_featured=excluded.is_featured
  `);

  const catalogProducts = [
    // 1. Delta Green Home 2026
    {
      code: 'DHS-10-HPWH',
      name: 'Delta Home Split Heat Pump DHS10',
      category: 'Water Treatment & Softeners',
      brand: 'Delta Green Home',
      price: 135000,
      promotional_price: 124990,
      stock: 12,
      availability: 'In Stock',
      description: 'High-efficiency residential split air-source heat pump water heater with 3.5 kW heating capacity. Designed for 200L/300L hot water storage with low noise outdoor compressor unit and smart app controller.',
      dimensions: 'Outdoor Unit: 800 x 300 x 550 mm',
      color_variants: 'Pure White & Graphite Trim',
      material_finish: 'Weatherproof Powder-Coated Galvanized Steel',
      key_features: JSON.stringify([
        'Heating Capacity: 3.5 kW (COP up to 4.2)',
        'Eco-friendly R410A / R32 refrigerant',
        'Energy savings up to 75% compared to conventional geysers',
        'Smart IoT Wi-Fi app monitoring and temperature scheduling'
      ]),
      image_url: '/images/products/source_extracted/delta_dhs_split_unit.png',
      source_ref: 'Delta Green Home 2026.pdf, Page 4-5',
      is_featured: 1
    },
    {
      code: 'DHS-15-HPWH',
      name: 'Delta Home Split Heat Pump DHS15',
      category: 'Water Treatment & Softeners',
      brand: 'Delta Green Home',
      price: 175000,
      promotional_price: 162500,
      stock: 8,
      availability: 'In Stock',
      description: 'Heavy-duty residential split heat pump water heater with 5.2 kW heating capacity. Ideal for multi-bathroom luxury residences, duplexes, and 300L-500L storage setups.',
      dimensions: 'Outdoor Unit: 860 x 350 x 680 mm',
      color_variants: 'Pure White & Graphite Trim',
      material_finish: 'Anti-corrosion Marine-grade Powder Coating',
      key_features: JSON.stringify([
        'Heating Capacity: 5.2 kW with rapid reheating cycle',
        'Low ambient operation down to -7°C',
        'Smart dual-sensor temperature precision control',
        'Comprehensive 5-year compressor manufacturer warranty'
      ]),
      image_url: '/images/products/source_extracted/delta_dhs_system_installed.png',
      source_ref: 'Delta Green Home 2026.pdf, Page 4 & 6',
      is_featured: 0
    },

    // 2. Zero B (Ion Exchange)
    {
      code: 'ZB-AS2-2000LPH',
      name: 'Zero B AutoSoft 2 Water Softener (2000 LPH)',
      category: 'Water Treatment & Softeners',
      brand: 'Zero B (Ion Exchange)',
      price: 68500,
      promotional_price: 63900,
      stock: 15,
      availability: 'In Stock',
      description: 'Fully automatic compact residential water softener with 2000 L/hr peak flow rate. Features a 40 kg integrated salt brine tank and 25 Litres high-exchange resin volume to eliminate scaling from bath fittings and tiles.',
      dimensions: '330 x 470 x 1100 mm',
      color_variants: 'Ocean Blue & Pearl White',
      material_finish: 'High-Grade Food Contact Polymers & FRP Pressure Vessel',
      key_features: JSON.stringify([
        'Flow Rate: 2,000 Litres per Hour (LPH)',
        'Resin Quantity: 25 Litres food-grade ion exchange resin',
        'Salt Storage Capacity: 40 kg brine cabinet',
        'Advanced automated multi-port regeneration valve'
      ]),
      image_url: '/images/products/source_extracted/zerob_autosoft_as2_main.png',
      source_ref: 'zerob-as2-water-softener-2000-lph.pdf, Page 2 & 4',
      is_featured: 1
    },

    // 3. BAL ENDURA Adhesives & Grouts
    {
      code: 'BAL-MASOFIX-25KG',
      name: 'BAL Endura Masofix Tile Adhesive (Type 1T)',
      category: 'Tile Adhesives & Chemical Grouts',
      brand: 'BAL Endura (Ardex)',
      price: 495,
      promotional_price: 460,
      stock: 250,
      availability: 'In Stock',
      description: 'Grey polymer-based Type 1T tile adhesive conforming to IS 15477:2019 Type 1T standards. Engineered for fixing ceramic, terracotta, and clay tiles on interior floor and wall surfaces with excellent anti-slip properties.',
      dimensions: '25 kg Heavy-Duty Moisture-Proof Bag',
      color_variants: 'Standard Cement Grey',
      material_finish: 'Cementitious Polymer Powder',
      key_features: JSON.stringify([
        'Conforms to IS 15477:2019 Type 1T specification',
        'High tensile adhesion strength (> 0.5 N/mm²)',
        'Anti-slip slip resistance for vertical wall tiles',
        'Approx. coverage: 55-60 sq.ft per 25kg bag at 3mm thickness'
      ]),
      image_url: '/images/products/source_extracted/bal_masofix_tile_adhesive.png',
      source_ref: 'BAL ENDURA FLYER.pdf, Page 1',
      is_featured: 1
    },
    {
      code: 'BAL-MASOFIX-ULTRA-25KG',
      name: 'BAL Endura Masofix Ultra Tile Adhesive (Type 2T)',
      category: 'Tile Adhesives & Chemical Grouts',
      brand: 'BAL Endura (Ardex)',
      price: 785,
      promotional_price: 720,
      stock: 180,
      availability: 'In Stock',
      description: 'High polymer modified Type 2T tile adhesive conforming to IS 15477:2019 Type 2T standards. Specially formulated for fixing vitrified tiles, granite, and natural stones on interior and exterior floors and walls.',
      dimensions: '25 kg Moisture-Proof Sealed Bag',
      color_variants: 'Grey / Off-White Powder',
      material_finish: 'High-Polymer Enriched Cementitious Compound',
      key_features: JSON.stringify([
        'Conforms to IS 15477:2019 Type 2T specification',
        'Superior shear strength for large format vitrified tiles',
        'Extended open time and exceptional anti-slump performance',
        'Suitable for internal floors, walls, and covered outdoor spaces'
      ]),
      image_url: '/images/products/source_extracted/bal_masofix_ultra_adhesive.png',
      source_ref: 'BAL ENDURA FLYER.pdf, Page 1',
      is_featured: 0
    },
    {
      code: 'BAL-MASOPOXY-2-1KG',
      name: 'BAL Endura Masopoxy 2 Epoxy Tile Grout',
      category: 'Tile Adhesives & Chemical Grouts',
      brand: 'BAL Endura (Ardex)',
      price: 850,
      promotional_price: 790,
      stock: 120,
      availability: 'In Stock',
      description: 'Two-part chemical resistant epoxy tile joint filler. Completely waterproof, 100% solid, non-shrink, stain-free, and resistant to domestic cleaners, oils, and hygiene hazards in luxury bathrooms and kitchens.',
      dimensions: '1 kg Complete Pack (Resin + Hardener + Filler)',
      color_variants: 'Alpine White, Ivory, Silver Grey, Charcoal',
      material_finish: '100% Solid Reaction Resin Epoxy Mortar',
      key_features: JSON.stringify([
        '100% stain proof and resistant to household chemicals',
        'Zero water absorption preventing fungal and bacterial growth',
        'Easy water-cleanup formulation during installation',
        'Ideal for joints from 2mm to 12mm width'
      ]),
      image_url: '/images/products/source_extracted/bal_masopoxy_epoxy_grout.png',
      source_ref: 'BAL ENDURA FLYER.pdf, Page 1',
      is_featured: 0
    },

    // 4. Ardex Endura Tiling Handout & Grout Shade Card
    {
      code: 'ARDEX-SILVER-STAR-20KG',
      name: 'Ardex Endura Silver Star Tile Adhesive',
      category: 'Tile Adhesives & Chemical Grouts',
      brand: 'Ardex Endura',
      price: 430,
      promotional_price: 395,
      stock: 200,
      availability: 'In Stock',
      description: 'Polymer modified cementitious adhesive for installation of ceramic and small vitrified tiles on floor and wall substrates in residential and commercial premises.',
      dimensions: '20 kg Kraft Paper Bag',
      color_variants: 'Grey Powder',
      material_finish: 'Polymer Enriched Cementitious Binder',
      key_features: JSON.stringify([
        'High bond strength for interior installations',
        'Self-curing formulation — eliminates water curing',
        'Smooth buttering consistency for rapid application',
        'Conforms to EN 12004 C1T standards'
      ]),
      image_url: '/images/products/source_extracted/ardex_silver_star_adhesive.png',
      source_ref: 'tiling_handout_-_low_resolution (1).pdf, Page 2',
      is_featured: 0
    },
    {
      code: 'ARDEX-GOLD-STAR-20KG',
      name: 'Ardex Endura Gold Star High-Polymer Adhesive',
      category: 'Tile Adhesives & Chemical Grouts',
      brand: 'Ardex Endura',
      price: 690,
      promotional_price: 640,
      stock: 150,
      availability: 'In Stock',
      description: 'Premium high-polymer modified tile adhesive engineered for large vitrified tiles, porcelain slabs, and marble on interior and exterior walls and floors.',
      dimensions: '20 kg Sealed Bag',
      color_variants: 'Grey / White',
      material_finish: 'Polymer-Modified Flexible Mortar',
      key_features: JSON.stringify([
        'Heavy-duty adhesive strength for large format tiles',
        'Excellent shock and thermal vibration accommodation',
        'Zero vertical tile slip on heights',
        'Conforms to IS 15477:2019 Type 2T'
      ]),
      image_url: '/images/products/source_extracted/ardex_gold_star_adhesive.png',
      source_ref: 'tiling_handout_-_low_resolution (1).pdf, Page 2',
      is_featured: 0
    },
    {
      code: 'ARDEX-WAD-SPARKLING-1KG',
      name: 'Ardex Endura WA D Sparkling Epoxy Grout',
      category: 'Tile Adhesives & Chemical Grouts',
      brand: 'Ardex Endura',
      price: 1350,
      promotional_price: 1250,
      stock: 85,
      availability: 'In Stock',
      description: 'Three-component sparkling glitter epoxy tile joint grout available in Bronze, Silver, and Gold effects. 100% non-absorbent, stain-proof, and designed for swimming pools, spas, and designer bathrooms.',
      dimensions: '1 kg Bucket Set (Part A, Part B, Metallic Filler)',
      color_variants: '391 Bronze, 392 Silver, 393 Gold Metallic Shades',
      material_finish: 'Decorative Epoxy Resin with Reflective Glitter Aggregate',
      key_features: JSON.stringify([
        'Architectural glitter finish with metallic sparkle reflection',
        'Resistant to aggressive pool chemicals and acid cleaners',
        'Non-sagging in vertical wall tile joints up to 15mm',
        'Impermeable to water, oils, grease, and bacteria'
      ]),
      image_url: '/images/products/source_extracted/ardex_wad_epoxy_grout.png',
      source_ref: 'tiling_handout_-_low_resolution (1).pdf, Page 3 & GROUT SHADE CARD-1.pdf',
      is_featured: 1
    },
    {
      code: 'ARDEX-HD-CLEANER-5L',
      name: 'Ardex Endura Heavy Duty Tile & Stone Cleaner (5L)',
      category: 'Tile Adhesives & Chemical Grouts',
      brand: 'Ardex Endura',
      price: 1100,
      promotional_price: 990,
      stock: 90,
      availability: 'In Stock',
      description: 'Concentrated chemical formula for rapid removal of stubborn cement film, grout haze, efflorescence, and mineral deposits from vitrified tiles, ceramics, and acid-resistant natural stone.',
      dimensions: '5 Litres HDPE Canister',
      color_variants: 'Clear Translucent Liquid',
      material_finish: 'Bio-Degradable Acid-Surfactant Formulation',
      key_features: JSON.stringify([
        'Dissolves tough cementitious residue and grout stains',
        'Cleans without damaging ceramic glaze',
        'Concentrated formula — dilutable up to 1:5 with water',
        'Leaves floor clean and ready for sealing or handover'
      ]),
      image_url: '/images/products/source_extracted/ardex_heavy_duty_tile_cleaner.png',
      source_ref: 'tiling_handout_-_low_resolution (1).pdf, Page 4',
      is_featured: 0
    },

    // 5. FRESHCO SS 304 Channel Gratings, Drains & Showers
    {
      code: 'GRT-TIL-S-13024',
      name: 'Freshco SS 304 Tile Insert Channel Grating 4"x24"',
      category: 'Showers & Drain Systems',
      brand: 'Freshco',
      price: 6850,
      promotional_price: 6490,
      stock: 35,
      availability: 'In Stock',
      description: 'Luxury linear shower drain channel fabricated from heavy-duty AISI 304 stainless steel with 1.0mm thick frame and tray. Designed for seamless tile or marble insert with integrated cockroach trap and debris strainer.',
      dimensions: '4" x 24" (100 x 600 mm), Side Hole Outlet',
      color_variants: 'Brushed Satin Stainless Steel Frame',
      material_finish: 'Grade 304 Stainless Steel (1.0mm thickness)',
      key_features: JSON.stringify([
        'Complete Set: Outer Base + Tile Insert Tray + SS Strainer + Cockroach Trap',
        'Accommodates floor tiles up to 13mm depth for invisible flush drainage',
        'High discharge flow rate prevents water pooling in walk-in showers',
        'Anti-odor mechanical water-seal pest barrier'
      ]),
      image_url: '/images/products/source_extracted/freshco_ss304_channel_grating.png',
      source_ref: 'FRESHCO CATALOG_AUGUST 26_VOL 1.pdf, Page 5',
      is_featured: 1
    },
    {
      code: 'GRT-SQ5-104',
      name: 'Freshco Emerald Square Floor Drain Grating (5"x5")',
      category: 'Showers & Drain Systems',
      brand: 'Freshco',
      price: 750,
      promotional_price: 699,
      stock: 120,
      availability: 'In Stock',
      description: 'Precision laser-cut Emerald geometric design square floor drain jali crafted from 304-grade stainless steel with anti-clog holes and mirror polished finish.',
      dimensions: '5" x 5" (125 x 125 mm)',
      color_variants: 'Mirror Polished Chrome Silver',
      material_finish: 'SS 304 Premium Stainless Steel',
      key_features: JSON.stringify([
        'Laser-cut Emerald designer drainage pattern',
        'Corrosion and rust-proof SS 304 construction',
        'Available in Jali Only or complete CCT cockroach trap set',
        'Smooth deburred edges for safe barefoot bathroom use'
      ]),
      image_url: '/images/products/source_extracted/freshco_floor_drains_emerald.png',
      source_ref: 'FRESHCO CATALOG_AUGUST 26_VOL 1.pdf, Page 6',
      is_featured: 0
    },
    {
      code: 'CS-SS4-2022',
      name: 'Freshco Prism SS304 4-Function Ceiling Shower (22"x20")',
      category: 'Showers & Drain Systems',
      brand: 'Freshco',
      price: 51000,
      promotional_price: 47500,
      stock: 10,
      availability: 'In Stock',
      description: 'Flagship 4-function concealed ceiling mounted shower system made from solid AISI 304 stainless steel. Features 4 independent sensory flow modes: Gentle Rain, Dual Waterfall, Refreshing Mist, and Direct Water Column.',
      dimensions: '22" x 20" (550 x 500 mm)',
      color_variants: 'Brushed Stainless Steel / Mirror Chrome',
      material_finish: 'Solid SS 304 Surgical Grade Stainless Steel',
      key_features: JSON.stringify([
        '4-in-1 Multi-Sensory Flows: Rain, Dual Waterfall, Mist, and Column',
        'Concealed ceiling-flush mounting for minimalist architectural look',
        'Self-cleaning silicone rubber anti-calc spray nozzles',
        'High pressure optimization for true spa-grade hydrotherapy'
      ]),
      image_url: '/images/products/source_extracted/freshco_ceiling_shower_prism.png',
      source_ref: 'FRESHCO CATALOG_AUGUST 26_VOL 1.pdf, Page 9',
      is_featured: 1
    },
    {
      code: 'HSH-S3-6210',
      name: 'Freshco Nest Round SS 304 Health Faucet Set',
      category: 'Showers & Drain Systems',
      brand: 'Freshco',
      price: 3200,
      promotional_price: 2950,
      stock: 65,
      availability: 'In Stock',
      description: 'Complete high-durability health faucet set featuring solid SS 304 gun body, 1.5-metre flexible SS 304 hose pipe (SHA-SS-315), and wall bracket hook.',
      dimensions: 'Gun Length: 125 mm | Hose: 1.5 Metres',
      color_variants: 'Brushed Silver SS',
      material_finish: 'All SS 304 Stainless Steel Construction',
      key_features: JSON.stringify([
        'Ergonomic trigger lever with smooth pressure regulation',
        'Solid SS 304 body — burst-resistant under high domestic water pressure',
        'Includes 1.5m anti-twist flexible shower hose and wall bracket',
        'Precision internal brass cartridge prevents dripping'
      ]),
      image_url: '/images/products/source_extracted/freshco_health_faucet_nest.png',
      source_ref: 'FRESHCO CATALOG_AUGUST 26_VOL 1.pdf, Page 11',
      is_featured: 0
    },

    // 6. ALITO Sintered Stone Slabs (1600x3200mm, 20mm)
    {
      code: 'ALITO-ART-MET-GREY',
      name: 'Alito Artistico Metalic Grey Sintered Slab (1600x3200mm)',
      category: 'Sintered Stone & Porcelain Slabs',
      brand: 'Alito Porcelain Slabs',
      price: 48000,
      promotional_price: 44500,
      stock: 25,
      availability: 'In Stock',
      description: 'Super-sized 1600x3200mm sintered stone porcelain architectural slab in 20mm thickness from the Artistico Collection. Boasts sophisticated metallic undertones with ultra-luxurious polished gloss finish.',
      dimensions: '1600 x 3200 x 20 mm (Weight: ~250 kg)',
      color_variants: 'Metalic Grey Glossy',
      material_finish: 'High-Density Sintered Porcelain Body with Mirror Polished Glaze',
      key_features: JSON.stringify([
        'Jumbo Architectural Size: 1600 x 3200 mm (Coverage: 55.1 sq.ft)',
        'Full 20mm Thickness — ideal for kitchen counters and luxury vanity tops',
        'Zero porosity (water absorption < 0.05%), stain, UV, and heat proof',
        'Scratch-resistant Mohs hardness 7+ rating'
      ]),
      image_url: '/images/products/source_extracted/alito_metalic_grey_slab.png',
      source_ref: 'ALITO_2026-Catalog.pdf, Page 5',
      is_featured: 1
    },
    {
      code: 'ALITO-ACC-CAL-INCISE',
      name: 'Alito Accord Calacatta Incise Porcelain Slab (1600x3200mm)',
      category: 'Sintered Stone & Porcelain Slabs',
      brand: 'Alito Porcelain Slabs',
      price: 52000,
      promotional_price: 48900,
      stock: 20,
      availability: 'In Stock',
      description: 'Bookmatched Calacatta marble aesthetic sintered stone slab from the Accord Series. Distinctive bold grey and charcoal veins across a pure statuary white crystalline background in 20mm solid slab profile.',
      dimensions: '1600 x 3200 x 20 mm (Weight: ~250 kg)',
      color_variants: 'Calacatta White with Bold Grey Veining',
      material_finish: 'Polished Sintered Compact Surface',
      key_features: JSON.stringify([
        'Authentic Italian Calacatta marble aesthetic with sintered stone strength',
        'Bookmatch pattern capability for seamless architectural continuity',
        'Food-safe antibacterial surface suitable for direct culinary preparation',
        'Thermal shock resistant to boiling pans and hot cookware'
      ]),
      image_url: '/images/products/source_extracted/alito_calacatta_incise_slab.png',
      source_ref: 'ALITO_2026-Catalog.pdf, Page 13',
      is_featured: 1
    },
    {
      code: 'ALITO-ACC-LUM-BLANCO',
      name: 'Alito Accord Lumina Blanco Porcelain Slab (1600x3200mm)',
      category: 'Sintered Stone & Porcelain Slabs',
      brand: 'Alito Porcelain Slabs',
      price: 49500,
      promotional_price: 46000,
      stock: 18,
      availability: 'In Stock',
      description: 'Subtle translucent crystalline white sintered porcelain slab with soft luminous veining. Perfect for bathroom vanity cladding, waterfall islands, and feature walls.',
      dimensions: '1600 x 3200 x 20 mm (Weight: ~250 kg)',
      color_variants: 'Lumina Blanco Glossy',
      material_finish: 'Sintered Stone Composite',
      key_features: JSON.stringify([
        'Luminous alabaster translucency with polished mirror surface',
        '1600 x 3200 mm monolithic format minimizes grout lines',
        'Extreme durability against impact, acids, and household stains',
        'Precision factory rectified edges for razor-thin installation joints'
      ]),
      image_url: '/images/products/source_extracted/alito_lumina_blanco_slab.png',
      source_ref: 'ALITO_2026-Catalog.pdf, Page 14',
      is_featured: 0
    },

    // 7. AGL Sanitaryware (Sanitaryware Pricelist Sep 26.pdf)
    {
      code: 'AGL-S122021150',
      name: 'AGL Alaska Rimless Wall-Hung Water Closet',
      category: 'Western Toilets / EWC',
      brand: 'AGL Bathware',
      price: 14300,
      promotional_price: 13200,
      stock: 40,
      availability: 'In Stock',
      description: 'Modern compact wall-hung water closet featuring clean rimless washdown hygiene technology, blind installation with hidden fixing kit, and heavy-duty UF soft-close seat cover.',
      dimensions: '490 x 350 x 360 mm',
      color_variants: 'Alpine White Glossy',
      material_finish: 'Vitreous China with Nano-Hygiene Coating',
      key_features: JSON.stringify([
        'Rimless Washdown 360° Flushing for zero dirt accumulation',
        'Blind Installation mechanism with included concealed fixing kit',
        'Ultra-durable UF (Urea-Formaldehyde) soft-close quick-release seat',
        'Compact 490mm depth ideal for contemporary luxury en-suites'
      ]),
      image_url: '/images/products/source_extracted/agl_wall_hung_closet.png',
      source_ref: 'Sanitaryware Pricelist Sep 26.pdf, Page 12',
      is_featured: 1
    },
    {
      code: 'AGL-S125039262',
      name: 'AGL Velora Elevate 360 Tornado Wall-Hung Closet',
      category: 'Western Toilets / EWC',
      brand: 'AGL Bathware',
      price: 15150,
      promotional_price: 14200,
      stock: 35,
      availability: 'In Stock',
      description: 'Next-generation Elevate 360 series wall-hung closet with Tornado Rimless flush vortex power, sleek curved styling, and blind installation kit.',
      dimensions: '510 x 360 x 330 mm',
      color_variants: 'Pure White Glossy',
      material_finish: 'Vitreous China Ceramic Body',
      key_features: JSON.stringify([
        'Elevate 360 Tornado vortex swirling water action for whisper-quiet clean',
        'Slim UF soft-close seat with stainless steel quick-release hinges',
        'Hidden blind wall mounting hardware for streamlined aesthetic',
        'Dual flush compatible (3L / 4.5L eco volume)'
      ]),
      image_url: '/images/products/source_extracted/agl_picasso_one_piece_ewc.png',
      source_ref: 'Sanitaryware Pricelist Sep 26.pdf, Page 12',
      is_featured: 0
    },
    {
      code: 'AGL-S127212556',
      name: 'AGL Marco Thin-Rim Table Top Wash Basin',
      category: 'Wash Basins',
      brand: 'AGL Bathware',
      price: 4800,
      promotional_price: 4350,
      stock: 50,
      availability: 'In Stock',
      description: 'Square architectural counter-top vessel basin with razor-thin edges, deep anti-splash bowl contour, and high-gloss non-porous vitreous glaze.',
      dimensions: '405 x 405 x 130 mm',
      color_variants: 'Alpine White Glossy',
      material_finish: 'Fine Fireclay Ceramic with Anti-Stain Glaze',
      key_features: JSON.stringify([
        'Architectural Thin-Rim edge profile (under 5mm rim)',
        'Compact square 405x405mm vessel footprint',
        'Antibacterial glaze prevents hard water scale and soap scum',
        'Compatible with tall boy basin mixers and wall-mounted spouts'
      ]),
      image_url: '/images/products/source_extracted/agl_table_top_basin.png',
      source_ref: 'Sanitaryware Pricelist Sep 26.pdf, Page 19',
      is_featured: 1
    },

    // 8. AGL Faucets (AGL SEP 26 Faucet Pricelist.pdf)
    {
      code: 'AGL-303212BL',
      name: 'AGL Nero Single Lever Basin Mixer (Matte Black)',
      category: 'Bath Fittings & Faucets',
      brand: 'AGL Bathware',
      price: 11440,
      promotional_price: 10490,
      stock: 25,
      availability: 'In Stock',
      description: 'Contemporary European-style single lever basin mixer with high-durability electroplated Matte Black finish. Powered by a 25mm ceramic cartridge and bundled with 450mm stainless steel braided inlet hoses.',
      dimensions: 'Spout Reach: 120 mm | Total Height: 165 mm',
      color_variants: 'Matte Black (BL)',
      material_finish: 'Solid Forged Brass Body with Matte Black Powder/PVD Finish',
      key_features: JSON.stringify([
        '25mm high-precision ceramic disc cartridge tested to 500,000 cycles',
        'Includes 450mm SS braided flexible connection hoses',
        'Neoperl Swiss aerator for soft foam water stream without splashing',
        'Corrosion resistant electroplated black finish'
      ]),
      image_url: '/images/products/source_extracted/agl_nero_basin_mixer.png',
      source_ref: 'AGL SEP 26 Faucet Pricelist.pdf, Page 4',
      is_featured: 1
    },
    {
      code: 'AGL-303218BL',
      name: 'AGL Nero Tall Body Basin Mixer (Matte Black)',
      category: 'Bath Fittings & Faucets',
      brand: 'AGL Bathware',
      price: 12800,
      promotional_price: 11800,
      stock: 20,
      availability: 'In Stock',
      description: 'Extended pillar tall body basin mixer tailored specifically for above-counter table-top wash basins. Features solid forged brass construction with velvety matte black surface.',
      dimensions: 'Spout Reach: 155 mm | Total Height: 295 mm',
      color_variants: 'Matte Black (BL)',
      material_finish: 'Heavy Brass Casting with PVD Black Finish',
      key_features: JSON.stringify([
        'Tall body pillar design for counter-top wash bowls',
        'Smooth feather-touch single lever joystick flow regulation',
        'Anti-limescale aerator saving up to 30% water',
        '10-year manufacturer warranty on internal brass body'
      ]),
      image_url: '/images/products/source_extracted/agl_nero_basin_mixer.png',
      source_ref: 'AGL SEP 26 Faucet Pricelist.pdf, Page 4',
      is_featured: 0
    },
    {
      code: 'AGL-301218CP',
      name: 'AGL Denver Tall Body Basin Mixer (Chrome)',
      category: 'Bath Fittings & Faucets',
      brand: 'AGL Bathware',
      price: 11400,
      promotional_price: 10250,
      stock: 30,
      availability: 'In Stock',
      description: 'Modern geometric tall body basin mixer finished in mirror trivalent chrome plating. Engineered with 25mm ceramic cartridge and flexible braided water supply hoses.',
      dimensions: 'Spout Reach: 150 mm | Total Height: 290 mm',
      color_variants: 'Mirror Chrome Plated (CP)',
      material_finish: 'Multi-layer Nickel-Chrome Plated Solid Brass',
      key_features: JSON.stringify([
        'Mirror shine multi-layer chrome finish with salt spray resistance',
        'Single lever hot and cold blending control',
        'Tall body configuration tailored for vessel basins',
        'Includes long braided supply pipes and brass mounting kit'
      ]),
      image_url: '/images/products/source_extracted/agl_sensor_tap.png',
      source_ref: 'AGL SEP 26 Faucet Pricelist.pdf, Page 4',
      is_featured: 0
    },

    // 9. Jaquar Laguna & Fusion Prime (CG VOL. 22_2026-27_Web (2).pdf)
    {
      code: 'JAQ-LAG-CHR-91011B',
      name: 'Jaquar Laguna Single Lever Basin Mixer',
      category: 'Bath Fittings & Faucets',
      brand: 'Jaquar Artize / Laguna',
      price: 11000,
      promotional_price: 9950,
      stock: 28,
      availability: 'In Stock',
      description: 'Architectural single lever basin mixer from Jaquar Laguna series. Designed by Matteo Thun and Antonio Rodriguez, featuring minimal cylindrical form, 450mm braided hoses, and smooth ceramic disc movement.',
      dimensions: 'Spout Reach: 115 mm | Height: 160 mm',
      color_variants: 'Chrome (CHR), Black Matt (BLM), Gold Bright (GBP)',
      material_finish: 'Forged Virgin Brass with Advanced Mirror Chrome Finish',
      key_features: JSON.stringify([
        'Designed in collaboration with award-winning European designers',
        'Operates smoothly at both low and high water pressure (0.5 to 5 bar)',
        'Eco-flush flow regulator delivering 6 L/min aerated stream',
        'Includes 450mm long braided connection hoses'
      ]),
      image_url: '/images/products/source_extracted/jaquar_laguna_basin_mixer.png',
      source_ref: 'CG VOL. 22_2026-27_Web (2).pdf, Page 6',
      is_featured: 1
    },
    {
      code: 'JAQ-FUP-CHR-29115PM',
      name: 'Jaquar Fusion Prime Single Lever Wall Mixer',
      category: 'Bath Fittings & Faucets',
      brand: 'Jaquar',
      price: 9000,
      promotional_price: 8250,
      stock: 22,
      availability: 'In Stock',
      description: 'Heavy brass single lever wall mixer with provision for connection to exposed shower pipe (SHA-1211N). Features chrome finish, connecting legs, and decorative wall flanges.',
      dimensions: 'Center-to-Center Distance: 150 ± 15 mm',
      color_variants: 'Mirror Chrome Plated (CHR)',
      material_finish: 'Virgin Grade CW617N Solid Brass Body',
      key_features: JSON.stringify([
        'Equipped with connecting offset legs and brass wall flanges',
        'Provision for overhead shower pipe connection',
        'Effortless single lever hot/cold water regulation',
        'Jaquar 10-year comprehensive warranty'
      ]),
      image_url: '/images/products/source_extracted/jaquar_fusion_prime_mixer.png',
      source_ref: 'CG VOL. 22_2026-27_Web (2).pdf, Page 10',
      is_featured: 0
    }
  ];

  for (const prod of catalogProducts) {
    upsertProduct.run(prod);
  }

  console.log(`Seeded and updated ${catalogProducts.length} certified catalog products.`);
}

seedCatalogProducts();
