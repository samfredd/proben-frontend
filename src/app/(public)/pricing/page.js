export default function PricingPage() {
  const plans = [
    {
      name: 'Essential Support',
      price: '$1,500',
      description: 'Ideal for independent care providers and small practices.',
      features: ['Up to 2 remote staff', 'Email support', 'Basic scheduling', 'USD Payments']
    },
    {
      name: 'Standard Operations',
      price: '$3,500',
      description: 'Perfect for assisted living and behavioral health programs.',
      features: ['Up to 5 remote staff', 'Priority support', 'Advanced coordination', 'Invoice management']
    },
    {
      name: 'Enterprise Fleet',
      price: 'Custom',
      description: 'Scalable solutions for large home health agencies.',
      features: ['Unlimited staff', 'Dedicated manager', 'Full platform access', 'Custom integrations']
    }
  ];

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold text-navy-900 mb-4">Pricing Plans</h1>
        <p className="text-xl text-gray-600">Transparent solutions for healthcare organizations of all sizes.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div key={plan.name} className={`p-10 rounded-3xl border ${plan.name === 'Standard Operations' ? 'border-lime-500 ring-2 ring-lime-500 bg-white' : 'border-gray-200 bg-gray-50'}`}>
            <h3 className="text-2xl font-bold text-navy-800 mb-2">{plan.name}</h3>
            <div className="text-4xl font-extrabold text-lime-600 mb-4">{plan.price}</div>
            <p className="text-gray-600 mb-8">{plan.description}</p>
            <ul className="space-y-4 mb-10">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center text-gray-700">
                  <svg className="h-5 w-5 text-lime-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <button className={`w-full py-4 rounded-2xl font-bold transition-all ${plan.name === 'Standard Operations' ? 'bg-lime-600 text-white hover:bg-lime-700' : 'bg-navy-900 text-white hover:bg-navy-800'}`}>
              Get Started
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
