import React from "react";
import { FileText, CheckCircle, Clock, XCircle } from "lucide-react";

const fakeStats = [
  {
    label: "Total Reports",
    value: "120",
    icon: FileText,
    change: "+5.2%",
    changeType: "up",
    changeColor: "text-green-600",
    subtext: "from last month",
  },
  {
    label: "Resolved",
    value: "90",
    icon: CheckCircle,
    change: "+3.1%",
    changeType: "up",
    changeColor: "text-green-600",
    subtext: "from last month",
  },
  {
    label: "Pending",
    value: "25",
    icon: Clock,
    change: "-1.8%",
    changeType: "down",
    changeColor: "text-red-500",
    subtext: "from last month",
  },
  {
    label: "Rejected",
    value: "5",
    icon: XCircle,
    change: "+0.5%",
    changeType: "up",
    changeColor: "text-green-600",
    subtext: "from last month",
  },
];

const fakeChartData = [
  { month: "Jan", reports: 10 },
  { month: "Feb", reports: 15 },
  { month: "Mar", reports: 20 },
  { month: "Apr", reports: 18 },
  { month: "May", reports: 25 },
  { month: "Jun", reports: 32 },
];

const Reports: React.FC = () => {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-6 text-black dark:text-white">
        Reports Overview
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {fakeStats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col justify-between min-h-[140px] text-foreground dark:bg-gray-900 dark:border-gray-700"
          >
            <div className="flex items-start justify-between w-full mb-2">
              <span className="font-semibold text-base text-black dark:text-white">
                {stat.label}
              </span>
              <stat.icon className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1 flex flex-col justify-end">
              <span className="text-2xl font-bold text-black mb-1 dark:text-white">
                {stat.value}
              </span>
              <div className="flex items-center gap-1 text-xs">
                <span className={stat.changeColor}>
                  {stat.changeType === "up" ? "↑" : "↓"} {stat.change}
                </span>
                <span className="text-muted-foreground">{stat.subtext}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-lg shadow-sm border border-border text-foreground p-6 dark:bg-gray-900 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">
          Reports (Last 6 Months)
        </h3>
        <div className="w-full overflow-x-auto">
          <table className="min-w-full text-center">
            <thead>
              <tr>
                {fakeChartData.map((d) => (
                  <th
                    key={d.month}
                    className="px-4 py-2 text-muted-foreground dark:text-white"
                  >
                    {d.month}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {fakeChartData.map((d) => (
                  <td key={d.month} className="px-4 py-2 dark:text-white">
                    <div className="h-24 flex items-end justify-center">
                      <div
                        className="w-6 bg-black rounded dark:bg-white"
                        style={{ height: `${d.reports * 2}px` }}
                        title={`${d.reports} reports`}
                      ></div>
                    </div>
                    <div className="mt-2 text-sm">{d.reports}</div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
