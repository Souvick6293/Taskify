import React from "react";
import Header from "../components/Header";
import Banner from "../components/Banner";
import AboutUs from "../components/AboutUs";
import Footer from "../components/Footer";
import IntroVideo from "../components/IntroVideo";


const HomePage = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      <Header/>
      <Banner/>
      <AboutUs/>
      <IntroVideo/>
      <Footer/>
    </div>
  );
};

export default HomePage;
