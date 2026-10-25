const db = require('./db');

try {
  const count = db.prepare('SELECT COUNT(*) as count FROM enquiries').get().count;
  if (count <= 1) {
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
      'Luxury Villa Development Specifications',
      'We require CAD specifications and commercial quotation for 42 units of rimless wall-hung EWCs and 28 table-top basins.',
      'New',
      'High-priority architecture lead. CAD spec sheet requested.'
    );

    insertEnq.run(
      'Rajesh Khandelwal',
      '9811234567',
      'rajesh@khandelwalceramics.in',
      'Khandelwal Sanitary & Tile Gallery',
      'New Delhi',
      'Dealership Request',
      'Complete Aqua Ceramics Range',
      'Exclusive Showroom Distributorship Inquiry',
      'Operating a 4,500 sq.ft showroom on Ring Road. Interested in dealership for Aqua Ceramics.',
      'Contacted',
      'Spoke on phone. Shared dealer margins and display mock-up terms.'
    );

    insertEnq.run(
      'Karthik Venugopal',
      '9448123456',
      'procurement@sobha-projects.com',
      'Sobha Commercial Infra LLP',
      'Bengaluru',
      '3D Bathroom Studio',
      '3D Bathroom Virtual Suite',
      'Corporate Restroom Suite Fitting - 3 Floors',
      'Saw your interactive 3D Virtual Bathroom Studio online. We would like a formal quotation for the exact 3D suite setup for 60 stalls.',
      'In Discussion',
      'Sample units scheduled for architect inspection.'
    );

    insertEnq.run(
      'Vikramaditya Builder Group',
      '9988776655',
      'contracts@vikramaditya.com',
      'Vikramaditya Infrastructure',
      'Hyderabad',
      'Project Quotation',
      'AC-WB-201 Table-Top Basins',
      'Bulk Purchase 120 Units Table-top Basins',
      'Immediate procurement needed for gated residential enclave.',
      'Converted',
      'Contract finalized for 120 units at project rates.'
    );

    console.log('Successfully seeded B2B demonstration leads.');
  } else {
    console.log(`Database already has ${count} leads.`);
  }
} catch (e) {
  console.error(e);
}
