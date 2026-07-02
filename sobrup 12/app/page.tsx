import Hero from "@/components/Hero";
import CategoryGrid from "@/components/CategoryGrid";
import FeaturedFacilities from "@/components/FeaturedFacilities";
import CityGrid from "@/components/CityGrid";
import WhySobrup from "@/components/WhySobrup";
import { getAllFacilities, getFeaturedFacilities, getCitySummaries } from "@/lib/data/facilities";

export default async function HomePage() {
  const [all, featured, cities] = await Promise.all([
    getAllFacilities(),
    getFeaturedFacilities(),
    getCitySummaries(),
  ]);

  return (
    <>
      <Hero count={all.length} />
      <CategoryGrid />
      <FeaturedFacilities facilities={featured} />
      <CityGrid cities={cities} />
      <WhySobrup />
    </>
  );
}
