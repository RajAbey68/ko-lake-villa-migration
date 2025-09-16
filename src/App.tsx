import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';

// Import page components from converted Next.js structure  
import HomePage from './pages/page';
import ContactPage from './pages/contact/page';
import GalleryPage from './pages/gallery/page';
import DealsPage from './pages/deals/page';
import DiningPage from './pages/dining/page';
import ExperiencesPage from './pages/experiences/page';
import FAQPage from './pages/faq/page';
import AccommodationPage from './pages/accommodation/page';
import AdminPage from './pages/admin/page';
import LoginPage from './pages/login/page';

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            {/* Main pages */}
            <Route path="/" element={<HomePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/deals" element={<DealsPage />} />
            <Route path="/dining" element={<DiningPage />} />
            <Route path="/experiences" element={<ExperiencesPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/accommodation" element={<AccommodationPage />} />
            
            {/* Admin and auth */}
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/*" element={<AdminPage />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Properties with dynamic routes */}
            <Route path="/properties/:propertyId" element={<PropertyPage />} />
            
            {/* Accommodation admin */}
            <Route path="/accommodation-admin" element={<AccommodationAdminPage />} />
            
            {/* Ko Lake Life */}
            <Route path="/ko-lake-life" element={<KoLakeLifePage />} />
            
            {/* Campaigns */}
            <Route path="/campaigns" element={<CampaignsPage />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

// Additional page components that need to be created
function PropertyPage() {
  return <div>Property Page - To be implemented</div>;
}

function AccommodationAdminPage() {
  return <div>Accommodation Admin - To be implemented</div>;
}

function KoLakeLifePage() {
  return <div>Ko Lake Life - To be implemented</div>;
}

function CampaignsPage() {
  return <div>Campaigns - To be implemented</div>;
}

function NotFound() {
  return <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-gray-600">Page not found</p>
    </div>
  </div>;
}