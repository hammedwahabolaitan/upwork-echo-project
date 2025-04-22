
const Testimonials = () => {
  const testimonials = [
    {
      quote: "Working with freelancers on Upwork has been essential for scaling our team quickly and efficiently. We find quality talent fast.",
      author: "John Smith",
      role: "Product Manager, TechCorp",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    {
      quote: "As a freelancer, Upwork has connected me with clients I never would have found on my own. My business has grown tremendously.",
      author: "Sarah Johnson",
      role: "Independent Designer",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg"
    },
    {
      quote: "The quality of freelancers on Upwork is unmatched. We've built a network of reliable professionals we can depend on.",
      author: "Michael Chen",
      role: "CEO, StartupX",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg"
    }
  ];

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Success stories from our community
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            See what clients and freelancers are saying about their Upwork experience
          </p>
        </div>

        <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <img 
                  className="h-12 w-12 rounded-full"
                  src={testimonial.avatar}
                  alt={testimonial.author}
                />
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-gray-900">{testimonial.author}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
              <blockquote>
                <p className="text-gray-600 italic">"{testimonial.quote}"</p>
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
