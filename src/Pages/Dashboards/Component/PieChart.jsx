import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
} from "recharts";

import "./pieChart.css";

const COLORS = [
  "#3B82F6",
  "#22C55E",
  "#FBBF24",
  "#8B5CF6",
  "#38BDF8",
];

export default function EmployeeChart({ datas, Tittle, role }) {

  /* =====================================================
     EMPLOYEE PERFORMANCE GRAPH
  ===================================================== */

  if (role === "EMPLOYEE") {

    /*
     * Handle all possible response formats:
     *
     * 1. datas = {
     *      attendaceScore: 0,
     *      ...
     *    }
     *
     * 2. datas = [{
     *      attendaceScore: 0,
     *      ...
     *    }]
     *
     * 3. datas = {
     *      data: {
     *          attendaceScore: 0,
     *          ...
     *      }
     *    }
     */

    let response = datas;

    if (Array.isArray(response)) {
      response = response[0];
    }

    if (response?.data) {
      response = response.data;
    }

    response = response || {};


    console.log("========== EMPLOYEE CHART ==========");
    console.log("Original datas:", datas);
    console.log("Final response:", response);


    const getScore = (value) => {

      const number = Number(value);

      if (!Number.isFinite(number)) {
        return 0;
      }

      return Math.round(number * 10) / 10;
    };


    const attendanceScore =
      getScore(response.attendaceScore);

    const feedbackScore =
      getScore(response.feedbackScore);

    const overallScore =
      getScore(response.overAllScore);

    const pendingTask =
      Number(response.pendingTask) || 0;

    const taskScore =
      getScore(response.taskScore);


    const employeeData = [

      {
        name: "Attendance",
        score: attendanceScore,
      },

      {
        name: "Feedback",
        score: feedbackScore,
      },

      {
        name: "Overall",
        score: overallScore,
      },

      {
        name: "Tasks",
        score: taskScore,
      }

    ];


    console.log(
      "Chart Data:",
      employeeData
    );


    return (

      <div className="employee-performance-chart">

        {/* HEADER */}

        <div className="performance-chart-header">

          <div>

            <h2>
              Performance Overview
            </h2>

            <p>
              Current performance score
            </p>

          </div>

        </div>


        {/* GRAPH */}

        <div className="performance-chart-wrapper">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <BarChart
              data={employeeData}
              layout="vertical"
              margin={{
                top: 10,
                right: 45,
                left: 5,
                bottom: 10
              }}
            >

              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                stroke="#E5E7EB"
              />


              <XAxis
                type="number"
                domain={[0, 100]}
                ticks={[
                  0,
                  25,
                  50,
                  75,
                  100
                ]}
                tick={{
                  fontSize: 11,
                  fill: "#64748B"
                }}
                axisLine={{
                  stroke: "#CBD5E1"
                }}
                tickLine={false}
              />


              <YAxis
                type="category"
                dataKey="name"
                width={75}
                tick={{
                  fontSize: 12,
                  fontWeight: 500,
                  fill: "#1E293B"
                }}
                axisLine={false}
                tickLine={false}
              />


              <Tooltip
                cursor={{
                  fill:
                    "rgba(59,130,246,0.04)"
                }}
                formatter={(value) => [
                  `${value}`,
                  "Score"
                ]}
                contentStyle={{
                  border:
                    "1px solid #E2E8F0",
                  borderRadius: "10px",
                  background: "#FFFFFF",
                  boxShadow:
                    "0 6px 20px rgba(15,23,42,0.10)",
                  fontSize: "12px"
                }}
              />


              <Bar
                dataKey="score"
                barSize={22}
                radius={[
                  0,
                  6,
                  6,
                  0
                ]}
                background={{
                  fill: "#F1F5F9",
                  radius: 6
                }}
                animationDuration={800}
              >

                {employeeData.map(
                  (entry, index) => (

                    <Cell
                      key={
                        `employee-${entry.name}`
                      }
                      fill={
                        COLORS[
                        index %
                        COLORS.length
                        ]
                      }
                    />

                  )
                )}

                <LabelList
                  dataKey="score"
                  position="right"
                  formatter={(value) =>
                    `${value}`
                  }
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    fill: "#1E293B"
                  }}
                />

              </Bar>

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>
    );
  }


  /* =====================================================
     ADMIN / MANAGER PIE CHART
  ===================================================== */

  const finalData =
    Array.isArray(datas)
      ? datas.map((datam) =>
        Array.isArray(datam)
          ? datam.map((d) => ({
            name: d[0],
            value: d[1],
          }))
          : []
      )
      : [];

  const pieData = finalData[0] || [];

  const totalEMP = pieData.reduce(
    (sum, item) =>
      sum + (Number(item.value) || 0),
    0
  );


  return (
    <div className="pi-Outer">

      <h1>{Tittle}</h1>

      <div className="chart-card">

        <div className="chart">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <PieChart>

              <Pie
                data={pieData}
                dataKey="value"
                innerRadius={60}
                outerRadius={100}
                cornerRadius={10}
                paddingAngle={1}
                stroke="white"
                strokeWidth={2}
              >

                {pieData.map((entry, index) => (
                  <Cell
                    key={`pie-${entry.name}-${index}`}
                    fill={
                      COLORS[index % COLORS.length]
                    }
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

          {pieData.map((item, index) => (

            <div
              className="legend-item"
              key={`legend-${item.name}-${index}`}
            >

              <span
                className="dot"
                style={{
                  background:
                    COLORS[index % COLORS.length],
                }}
              />

              <span>{item.name}</span>

              <strong>{item.value}</strong>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}