'use client';

import React, { useEffect, useState } from 'react';
import AccommodationCard from '@/components/AccommodationCard';
import { EditableSection } from '@/components/admin/EditableSection';
import { airbnbUrl } from '@/lib/airbnb';
import { getCheapestPrices } from '@/lib/cheapest-price';
import { Button } from '@/components/ui/button';
import { Edit, Eye } from 'lucide-react';

interface SectionContent {
  id: string;
  type: string;
  content: any;
}

export default function EditableAccommodationPage() {
  const [adminMode, setAdminMode] = useState(false);
  const [sections, setSections] = useState<Record<string, SectionContent>>({});
  const [loading, setLoading] = useState(true);

  const WHATSAPP = sections['contact-strip']?.content?.whatsapp || "https://wa.me/94717765780?text=Hello%20from%20Ko%20Lake%20Villa%20website";
  const MANAGER_PHONE = sections['contact-strip']?.content?.phone || "+94 71 776 5780";
  const MANAGER_TEL = `tel:${MANAGER_PHONE.replace(/\s/g, '')}`;

  // Load section content
  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    try {
      const response = await fetch('/api/admin/sections?page=accommodation');
      if (response.ok) {
        const sectionsArray = await response.json();
        const sectionsMap = sectionsArray.reduce((acc: Record<string, SectionContent>, section: SectionContent) => {
          acc[section.id] = section;
          return acc;
        }, {});
        setSections(sectionsMap);
      }
    } catch (error) {
      console.error('Error loading sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSectionSave = async (sectionId: string, content: any) => {
    try {
      const response = await fetch('/api/admin/sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionId, content })
      });

      if (response.ok) {
        const updated = await response.json();
        setSections(prev => ({
          ...prev,
          [sectionId]: updated
        }));
        alert('Section updated successfully!');
      }
    } catch (error) {
      console.error('Error saving section:', error);
      alert('Failed to save section');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const pageHeading = sections['page-heading']?.content || { title: 'Accommodation', subtitle: 'Open the Airbnb listing if you prefer to book there, or book direct below and save.' };
  const pricingData = sections['pricing-disclaimer']?.content || { title: 'Direct Booking Savings', description: 'Prices shown below are current Airbnb rates. Book direct with us and save automatically:', standardDiscount: 10, lastMinuteDiscount: 25 };
  const contactData = sections['contact-strip']?.content || { phone: '+94 71 776 5780', timezone: '(Sri Lanka, GMT+5:30)' };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 space-y-10">
      {/* Admin Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={() => setAdminMode(!adminMode)}
          variant={adminMode ? "default" : "outline"}
          size="sm"
        >
          {adminMode ? <Eye className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
          {adminMode ? 'Preview Mode' : 'Edit Mode'}
        </Button>
      </div>

      {/* Contact Strip - Editable */}
      <EditableSection 
        sectionId="contact-strip" 
        sectionType="contact" 
        content={contactData}
        
        
      >
        <section className="rounded-xl border bg-white p-4 flex flex-wrap items-center gap-3">
          <div className="text-sm">
            <span className="font-semibold">Manager:</span> {contactData.phone}
            <span className="ml-2 text-gray-500">{contactData.timezone}</span>
          </div>
          <div className="ml-auto flex gap-3">
            <a href={MANAGER_TEL} className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50">Call</a>
            <a href={WHATSAPP} target="_blank" rel="noopener" className="rounded-lg bg-green-600 text-white px-3 py-1.5 text-sm hover:opacity-90">WhatsApp</a>
          </div>
        </section>
      </EditableSection>

      {/* Page Heading - Editable */}
      <EditableSection 
        sectionId="page-heading" 
        sectionType="heading" 
        content={pageHeading}
        
        
      >
        <section className="rounded-2xl border bg-white p-5">
          <h1 className="text-2xl font-semibold mb-2">{pageHeading.title}</h1>
          <p className="text-gray-600 mb-4">{pageHeading.subtitle}</p>
          <ul className="space-y-1 text-sm">
            <li><strong>Entire Villa:</strong> <a className="underline" href={airbnbUrl('villa')} target="_blank" rel="noopener">airbnb.co.uk/h/eklv</a></li>
            <li><strong>Master Family Suite:</strong> <a className="underline" href={airbnbUrl('master')} target="_blank" rel="noopener">airbnb.co.uk/h/klv6</a></li>
            <li><strong>Triple/Twin Rooms:</strong> <a className="underline" href={airbnbUrl('triple')} target="_blank" rel="noopener">airbnb.co.uk/h/klv2or3</a></li>
          </ul>
          <p className="text-xs text-gray-500 mt-2">Tip: Click an URL to open in a new tab.</p>
        </section>
      </EditableSection>

      {/* Pricing Disclaimer - Editable */}
      <EditableSection 
        sectionId="pricing-disclaimer" 
        sectionType="pricing" 
        content={pricingData}
        
        
      >
        <section className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">💰</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-emerald-800 mb-2">{pricingData.title}</h3>
              <p className="text-emerald-700 mb-4">
                {pricingData.description}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded-lg p-3 border border-emerald-200">
                  <div className="text-sm font-medium text-emerald-800">Standard Direct Booking</div>
                  <div className="text-2xl font-bold text-emerald-600">Save {pricingData.standardDiscount}%</div>
                  <div className="text-xs text-emerald-600">{pricingData.standardLabel || 'Always available'}</div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-emerald-200">
                  <div className="text-sm font-medium text-emerald-800">Last-Minute Special</div>
                  <div className="text-2xl font-bold text-emerald-600">Save {pricingData.lastMinuteDiscount}%</div>
                  <div className="text-xs text-emerald-600">{pricingData.lastMinuteLabel || 'Sun-Wed, booked within 3 days'}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <a 
                  href="/deals" 
                  className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                >
                  Calculate Your Savings →
                </a>
                <div className="flex gap-2">
                  <a 
                    href={airbnbUrl('villa')} 
                    target="_blank" 
                    rel="noopener" 
                    className="inline-flex items-center px-3 py-2 border border-emerald-300 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors text-sm"
                  >
                    Compare on Airbnb
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </EditableSection>

      {/* Accommodation Cards - Each individually editable */}
      <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <EditableSection 
          sectionId="villa-card" 
          sectionType="card" 
          content={{ title: "Entire Villa Exclusive", guests: "16 guests (up to 24)", baseNight: 431, perks: ['Private pool', 'Lake views'], image: "/images/rooms/villa.jpg" }}
          
          
        >
          <AccommodationCard
            kind="villa"
            title="Entire Villa Exclusive"
            guests="16 guests (up to 24)"
            baseNight={431}
            perks={['Private pool', 'Lake views']}
            image="/images/rooms/villa.jpg"
          />
        </EditableSection>

        <EditableSection 
          sectionId="master-card" 
          sectionType="card" 
          content={{ title: "Master Family Suite", guests: "3 guests (up to 6)", baseNight: 119, perks: ['Lake view', 'Private balcony'], image: "/images/rooms/master.jpg" }}
          
          
        >
          <AccommodationCard
            kind="master"
            title="Master Family Suite"
            guests="3 guests (up to 6)"
            baseNight={119}
            perks={['Lake view', 'Private balcony']}
            image="/images/rooms/master.jpg"
          />
        </EditableSection>

        <EditableSection 
          sectionId="triple-card" 
          sectionType="card" 
          content={{ title: "Triple/Twin Rooms", guests: "3 guests (up to 4)", baseNight: 70, perks: ['Garden view', 'Twin/Triple beds'], image: "/images/rooms/triple.jpg" }}
          
          
        >
          <AccommodationCard
            kind="triple"
            title="Triple/Twin Rooms"
            guests="3 guests (up to 4)"
            baseNight={70}
            perks={['Garden view', 'Twin/Triple beds']}
            image="/images/rooms/triple.jpg"
          />
        </EditableSection>

        <EditableSection 
          sectionId="group-card" 
          sectionType="card" 
          content={{ title: "Group Room", guests: "5 guests (up to 8)", baseNight: 119, perks: ['Multiple beds', 'Shared space'], image: "/images/rooms/group.jpg" }}
          
          
        >
          <AccommodationCard
            kind="group"
            title="Group Room"
            guests="5 guests (up to 8)"
            baseNight={119}
            perks={['Multiple beds', 'Shared space']}
            image="/images/rooms/group.jpg"
          />
        </EditableSection>
      </section>

      {/* Benefits Section - Also editable */}
      <EditableSection 
        sectionId="benefits-section" 
        sectionType="text" 
        content={{ title: "Why Book Direct with Ko Lake Villa?", subtitle: "Skip the middleman and enjoy exclusive benefits unavailable on booking platforms" }}
        
        
      >
        <section className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-emerald-800 mb-3">Why Book Direct with Ko Lake Villa?</h2>
            <p className="text-emerald-700 text-lg">Skip the middleman and enjoy exclusive benefits unavailable on booking platforms</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Price Benefits */}
            <div className="bg-white rounded-xl p-5 border border-emerald-200">
              <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-white text-xl">💰</span>
              </div>
              <h3 className="text-lg font-semibold text-emerald-800 mb-2">Best Price Guarantee</h3>
              <ul className="text-emerald-700 text-sm space-y-1">
                <li>• 10% below best Airbnb rates</li>
                <li>• Up to 25% total savings</li>
                <li>• No booking fees or hidden charges</li>
                <li>• Last-minute specials (Sun-Wed)</li>
              </ul>
            </div>
          </div>
        </section>
      </EditableSection>
    </main>
  );
}