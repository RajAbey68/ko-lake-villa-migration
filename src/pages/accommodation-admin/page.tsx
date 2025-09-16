import EditableAccommodationPage from '../accommodation/editable-page';
import { generateSEOMetadata, getPageSEO } from "@/lib/seo";

export const metadata = generateSEOMetadata(getPageSEO('accommodation'));

export default function AccommodationAdminPage() {
  return <EditableAccommodationPage />;
}