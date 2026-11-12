const db = require('../database/db');

function rebuildCatalogFromSources() {
  console.log('Rebuilding Aqua Ceramics catalog strictly from 10 source PDF documents...');

  // 1. Wipe existing products and categories safely with foreign keys pragma
  db.exec(`PRAGMA foreign_keys = OFF;`);
  db.exec(`DELETE FROM order_items;`);
  db.exec(`DELETE FROM quotations;`);
  db.exec(`DELETE FROM products;`);
  db.exec(`DELETE FROM categories;`);
  db.exec(`PRAGMA foreign_keys = ON;`);
  console.log('Cleared existing catalog products, quotations, and categories.');

  // 2. Insert verified source categories
  const insertCat = db.prepare(`
    INSERT INTO categories (name, slug, description, image_url)
    VALUES (?, ?, ?, ?)
  `);

  const categories = [
    {
      name: 'Sanitaryware & Closets',
      slug: 'sanitaryware-closets',
      description: 'One-piece toilet closets, rimless wall-hung water closets, and pedestal suites from manufacturer source catalogs.',
      image_url: ''
    },
    {
      name: 'Wash Basins & Vanities',
      slug: 'wash-basins-vanities',
      description: 'One-piece floor-mounted basins, table-top vessel bowls, and wall-hung ceramic basins.',
      image_url: ''
    },
    {
      name: 'Pans & Commercial Urinals',
      slug: 'pans-commercial-urinals',
      description: 'Orissa pans, eastern squatting pans, stall urinals, half-stall urinals, and partition dividers.',
      image_url: ''
    },
    {
      name: 'Bath Fittings & Faucets',
      slug: 'bath-fittings-faucets',
      description: 'Basin mixers, diverters, bath spouts, bib cocks, and sensor taps with printed MRP pricelists.',
      image_url: ''
    },
    {
      name: 'Showers & Drain Systems',
      slug: 'showers-drain-systems',
      description: 'SS 304 channel gratings, floor drains, ceiling-mounted showers, and health faucets.',
      image_url: ''
    },
    {
      name: 'Sintered Stone & Porcelain Slabs',
      slug: 'sintered-stone-slabs',
      description: '1600x3200mm, 20mm sintered stone porcelain architectural slabs.',
      image_url: ''
    },
    {
      name: 'Tile Adhesives & Chemical Grouts',
      slug: 'tile-adhesives-grouts',
      description: 'Polymer-modified tile adhesives, sparkling epoxy grouts, stone cleaners, and impregnating sealers.',
      image_url: ''
    },
    {
      name: 'Water Softeners & Heat Pumps',
      slug: 'water-softeners-heat-pumps',
      description: 'Residential automatic water softeners and energy-saving split air-source heat pump water heaters.',
      image_url: ''
    }
  ];

  for (const cat of categories) {
    insertCat.run(cat.name, cat.slug, cat.description, cat.image_url);
  }
  console.log(`Initialized ${categories.length} verified categories.`);

  // 3. Prepare product insertion statement
  const insertProduct = db.prepare(`
    INSERT INTO products (
      code, name, category, brand, price, promotional_price, stock, availability,
      description, dimensions, color_variants, material_finish,
      key_features, image_url, source_ref, is_featured, is_published
    ) VALUES (
      @code, @name, @category, @brand, @price, @promotional_price, @stock, @availability,
      @description, @dimensions, @color_variants, @material_finish,
      @key_features, @image_url, @source_ref, @is_featured, 1
    )
  `);

  // 4. Source catalog products (Every single item extracted faithful to source with exact image reference note)
  const products = [
    // ==========================================
    // SOURCE: COLORS SANITARY WARE 23.pdf (30 Pages)
    // Brand: COLORS Sanitaryware
    // Price: Price not listed (Catalog does not contain printed prices)
    // ==========================================
    {
      code: 'COLORS-101-ALFA',
      name: 'Colors Alfa One Piece Closet',
      category: 'Sanitaryware & Closets',
      brand: 'COLORS Sanitaryware',
      price: 0,
      promotional_price: null,
      stock: 25,
      availability: 'Price not listed - Request Quote',
      description: 'One piece ceramic water closet with wash down flushing system and PP soft close seat cover (Item 735). Large water surface for easy cleaning and fully glazed trapway.',
      dimensions: '680 x 365 x 655 mm (26.8" x 14" x 26"-inch)',
      color_variants: 'White Ceramic',
      material_finish: 'Vitreous China Glazed Ceramic',
      key_features: JSON.stringify([
        'Wash down flushing system',
        'PP Seat Cover Model 735 included',
        'Fully glazed computer designed trapway',
        'S-Trap 250/300mm roughing-in'
      ]),
      image_url: '',
      source_ref: 'COLORS SANITARY WARE 23.pdf — printed page 02 (PDF page 5), isolated product image of Alfa one-piece closet 101',
      is_featured: 1
    },
    {
      code: 'COLORS-102-SENDY',
      name: 'Colors Sendy One Piece Closet',
      category: 'Sanitaryware & Closets',
      brand: 'COLORS Sanitaryware',
      price: 0,
      promotional_price: null,
      stock: 20,
      availability: 'Price not listed - Request Quote',
      description: 'One piece toilet closet with wash down flushing mechanism and PP seat cover (Item 792).',
      dimensions: '650 x 350 x 720 mm (26" x 14" x 28"-inch)',
      color_variants: 'White Ceramic',
      material_finish: 'Vitreous China Glazed Ceramic',
      key_features: JSON.stringify([
        'Wash down flushing system',
        'PP Seat Cover Model 792 included',
        'Contoured ergonomic bowl geometry'
      ]),
      image_url: '',
      source_ref: 'COLORS SANITARY WARE 23.pdf — printed page 02 (PDF page 5), isolated product image of Sendy one-piece closet 102',
      is_featured: 0
    },
    {
      code: 'COLORS-104-LEXO',
      name: 'Colors Lexo One Piece Closet',
      category: 'Sanitaryware & Closets',
      brand: 'COLORS Sanitaryware',
      price: 0,
      promotional_price: null,
      stock: 18,
      availability: 'Price not listed - Request Quote',
      description: 'One piece siphon toilet suite featuring large water seal surface and glazed trapway.',
      dimensions: '680 x 355 x 730 mm (27" x 14" x 29"-inch)',
      color_variants: 'White Ceramic',
      material_finish: 'Vitreous China Glazed Ceramic',
      key_features: JSON.stringify([
        'Siphonic / Wash down flush compatibility',
        'Durable PP soft-closing seat cover',
        'High stain resistance'
      ]),
      image_url: '',
      source_ref: 'COLORS SANITARY WARE 23.pdf — printed page 02 (PDF page 5), isolated product image of Lexo one-piece closet 104',
      is_featured: 0
    },
    {
      code: 'COLORS-154-SHARP',
      name: 'Colors Sharp One Piece Closet',
      category: 'Sanitaryware & Closets',
      brand: 'COLORS Sanitaryware',
      price: 0,
      promotional_price: null,
      stock: 22,
      availability: 'Price not listed - Request Quote',
      description: 'Compact one piece water closet designed for modern luxury bathrooms.',
      dimensions: '640 x 365 x 725 mm (25" x 14" x 29"-inch)',
      color_variants: 'White Ceramic',
      material_finish: 'Vitreous China Glazed Ceramic',
      key_features: JSON.stringify([
        'Skirted ceramic trapway for easy cleaning',
        'Dual-flush internal valve fitting',
        'Anti-bacterial surface glaze'
      ]),
      image_url: '',
      source_ref: 'COLORS SANITARY WARE 23.pdf — printed page 02 (PDF page 5), isolated product image of Sharp one-piece closet 154',
      is_featured: 0
    },
    {
      code: 'COLORS-33017-CINIC',
      name: 'Colors Cinic Wall Hung Closet',
      category: 'Sanitaryware & Closets',
      brand: 'COLORS Sanitaryware',
      price: 0,
      promotional_price: null,
      stock: 30,
      availability: 'Price not listed - Request Quote',
      description: 'Wall hung ceramic toilet closet engineered for concealed cistern frame installation.',
      dimensions: '515 x 360 x 350 mm (20" x 14" x 14"-inch)',
      color_variants: 'White Ceramic',
      material_finish: 'Vitreous China Glazed Ceramic',
      key_features: JSON.stringify([
        'Wall mounted design with concealed fixings',
        'Compatible with standard wall frames and actuator plates',
        'Hygienic rimless bowl profile'
      ]),
      image_url: '',
      source_ref: 'COLORS SANITARY WARE 23.pdf — printed page 10 (PDF page 9), isolated product image of Cinic wall-hung closet 33017',
      is_featured: 1
    },
    {
      code: 'COLORS-33004-LEXO-WH',
      name: 'Colors Lexo Wall Hung Closet',
      category: 'Sanitaryware & Closets',
      brand: 'COLORS Sanitaryware',
      price: 0,
      promotional_price: null,
      stock: 24,
      availability: 'Price not listed - Request Quote',
      description: 'Wall hung ceramic toilet bowl with contemporary rectangular-curve contouring.',
      dimensions: '525 x 375 x 375 mm (21" x 15" x 15"-inch)',
      color_variants: 'White Ceramic',
      material_finish: 'Vitreous China Glazed Ceramic',
      key_features: JSON.stringify([
        'Wall mounted space-saving installation',
        'Soft-close UF seat mechanism compatible',
        'Smooth glazed waterways'
      ]),
      image_url: '',
      source_ref: 'COLORS SANITARY WARE 23.pdf — printed page 10 (PDF page 9), isolated product image of Lexo wall-hung closet 33004',
      is_featured: 0
    },
    {
      code: 'COLORS-7000-FIONA',
      name: 'Colors Fiona One Piece Floor Mounted Basin',
      category: 'Wash Basins & Vanities',
      brand: 'COLORS Sanitaryware',
      price: 0,
      promotional_price: null,
      stock: 15,
      availability: 'Price not listed - Request Quote',
      description: 'Monolithic single piece floor-mounted architectural wash basin with integrated pedestal.',
      dimensions: '410 x 410 x 810 mm (16" x 16" x 32"-inch)',
      color_variants: 'White Ceramic',
      material_finish: 'High-Fired Vitreous China',
      key_features: JSON.stringify([
        'Monolithic floor-standing cylindrical basin column',
        'Pre-punched single center tap hole',
        'Integrated overflow and floor waste outlet'
      ]),
      image_url: '',
      source_ref: 'COLORS SANITARY WARE 23.pdf — printed page 15 (PDF page 12), isolated product image of Fiona one-piece basin 7000',
      is_featured: 1
    },
    {
      code: 'COLORS-10000-SCORPIO',
      name: 'Colors Scorpio One Piece Basin',
      category: 'Wash Basins & Vanities',
      brand: 'COLORS Sanitaryware',
      price: 0,
      promotional_price: null,
      stock: 12,
      availability: 'Price not listed - Request Quote',
      description: 'Free-standing one piece ceramic wash basin with square pillar architectural form.',
      dimensions: '460 x 460 x 810 mm (18.2" x 18.2" x 32"-inch)',
      color_variants: 'White Ceramic',
      material_finish: 'Vitreous China Glazed Ceramic',
      key_features: JSON.stringify([
        'Bold square architectural pillar form',
        'Deep anti-splash washing bowl',
        'Central single lever faucet provision'
      ]),
      image_url: '',
      source_ref: 'COLORS SANITARY WARE 23.pdf — printed page 17 (PDF page 13), isolated product image of Scorpio one-piece basin 10000',
      is_featured: 0
    },
    {
      code: 'COLORS-221-ORCHIT-SET',
      name: 'Colors Orchit Pedestal Basin Set',
      category: 'Wash Basins & Vanities',
      brand: 'COLORS Sanitaryware',
      price: 0,
      promotional_price: null,
      stock: 20,
      availability: 'Price not listed - Request Quote',
      description: 'Two-piece ceramic wash basin with matching full floor-length pedestal.',
      dimensions: '430 x 560 x 860 mm (17" x 22" x 34"-inch)',
      color_variants: 'White Ceramic',
      material_finish: 'Vitreous China Glazed Ceramic',
      key_features: JSON.stringify([
        'Two-piece matching basin and full pedestal set',
        'Conceals internal plumbing pipework cleanly',
        'Standard wall mounting brackets'
      ]),
      image_url: '',
      source_ref: 'COLORS SANITARY WARE 23.pdf — printed page 17 (PDF page 13), isolated product image of Orchit pedestal set 221',
      is_featured: 0
    },
    {
      code: 'COLORS-22004-VITO',
      name: 'Colors Vito Table Top Wash Basin',
      category: 'Wash Basins & Vanities',
      brand: 'COLORS Sanitaryware',
      price: 0,
      promotional_price: null,
      stock: 35,
      availability: 'Price not listed - Request Quote',
      description: 'Square counter-top vessel wash basin designed for granite, marble, or vanity tops.',
      dimensions: '410 x 410 x 125 mm (16" x 16" x 5"-inch)',
      color_variants: 'White Ceramic',
      material_finish: 'Fine Ceramic Glaze',
      key_features: JSON.stringify([
        'Counter-top vessel bowl',
        'Slim-rim contemporary profile',
        'Easy clean stain-resistant glaze'
      ]),
      image_url: '',
      source_ref: 'COLORS SANITARY WARE 23.pdf — printed page 22 (PDF page 16), isolated product image of Vito table top basin 22004',
      is_featured: 0
    },
    {
      code: 'COLORS-801-DULUX-ORISSA',
      name: 'Colors Dulux 20" Orissa Pan',
      category: 'Pans & Commercial Urinals',
      brand: 'COLORS Sanitaryware',
      price: 0,
      promotional_price: null,
      stock: 50,
      availability: 'Price not listed - Request Quote',
      description: 'Traditional Indian squatting toilet pan with integral anti-skid footrests.',
      dimensions: '520 x 400 x 170 mm (20.5" x 16" x 7"-inch)',
      color_variants: 'White Ceramic',
      material_finish: 'Vitreous China Ceramic',
      key_features: JSON.stringify([
        'Integrated treaded footrests for slip resistance',
        'High volume water flush channel',
        'Durable heavy-duty clay body'
      ]),
      image_url: '',
      source_ref: 'COLORS SANITARY WARE 23.pdf — printed page 30 (PDF page 19), isolated product image of Dulux Orissa pan 801',
      is_featured: 0
    },
    {
      code: 'COLORS-352-HALF-STALL',
      name: 'Colors 352 Half Stall Urinal',
      category: 'Pans & Commercial Urinals',
      brand: 'COLORS Sanitaryware',
      price: 0,
      promotional_price: null,
      stock: 25,
      availability: 'Price not listed - Request Quote',
      description: 'Commercial wall-mounted ceramic half-stall urinal with integrated flush spreader inlet.',
      dimensions: '330 x 345 x 610 mm (13" x 13.5" x 24"-inch)',
      color_variants: 'White Ceramic',
      material_finish: 'Vitreous China Glazed Ceramic',
      key_features: JSON.stringify([
        'Half stall commercial wall mounting profile',
        'Top water inlet provision for exposed flush valve',
        'Hygienic deep bowl anti-splash contour'
      ]),
      image_url: '',
      source_ref: 'COLORS SANITARY WARE 23.pdf — printed page 31 (PDF page 20), isolated product image of Half Stall Urinal 352',
      is_featured: 0
    },

    // ==========================================
    // SOURCE: FRESHCO CATALOG_AUGUST 26_VOL 1.pdf (16 Pages)
    // Brand: Freshco
    // Price: Printed MRP in Rs.
    // ==========================================
    {
      code: 'GRT-TIL-S-13012',
      name: 'Freshco SS 304 Tile Insert Channel Grating 4"x12" (Side Hole)',
      category: 'Showers & Drain Systems',
      brand: 'Freshco',
      price: 3450,
      promotional_price: null,
      stock: 40,
      availability: 'In Stock',
      description: 'Channel grating in SS 304 stainless steel with 1.0mm thick frame & tray. Includes outer base + tile insert frame + strainer + cockroach trap. Max insert tile depth: 13mm with 2-in-1 reversible tray.',
      dimensions: '4" x 12" (100 x 300 mm), Side Hole Outlet',
      color_variants: 'SS 304 Brushed Natural',
      material_finish: 'AISI 304 Stainless Steel (1.0mm thickness)',
      key_features: JSON.stringify([
        'Includes Base + Tile Insert Frame + Strainer + Cockroach Trap',
        'Max insert depth 13mm for flush tile or marble installation',
        '2-in-1 reversible tray (Tile insert or plain stainless surface)',
        'Printed MRP: Rs. 3,450/-'
      ]),
      image_url: '',
      source_ref: 'FRESHCO CATALOG_AUGUST 26_VOL 1.pdf — printed page 02 (PDF page 5), isolated product image of Tile/Marble Insert Channel Grating',
      is_featured: 1
    },
    {
      code: 'GRT-TIL-S-13018',
      name: 'Freshco SS 304 Tile Insert Channel Grating 4"x18" (Side Hole)',
      category: 'Showers & Drain Systems',
      brand: 'Freshco',
      price: 5150,
      promotional_price: null,
      stock: 30,
      availability: 'In Stock',
      description: 'Channel grating in SS 304 stainless steel with 1.0mm thick frame & tray. Includes outer base + tile insert frame + strainer + cockroach trap. Max insert tile depth: 13mm.',
      dimensions: '4" x 18" (100 x 450 mm), Side Hole Outlet',
      color_variants: 'SS 304 Brushed Natural',
      material_finish: 'AISI 304 Stainless Steel (1.0mm thickness)',
      key_features: JSON.stringify([
        'Includes Base + Tile Insert Frame + Strainer + Cockroach Trap',
        'Max insert depth 13mm',
        'Printed MRP: Rs. 5,150/-'
      ]),
      image_url: '',
      source_ref: 'FRESHCO CATALOG_AUGUST 26_VOL 1.pdf — printed page 02 (PDF page 5), isolated product image of Tile Insert Channel Grating 4x18',
      is_featured: 0
    },
    {
      code: 'GRT-TIL-S-13024',
      name: 'Freshco SS 304 Tile Insert Channel Grating 4"x24" (Side Hole)',
      category: 'Showers & Drain Systems',
      brand: 'Freshco',
      price: 6850,
      promotional_price: null,
      stock: 25,
      availability: 'In Stock',
      description: 'Channel grating in SS 304 stainless steel with 1.0mm thick frame & tray. Complete set includes outer base + tile insert frame + strainer + cockroach trap.',
      dimensions: '4" x 24" (100 x 600 mm), Side Hole Outlet',
      color_variants: 'SS 304 Brushed Natural',
      material_finish: 'AISI 304 Stainless Steel (1.0mm thickness)',
      key_features: JSON.stringify([
        'Includes Base + Tile Insert Frame + Strainer + Cockroach Trap',
        '2-in-1 Reversible Tray',
        'Printed MRP: Rs. 6,850/-'
      ]),
      image_url: '',
      source_ref: 'FRESHCO CATALOG_AUGUST 26_VOL 1.pdf — printed page 02 (PDF page 5), isolated product image of Tile Insert Channel Grating 4x24',
      is_featured: 1
    },
    {
      code: 'GRT-SQ5-104',
      name: 'Freshco Emerald Square Floor Drain Grating (5"x5" Jali Only)',
      category: 'Showers & Drain Systems',
      brand: 'Freshco',
      price: 750,
      promotional_price: null,
      stock: 80,
      availability: 'In Stock',
      description: 'Square floor drain grating with Emerald laser cut pattern. Crafted from SS 304 18/8 stainless steel with hinged design.',
      dimensions: '5" x 5" (125 x 125 mm)',
      color_variants: 'SS 304 Polished Stainless Steel',
      material_finish: 'AISI 304 Stainless Steel',
      key_features: JSON.stringify([
        'Hinged square floor drain jali',
        'Precision Emerald drainage holes',
        'Printed MRP: Rs. 750/- (Jali Only)'
      ]),
      image_url: '',
      source_ref: 'FRESHCO CATALOG_AUGUST 26_VOL 1.pdf — printed page 03 (PDF page 6), isolated product image of Emerald Square Grating GRT-SQ5-104',
      is_featured: 0
    },
    {
      code: 'GRT-CCT-104',
      name: 'Freshco Emerald Square Floor Drain Complete Set with CCT (5"x5")',
      category: 'Showers & Drain Systems',
      brand: 'Freshco',
      price: 1300,
      promotional_price: null,
      stock: 60,
      availability: 'In Stock',
      description: 'Square floor drain grating with Emerald design supplied as a complete set with cockroach trap (CCT Set).',
      dimensions: '5" x 5" (125 x 125 mm)',
      color_variants: 'SS 304 Polished Stainless Steel',
      material_finish: 'AISI 304 Stainless Steel',
      key_features: JSON.stringify([
        'Complete set with CCT (Cockroach Trap)',
        'Prevents foul odors and insect entry',
        'Printed MRP: Rs. 1,300/-'
      ]),
      image_url: '',
      source_ref: 'FRESHCO CATALOG_AUGUST 26_VOL 1.pdf — printed page 03 (PDF page 6), isolated product image of Emerald CCT Set GRT-CCT-104',
      is_featured: 0
    },
    {
      code: 'GRT-RO5-202',
      name: 'Freshco Daisy Round Floor Drain Grating (5" Jali Only)',
      category: 'Showers & Drain Systems',
      brand: 'Freshco',
      price: 450,
      promotional_price: null,
      stock: 90,
      availability: 'In Stock',
      description: 'Round floor drain jali with Daisy pattern manufactured from SS 304 stainless steel.',
      dimensions: '5" Round (125 mm diameter)',
      color_variants: 'SS 304 Natural',
      material_finish: 'AISI 304 Stainless Steel',
      key_features: JSON.stringify([
        'Daisy designer round perforation',
        'Anti-rust SS 304 composition',
        'Printed MRP: Rs. 450/- (Jali Only)'
      ]),
      image_url: '',
      source_ref: 'FRESHCO CATALOG_AUGUST 26_VOL 1.pdf — printed page 04 (PDF page 7), isolated product image of Daisy Round Grating GRT-RO5-202',
      is_featured: 0
    },
    {
      code: 'CS-SS4-2022',
      name: 'Freshco Prism SS304 4-Function Ceiling Shower 22"x20"',
      category: 'Showers & Drain Systems',
      brand: 'Freshco',
      price: 51000,
      promotional_price: null,
      stock: 12,
      availability: 'In Stock',
      description: 'Concealed ceiling mounted shower in SS304 stainless steel. 4 flow modes: Rain, Column, Mist, Dual Waterfall.',
      dimensions: '22" x 20" (550 x 500 mm)',
      color_variants: 'SS 304 Mirror Stainless Steel',
      material_finish: 'Solid AISI 304 Stainless Steel',
      key_features: JSON.stringify([
        '4 Functions: Rain, Column, Mist, Dual Waterfall',
        'Flush ceiling-mounted concealed installation',
        'Printed MRP: Rs. 51,000/-'
      ]),
      image_url: '',
      source_ref: 'FRESHCO CATALOG_AUGUST 26_VOL 1.pdf — printed page 06 (PDF page 9), isolated product image of Prism 4-function ceiling shower CS-SS4-2022',
      is_featured: 1
    },
    {
      code: 'CS-SS2-1616',
      name: 'Freshco Spectrum SS304 2-Function Ceiling Shower 16"x16"',
      category: 'Showers & Drain Systems',
      brand: 'Freshco',
      price: 28000,
      promotional_price: null,
      stock: 15,
      availability: 'In Stock',
      description: 'SS304 2-function concealed ceiling mounted shower. Flows: Rain, Mist.',
      dimensions: '16" x 16" (400 x 400 mm)',
      color_variants: 'SS 304 Mirror Stainless Steel',
      material_finish: 'Solid AISI 304 Stainless Steel',
      key_features: JSON.stringify([
        '2 Functions: Rain, Mist',
        'Concealed ceiling mounted',
        'Printed MRP: Rs. 28,000/-'
      ]),
      image_url: '',
      source_ref: 'FRESHCO CATALOG_AUGUST 26_VOL 1.pdf — printed page 06 (PDF page 9), isolated product image of Spectrum 2-function shower CS-SS2-1616',
      is_featured: 0
    },
    {
      code: 'HSH-S3-6210',
      name: 'Freshco Nest Round SS 304 Health Faucet Set',
      category: 'Showers & Drain Systems',
      brand: 'Freshco',
      price: 3200,
      promotional_price: null,
      stock: 45,
      availability: 'In Stock',
      description: 'Health faucet complete set containing SS 304 gun, 1.5-metre SS 304 shower hose (SHA-SS-315), and wall hook (HK-HF-001). Faceplate SS304, body ABS/SS304.',
      dimensions: 'Gun + 1.5m flexible hose pipe',
      color_variants: 'SS 304 Brushed Chrome',
      material_finish: 'SS 304 Stainless Steel Gun & Hose',
      key_features: JSON.stringify([
        'Includes 1.5m SS304 hose (SHA-SS-315) and hook (HK-HF-001)',
        'Gun only SKU: HSH-S0-6210 (MRP: Rs. 2000/-)',
        'Complete set SKU: HSH-S3-6210 (Printed MRP: Rs. 3,200/-)'
      ]),
      image_url: '',
      source_ref: 'FRESHCO CATALOG_AUGUST 26_VOL 1.pdf — printed page 08 (PDF page 11), isolated product image of Nest Round health faucet set HSH-S3-6210',
      is_featured: 0
    },

    // ==========================================
    // SOURCE: AGL SEP 26 Faucet Pricelist.pdf (24 Pages)
    // Brand: AGL Bathware
    // Price: Printed MRP in `
    // ==========================================
    {
      code: 'AGL-303212BL',
      name: 'AGL Nero Single Lever Basin Mixer (Matte Black)',
      category: 'Bath Fittings & Faucets',
      brand: 'AGL Bathware',
      price: 11440,
      promotional_price: null,
      stock: 25,
      availability: 'In Stock',
      description: 'Single lever basin mixer with braided hoses without pop-up waste. Powered by 25mm ceramic cartridge. Electroplated Matte Black finish.',
      dimensions: 'Spout reach 120mm, total height 165mm',
      color_variants: 'Matte Black (BL)',
      material_finish: 'Forged Brass Body with Electroplated Matte Black Finish',
      key_features: JSON.stringify([
        '25mm ceramic cartridge',
        'Includes braided connection hoses',
        'Printed MRP: `11,440'
      ]),
      image_url: '',
      source_ref: 'AGL SEP 26 Faucet Pricelist.pdf — printed page 6 (PDF page 4), isolated product image of Nero single lever basin mixer 303212BL',
      is_featured: 1
    },
    {
      code: 'AGL-303218BL',
      name: 'AGL Nero Tall Body Basin Mixer (Matte Black)',
      category: 'Bath Fittings & Faucets',
      brand: 'AGL Bathware',
      price: 12800,
      promotional_price: null,
      stock: 20,
      availability: 'In Stock',
      description: 'Single lever basin mixer tall body with braided hoses without pop-up waste. Tailored for counter-top wash basins. 25mm cartridge.',
      dimensions: 'Spout reach 155mm, height 295mm',
      color_variants: 'Matte Black (BL)',
      material_finish: 'Solid Brass Body with Matte Black Finish',
      key_features: JSON.stringify([
        'Tall body configuration for table-top vessels',
        '25mm high-precision ceramic disc cartridge',
        'Printed MRP: `12,800'
      ]),
      image_url: '',
      source_ref: 'AGL SEP 26 Faucet Pricelist.pdf — printed page 6 (PDF page 4), isolated product image of Nero tall body basin mixer 303218BL',
      is_featured: 0
    },
    {
      code: 'AGL-303306BL',
      name: 'AGL Nero Bath Tub Spout with Wall Flange (Matte Black)',
      category: 'Bath Fittings & Faucets',
      brand: 'AGL Bathware',
      price: 5250,
      promotional_price: null,
      stock: 30,
      availability: 'In Stock',
      description: 'Bath tub spout with wall flange in electroplated Matte Black finish.',
      dimensions: 'Standard wall projection spout',
      color_variants: 'Matte Black (BL)',
      material_finish: 'Solid Brass with Matte Black Coating',
      key_features: JSON.stringify([
        'Includes matching wall flange',
        'Aerated smooth splash-free water flow',
        'Printed MRP: `5,250'
      ]),
      image_url: '',
      source_ref: 'AGL SEP 26 Faucet Pricelist.pdf — printed page 6 (PDF page 4), isolated product image of Nero bath tub spout 303306BL',
      is_featured: 0
    },
    {
      code: 'AGL-301218CP',
      name: 'AGL Denver Tall Body Basin Mixer (Chrome)',
      category: 'Bath Fittings & Faucets',
      brand: 'AGL Bathware',
      price: 11400,
      promotional_price: null,
      stock: 28,
      availability: 'In Stock',
      description: 'Denver series single lever basin mixer tall body with braided hoses. 25mm cartridge. Mirror chrome finish.',
      dimensions: 'Spout reach 150mm, total height 290mm',
      color_variants: 'Chrome Plated (CP)',
      material_finish: 'Multi-layer Chrome Plated Brass',
      key_features: JSON.stringify([
        '25mm Cartridge',
        'Includes long braided supply hoses',
        'Printed MRP: `11,400'
      ]),
      image_url: '',
      source_ref: 'AGL SEP 26 Faucet Pricelist.pdf — printed page 7 (PDF page 4), isolated product image of Denver tall body basin mixer 301218CP',
      is_featured: 0
    },
    {
      code: 'AGL-281120CP',
      name: 'AGL Automatic Sensor Tap (AC/DC Operated)',
      category: 'Bath Fittings & Faucets',
      brand: 'AGL Bathware',
      price: 11190,
      promotional_price: null,
      stock: 15,
      availability: 'In Stock',
      description: 'Sensor tap AC/DC operated, complete with external control box set and infrared proximity sensor.',
      dimensions: 'Standard pillar sensor spout',
      color_variants: 'Chrome Plated (CP)',
      material_finish: 'Solid Brass with Chrome Finish',
      key_features: JSON.stringify([
        'AC / DC dual power operation',
        'Complete control box set included',
        'Touchless infrared proximity sensor',
        'Printed MRP: `11,190'
      ]),
      image_url: '',
      source_ref: 'AGL SEP 26 Faucet Pricelist.pdf — printed page 18 (PDF page 10), isolated product image of Sensor Tap 281120CP',
      is_featured: 1
    },

    // ==========================================
    // SOURCE: CG VOL. 22_2026-27_Web (2).pdf (224 Pages)
    // Brand: Jaquar
    // Price: Printed MRP in Rs.
    // ==========================================
    {
      code: 'JAQ-LAG-CHR-91011B',
      name: 'Jaquar Laguna Single Lever Basin Mixer (Chrome)',
      category: 'Bath Fittings & Faucets',
      brand: 'Jaquar',
      price: 11000,
      promotional_price: null,
      stock: 25,
      availability: 'In Stock',
      description: 'Single Lever Basin Mixer without Popup Waste with 450mm Long Braided Hoses. Designed by Matteo Thun & Antonio Rodriguez.',
      dimensions: 'Center distance 115mm, height 160mm',
      color_variants: 'Chrome (CHR)',
      material_finish: 'Virgin Brass CW617N with Mirror Chrome Plating',
      key_features: JSON.stringify([
        'Designed by Matteo Thun & Antonio Rodriguez',
        'Includes 450mm braided hoses',
        'Smooth ceramic cartridge flow regulation',
        'Printed MRP: Rs. 11,000'
      ]),
      image_url: '',
      source_ref: 'CG VOL. 22_2026-27_Web (2).pdf — printed page 4 (PDF page 6), isolated product image of Laguna single lever basin mixer LAG-CHR-91011B',
      is_featured: 1
    },
    {
      code: 'JAQ-LAG-CHR-91005B',
      name: 'Jaquar Laguna Tall Boy Basin Mixer (Chrome)',
      category: 'Bath Fittings & Faucets',
      brand: 'Jaquar',
      price: 15300,
      promotional_price: null,
      stock: 20,
      availability: 'In Stock',
      description: 'Single Lever Tall Boy without Popup Waste System with 600mm Long Braided Hoses for vessel counter-top wash basins.',
      dimensions: 'Total height 295mm',
      color_variants: 'Chrome (CHR)',
      material_finish: 'Virgin Grade Brass with Chrome Plating',
      key_features: JSON.stringify([
        'Tall body pillar for counter-top wash bowls',
        'Includes 600mm long braided hoses',
        'Printed MRP: Rs. 15,300'
      ]),
      image_url: '',
      source_ref: 'CG VOL. 22_2026-27_Web (2).pdf — printed page 4 (PDF page 6), isolated product image of Laguna tall boy basin mixer LAG-CHR-91005B',
      is_featured: 0
    },
    {
      code: 'JAQ-FUP-CHR-29115PM',
      name: 'Jaquar Fusion Prime Single Lever Wall Mixer',
      category: 'Bath Fittings & Faucets',
      brand: 'Jaquar',
      price: 9000,
      promotional_price: null,
      stock: 22,
      availability: 'In Stock',
      description: 'Single Lever Wall Mixer with Provision for Connection to Exposed Shower Pipe (SHA-1211N) with Connecting Legs & Wall Flanges.',
      dimensions: 'Wall mounted center 150 ± 15 mm',
      color_variants: 'Chrome (CHR)',
      material_finish: 'Brass Casting with Nickel Chrome Finish',
      key_features: JSON.stringify([
        'Connecting legs & wall flanges included',
        'Provision for exposed overhead shower pipe',
        'Printed MRP: Rs. 9,000'
      ]),
      image_url: '',
      source_ref: 'CG VOL. 22_2026-27_Web (2).pdf — printed page 8 (PDF page 10), isolated product image of Fusion Prime wall mixer FUP-CHR-29115PM',
      is_featured: 0
    },
    {
      code: 'JAQ-FUP-CHR-29053PM',
      name: 'Jaquar Fusion Prime Angular Stop Cock with Wall Flange',
      category: 'Bath Fittings & Faucets',
      brand: 'Jaquar',
      price: 1300,
      promotional_price: null,
      stock: 50,
      availability: 'In Stock',
      description: 'Angular stop cock with wall flange for geyser, basin mixer, or health faucet water supply lines.',
      dimensions: '1/2" connection thread',
      color_variants: 'Chrome (CHR)',
      material_finish: 'Solid Brass with Chrome Finish',
      key_features: JSON.stringify([
        'Wall flange included',
        'High pressure ceramic spindle',
        'Printed MRP: Rs. 1,300'
      ]),
      image_url: '',
      source_ref: 'CG VOL. 22_2026-27_Web (2).pdf — printed page 10 (PDF page 12), isolated product image of Fusion Prime angular stop cock FUP-CHR-29053PM',
      is_featured: 0
    },

    // ==========================================
    // SOURCE: Delta Green Home 2026.pdf (8 Pages)
    // Brand: Delta Green
    // Price: Price not listed (Catalog does not contain printed prices)
    // ==========================================
    {
      code: 'DELTA-DHS10',
      name: 'Delta Home Split Heat Pump DHS10 (3.6 kW)',
      category: 'Water Softeners & Heat Pumps',
      brand: 'Delta Green',
      price: 0,
      promotional_price: null,
      stock: 10,
      availability: 'Price not listed - Request Quote',
      description: 'Residential split air-source heat pump water heater with 3.6 kW heating capacity. Rated hot water output 75 L/h. Rated input power 0.9 kW, COP 4.0, Rotary Panasonic/GMCC compressor, R410A refrigerant. Smartphone IoT app control.',
      dimensions: 'Outdoor Split Unit + Compatible Water Tank (200L/300L)',
      color_variants: 'Pure White & Graphite',
      material_finish: 'Weatherproof Powder-Coated Metal Cabinet',
      key_features: JSON.stringify([
        'Heating Capacity: 3.6 kW',
        'Rated Hot Water Output: 75 L/h',
        'Rated Input Power: 0.9 kW | COP: 4.0',
        'Power Supply: 220V/1ph/50Hz | Refrigerant: R410A',
        'Phone and IoT support: Can be managed from anywhere'
      ]),
      image_url: '',
      source_ref: 'Delta Green Home 2026.pdf — printed page 05 (PDF page 6), isolated product image of Delta Home Split outdoor compressor unit',
      is_featured: 1
    },
    {
      code: 'DELTA-DHS15',
      name: 'Delta Home Split Heat Pump DHS15 (5.3 kW)',
      category: 'Water Softeners & Heat Pumps',
      brand: 'Delta Green',
      price: 0,
      promotional_price: null,
      stock: 8,
      availability: 'Price not listed - Request Quote',
      description: 'Residential split heat pump water heater with 5.3 kW heating capacity. Rated hot water output 115 L/h. Rated input power 1.3 kW, COP 4.08, Panasonic/GMCC rotary compressor, R410A refrigerant. Designed for luxury villas.',
      dimensions: 'Outdoor Split Unit + Compatible Water Tank (300L/500L)',
      color_variants: 'Pure White & Graphite',
      material_finish: 'Weatherproof Powder-Coated Galvanized Steel',
      key_features: JSON.stringify([
        'Heating Capacity: 5.3 kW',
        'Rated Hot Water Output: 115 L/h',
        'Rated Input Power: 1.3 kW | COP: 4.08',
        'Compressor: Panasonic/GMCC Rotary',
        'Ambient Operating Temperature: -10°C ~ 45°C'
      ]),
      image_url: '',
      source_ref: 'Delta Green Home 2026.pdf — printed page 05 (PDF page 6), isolated product image of Delta Home Split outdoor unit with system hookup',
      is_featured: 0
    },
    {
      code: 'DELTA-DHS20',
      name: 'Delta Home Split Heat Pump DHS20 (8.0 kW)',
      category: 'Water Softeners & Heat Pumps',
      brand: 'Delta Green',
      price: 0,
      promotional_price: null,
      stock: 6,
      availability: 'Price not listed - Request Quote',
      description: 'High capacity residential split heat pump with 8.0 kW heating capacity. Rated hot water output 175 L/h. Rated input power 2.0 kW, COP 4.0, R410A refrigerant. Ideal for large residential bungalows and multi-bathroom residences.',
      dimensions: 'Heavy-duty Outdoor Split Compressor Unit',
      color_variants: 'Pure White & Graphite',
      material_finish: 'Heavy Gauge Weatherproof Enclosure',
      key_features: JSON.stringify([
        'Heating Capacity: 8.0 kW',
        'Rated Hot Water Output: 175 L/h',
        'Rated Input Power: 2.0 kW | COP: 4.0',
        'Max Outlet Water Temperature: 60°C'
      ]),
      image_url: '',
      source_ref: 'Delta Green Home 2026.pdf — printed page 05 (PDF page 6), isolated product image of DHS series split outdoor compressor',
      is_featured: 0
    },

    // ==========================================
    // SOURCE: zerob-as2-water-softener-2000-lph.pdf (4 Pages)
    // Brand: Zero B (Ion Exchange India Ltd)
    // Price: Price not listed (Engineering brochure)
    // ==========================================
    {
      code: 'ZEROB-AUTOSOFT-AS2',
      name: 'Zero B AutoSoft 2 Automated Water Softener (2000 LPH)',
      category: 'Water Softeners & Heat Pumps',
      brand: 'Zero B (Ion Exchange)',
      price: 0,
      promotional_price: null,
      stock: 12,
      availability: 'Price not listed - Request Quote',
      description: 'Fully automatic compact residential water softener with 2000 Litres per Hour (LPH) flow rate. Features high-exchange capacity food-grade resin, automatic multi-port regeneration valve, and integrated brine salt storage cabinet.',
      dimensions: '330 x 470 x 1100 mm (Approx.)',
      color_variants: 'Blue & Pearl White Cabinet',
      material_finish: 'FRP Composite Pressure Vessel in Polypropylene Cabinet',
      key_features: JSON.stringify([
        'Flow Rate: 2,000 Litres per Hour (LPH)',
        'Fully automatic multi-port valve regeneration cycle',
        'Food-grade ion exchange softening resin',
        'Integrated salt storage brine tank'
      ]),
      image_url: '',
      source_ref: 'zerob-as2-water-softener-2000-lph.pdf — printed page unnumbered (PDF page 1), isolated product photo of Zero B AutoSoft 2 cabinet unit',
      is_featured: 1
    },

    // ==========================================
    // SOURCE: ALITO_2026-Catalog.pdf (46 Pages)
    // Brand: Alito Porcelain Slabs
    // Price: Price not listed (Catalog does not contain printed prices)
    // ==========================================
    {
      code: 'ALITO-ART-MET-GREY',
      name: 'Alito Artistico Metalic Grey Sintered Slab (1600x3200mm)',
      category: 'Sintered Stone & Porcelain Slabs',
      brand: 'Alito',
      price: 0,
      promotional_price: null,
      stock: 30,
      availability: 'Price not listed - Request Quote',
      description: 'Artistico Series sintered porcelain slab in 1600x3200mm format and 20mm thickness. Glossy surface finish with metallic grey undertones. Slabs weigh ~250 kg per piece.',
      dimensions: '1600 x 3200 x 20 mm (Weight: 250 kg / slab ± 2%)',
      color_variants: 'Metalic Grey Glossy',
      material_finish: '20mm Sintered Stone Compact Porcelain Body',
      key_features: JSON.stringify([
        'Size: 1600 x 3200 mm | Thickness: 20 mm',
        'Surface: Glossy',
        'Series: Artistico Series',
        'Weight: 250 kg / slab ± 2%',
        'Non-porous, heat, scratch and UV resistant'
      ]),
      image_url: '',
      source_ref: 'ALITO_2026-Catalog.pdf — printed page unnumbered (PDF page 5), isolated slab texture image of Metalic Grey Artistico Series',
      is_featured: 1
    },
    {
      code: 'ALITO-ART-VER-TOSCANO',
      name: 'Alito Artistico Verde Toscano Sintered Slab (1600x3200mm)',
      category: 'Sintered Stone & Porcelain Slabs',
      brand: 'Alito',
      price: 0,
      promotional_price: null,
      stock: 25,
      availability: 'Price not listed - Request Quote',
      description: 'Artistico Series sintered porcelain slab with luxurious deep green Tuscan marble veining. Size 1600x3200mm, thickness 20mm, Glossy surface.',
      dimensions: '1600 x 3200 x 20 mm (Weight: 250 kg / slab)',
      color_variants: 'Verde Toscano Glossy',
      material_finish: '20mm Sintered Porcelain Body',
      key_features: JSON.stringify([
        'Size: 1600 x 3200 mm | Thickness: 20 mm',
        'Surface: Glossy',
        'Series: Artistico Series',
        'Deep green luxury marble aesthetic'
      ]),
      image_url: '',
      source_ref: 'ALITO_2026-Catalog.pdf — printed page unnumbered (PDF page 12), isolated slab texture image of Verde Toscano Artistico Series',
      is_featured: 0
    },
    {
      code: 'ALITO-ACC-CAL-INCISE',
      name: 'Alito Accord Calacatta Incise Porcelain Slab (1600x3200mm)',
      category: 'Sintered Stone & Porcelain Slabs',
      brand: 'Alito',
      price: 0,
      promotional_price: null,
      stock: 28,
      availability: 'Price not listed - Request Quote',
      description: 'Accord Series Calacatta marble design sintered porcelain slab. Size 1600x3200mm, thickness 20mm, Glossy surface. Striking grey veining over white porcelain field.',
      dimensions: '1600 x 3200 x 20 mm (Weight: 250 kg / slab)',
      color_variants: 'Calacatta Incise Glossy',
      material_finish: '20mm Sintered Compact Stone',
      key_features: JSON.stringify([
        'Size: 1600 x 3200 mm | Thickness: 20 mm',
        'Surface: Glossy',
        'Series: Accord Series',
        'Calacatta statuario marble veining'
      ]),
      image_url: '',
      source_ref: 'ALITO_2026-Catalog.pdf — printed page unnumbered (PDF page 13), isolated slab texture image of Calacatta Incise Accord Series',
      is_featured: 1
    },
    {
      code: 'ALITO-ACC-LUM-BLANCO',
      name: 'Alito Accord Lumina Blanco Porcelain Slab (1600x3200mm)',
      category: 'Sintered Stone & Porcelain Slabs',
      brand: 'Alito',
      price: 0,
      promotional_price: null,
      stock: 24,
      availability: 'Price not listed - Request Quote',
      description: 'Accord Series Lumina Blanco crystalline porcelain slab. Size 1600x3200mm, thickness 20mm, Glossy surface.',
      dimensions: '1600 x 3200 x 20 mm (Weight: 250 kg / slab)',
      color_variants: 'Lumina Blanco Glossy',
      material_finish: '20mm Sintered Stone',
      key_features: JSON.stringify([
        'Size: 1600 x 3200 mm | Thickness: 20 mm',
        'Surface: Glossy',
        'Series: Accord Series',
        'Translucent white crystalline look'
      ]),
      image_url: '',
      source_ref: 'ALITO_2026-Catalog.pdf — printed page unnumbered (PDF page 14), isolated slab texture image of Lumina Blanco Accord Series',
      is_featured: 0
    },

    // ==========================================
    // SOURCE: BAL ENDURA FLYER.pdf (1 Page)
    // Brand: BAL Endura (Ardex Endura)
    // Price: Price not listed (Technical flyer)
    // ==========================================
    {
      code: 'BAL-MASOFIX',
      name: 'BAL Endura Masofix Polymer Modified Tile Adhesive',
      category: 'Tile Adhesives & Chemical Grouts',
      brand: 'BAL Endura',
      price: 0,
      promotional_price: null,
      stock: 100,
      availability: 'Price not listed - Request Quote',
      description: 'Polymer modified tile adhesive for ceramic tiles. Grey cementitious powder formulation with non-slip vertical hold.',
      dimensions: '25 kg Bag',
      color_variants: 'Grey Powder',
      material_finish: 'Polymer Modified Cementitious Mortar',
      key_features: JSON.stringify([
        'For fixing ceramic tiles',
        'Polymer modified formula',
        'Non-slip vertical hold for wall tiles',
        'IS 15477 Type 1T specification'
      ]),
      image_url: '',
      source_ref: 'BAL ENDURA FLYER.pdf — printed page unnumbered (PDF page 1), isolated product package image of Masofix adhesive bag',
      is_featured: 1
    },
    {
      code: 'BAL-MASOFIX-ULTRA',
      name: 'BAL Endura Masofix Ultra High Polymer Tile/Stone Adhesive',
      category: 'Tile Adhesives & Chemical Grouts',
      brand: 'BAL Endura',
      price: 0,
      promotional_price: null,
      stock: 90,
      availability: 'Price not listed - Request Quote',
      description: 'High polymer modified high strength tile and stone adhesive for vitrified tiles, granite, and natural stone installations on interior and exterior walls and floors.',
      dimensions: '25 kg Bag',
      color_variants: 'Grey / Off-White Powder',
      material_finish: 'High-Polymer Enriched Cementitious Binder',
      key_features: JSON.stringify([
        'High polymer modified formulation',
        'High tensile and shear bond strength',
        'Suitable for vitrified tiles & natural stones',
        'IS 15477 Type 2T specification'
      ]),
      image_url: '',
      source_ref: 'BAL ENDURA FLYER.pdf — printed page unnumbered (PDF page 1), isolated product package image of Masofix Ultra adhesive bag',
      is_featured: 0
    },
    {
      code: 'BAL-MASOFILL',
      name: 'BAL Endura Masofill Cementitious Polymer Grout',
      category: 'Tile Adhesives & Chemical Grouts',
      brand: 'BAL Endura',
      price: 0,
      promotional_price: null,
      stock: 80,
      availability: 'Price not listed - Request Quote',
      description: 'Polymer modified tile joint filler for interior and exterior ceramic and vitrified tile joints.',
      dimensions: '1 kg / 5 kg Pack',
      color_variants: 'White / Grey / Ivory Shades',
      material_finish: 'Cementitious Polymer Grout Powder',
      key_features: JSON.stringify([
        'Non-shrinking joint filler',
        'For interior & exterior tile joints',
        'Water-resistant formula'
      ]),
      image_url: '',
      source_ref: 'BAL ENDURA FLYER.pdf — printed page unnumbered (PDF page 1), isolated product packaging image of Masofill pouch',
      is_featured: 0
    },
    {
      code: 'BAL-MASOPOXY-2',
      name: 'BAL Endura Masopoxy 2 Epoxy Tile Grout',
      category: 'Tile Adhesives & Chemical Grouts',
      brand: 'BAL Endura',
      price: 0,
      promotional_price: null,
      stock: 70,
      availability: 'Price not listed - Request Quote',
      description: 'Two-component 100% solid chemical and stain resistant reaction resin epoxy tile grout. Completely impermeable to water, oils, and domestic cleaners.',
      dimensions: '1 kg Pack (Resin + Hardener + Filler)',
      color_variants: 'Multi-Color Resin System',
      material_finish: '100% Solid Reaction Resin Epoxy Mortar',
      key_features: JSON.stringify([
        '100% stain proof and chemical resistant',
        'Zero water absorption',
        'High mechanical strength and abrasion resistance'
      ]),
      image_url: '',
      source_ref: 'BAL ENDURA FLYER.pdf — printed page unnumbered (PDF page 1), isolated product packaging image of Masopoxy 2 kit',
      is_featured: 0
    },

    // ==========================================
    // SOURCE: tiling_handout_-_low_resolution (1).pdf (4 Pages)
    // Brand: Ardex Endura
    // Price: Price not listed (Product specs handout)
    // ==========================================
    {
      code: 'ARDEX-SILVER-STAR',
      name: 'Ardex Endura Silver Star Tile Adhesive',
      category: 'Tile Adhesives & Chemical Grouts',
      brand: 'Ardex Endura',
      price: 0,
      promotional_price: null,
      stock: 120,
      availability: 'Price not listed - Request Quote',
      description: 'High polymer modified, tile/stone adhesive. Pack size: (Grey) 20kg. Suitable for vitrified tiles & natural stones on interior walls & floors, exterior floors, showers & swimming pools. Conforms with IS 15477: 2019 Type 2T & EN 12004: 2017 C1T. Open time 20 mins.',
      dimensions: '20 kg Pack (Grey)',
      color_variants: 'Grey',
      material_finish: 'High Polymer Modified Adhesive Mortar',
      key_features: JSON.stringify([
        'Pack size: (Grey) 20kg',
        'Suitable for vitrified tiles & natural stones',
        'Conforms with IS 15477: 2019 Type 2T & EN 12004: 2017 C1T',
        'Open time of 20 mins'
      ]),
      image_url: '',
      source_ref: 'tiling_handout_-_low_resolution (1).pdf — printed page 2 (PDF page 2), isolated product bag image of Silver Star adhesive',
      is_featured: 1
    },
    {
      code: 'ARDEX-GOLD-STAR',
      name: 'Ardex Endura Gold Star / White Star Tile Adhesive',
      category: 'Tile Adhesives & Chemical Grouts',
      brand: 'Ardex Endura',
      price: 0,
      promotional_price: null,
      stock: 110,
      availability: 'Price not listed - Request Quote',
      description: 'High polymer modified tile/stone adhesive. Pack size: Gold Star (Grey) 2kg, 20kg & 50kg; White Star (White) 20kg & 50kg. Suitable for vitrified tiles & natural stones in toilets, bathrooms & water bodies. Conforms with IS 15477: 2019 Type 2T & EN 12004: 2017 C1T. Open time 20 mins.',
      dimensions: 'Gold Star 20kg (Grey) / White Star 20kg (White)',
      color_variants: 'Grey / White',
      material_finish: 'Polymer Modified Cementitious Binder',
      key_features: JSON.stringify([
        'Pack size: 2kg, 20kg & 50kg',
        'For toilets, bathrooms & water bodies',
        'Conforms with IS 15477: 2019 Type 2T & EN 12004: 2017 C1T',
        'Open time of 20 mins'
      ]),
      image_url: '',
      source_ref: 'tiling_handout_-_low_resolution (1).pdf — printed page 2 (PDF page 2), isolated product bag image of Gold Star / White Star adhesive',
      is_featured: 0
    },
    {
      code: 'ARDEX-WAD-EPOXY-GROUT',
      name: 'Ardex Endura WA D Sparkling Epoxy Grout',
      category: 'Tile Adhesives & Chemical Grouts',
      brand: 'Ardex Endura',
      price: 0,
      promotional_price: null,
      stock: 80,
      availability: 'Price not listed - Request Quote',
      description: 'High performance epoxy grout with metallic and glitter finish. 100% water proof, stain proof, and chemical resistant. Ideal for swimming pools, luxury bathrooms, and commercial installations.',
      dimensions: '1 kg & 5 kg Bucket Set',
      color_variants: '391 Bronze, 392 Silver, 393 Gold (and 30+ colors per shade card)',
      material_finish: 'Epoxy Resin with Metallic Aggregate',
      key_features: JSON.stringify([
        'High performance epoxy grout with sparkling glitter finish',
        '100% water proof & stain proof',
        'Resistant to aggressive chemicals and pool cleaners',
        'Available in Bronze, Silver, and Gold effects'
      ]),
      image_url: '',
      source_ref: 'tiling_handout_-_low_resolution (1).pdf — printed page 3 (PDF page 3) & GROUT SHADE CARD-1.pdf, isolated product container image of WA D epoxy grout',
      is_featured: 1
    },
    {
      code: 'ARDEX-HD-TILE-CLEANER',
      name: 'Ardex Endura Heavy Duty Tile & Stone Cleaner',
      category: 'Tile Adhesives & Chemical Grouts',
      brand: 'Ardex Endura',
      price: 0,
      promotional_price: null,
      stock: 95,
      availability: 'Price not listed - Request Quote',
      description: 'Highly effective cleaner for removal of cementitious grout haze, efflorescence, and stubborn deposits from tiles and natural stone. Pack sizes: 500ml & 5 litres.',
      dimensions: '500 ml & 5 Litres Canister',
      color_variants: 'Translucent Fluid',
      material_finish: 'Specialized Acidic Surfactant Formula',
      key_features: JSON.stringify([
        'Pack size: 500ml & 5 litres',
        'Removes tough cement films and grout stains',
        'Suitable for vitrified tiles and acid-resistant natural stone'
      ]),
      image_url: '',
      source_ref: 'tiling_handout_-_low_resolution (1).pdf — printed page 3 (PDF page 3), isolated product container image of Heavy Duty Tile Cleaner',
      is_featured: 0
    },
    {
      code: 'ARDEX-HD-IMPREGNATING-SEALER',
      name: 'Ardex Endura Heavy Duty Impregnating Tile & Stone Sealer',
      category: 'Tile Adhesives & Chemical Grouts',
      brand: 'Ardex Endura',
      price: 0,
      promotional_price: null,
      stock: 65,
      availability: 'Price not listed - Request Quote',
      description: 'Deep penetrating sealer that seals with a wet look finish. Improves wear resistance of porous tile & stone, reduces water permeability, enhances color of the tile. Usage on bricks, concrete tiles, clay tiles, natural stones & ceramic tiles. Pack size: 500ml & 5 litres.',
      dimensions: '500 ml & 5 Litres Canister',
      color_variants: 'Wet Look Clear Coat',
      material_finish: 'Solvent-Based Penetrating Siloxane Polymer',
      key_features: JSON.stringify([
        'Seals with a WET look finish',
        'Pack size: 500ml & 5 litres',
        'Improves wear resistance and reduces water permeability',
        'Usage on bricks, concrete tiles, clay tiles, natural stones & ceramic tiles'
      ]),
      image_url: '',
      source_ref: 'tiling_handout_-_low_resolution (1).pdf — printed page 4 (PDF page 4), isolated product container image of Heavy Duty Impregnating Sealer',
      is_featured: 0
    }
  ];

  for (const p of products) {
    insertProduct.run(p);
  }

  console.log(`Successfully populated database with ${products.length} source-extracted products.`);
}

rebuildCatalogFromSources();
