import Footer from './Footer';

const About = () => {
  const socialPlatforms = [
    { 
      label: "Facebook", 
      img: "./Icons/facebook.png",
      url: "https://www.facebook.com/profile.php?id=61573518617678"
    },
    { 
      label: "Instagram", 
      img: "./Icons/instagram.png",
      url: "https://www.instagram.com"
    },
    { 
      label: "Twitter", 
      img: "./Icons/twitter.png",
      url: "https://www.twitter.com"
    },
    { 
      label: "YouTube", 
      img: "./Icons/youtube.png",
      url: "https://www.youtube.com"
    }
  ];

  return (
    <>
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="flex flex-col md:flex-row">
              
              <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <h1 className="text-4xl md:text-5xl font-bold text-indigo-900 mb-6">
                  Journey of <span className="text-indigo-600">Hopyfy Cart</span>
                </h1>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Founded in 2020, Hopyfy began with a simple vision: to create a shopping experience that combines cutting-edge technology with human-centered design. Today, we serve millions of customers worldwide with our curated collection of quality products.
                </p>

                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="bg-indigo-50 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-indigo-700">10M+</div>
                    <div className="text-gray-600">Happy Customers</div>
                  </div>
                  <div className="bg-indigo-50 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-indigo-700">150+</div>
                    <div className="text-gray-600">Global Brands</div>
                  </div>
                  <div className="bg-indigo-50 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-indigo-700">24/7</div>
                    <div className="text-gray-600">Customer Support</div>
                  </div>
                </div>

                <a href="/product">
                  <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium px-8 py-3 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:-translate-y-1 shadow-lg">
                    Discover Our Collection
                  </button>
                </a>
              </div>

              <div className="md:w-1/2">
                <div className="h-full w-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center p-8">
                  <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl p-6 w-full max-w-md">
                    <img src={"./about.png"} alt="About Hopyfy" className="aspect-square bg-gray-200 border-2 border-dashed rounded-xl w-full" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-indigo-900 mb-4">Our Core Values</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              These principles guide everything we do at Hopyfy, from product selection to customer service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-indigo-50 transform transition-transform duration-300 hover:-translate-y-2">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <img src={"./Icons/achievement.png"} alt="Quality" className="h-12"/>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Quality First</h3>
              <p className="text-gray-600">
                We meticulously curate every product to ensure it meets our high standards for quality, durability, and design.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-indigo-50 transform transition-transform duration-300 hover:-translate-y-2">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <img src={"./Icons/rating.png"} alt="Customer" className="h-11"/> 
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Customer Obsession</h3>
              <p className="text-gray-600">
                Your satisfaction is our top priority. We listen, adapt, and go above and beyond to create exceptional experiences.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-indigo-50 transform transition-transform duration-300 hover:-translate-y-2">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <img src={"./Icons/sus.png"} alt="Sustainability" className="h-12"/> 
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Sustainable Growth</h3>
              <p className="text-gray-600">
                We're committed to ethical practices and minimizing our environmental impact at every step of our operations.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-20">
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <h2 className="text-3xl font-bold text-indigo-900 mb-4">Join Our Community</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Become part of the Hopyfy family! Follow us for exclusive deals, styling tips, and behind-the-scenes content.
            </p>

            <div className="flex justify-center space-x-6">
              {socialPlatforms.map((platform, index) => (
                <a 
                  key={index} 
                  href={platform.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex flex-col items-center group"
                  title={platform.label}
                >
                  <img 
                    src={platform.img} 
                    alt={platform.label} 
                    className="w-6 h-6 group-hover:scale-110 transition-transform"
                  />
                  <span className="text-sm mt-1">{platform.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default About;
