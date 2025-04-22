
const TrustedBy = () => {
  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-base font-medium text-gray-500">
          Trusted by leading brands and startups
        </p>
        <div className="mt-6 grid grid-cols-2 gap-8 md:grid-cols-6 lg:grid-cols-5">
          <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
            <span className="text-xl font-bold text-gray-400">Microsoft</span>
          </div>
          <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
            <span className="text-xl font-bold text-gray-400">Airbnb</span>
          </div>
          <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
            <span className="text-xl font-bold text-gray-400">Google</span>
          </div>
          <div className="col-span-1 flex justify-center md:col-span-3 lg:col-span-1">
            <span className="text-xl font-bold text-gray-400">NASDAQ</span>
          </div>
          <div className="col-span-2 flex justify-center md:col-span-3 lg:col-span-1">
            <span className="text-xl font-bold text-gray-400">GE</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustedBy;
