import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-indigo-600">MyChannel</div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-indigo-600 transition">Home</a>
            <a href="#" className="text-gray-600 hover:text-indigo-600 transition">Videos</a>
            <a href="#" className="text-gray-600 hover:text-indigo-600 transition">About</a>
            <a href="#" className="text-gray-600 hover:text-indigo-600 transition">Contact</a>
          </div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
            Subscribe
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 flex flex-col items-center text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">Welcome to My Channel</h1>
        <p className="text-xl text-gray-600 max-w-2xl mb-10">
          Discover amazing content, tutorials, and insights. Join our community of creators and learners.
        </p>
        <div className="flex space-x-4">
          <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-indigo-700 transition">
            Watch Latest Video
          </button>
          <button className="border-2 border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg text-lg font-medium hover:bg-indigo-50 transition">
            View All Videos
          </button>
        </div>
      </section>

      {/* Featured Content */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Featured Content</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
              <div className="h-48 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
              <div className="p-6">
                <span className="text-sm text-indigo-600 font-medium">Tutorial</span>
                <h3 className="text-xl font-bold text-gray-800 mt-2 mb-3">Amazing Video Title {item}</h3>
                <p className="text-gray-600 mb-4">This is a brief description of the video content. Learn something new and exciting in this tutorial.</p>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">10K views</span>
                  <button className="text-indigo-600 font-medium hover:text-indigo-800 transition">Watch Now →</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">About My Channel</h2>
            <p className="text-lg text-gray-600 mb-8">
              Welcome to my corner of the internet! I create high-quality content to help you learn, grow, and be inspired. 
              My channel focuses on sharing knowledge, tutorials, and insights that matter to you.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">500K+</div>
                <div className="text-gray-600">Subscribers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">300+</div>
                <div className="text-gray-600">Videos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">10M+</div>
                <div className="text-gray-600">Views</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">5+</div>
                <div className="text-gray-600">Years</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subscribe Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-500 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Join Our Community</h2>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto mb-8">
            Subscribe to get notified about new videos and exclusive content.
          </p>
          <div className="max-w-md mx-auto flex">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 px-4 py-3 rounded-l-lg focus:outline-none"
            />
            <button className="bg-indigo-900 text-white px-6 py-3 rounded-r-lg font-medium hover:bg-indigo-800 transition">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">MyChannel</h3>
              <p className="text-gray-400">Creating amazing content for our community since 2019.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Navigation</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Videos</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Playlists</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">About</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Copyright</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition">YT</a>
                <a href="#" className="text-gray-400 hover:text-white transition">TW</a>
                <a href="#" className="text-gray-400 hover:text-white transition">IG</a>
                <a href="#" className="text-gray-400 hover:text-white transition">FB</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 MyChannel. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
