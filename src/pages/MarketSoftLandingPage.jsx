import React, { useEffect, useRef, useState } from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import BgImg from '../images/bannerImg.png'
import { GroupByAnima } from '../components/GroupByAnima';
import InformationForm from '../components/InformationForm';
import { MarketSoftJoin } from '../components/MarketSoftJoin';

const MarketSoftLandingPage = () => {

  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = BgImg; // Preload the image

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "100px", // Load earlier
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white overflow-hidden w-full relative">
        
        <Header />
        <section className="w-full bg-cover bg-center"
        ref={sectionRef}
        style={{
          backgroundImage: isVisible ? `url(${BgImg})` : "none",
        }}
        >
          <GroupByAnima />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="col-span-1">
          <MarketSoftJoin />
          </div>
          <div className="col-span-1">
          <InformationForm />
          </div>
        </div>

        <Footer />
      </div>
    </div>
  )
}

export default MarketSoftLandingPage
