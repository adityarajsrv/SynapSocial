/* eslint-disable react/prop-types */
import { Bars3Icon, XMarkIcon, HomeIcon, DocumentTextIcon, PencilSquareIcon, CheckCircleIcon, ChartBarIcon, ChartPieIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import logo from '../assets/logo.png';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const menuItems = [
    { icon: HomeIcon, label: "Home", href: "#dashboard" },
    { icon: DocumentTextIcon, label: "Posts", href: "#posts", isSection: true },
    { icon: DocumentTextIcon, label: "All Posts", href: "#all-posts", indent: true },
    { icon: PencilSquareIcon, label: "AI Generate Post", href: "#ai-generate", indent: true },
    { icon: CheckCircleIcon, label: "Tasks", href: "#tasks" },
    { icon: ChartBarIcon, label: "Analytics", href: "#analytics" },
    { icon: ChartPieIcon, label: "Charts", href: "#charts" },
    { icon: Cog6ToothIcon, label: "Settings", href: "#settings" },
  ];

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-gray-800 rounded-md md:hidden cursor-pointer "
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <XMarkIcon className="h-6 w-6 text-white" /> : <Bars3Icon className="h-6 w-6 text-white" />}
      </button>

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white shadow-lg z-40 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative md:h-screen`}
      >
        <div className="p-6 flex items-center gap-3 border-b border-gray-700">
          <img src={logo} alt="SynapSocial" className="h-8 w-8" />
          <h2 className="text-xl font-bold">SynapSocial</h2>
        </div>

        <nav className="p-4 space-y-1 h-[calc(100vh-80px)] overflow-y-auto">
          {menuItems.map((item, index) => (
            <div key={index}>
              {item.isSection ? (
                <div className="mt-6 mb-2">
                  <p className="text-lg font-medium text-gray-300 px-3 py-2">{item.label}</p>
                  <div className="h-px w-full bg-gray-700 mt-2"></div>
                </div>
              ) : (
                <a
                  href={item.href}
                  className={`flex items-center p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 group ${
                    item.indent ? 'ml-4' : ''
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3 text-gray-300 group-hover:text-white" />
                  <span className="text-gray-300 group-hover:text-white">{item.label}</span>
                </a>
              )}
            </div>
          ))}
        </nav>
      </div>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;