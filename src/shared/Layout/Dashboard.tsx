import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";

// Context
import { AuthContext } from "../../context/AuthContext";

// Shared Component
import Button from "../FormElements/Button";
import { Add, Home, Members, Template } from "../Icons";

interface DashboardProps {
  children: React.ReactNode;
}

const headerLinkList = [
  {
    name: "Projects",
  },
  {
    name: "Dashboard",
  },
];

const Layout: React.FC<DashboardProps> = ({ children }) => {
  const auth = useContext(AuthContext);
  const location = useLocation();

  const SideBarLinkList = [
    {
      name: "Projects",
      link: `/${auth.userId}/projects`,
      icons: <Template size={19} />,
    },
    {
      name: "Members",
      link: "/members",
      icons: <Members size={19} />,
    },
    {
      name: "Template",
      link: "/template",
      icons: <Template size={19} />,
    },

    {
      name: "Home",
      link: "/home",
      icons: <Home size={19} />,
    },
  ];

  return (
    <div>
      <header className="flex items-center justify-between px-5 bg-white border-b border-gray-300 py-7">
        <div className="flex items-center justify-center ">
          <div className=" w-[40px] h-[40px] ">
            <img src="/logo.svg" className="w-full h-full" alt="logo-img" />
          </div>
          <h1 className="text-2xl font-bold text-center uppercase text-primary ">
            teamforge
          </h1>
        </div>

        <div className="flex items-center justify-center gap-5">
          <ul className="flex items-center justify-center space-x-6">
            {headerLinkList.map((link) => (
              <li className="p-2 font-medium text-gray-500 rounded-[2px] cursor-pointer hover:bg-gray-200">
                {link.name}
              </li>
            ))}
          </ul>
          <Link to="/projects/new">
            <Button className="flex items-center justify-center text-white transition-all bg-primary hover:bg-primary_light">
              <Add size={25} />
              Create
            </Button>
          </Link>{" "}
          <Button
            className="text-gray-600 transition-all bg-gray-200 hover:bg-gray-300 "
            onClick={() => auth.isLogout()}
          >
            Logout
          </Button>
        </div>
      </header>

      <div className="flex h-screen">
        <div className=" w-[300px] border-r-[2px] border-gray-300 p-5">
          {SideBarLinkList.map((link) => (
            <div className="mb-3">
              <Link to={`${link.link}`}>
                <Button
                  variant="dashboard"
                  className={
                    location.pathname === link.link
                      ? "bg-blue-100 text-primary"
                      : ""
                  }
                >
                  {React.cloneElement(link.icons, {
                    color:
                      location.pathname === link.link ? "#3182CE" : "#616161",
                  })}
                  {link.name}
                </Button>
              </Link>
            </div>
          ))}
        </div>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
