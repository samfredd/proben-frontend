export default function ServicesPage() {
  const services = [
    { id: 1, name: 'Remote Healthcare Support', description: '24/7 coordination and administrative support for your medical practice.', price: '$2,500' },
    { id: 2, name: 'Care Coordination', description: 'Assistance with patient scheduling and resource allocation.', price: '$1,800' },
    { id: 3, name: 'Billing & Claims Management', description: 'Streamlined invoicing and claims processing for assisted living facilities.', price: '$3,000' }
  ];

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-navy-900 mb-8">Our Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((service) => (
          <div key={service.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 border border-gray-100">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-navy-800 mb-4">{service.name}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-lime-600">{service.price}<span className="text-sm text-gray-400">/mo</span></span>
                <button className="bg-navy-900 text-white px-6 py-2 rounded-full font-semibold hover:bg-navy-800 transition-colors">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
