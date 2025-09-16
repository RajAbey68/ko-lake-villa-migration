'use client';
import React from 'react';
import { airbnbUrl } from '@/lib/airbnb';
import { computeDirect } from '@/lib/pricing';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';
// Admin mode disabled for production pages
// import { useAdminMode } from '@/hooks/useAdminMode';

type Props = {
  kind: 'villa'|'master'|'triple'|'group';
  title: string;
  guests: string;
  baseNight: number;
  perks: string[];
  image?: string; // optional hero per card
  onSave?: (id: string, value: string) => void;
};

export default function AccommodationCard({ kind, title, guests, baseNight, perks, image, onSave }: Props) {
  const price = computeDirect({ baseNight });
  const A = airbnbUrl(kind);
  // Admin mode disabled for production pages
  const adminMode = false;

  const handleContentSave = async (id: string, value: string) => {
    try {
      await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, type: 'text', value })
      });
      if (onSave) onSave(id, value);
    } catch (error) {
      console.error('Error saving content:', error);
    }
  };

  const handleImageSave = async (id: string, imageUrl: string) => {
    try {
      await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, type: 'image', value: imageUrl })
      });
      if (onSave) onSave(id, imageUrl);
    } catch (error) {
      console.error('Error saving image:', error);
    }
  };

  return (
    <article className="relative rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {image && (
        <EditableImage 
          id={`accommodation-card-image-${kind}`}
          src={image}
          alt={title}
          className="h-40 w-full object-cover"
          width={400}
          height={160}
          onSave={handleImageSave}
          adminMode={adminMode}
        />
      )}
      <div className="p-5">
        <div className="absolute right-3 top-3 rounded-full bg-red-500 text-white text-xs px-2 py-1">
          <EditableText 
            id={`accommodation-card-save-badge-${kind}`}
            initialValue={`Save ${price.totalPct}%`}
            element="span"
            onSave={handleContentSave}
            adminMode={adminMode}
          />
        </div>
        <EditableText 
          id={`accommodation-card-title-${kind}`}
          initialValue={title}
          element="h3"
          className="text-lg font-semibold"
          onSave={handleContentSave}
          adminMode={adminMode}
        />
        <EditableText 
          id={`accommodation-card-guests-${kind}`}
          initialValue={guests}
          element="p"
          className="text-sm text-gray-600 mt-1"
          onSave={handleContentSave}
          adminMode={adminMode}
        />

        <div className="mt-3 text-sm">
          <p className="line-through text-gray-400">
            <EditableText 
              id={`accommodation-card-airbnb-label-${kind}`}
              initialValue="Airbnb:"
              element="span"
              onSave={handleContentSave}
              adminMode={adminMode}
            /> ${price.baseNight}
          </p>
          <p className="text-2xl font-semibold text-amber-600">
            ${price.final}<EditableText 
              id={`accommodation-card-night-label-${kind}`}
              initialValue="/night"
              element="span"
              className="text-sm text-gray-500"
              onSave={handleContentSave}
              adminMode={adminMode}
            />
          </p>
          <p className="text-green-600 text-sm">
            <EditableText 
              id={`accommodation-card-save-label-${kind}`}
              initialValue="Save"
              element="span"
              onSave={handleContentSave}
              adminMode={adminMode}
            /> ${price.savings}
          </p>
        </div>

        <ul className="mt-3 text-sm text-gray-700 list-disc ml-5">
          {perks.map((p, index) => (
            <li key={p}>
              <EditableText 
                id={`accommodation-card-perk-${kind}-${index}`}
                initialValue={p}
                element="span"
                onSave={handleContentSave}
                adminMode={adminMode}
              />
            </li>
          ))}
        </ul>

        <div className="mt-4 grid gap-2">
          <a href="/contact?reason=booking" className="inline-flex items-center justify-center rounded-xl bg-amber-500 text-white px-4 py-2 text-sm hover:opacity-90">
            <EditableText 
              id={`accommodation-card-book-button-${kind}`}
              initialValue="Book Direct & Save"
              element="span"
              onSave={handleContentSave}
              adminMode={adminMode}
            />
          </a>
          <a href={A} target="_blank" rel="noopener" className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm hover:bg-gray-50">
            <EditableText 
              id={`accommodation-card-airbnb-button-${kind}`}
              initialValue="Open on Airbnb"
              element="span"
              onSave={handleContentSave}
              adminMode={adminMode}
            />
          </a>
        </div>

        {price.extraPct > 0 && (
          <p className="mt-2 text-xs text-emerald-700">
            <EditableText 
              id={`accommodation-card-lastminute-${kind}`}
              initialValue={`Includes last-minute ${price.extraPct}% (Sun–Thu, within 3 days)`}
              element="span"
              onSave={handleContentSave}
              adminMode={adminMode}
            />
          </p>
        )}
      </div>
    </article>
  );
}