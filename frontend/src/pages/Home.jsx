import { Link } from "react-router";
import Prism from "../components/Prism";

const Home = () => {
  return (
    <div className="min-h-screen bg-black">
      <div className="relative w-full h-screen">
        <Prism
          animationType="rotate"
          timeScale={1}
          height={3}
          baseWidth={5.5}
          scale={3.5}
          hueShift={0}
          colorFrequency={1}
          noise={0}
          glow={0.7}
          bloom={1}
          transparent={false}
        />
        <div className="text-white flex flex-row px-4 text-lg justify-between items-center w-full md:w-[70%] lg:w-[50%] mt-4 md:mt-6 bg-transparent bg-opacity-30 backdrop-blur-md border border-white border-opacity-20 rounded-2xl p-2 z-20 fixed top-4 left-1/2 transform -translate-x-1/2">
          <h3 className="cursor-pointer">SynapSocial</h3>
          <div className="hidden md:flex flex-row justify-between items-center space-x-4 cursor-pointer">
            <h3>Home</h3>
            <h3>Contact</h3>
            <h3>About Us</h3>
          </div>
          <Link to="/login">
            <button className="bg-transparent text-lg md:text-base cursor-pointer">
              Login
            </button>
          </Link>
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10 px-4">
          <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold drop-shadow-[0_0_10px_rgba(0,0,0,0.7)] mb-2 sm:mb-3 md:mb-4">
            Unleash the Power of AI for Your Social Media
          </h1>
          <div className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold uppercase tracking-wide drop-shadow-[0_0_5px_rgba(0,0,0,0.5)]">
            Automate. Schedule. Create.
          </div>
          <p className="text-white text-sm sm:text-base md:text-lg lg:text-xl font-medium mt-2 sm:mt-3 md:mt-4 drop-shadow-[0_0_5px_rgba(0,0,0,0.5)]">
            Elevate your online presence with cutting-edge intelligence-starting
            today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-5 items-center mt-4 sm:mt-5">
            <button className="py-2 sm:py-3 px-5 sm:px-8 lg:px-10 cursor-pointer bg-white rounded-3xl shadow-md hover:shadow-neutral-600 hover:scale-101 text-sm sm:text-base">
              Get Started
            </button>
            <button className="py-2 sm:py-3 px-5 sm:px-8 lg:px-10 cursor-pointer bg-white rounded-3xl shadow-md hover:shadow-neutral-600 hover:scale-101 text-sm sm:text-base">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
