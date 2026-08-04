import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import "./pieChart.css";
import { useEffect, useState } from "react";
const COLORS = [
  "#3B82F6",
  "#22C55E",
  "#FBBF24",
  "#8B5CF6",
  "#38BDF8",
];



export default function EmployeeChart({ datas }) {

  // console.log(datas);
  const finalData = datas.map((datam) =>
    datam.map((d) => ({
      name: d[0],
      value: d[1]
    
      
    }))
  );

  const totalEMP = finalData
  .flat()
  .reduce((sum, item) => sum + item.value, 0);





  // console.log(finalData)

  return (
    <div className="pi-Outer">
      <h1>Employees by Department </h1>

      <div className="chart-card">

        <div className="chart">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>

              <Pie
                data={finalData[0]}
                dataKey="value"
                innerRadius={60}
                outerRadius={100}
                cornerRadius={10}
                paddingAngle={1}
                stroke="white"
                strokeWidth={2}
              >
                {finalData[0].map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index]}
                  />
                ))}
              </Pie>

            </PieChart>
          </ResponsiveContainer>

          <div className="center-text">
            <h1>{totalEMP}</h1>
            <span>Total</span>
          </div>

        </div>

        <div className="legend">

          {finalData[0].map((item , i) => (
            <div className="legend-item" key={item.name}>
              <span
                className="dot"
                style={{ background: COLORS[i] }}
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