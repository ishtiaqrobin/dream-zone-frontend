import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useLocation, Link as RouterLink } from "react-router-dom";

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Close sidebar when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Dynamic document title
  useEffect(() => {
    let title = "Dashboard";
    if (pathnames.length > 1) {
      const last = pathnames[pathnames.length - 1];
      title = last.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    }
    document.title = `${title} | Dream Zone`;
  }, [pathnames]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

        <div className="flex-1 flex flex-col min-w-0">
          <Navbar onMenuToggle={toggleSidebar} />

          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto">
              <div className="mb-4">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <RouterLink to="/dashboard">Dashboard</RouterLink>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    {pathnames.slice(1).map((value, idx) => {
                      const to = `/dashboard/${pathnames
                        .slice(1, idx + 2)
                        .join("/")}`;
                      const isLast = idx === pathnames.slice(1).length - 1;
                      return (
                        <React.Fragment key={to}>
                          <BreadcrumbSeparator />
                          <BreadcrumbItem>
                            {isLast ? (
                              <BreadcrumbPage>
                                {value
                                  .replace(/-/g, " ")
                                  .replace(/\b\w/g, (l) => l.toUpperCase())}
                              </BreadcrumbPage>
                            ) : (
                              <BreadcrumbLink asChild>
                                <RouterLink to={to}>
                                  {value
                                    .replace(/-/g, " ")
                                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                                </RouterLink>
                              </BreadcrumbLink>
                            )}
                          </BreadcrumbItem>
                        </React.Fragment>
                      );
                    })}
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
