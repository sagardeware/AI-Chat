import { ChatWidget } from './components/ChatWidget';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Demo page content - This would be the host website */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to Our Veterinary Clinic 🐾
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Providing compassionate care for your beloved pets since 2010.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-blue-600">Our Services</h2>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Wellness Exams</li>
                <li>✓ Vaccinations</li>
                <li>✓ Surgery</li>
                <li>✓ Dental Care</li>
                <li>✓ Emergency Services</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-purple-600">Hours</h2>
              <ul className="space-y-2 text-gray-700">
                <li>Monday - Friday: 8AM - 6PM</li>
                <li>Saturday: 9AM - 4PM</li>
                <li>Sunday: Closed</li>
                <li>Emergency: 24/7</li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white shadow-xl">
            <h2 className="text-3xl font-bold mb-4">Need Help?</h2>
            <p className="text-lg mb-4">
              Our AI assistant is here to answer your questions and help you book appointments!
            </p>
            <p className="text-sm opacity-90">
              👉 Click the chat button in the bottom-right corner to get started.
            </p>
          </div>
        </div>
      </div>

      {/* Floating Chat Widget */}
      <ChatWidget />
    </div>
  );
}

export default App;
