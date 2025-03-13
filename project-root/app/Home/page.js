import Header from '@components/Header';
import HeroSection from '@components/HeroSection';
import ServiceFeatures from '@components/ServiceFeatures';
import HowItWorks from '@components/HowItWorks';
import RegisterDocument from '@components/RegisterDocument';
import ValidateDocument from '@components/ValidateDocument';
import Footer from '@components/Footer';

export default function Home() {
  return (
    <main>
      <Header />
      <HeroSection />
      <ServiceFeatures />
      <HowItWorks />
      <RegisterDocument />
      <ValidateDocument />
      <Footer />
    </main>
  );
}