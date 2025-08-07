import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const sliderImages = [
  {
    url: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=900&q=80',
    title: 'Empowering Education with Technology',
    subtitle: 'Seamless resource management for students, faculty, and admins.'
  },
  {
    url: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=900&q=80',
    title: 'Smart Instrument Checkout',
    subtitle: 'Reserve, track, and manage educational resources with ease.'
  },
  {
    url: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=900&q=80',
    title: 'For Every Role',
    subtitle: 'Personalized dashboards for admins, faculty, and students.'
  }
];

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % sliderImages.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);

  const handleGetStarted = () => {
    if (user) navigate('/dashboard');
    else navigate('/login');
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-emerald-100 min-h-screen">
      {/* Hero Banner with Slider */}
      <div className="relative w-full h-[420px] md:h-[500px] flex items-center justify-center overflow-hidden">
        {sliderImages.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute w-full h-full transition-opacity duration-700 ${idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <img
              src={slide.url}
              alt={slide.title}
              className="w-full h-full object-cover object-center brightness-75"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
              <h1 className="text-3xl md:text-5xl font-extrabold drop-shadow-lg mb-4 animate-fade-in">
                {slide.title}
              </h1>
              <p className="text-lg md:text-2xl font-medium drop-shadow-md mb-8 animate-fade-in delay-200">
                {slide.subtitle}
              </p>
              <button
                className="btn btn-primary btn-lg shadow-xl animate-fade-in delay-300"
                onClick={handleGetStarted}
              >
                Get Started
              </button>
            </div>
          </div>
        ))}
        {/* Slider Controls */}
        <button className="absolute left-4 top-1/2 -translate-y-1/2 btn btn-circle btn-outline" onClick={prevSlide}>
          ❮
        </button>
        <button className="absolute right-4 top-1/2 -translate-y-1/2 btn btn-circle btn-outline" onClick={nextSlide}>
          ❯
        </button>
        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
          {sliderImages.map((_, idx) => (
            <button
              key={idx}
              className={`w-3 h-3 rounded-full ${idx === current ? 'bg-primary' : 'bg-white/60'} border-2 border-white`}
              onClick={() => setCurrent(idx)}
            />
          ))}
        </div>
      </div>

      {/* About Section */}
      <section className="max-w-5xl mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Welcome to EduResource</h2>
          <p className="text-lg text-gray-600">
            EduResource is your one-stop platform for managing, reserving, and tracking educational instruments and resources. Whether you are a student, faculty, or admin, our system is designed to make your academic journey smoother and more efficient.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center hover:scale-105 transition-transform">
            <div className="bg-primary text-white rounded-full p-4 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3v1a3 3 0 006 0v-1c0-1.657-1.343-3-3-3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19 10v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6" /></svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy Checkout</h3>
            <p className="text-gray-600 text-center">Reserve and check out resources in just a few clicks. No paperwork, no hassle.</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center hover:scale-105 transition-transform">
            <div className="bg-secondary text-white rounded-full p-4 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m0 0H3" /></svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Role-Based Access</h3>
            <p className="text-gray-600 text-center">Admins, faculty, and students each get a personalized dashboard and features.</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center hover:scale-105 transition-transform">
            <div className="bg-accent text-white rounded-full p-4 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 018 0v2" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 7a4 4 0 110-8 4 4 0 010 8z" /></svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Notifications</h3>
            <p className="text-gray-600 text-center">Get notified about due dates, approvals, and important updates instantly.</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose EduResource?</h2>
            <p className="text-lg text-gray-600">Discover the benefits of our platform for your institution.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="flex items-start space-x-6">
              <div className="bg-primary text-white rounded-full p-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-1">Real-Time Availability</h4>
                <p className="text-gray-600">See which resources are available instantly and plan your projects better.</p>
              </div>
            </div>
            <div className="flex items-start space-x-6">
              <div className="bg-secondary text-white rounded-full p-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m4 4h-1v-4h-1m-4 4h-1v-4h-1" /></svg>
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-1">Secure & Reliable</h4>
                <p className="text-gray-600">Your data is protected and always available, with robust security and backups.</p>
              </div>
            </div>
            <div className="flex items-start space-x-6">
              <div className="bg-accent text-white rounded-full p-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg>
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-1">Usage History</h4>
                <p className="text-gray-600">Track your past checkouts and never lose track of your borrowed items.</p>
              </div>
            </div>
            <div className="flex items-start space-x-6">
              <div className="bg-primary text-white rounded-full p-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 018 0v2" /></svg>
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-1">Admin Controls</h4>
                <p className="text-gray-600">Admins can manage resources, approve requests, and monitor overdue items easily.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-50 to-emerald-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-800 mb-3 tracking-tight">Meet the Founders</h2>
            <p className="text-lg text-gray-500">The visionaries behind EduResource</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {/* Founder 1 */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center group transition-transform hover:-translate-y-2 hover:shadow-primary/30 border border-primary/10">
              <div className="relative mb-5">
                <img src="https://scontent.fcgp3-1.fna.fbcdn.net/v/t39.30808-6/481164461_1975401046293487_1949196131765593662_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeFHazgi_bvYCLCInele--XLwdkO29q_WUPB2Q7b2r9ZQ0dQAE7e9QNHOb_MwHgJKAmS0v1K3y1OYsMW7eKBbkRh&_nc_ohc=qH4fPgtstM0Q7kNvwFNVtvi&_nc_oc=AdnU-Xfbd2ieTVDnQTv3FvC-i2s_N2iCD-qU-fSFnGgM6vvvELux8K-zga_jUy4tL8Y&_nc_zt=23&_nc_ht=scontent.fcgp3-1.fna&_nc_gid=v-qrL30uiE6iTruZAJfuDQ&oh=00_AfXTQ3OKDCJk8lRP6ERc5TMhG7RseyeirGVAatbq5mqTzA&oe=689A3EEC" alt="Amit Sharma" className="w-32 h-32 rounded-full object-cover border-4 border-primary ring-4 ring-primary/20 shadow-lg transition-transform group-hover:scale-105" />
                <span className="absolute bottom-0 right-0 bg-primary text-white text-xs px-3 py-1 rounded-full shadow-md font-semibold">Founder</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1 text-center">Samsed Tareq Jami</h3>
              <p className="text-base text-gray-500 mb-2 text-center">Department of Computer Science and Engineering</p>
            </div>
            {/* Founder 2 */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center group transition-transform hover:-translate-y-2 hover:shadow-secondary/30 border border-secondary/10">
              <div className="relative mb-5">
                <img src="https://scontent.fcgp3-1.fna.fbcdn.net/v/t39.30808-1/525571605_2084666462277799_652843575075469458_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=100&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeFsoRJ9lRgZwauOl68rxgt5xFNqIgaW4AXEU2oiBpbgBWashLoKDK7xUaVcabUVAmMgxEe_xYu0vMZAy2b_27UX&_nc_ohc=wzMDS-oxxiIQ7kNvwFbEj_1&_nc_oc=AdnSM9oxQvGXwpbNaIU3cbQB6URj02DhUWjCSlXflmb4vhGWZ97XOu_l16Imm6Tqs-A&_nc_zt=24&_nc_ht=scontent.fcgp3-1.fna&_nc_gid=m6MDnrSFOWtakB2eC8OeCA&oh=00_AfWWgCOOtkt1tT6hCUgf_wKVv_83XeD7EU68PNvOCExDow&oe=689A459A" alt="Priya Verma" className="w-32 h-32 rounded-full object-cover border-4 border-secondary ring-4 ring-secondary/20 shadow-lg transition-transform group-hover:scale-105" />
                <span className="absolute bottom-0 right-0 bg-secondary text-white text-xs px-3 py-1 rounded-full shadow-md font-semibold">Co-Founder</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1 text-center">Asir Mahmud Ishmam</h3>
              <p className="text-base text-gray-500 mb-2 text-center">Department of Computer Science and Engineering</p>
            </div>
            {/* Founder 3 */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center group transition-transform hover:-translate-y-2 hover:shadow-accent/30 border border-accent/10">
              <div className="relative mb-5">
                <img src="https://scontent.fcgp3-2.fna.fbcdn.net/v/t39.30808-6/490638258_1404278570575386_123255659254208509_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGSt8bUDD4TmyCXt9t_MpbR56rKUvWR14HnqspS9ZHXgacdqMvRLwqu_JCGBUnBDo_NUdUN8q02vU39Ol37Vzqu&_nc_ohc=6i1AjomG1yIQ7kNvwExHKef&_nc_oc=AdkZg8lC0q3zgkvkJfg078dXzJiX4fNkrz3vhs-x62fxvktRDnTdFI3cp2i6VoBkgPE&_nc_zt=23&_nc_ht=scontent.fcgp3-2.fna&_nc_gid=g8mSvnE8a3pUS5rfhpGe8A&oh=00_AfWSrxrXudORhDdr4NqqOwHee7fS-zYIYr2W3sTMcEBjqA&oe=689A5398" alt="Rahul Singh" className="w-32 h-32 rounded-full object-cover border-4 border-accent ring-4 ring-accent/20 shadow-lg transition-transform group-hover:scale-105" />
                <span className="absolute bottom-0 right-0 bg-accent text-white text-xs px-3 py-1 rounded-full shadow-md font-semibold">Co-Founder</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1 text-center">Mohammad Abu Bakkar</h3>
              <p className="text-base text-gray-500 mb-2 text-center">Department of Computer Science and Engineering</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-emerald-50 to-blue-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600">Get started in just a few steps!</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center">
              <div className="bg-primary text-white rounded-full p-4 mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h4 className="font-semibold mb-2">Sign Up</h4>
              <p className="text-gray-600 text-center">Create your account as a student, faculty, or admin.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-secondary text-white rounded-full p-4 mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h4 className="font-semibold mb-2">Browse Resources</h4>
              <p className="text-gray-600 text-center">Explore available instruments and resources for your needs.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-accent text-white rounded-full p-4 mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h4 className="font-semibold mb-2">Request & Checkout</h4>
              <p className="text-gray-600 text-center">Submit a request and get approval for checkout.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary text-white rounded-full p-4 mb-4">
                <span className="text-2xl font-bold">4</span>
              </div>
              <h4 className="font-semibold mb-2">Track & Return</h4>
              <p className="text-gray-600 text-center">Track your usage and return items on time with reminders.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to get started?</h2>
          <p className="text-lg text-gray-600 mb-8">Join EduResource today and experience the future of educational resource management.</p>
          <button className="btn btn-primary btn-lg shadow-lg" onClick={handleGetStarted}>
            {user ? 'Go to Dashboard' : 'Sign Up Now'}
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;