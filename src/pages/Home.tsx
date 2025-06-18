import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import HomeNavbar from "@/components/home/HomeNavbar";
import Footer from "@/components/home/Footer";

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <HomeNavbar />

      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              Welcome {user?.name?.split(" ")[0]}!
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Welcome to your dream world. Here you will find everything you
              need to achieve your goals.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link to="/dashboard">
                <Button size="lg">Go to Dashboard</Button>
              </Link>
              <Link to="/dashboard/tasks">
                <Button variant="outline" size="lg">
                  View Tasks
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-muted/50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary">
              Our Services
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Our help to achieve your goals
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="text-base font-semibold leading-7 text-foreground">
                  Task Management
                </dt>
                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">
                    Manage your daily tasks easily and track them.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-base font-semibold leading-7 text-foreground">
                  Progress Tracking
                </dt>
                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">
                    See your progress and move forward towards achieving your
                    goals.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-base font-semibold leading-7 text-foreground">
                  Reports and Analytics
                </dt>
                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">
                    Analyze your performance and get suggestions for
                    improvement.
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
