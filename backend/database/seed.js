const db = require('./db');
const bcrypt = require('bcryptjs');

function seedDatabase() {
  console.log('Seeding Aqua Ceramics enterprise database...');

  // 1. Seed Categories
  const catCount = db.prepare('SELECT COUNT(*) as count FROM categories').get();
  if (catCount.count === 0) {
    const insertCat = db.prepare('INSERT INTO categories (name, slug, description, image_url) VALUES (?, ?, ?, ?)');
    insertCat.run('Wash Basins', 'wash-basins', 'Architectural table-top, pedestal, and wall-mounted ceramic basins.', '/images/category_wash_basins.jpg');
    insertCat.run('Western Toilets / EWC', 'ewc-toilets', 'Rimless wall-hung EWCs, one-piece siphon closets, and ergonomic floor models.', '/images/category_ewc_toilets.jpg');
    insertCat.run('Other Sanitaryware', 'other-sanitaryware', 'Concealed cisterns, ceramic urinals, bidet fixtures, and accessories.', '/images/category_other_sanitaryware.jpg');
    console.log('Seeded 3 product categories.');
  }

  // 2. Seed Products
  const prodCount = db.prepare('SELECT COUNT(*) as count FROM products').get();
  if (prodCount.count === 0) {
    const insertStmt = db.prepare(`
      INSERT INTO products (
        code, name, category, brand, price, promotional_price, stock, availability,
        description, dimensions, color_variants, material_finish,
        key_features, image_url, is_featured, is_published
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `);

    const products = [
      {
        code: 'AC-EWC-101',
        name: 'Aqua Luxe Rimless Wall-Hung EWC',
        category: 'Western Toilets / EWC',
        brand: 'Aqua Ceramics',
        price: 12490,
        promotional_price: 11490,
        stock: 45,
        availability: 'In Stock',
        description: 'Premium vitreous china wall-hung Western toilet with rimless hygiene technology and ultra-quiet soft-close seat cover.',
        dimensions: '530 x 360 x 360 mm',
        color_variants: 'Alpine White, Glossy Ivory',
        material_finish: 'Vitreous China with Nano-Glaze Protection',
        key_features: JSON.stringify([
          'Rimless Design for 99.9% bacteriological protection',
          'Dual Flush System (3L / 6L) for maximum water saving',
          'UF Soft-Close Ergonomic Seat Cover',
          'Stain-Resistant Super Glazed Surface'
        ]),
        image_url: '/images/products/wall-hung-toilet.jpg',
        is_featured: 1
      },
      {
        code: 'AC-EWC-102',
        name: 'Aqua Comfort One-Piece Water Closet',
        category: 'Western Toilets / EWC',
        brand: 'Aqua Ceramics',
        price: 18990,
        promotional_price: 17490,
        stock: 30,
        availability: 'In Stock',
        description: 'Single-piece seamless ceramic floor-mounted EWC featuring Tornado Siphon flushing power and heavy-duty brass internal fittings.',
        dimensions: '680 x 370 x 740 mm',
        color_variants: 'Alpine White',
        material_finish: 'High-Density Ceramic with Anti-Bacterial Glaze',
        key_features: JSON.stringify([
          'Seamless One-Piece Construction for easy cleaning',
          '360 Degree Tornado Siphon Flushing',
          'P-Trap / S-Trap universal installation compatibility',
          'Ergonomic comfort height seating'
        ]),
        image_url: '/images/products/one-piece-toilet.jpg',
        is_featured: 1
      },
      {
        code: 'AC-EWC-103',
        name: 'Aqua Royal Floor-Mounted EWC',
        category: 'Western Toilets / EWC',
        brand: 'Aqua Ceramics',
        price: 9850,
        promotional_price: null,
        stock: 60,
        availability: 'In Stock',
        description: 'Classic European water closet with coupled cistern and durable ceramic build designed for modern family bathrooms.',
        dimensions: '560 x 360 x 400 mm',
        color_variants: 'Alpine White, Pure White',
        material_finish: 'High-Gloss Ceramic',
        key_features: JSON.stringify([
          'Coupled cistern design with chrome flush actuator',
          'Quick-release seat hinges for easy sanitization',
          'Heavy impact load bearing rating up to 400kg',
          'Compatible with standard plumbing'
        ]),
        image_url: '/images/products/floor-mounted-ewc.jpg',
        is_featured: 0
      },
      {
        code: 'AC-EWC-104',
        name: 'Aqua Slim Tornado Wall-Hung Closet',
        category: 'Western Toilets / EWC',
        brand: 'Aqua Ceramics',
        price: 14200,
        promotional_price: 13200,
        stock: 25,
        availability: 'In Stock',
        description: 'Modern compact wall-mounted toilet bowl engineered for modern architectural spaces with minimal footprint.',
        dimensions: '520 x 355 x 360 mm',
        color_variants: 'Alpine White, Matte Black Edition',
        material_finish: 'Matte & Gloss Nano Ceramic',
        key_features: JSON.stringify([
          'Ultra-slim aerodynamic profile',
          'Dual nozzle whirlpool wash-down flush',
          'Heavy-duty stainless steel hinge fittings',
          'Eco-friendly 3.5L average flush capacity'
        ]),
        image_url: '/images/products/slim-toilet.jpg',
        is_featured: 1
      },
      {
        code: 'AC-WB-201',
        name: 'Aqua Crystal Ceramic Table-Top Wash Basin',
        category: 'Wash Basins',
        brand: 'Aqua Ceramics',
        price: 5490,
        promotional_price: 4990,
        stock: 50,
        availability: 'In Stock',
        description: 'Elegant rectangular counter-top wash bowl with smooth curved edges and deep basin depth to eliminate water splash.',
        dimensions: '480 x 370 x 130 mm',
        color_variants: 'Alpine White, Marble Texture',
        material_finish: 'Premium Vitrified Ceramic',
        key_features: JSON.stringify([
          'Deep splash-proof basin bowl',
          'Smooth rounded safety corners',
          'Over-counter easy silicone installation',
          'Scratch and chemical resistant surface coating'
        ]),
        image_url: '/images/products/table-top-basin.jpg',
        is_featured: 1
      },
      {
        code: 'AC-WB-202',
        name: 'Aqua Horizon Pedestal Wash Basin',
        category: 'Wash Basins',
        brand: 'Aqua Ceramics',
        price: 7990,
        promotional_price: null,
        stock: 40,
        availability: 'In Stock',
        description: 'Full floor pedestal ceramic wash basin featuring integrated tap hole, overflow port, and concealed pipe cavity.',
        dimensions: '560 x 450 x 830 mm',
        color_variants: 'Alpine White',
        material_finish: 'High-Gloss Glazed China',
        key_features: JSON.stringify([
          'Full length pedestal conceals all plumbing lines',
          'Integrated overflow safety outlet',
          'Pre-drilled central faucet hole',
          'Wide bowl deck for soap dispenser placement'
        ]),
        image_url: '/images/products/pedestal-basin.jpg',
        is_featured: 1
      },
      {
        code: 'AC-WB-203',
        name: 'Aqua Oval Matt-Finish Countertop Basin',
        category: 'Wash Basins',
        brand: 'Aqua Ceramics',
        price: 6750,
        promotional_price: 6200,
        stock: 35,
        availability: 'In Stock',
        description: 'Architectural oval vessel basin crafted with modern matte surface aesthetics for luxury Master suite bathrooms.',
        dimensions: '500 x 380 x 140 mm',
        color_variants: 'Matte Grey, Matte White, Alpine White',
        material_finish: 'Matte Ceramic Glaze',
        key_features: JSON.stringify([
          'Italian architectural oval silhouette',
          'Non-porous stain resistant ceramic body',
          'High thermal shock resistance',
          'Standard pop-up waste coupling compatible'
        ]),
        image_url: '/images/products/oval-basin.jpg',
        is_featured: 0
      },
      {
        code: 'AC-WB-204',
        name: 'Aqua Compact Wall-Hung Ceramic Basin',
        category: 'Wash Basins',
        brand: 'Aqua Ceramics',
        price: 3200,
        promotional_price: null,
        stock: 80,
        availability: 'In Stock',
        description: 'Space-saving wall-mounted ceramic basin ideal for powder rooms, guest restrooms, and compact commercial washrooms.',
        dimensions: '410 x 310 x 120 mm',
        color_variants: 'Alpine White',
        material_finish: 'High-Gloss Ceramic',
        key_features: JSON.stringify([
          'Compact depth footprint for tight spaces',
          'Heavy-duty wall mounting bolt points',
          'Integrated towel rack bar option',
          'Smooth wipe-clean interior'
        ]),
        image_url: '/images/products/wall-hung-basin.jpg',
        is_featured: 0
      },
      {
        code: 'AC-ST-301',
        name: 'Aqua Smart Concealed Dual-Flush Cistern',
        category: 'Other Sanitaryware',
        brand: 'Aqua Ceramics',
        price: 4890,
        promotional_price: 4490,
        stock: 70,
        availability: 'In Stock',
        description: 'In-wall concealed water tank with heavy-duty structural steel mounting frame for wall-hung EWCs.',
        dimensions: '500 x 120 x 1100 mm',
        color_variants: 'Chrome Actuator Plate',
        material_finish: 'HDPE Tank with Powder-Coated Steel Frame',
        key_features: JSON.stringify([
          'Tested to withstand 400kg wall load',
          'Ultra-quiet acoustic insulation wrapper',
          'Dual flush mechanism (3L / 6L) with pneumatic push button',
          'Easy front maintenance access hatch'
        ]),
        image_url: '/images/products/concealed-tank.jpg',
        is_featured: 1
      },
      {
        code: 'AC-ST-302',
        name: 'Aqua Eco Sensor Ceramic Urinal',
        category: 'Other Sanitaryware',
        brand: 'Aqua Ceramics',
        price: 8450,
        promotional_price: null,
        stock: 20,
        availability: 'In Stock',
        description: 'Commercial grade wall-mounted ceramic urinal with integrated infrared sensor for hygienic touchless flushing.',
        dimensions: '340 x 310 x 680 mm',
        color_variants: 'Alpine White',
        material_finish: 'Vitreous China with Hydro-Glaze',
        key_features: JSON.stringify([
          'Automated battery / AC touchless infrared flush sensor',
          'Internal trap prevents sewer gas reflux',
          'Splash-free back wall geometry',
          'Designed for high-traffic commercial installations'
        ]),
        image_url: '/images/products/ceramic-urinal.jpg',
        is_featured: 0
      },
      {
        code: 'AC-ST-303',
        name: 'Aqua Ceramic Bidet Closet Unit',
        category: 'Other Sanitaryware',
        brand: 'Aqua Ceramics',
        price: 11500,
        promotional_price: 10500,
        stock: 15,
        availability: 'In Stock',
        description: 'Dedicated ceramic bidet fixture with adjustable single-hole tap rim for maximum personal hygiene comfort.',
        dimensions: '540 x 360 x 390 mm',
        color_variants: 'Alpine White',
        material_finish: 'Vitreous China',
        key_features: JSON.stringify([
          'Precision flow water spray nozzle orifice',
          'Ergonomic contouring for user comfort',
          'Floor mounted with concealed fixing hardware',
          'Anti-microbial surface treatment'
        ]),
        image_url: '/images/products/bidet-unit.jpg',
        is_featured: 0
      },
      {
        code: 'AC-ST-304',
        name: 'Aqua Corner Ceramic Hand Wash Basin',
        category: 'Other Sanitaryware',
        brand: 'Aqua Ceramics',
        price: 3990,
        promotional_price: null,
        stock: 45,
        availability: 'In Stock',
        description: 'Ergonomic 90-degree corner ceramic basin designed to maximize unusable bathroom corner spaces efficiently.',
        dimensions: '400 x 400 x 150 mm',
        color_variants: 'Alpine White',
        material_finish: 'Glazed Porcelain',
        key_features: JSON.stringify([
          '90-Degree corner wall mount geometry',
          'Pre-drilled tap hole',
          'Includes overflow drainage system',
          'Heavy gloss scratch-resistant enamel'
        ]),
        image_url: '/images/products/corner-basin.jpg',
        is_featured: 0
      }
    ];

    for (const p of products) {
      insertStmt.run(
        p.code, p.name, p.category, p.brand, p.price, p.promotional_price,
        p.stock, p.availability, p.description, p.dimensions, p.color_variants,
        p.material_finish, p.key_features, p.image_url, p.is_featured
      );
    }
    console.log(`Seeded ${products.length} sanitaryware products.`);
  }

  // 3. Seed Users (Admin & Demo Customer)
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
  if (userCount.count === 0) {
    const adminHash = bcrypt.hashSync('AquaAdmin2026!', 10);
    const customerHash = bcrypt.hashSync('Customer123!', 10);

    const insertUser = db.prepare('INSERT INTO users (name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)');
    insertUser.run('Aqua Administrator', 'business@aquaceramics.in', '7019254016', adminHash, 'admin');
    insertUser.run('Vikram Sen (Demo Customer)', 'customer@example.com', '7019254016', customerHash, 'customer');

    // Sync admin_users
    const adminCheck = db.prepare('SELECT COUNT(*) as count FROM admin_users').get();
    if (adminCheck.count === 0) {
      db.prepare('INSERT INTO admin_users (username, password_hash, email, role) VALUES (?, ?, ?, ?)')
        .run('admin', adminHash, 'business@aquaceramics.in', 'Admin');
    }
    console.log('Seeded administrator and demo customer users.');
  }

  // 4. Seed Company Content (Editable Placeholders)
  const contentCount = db.prepare('SELECT COUNT(*) as count FROM company_content').get();
  if (contentCount.count === 0) {
    const insertContent = db.prepare('INSERT INTO company_content (key, value) VALUES (?, ?)');
    insertContent.run('overview', 'AQUA CERAMICS LLP is dedicated to transforming residential and commercial bathroom spaces through premium ceramic sanitaryware products. Our commitment centers on delivering superior aesthetic appeal, optimal water efficiency, and uncompromised structural reliability.');
    insertContent.run('vision', 'To establish Aqua Ceramics LLP as a benchmark of architectural elegance, ergonomics, and sustainable water management across the ceramic sanitaryware landscape.');
    insertContent.run('mission', 'To craft hygienic, ultra-durable vitreous china sanitaryware solutions that harmonize cutting-edge engineering with timeless comfort.');
    insertContent.run('leadership_status', 'Leadership profile coming soon (To be updated with verified corporate documentation)');
    insertContent.run('milestones', JSON.stringify([
      { date: 'Phase 1', title: 'Brand Conceptualization', description: 'Establishment of Aqua Ceramics LLP brand vision: Designed for Comfort, Built for Life.' },
      { date: 'Phase 2', title: 'Product Catalog Engineering', description: 'Development of rimless EWC closets and vitreous china nano-glaze wash basins.' },
      { date: 'Phase 3', title: 'Digital Platform Launch', description: 'Deployment of online catalogue, 3D interactive bathroom visualization, and dealer portal.' }
    ]));
    insertContent.run('values', JSON.stringify([
      { title: 'Ceramic Excellence', desc: 'High-density vitreous china fired at optimal temperatures for minimal porosity and maximum fracture toughness.' },
      { title: 'Eco-Friendly Engineering', desc: 'Dual-flush technology conserving up to 45% water without compromising siphon discharge velocity.' },
      { title: 'Architectural Ergonomics', desc: 'Human-centric contouring ensuring comfort, ease of cleaning, and universal accessibility.' },
      { title: 'Dealer Partnership', desc: 'Transparent commercial terms and seamless fulfillment for distributors, architects, and contractors.' }
    ]));
    console.log('Seeded company content placeholders.');
  }

  // 5. Seed Demonstration Projects & Installations
  const projCount = db.prepare('SELECT COUNT(*) as count FROM projects').get();
  if (projCount.count === 0) {
    const insertProj = db.prepare('INSERT INTO projects (title, category, location, description, image_url, products_used) VALUES (?, ?, ?, ?, ?, ?)');
    insertProj.run('Azure Heights Luxury Residences', 'Residential', 'Demonstration Installation [Sample]', 'Premium master suites equipped with Aqua Luxe Rimless EWCs and custom vessel basins.', '/images/hero_sanitaryware_banner.jpg', 'AC-EWC-101, AC-WB-201');
    insertProj.run('The Horizon Corporate Tower', 'Commercial', 'Demonstration Installation [Sample]', 'Touchless sensor urinals and concealed water-saving flush cistern systems.', '/images/category_other_sanitaryware.jpg', 'AC-ST-301, AC-ST-302');
    insertProj.run('Serene Bay Resort & Spa', 'Hospitality', 'Demonstration Installation [Sample]', 'Designer bathroom suites featuring oval matte countertop vessels and concealed bidets.', '/images/category_wash_basins.jpg', 'AC-WB-203, AC-ST-303');
    console.log('Seeded 3 demonstration installation projects.');
  }

  // 6. Seed Demonstration Partners
  const partCount = db.prepare('SELECT COUNT(*) as count FROM partners').get();
  if (partCount.count === 0) {
    const insertPart = db.prepare('INSERT INTO partners (name, category, website, description, logo_url, status) VALUES (?, ?, ?, ?, ?, ?)');
    insertPart.run('Architects Alliance Network', 'Architectural Advisory', 'https://example.com', 'Sample partnership entry: Specification and architectural consulting for luxury villas.', '/images/hero_sanitaryware_banner.jpg', 'Published');
    insertPart.run('Prime Hospitality Developers', 'Commercial Client', 'https://example.com', 'Sample partnership entry: Preferred sanitaryware partner for boutique hotel chains.', '/images/category_wash_basins.jpg', 'Published');
    console.log('Seeded demonstration partners.');
  }

  // 7. Seed Demo Order with Timeline History (For Order Tracking Demo)
  const ordCount = db.prepare('SELECT COUNT(*) as count FROM orders').get();
  if (ordCount.count === 0) {
    const demoRef = 'AQUA-ORD-20261012-7019';
    const insertOrd = db.prepare(`
      INSERT INTO orders (
        order_ref, customer_name, customer_phone, customer_email,
        address, city, state, postal_code, notes,
        total_amount, payment_method, payment_status, order_status, tracking_number
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const ordRes = insertOrd.run(
      demoRef, 'Vikram Sen', '7019254016', 'customer@example.com',
      'Flat 402, Royal Palms Apartment, MG Road', 'Bengaluru', 'Karnataka', '560001',
      'Please call before delivery', 17980, 'COD', 'Pending', 'Processing', 'TRK-AQUA-8831'
    );
    const ordId = ordRes.lastInsertRowid;

    // Order items
    db.prepare('INSERT INTO order_items (order_id, product_id, product_name, product_code, price, quantity, subtotal) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(ordId, 1, 'Aqua Luxe Rimless Wall-Hung EWC', 'AC-EWC-101', 12490, 1, 12490);
    db.prepare('INSERT INTO order_items (order_id, product_id, product_name, product_code, price, quantity, subtotal) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(ordId, 5, 'Aqua Crystal Ceramic Table-Top Wash Basin', 'AC-WB-201', 5490, 1, 5490);

    // Status timeline history
    const insertHistory = db.prepare('INSERT INTO order_status_history (order_id, status, notes, updated_by) VALUES (?, ?, ?, ?)');
    insertHistory.run(ordId, 'Order Placed', 'Customer placed order via website.', 'Customer');
    insertHistory.run(ordId, 'Order Confirmed', 'Order verified and confirmed by Aqua Logistics.', 'Admin');
    insertHistory.run(ordId, 'Processing', 'Sanitaryware units inspected for ceramic glaze quality and packaged.', 'Warehouse');
    console.log(`Seeded demo order with reference "${demoRef}" and tracking timeline.`);
  }

  // 8. Seed Demo B2B Inquiries & Leads
  const enqCount = db.prepare('SELECT COUNT(*) as count FROM enquiries').get();
  if (enqCount.count === 0) {
    const insertEnq = db.prepare(`
      INSERT INTO enquiries (
        name, phone, email, company_name, city, enquiry_type, product_of_interest, subject, message, status, admin_notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertEnq.run(
      'Ar. Sneha Deshmukh',
      '9820145672',
      'sneha@deshmukh-associates.com',
      'Deshmukh Architectural Studio',
      'Mumbai',
      'Project Quotation',
      'AC-EWC-101 (Aqua Luxe Rimless EWC)',
      'Luxury Villa Development Sanitaryware Specifications',
      'We are designing 14 luxury private residences in Alibaug. We require CAD specifications and commercial quotation for 42 units of rimless wall-hung EWCs and 28 table-top basins.',
      'New',
      'High-priority architecture lead. Reviewing CAD spec sheet dispatch.'
    );

    insertEnq.run(
      'Rajesh Khandelwal',
      '9811234567',
      'rajesh@khandelwalceramics.in',
      'Khandelwal Sanitary & Tile Gallery',
      'New Delhi',
      'Dealership Request',
      'Complete Aqua Ceramics Catalogue',
      'Exclusive Showroom Distributorship Inquiry - North Delhi',
      'We operate a 4,500 sq.ft tile and sanitaryware studio on Ring Road. Interested in becoming authorized display partners and distributors for Aqua Ceramics sanitaryware range.',
      'Contacted',
      'Spoke on 14th Oct. Shared dealer margins and display mock-up terms.'
    );

    insertEnq.run(
      'Karthik Venugopal',
      '9448123456',
      'procurement@sobha-projects.com',
      'Sobha Commercial Infra LLP',
      'Bengaluru',
      '3D Suite Specification',
      '3D Bathroom Architectural Suite',
      'Corporate Restroom Suite Fitting - 3 Floors',
      'Saw your interactive 3D Virtual Bathroom Studio online. We would like a formal quotation for the exact 3D suite setup (Wall-hung toilet, table-top basin, and concealed cistern) for 60 restroom stalls.',
      'In Discussion',
      'Sample units requested for inspection next week.'
    );

    console.log('Seeded 3 business leads & inquiries.');
  }

  // 9. Seed Demo Quotations
  const quoteCount = db.prepare('SELECT COUNT(*) as count FROM quotations').get();
  if (quoteCount.count === 0) {
    const insertQuote = db.prepare(`
      INSERT INTO quotations (
        quote_ref, product_name, quantity, customer_name, customer_phone, customer_email, message, status, proposed_price, admin_notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertQuote.run(
      'AQUA-QT-20261014-4821',
      'Aqua Luxe Rimless Wall-Hung EWC (AC-EWC-101)',
      50,
      'Sunil Mehta',
      '7019254016',
      'sunil@mehtabuilders.com',
      'Bulk requirement of 50 units for residential high-rise project. Request best commercial contractor rates.',
      'Under Review',
      550000,
      'Offered 12% bulk contractor concession.'
    );

    console.log('Seeded commercial quotation requests.');
  }

  console.log('Database seeding complete.');
}

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
