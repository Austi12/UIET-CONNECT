import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_50%)]"></div>
      
      <div className="w-full max-w-md relative z-10 animate-fadeIn">
        {/* Logo/Title */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 glow-white">
              <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 gradient-text">
            UIET Connect
          </h1>
          <p className="text-neutral-400 text-sm tracking-wide">Smart Campus Infrastructure Platform</p>
        </div>

        {/* Auth Card */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl glow-white">
          <Outlet />
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-neutral-500 text-xs">
            © 2024 UIET, Panjab University
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
