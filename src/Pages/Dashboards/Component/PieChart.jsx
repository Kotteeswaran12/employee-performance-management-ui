import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import "./pieChart.css";
const COLORS = [
  "#3B82F6",
  "#22C55E",
  "#FBBF24",
  "#8B5CF6",
  "#38BDF8",
];
const data = [
  { name: "Development", value: 45, color: "#3B82F6" },
  { name: "HR", value: 20, color: "#22C55E" },
  { name: "Finance", value: 15, color: "#FBBF24" },
  { name: "Sales", value: 25, color: "#8B5CF6" },
  { name: "Marketing", value: 15, color: "#38BDF8" },
];

export default function EmployeeChart() {
  return (
    <div className="pi-Outer">
      <h1>Employees by Department </h1>

      <div className="chart-card">

        <div className="chart">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>

              <Pie
                data={data}
                dataKey="value"
                innerRadius={60}
                outerRadius={100}
                cornerRadius={10}
                paddingAngle={1}
                stroke="white"
                strokeWidth={2}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index]}
                  />
                ))}
              </Pie>

            </PieChart>
          </ResponsiveContainer>

          <div className="center-text">
            <h1>120</h1>
            <span>Total</span>
          </div>

        </div>

        <div className="legend">

          {data.map((item) => (
            <div className="legend-item" key={item.name}>
              <span
                className="dot"
                style={{ background: item.color }}
              ></span>

              <span>{item.name}</span>

              <strong>{item.value}</strong>

            </div>
          ))}

        </div>

      </div>
    </div>
  );
}