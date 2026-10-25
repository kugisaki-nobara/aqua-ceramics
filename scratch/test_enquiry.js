const testEnquiry = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Oberoi Realty Projects',
        phone: '9833445566',
        email: 'procurement@oberoi.com',
        company_name: 'Oberoi Realty',
        city: 'Mumbai',
        enquiry_type: 'Project Quotation',
        product_of_interest: 'AC-EWC-101',
        subject: 'Sanitaryware Tender - 80 Units',
        message: 'Requesting project rates and delivery timeline for 80 sets of rimless wall-hung closets for our Worli residential tower project.'
      })
    });
    const data = await res.json();
    console.log('Submission result:', data);

    const getRes = await fetch('http://localhost:3000/api/enquiries');
    const all = await getRes.json();
    console.log(`Current leads count: ${all.count}`);
    console.log('Latest lead:', all.data[0]);
  } catch (e) {
    console.error(e);
  }
};

testEnquiry();
