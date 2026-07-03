import Hero from "@/components/Hero";
import { getAllFacilities } from "@/lib/data/facilities";

export default async function HomePage() {
  const facilities = await getAllFacilities();
  return <Hero count={facilities.length} />;
}
