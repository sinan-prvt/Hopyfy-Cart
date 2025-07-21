const About = () => {
  return (
    <div className="bg-gradient-to-br from-white to-blue-50 min-h-screen py-12 px-6">
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-xl p-10 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1">
          <img
            src="/about.jpg"
            alt="About Hopyfy"
            className="rounded-xl w-full object-cover"
          />
        </div>

        <div className="flex-1 text-gray-800">
          <h1 className="text-4xl font-bold mb-4 text-blue-800">About Us</h1>
          <p className="text-lg leading-relaxed mb-4">
            <strong>Hopyfy Cart</strong> is your trusted destination for quality products and seamless shopping experiences.
            We strive to provide a fast, secure, and joyful experience for every customer.
          </p>
          <p className="text-lg leading-relaxed mb-4">
            This platform is powered by <span className="font-semibold text-black">React</span>, <span className="font-semibold text-black">JSON Server</span>, and built with 💙 to help you explore modern e-commerce development.
          </p>
          <p className="text-lg leading-relaxed mb-6">
            Thank you for visiting. We hope you love browsing and shopping with us!
          </p>
          <a href="/product">
            <button className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800 transition duration-200">
              Explore Products
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
