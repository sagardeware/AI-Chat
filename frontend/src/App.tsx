import { ChatWidget } from './components/ChatWidget';
import { AppointmentsList } from './components/AppointmentsList';
import { Sparkles } from 'lucide-react';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered Veterinary Care</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white">
              Welcome to Our Veterinary Clinic 🐾
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Providing compassionate care for your beloved pets since 2010
            </p>
          </div>

          {/* Appointments Section */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <AppointmentsList />
          </div>
        </div>
      </div>

      {/* Floating Chat Widget */}
      <ChatWidget />
    </div>
  );
}

export default App;
