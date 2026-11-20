import Banner from '@/components/home/Banner';
import CategoriesSection from '@/components/home/CategoriesSection';
import FeaturedEquipment from '@/components/home/FeaturedEquipment';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import HowItWorks from '@/components/home/HowItWorks';
import CustomerReviews from '@/components/home/CustomerReviews';
import OwnerCTA from '@/components/home/OwnerCTA';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Banner />
      <CategoriesSection />
      <FeaturedEquipment />
      <WhyChooseUs />
      <HowItWorks />
      <CustomerReviews />
      <OwnerCTA />
    </div>
  );
}
