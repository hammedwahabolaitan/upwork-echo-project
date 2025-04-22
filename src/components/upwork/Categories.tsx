
const Categories = () => {
  const categories = [
    {
      title: "Development & IT",
      skills: ["Web Development", "Mobile Development", "Game Development", "QA & Testing"]
    },
    {
      title: "Design & Creative",
      skills: ["Graphic Design", "UI/UX Design", "Animation", "Art & Illustration"]
    },
    {
      title: "Sales & Marketing",
      skills: ["Digital Marketing", "Social Media", "SEO", "Content Creation"]
    },
    {
      title: "Writing & Translation",
      skills: ["Content Writing", "Copywriting", "Translation", "Transcription"]
    },
    {
      title: "Admin & Customer Support",
      skills: ["Virtual Assistance", "Customer Service", "Data Entry", "Project Management"]
    },
    {
      title: "Finance & Accounting",
      skills: ["Accounting", "Bookkeeping", "Financial Analysis", "Tax Preparation"]
    }
  ];

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Browse talent by category
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Find professional freelancers and agencies in popular categories
          </p>
        </div>

        <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">{category.title}</h3>
              <ul className="mt-4 space-y-2">
                {category.skills.map((skill, skillIndex) => (
                  <li key={skillIndex}>
                    <a href="#" className="text-gray-600 hover:text-upwork-green">
                      {skill}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <a href="#" className="text-upwork-green hover:text-upwork-darkGreen font-medium">
                  Browse all {category.title} →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
