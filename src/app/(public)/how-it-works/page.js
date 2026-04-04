'use client';
import Link from 'next/link';

export default function HowItWorks() {
  const steps = [
    {
      title: "1. Organization Registration",
      description: "Sign up your healthcare organization in seconds. We verify your business details to ensure a secure B2B environment.",
      icon: "🏢"
    },
    {
      title: "2. Service Selection",
      description: "Browse our catalog of remote support services, from behavioral health coordination to administrative back-office support.",
      icon: "🔍"
    },
    {
      title: "3. Secure Payment",
      description: "Book services via our integrated Stripe portal. We handle all transactions in USD with full transparency.",
      icon: "💳"
    },
    {
      title: "4. Coordination & Delivery",
      description: "Access your meeting links directly from your dashboard. Our remote staff coordinates with you via Zoom or Google Meet.",
      icon: "🗓️"
    }
  ];

  return (
    <div className="bg-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold text-navy-900 mb-6">How Proben Works</h1>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto">
            A seamless bridge between U.S. healthcare facilities and expert remote support staff.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-xl transition-all group">
              <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">{step.icon}</div>
              <h3 className="text-xl font-bold text-navy-900 mb-4">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-24 text-center bg-navy-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Ready to streamline your coordination?</h2>
            <Link href="/signup" className="inline-block bg-lime-500 text-navy-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-lime-400 transition-colors shadow-lg shadow-lime-500/20">
              Get Started Now
            </Link>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-lime-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-lime-500/5 rounded-full -ml-48 -mb-48 blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}
