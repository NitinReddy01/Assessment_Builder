import { useState } from "react";
import { Link } from "react-router-dom";
import navItems from "./NavItems";

function Navbar() {
  const [activeTab, setActiveTab] = useState("Assessments");

  return (
    <nav className="z-30">
      <div className="flex flex-col">
        <div className="flex relative items-center max-w-screen md:gap-[4%] text-black md:p-4 ">
          {/* Logo */}
          <div className="lg:relative md:mb-6">
            <img
              className="w-[8rem] h-[2rem] lg:w-[12rem] lg:h-[4rem] lg:p-2 lg:ml-8"
              alt="Logo"
            />
          </div>

          {/* Desktop Navigation */}
          <div>
            <ul className="flex md:flex-wrap justify-between lg:gap-4">
              {navItems.map((item, index) => (
                <li key={index} className="mx-2 my-4">
                  <div className="flex flex-col items-center">
                    <Link
                      className={
                        activeTab === item.name ? "text-primary-500" : ""
                      }
                      onClick={() => setActiveTab(item.name)}
                      to={item.link}
                    >
                      {item.name}
                    </Link>
                    <div
                      className={
                        activeTab === item.name
                          ? "mt-6 h-[0.5rem] w-[3rem] bg-primary-500 rounded-tl-full rounded-tr-full"
                          : ""
                      }
                    ></div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
