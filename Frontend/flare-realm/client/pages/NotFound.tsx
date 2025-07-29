import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-white font-cantata max-w-md mx-auto lg:max-w-lg xl:max-w-xl">
      {/* Header */}
      <div className="w-full h-[73px] bg-emergency-gray flex items-center justify-between px-4 lg:px-6">
        <div className="text-black text-xl font-normal">Emergency App</div>
      </div>

      {/* Not Found Content */}
      <div className="flex flex-col items-center justify-center px-6 py-16">
        <div className="w-[158px] h-[154px] bg-emergency-gray rounded-full flex items-center justify-center mb-8">
          <span className="text-black text-6xl font-normal">?</span>
        </div>

        <h1 className="text-black text-2xl font-normal text-center mb-4">
          Page Not Found
        </h1>

        <p className="text-black text-base font-normal text-center mb-8 max-w-sm">
          The page you're looking for doesn't exist. Please return to the
          emergency services page.
        </p>

        <Link
          to="/"
          className="bg-emergency-green hover:bg-green-400 transition-colors px-8 py-3 rounded-full"
        >
          <span className="text-black text-base font-normal">
            Return to Emergency Services
          </span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
