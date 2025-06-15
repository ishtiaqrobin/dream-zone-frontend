import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Facebook,
  Mail,
  Music,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";

interface TaskCard {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const Tasks = () => {
  const navigate = useNavigate();

  const taskCards: TaskCard[] = [
    {
      id: 1,
      title: "Facebook ID Sells",
      description: "Submit your Facebook account details for selling",
      icon: <Facebook className="w-8 h-8" />,
      color: "bg-blue-500",
    },
    {
      id: 2,
      title: "Gmail ID Sells",
      description: "Submit your Gmail account details for selling",
      icon: <Mail className="w-8 h-8" />,
      color: "bg-red-500",
    },
    {
      id: 3,
      title: "TikTok ID Sells",
      description: "Submit your TikTok account details for selling",
      icon: <Music className="w-8 h-8" />,
      color: "bg-black",
    },
    {
      id: 4,
      title: "Instagram ID Sells",
      description: "Submit your Instagram account details for selling",
      icon: <Instagram className="w-8 h-8" />,
      color: "bg-pink-500",
    },
    {
      id: 5,
      title: "Twitter ID Sells",
      description: "Submit your Twitter account details for selling",
      icon: <Twitter className="w-8 h-8" />,
      color: "bg-sky-500",
    },
    {
      id: 6,
      title: "YouTube ID Sells",
      description: "Submit your YouTube account details for selling",
      icon: <Youtube className="w-8 h-8" />,
      color: "bg-red-600",
    },
  ];

  const handleCardClick = (taskType: string) => {
    navigate("/dashboard/submit-tasks", { state: { taskType } });
  };

  return (
    <div className="w-full p-0 md:p-8">
      <h2 className="text-2xl font-semibold mb-6 text-black dark:text-white">
        Available Tasks
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {taskCards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card.title)}
            className="bg-card rounded-lg shadow-sm border border-border p-6 cursor-pointer hover:shadow-md transition-all duration-300 dark:bg-gray-900 dark:border-gray-700"
          >
            <div
              className={`${card.color} w-16 h-16 rounded-full flex items-center justify-center text-white mb-4`}
            >
              {card.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2 text-black dark:text-white">
              {card.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
