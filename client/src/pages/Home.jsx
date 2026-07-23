import React from "react";
import Homehero from "../components/Homehero";
import Works from "../components/Works";
import DorneeHomeSection from "../components/DorneeHomeSection";
import CategoryGrid from "../components/Categories";
const Home = () => {
  return (
    <>
      <Homehero />
      <DorneeHomeSection />
      <Works />
      <CategoryGrid />
    </>
  );
};

export default Home;
