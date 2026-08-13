import './Attendance.css';
import {
  GetAllAttendanceDetaisl,
  PunchIn,
  PunchOut
} from '../../Api/EmployeeAccess';
import { useEffect, useMemo, useState } from 'react';

const Attendance = () => {

  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  const Token = localStorage.getItem('token');

  // --------------------------------------------------
  // Date Helpers
  // --------------------------------------------------

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const formatDisplayDate = (dateString) => {
    const date = new Date(`${dateString}T00:00:00`);

    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short'
    });
  };

  const formatDay = (dateString) => {
    const date = new Date(`${dateString}T00:00:00`);

    return date.toLocaleDateString('en-IN', {
      weekday: 'short'
    });
  };

  const formatTime = (time) => {
    if (!time || time === 'string') {
      return '--';
    }

    const date = new Date(`1970-01-01T${time}`);

    if (Number.isNaN(date.getTime())) {
      return time;
    }

    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatWorkingHours = (hours) => {
    if (hours === null || hours === undefined || hours === 0) {
      return '--';
    }

    const totalMinutes = Math.round(Number(hours) * 60);

    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;

    return `${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m`;
  };

  // --------------------------------------------------
  // Get Current Week
  // Monday -> Sunday
  // --------------------------------------------------

  const getCurrentWeek = () => {

    const today = new Date();

    const day = today.getDay();

    // Convert Sunday(0) -> 7
    const mondayOffset = day === 0 ? -6 : 1 - day;

    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);

    const week = [];

    for (let i = 0; i < 7; i++) {

      const date = new Date(monday);
      date.setDate(monday.getDate() + i);

      week.push({
        date: formatDate(date),
        day: date.getDay()
      });
    }

    return week;
  };

  // --------------------------------------------------
  // Fetch Attendance
  // --------------------------------------------------

  const fetchAllAttendance = async () => {

    try {

      setLoading(true);
      setError('');

      const response = await GetAllAttendanceDetaisl(Token, 0, 10);

      const data = response?.data?.content || [];

      setAttendance(data);

    } catch (err) {

      console.error('Attendance fetch error:', err);

      setError(
        err?.response?.data?.message ||
        'Unable to load attendance details.'
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchAllAttendance();
  }, []);

  // --------------------------------------------------
  // Build Weekly Attendance
  // --------------------------------------------------

  const weeklyAttendance = useMemo(() => {

    const week = getCurrentWeek();

    const attendanceMap = new Map();

    attendance.forEach((item) => {
      attendanceMap.set(item.attendanceDate, item);
    });

    const today = formatDate(new Date());

    return week.map((day) => {

      const record = attendanceMap.get(day.date);

      const dateObject = new Date(`${day.date}T00:00:00`);

      const isWeekend =
        dateObject.getDay() === 0 ||
        dateObject.getDay() === 6;

      const isFuture = day.date > today;

      let status = 'Absent';

      if (record) {

        if (record.checkIn && !record.checkOut) {
          status = 'Working';
        } else if (record.checkIn && record.checkOut) {
          status = 'Present';
        }

      } else if (isWeekend) {

        status = 'Weekend';

      } else if (isFuture) {

        status = 'Upcoming';

      } else if (day.date === today) {

        status = 'Not Checked In';

      }

      return {
        date: day.date,
        day: formatDay(day.date),
        checkIn: record?.checkIn,
        checkOut: record?.checkOut,
        workingHours: record?.workingHours,
        status
      };

    });

  }, [attendance]);

  // --------------------------------------------------
  // Today's Attendance
  // --------------------------------------------------

  const todayAttendance = useMemo(() => {

    const today = formatDate(new Date());

    return weeklyAttendance.find(
      (item) => item.date === today
    );

  }, [weeklyAttendance]);

  // --------------------------------------------------
  // Statistics
  // --------------------------------------------------

  const statistics = useMemo(() => {

    const present = weeklyAttendance.filter(
      (item) => item.status === 'Present'
    ).length;

    const absent = weeklyAttendance.filter(
      (item) => item.status === 'Absent'
    ).length;

    const working = weeklyAttendance.filter(
      (item) => item.status === 'Working'
    ).length;

    const totalHours = weeklyAttendance.reduce(
      (total, item) => {
        return total + (Number(item.workingHours) || 0);
      },
      0
    );

    return {
      present,
      absent,
      working,
      totalHours
    };

  }, [weeklyAttendance]);

  // --------------------------------------------------
  // Punch In
  // --------------------------------------------------

  const handlePunchIn = async () => {

    try {

      setActionLoading(true);
      setError('');

      await PunchIn(Token);

      await fetchAllAttendance();

    } catch (err) {

      console.error('Punch in error:', err);

      setError(
        err?.response?.data?.message ||
        'Unable to punch in.'
      );

    } finally {

      setActionLoading(false);

    }
  };

  // --------------------------------------------------
  // Punch Out
  // --------------------------------------------------

  const handlePunchOut = async () => {

    try {

      setActionLoading(true);
      setError('');

      await PunchOut(Token);

      await fetchAllAttendance();

    } catch (err) {

      console.error('Punch out error:', err);

      setError(
        err?.response?.data?.message ||
        'Unable to punch out.'
      );

    } finally {

      setActionLoading(false);

    }
  };

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div className="AttendanceOuter">

      {/* Header */}

      <div className="attendanceHeader">

        <div>
          <span className="attendanceEyebrow">
            EMPLOYEE PORTAL
          </span>

          <h1>Attendance</h1>

          <p>
            Track your attendance and working hours for this week.
          </p>
        </div>

      </div>


      {/* Error */}

      {error && (
        <div className="attendanceError">
          <span>!</span>
          {error}
        </div>
      )}


      {/* Statistics */}

      <div className="attendanceStats">

        <div className="attendanceStatCard">

          <div className="statIcon presentIcon">
            ✓
          </div>

          <div>
            <span>Present</span>
            <strong>{statistics.present}</strong>
          </div>

        </div>


        <div className="attendanceStatCard">

          <div className="statIcon absentIcon">
            !
          </div>

          <div>
            <span>Absent</span>
            <strong>{statistics.absent}</strong>
          </div>

        </div>


        <div className="attendanceStatCard">

          <div className="statIcon workingIcon">
            ●
          </div>

          <div>
            <span>Working</span>
            <strong>{statistics.working}</strong>
          </div>

        </div>


        <div className="attendanceStatCard">

          <div className="statIcon hoursIcon">
            ◷
          </div>

          <div>
            <span>Total Hours</span>
            <strong>
              {statistics.totalHours.toFixed(1)}h
            </strong>
          </div>

        </div>

      </div>


      {/* Today's Attendance */}

      <div className="todayAttendance">

        <div className="todayTop">

          <div>

            <span className="sectionLabel">
              TODAY
            </span>

            <h2>
              {formatDisplayDate(todayAttendance?.date)}
            </h2>

            <span className="todayDay">
              {todayAttendance?.day}
            </span>

          </div>


          <div
            className={`statusBadge status-${todayAttendance?.status
              ?.toLowerCase()
              .replace(/\s+/g, '-')}`}
          >
            <span className="statusDot"></span>
            {todayAttendance?.status}
          </div>

        </div>


        <div className="todayDetails">

          <div className="todayDetail">

            <span>CHECK IN</span>

            <strong>
              {formatTime(todayAttendance?.checkIn)}
            </strong>

          </div>


          <div className="todayDivider"></div>


          <div className="todayDetail">

            <span>CHECK OUT</span>

            <strong>
              {formatTime(todayAttendance?.checkOut)}
            </strong>

          </div>


          <div className="todayDivider"></div>


          <div className="todayDetail">

            <span>WORKING HOURS</span>

            <strong>
              {formatWorkingHours(
                todayAttendance?.workingHours
              )}
            </strong>

          </div>


          <div className="todayActions">

            {!todayAttendance?.checkIn &&
              todayAttendance?.status === 'Not Checked In' && (

                <button
                  className="punchButton punchInButton"
                  onClick={handlePunchIn}
                  disabled={actionLoading}
                >
                  {actionLoading
                    ? 'Checking...'
                    : 'Check In'}
                </button>

              )}


            {todayAttendance?.checkIn &&
              !todayAttendance?.checkOut && (

                <button
                  className="punchButton punchOutButton"
                  onClick={handlePunchOut}
                  disabled={actionLoading}
                >
                  {actionLoading
                    ? 'Checking...'
                    : 'Check Out'}
                </button>

              )}


            {todayAttendance?.checkIn &&
              todayAttendance?.checkOut && (

                <div className="completedMessage">
                  ✓ Day Completed
                </div>

              )}

          </div>

        </div>

      </div>


      {/* Attendance History */}

      <div className="attendanceHistory">

        <div className="historyHeader">

          <div>
            <span className="sectionLabel">
              WEEKLY RECORD
            </span>

            <h2>Attendance History</h2>

            <p>
              Your attendance for the current week
            </p>
          </div>

        </div>


        {loading ? (

          <div className="attendanceLoading">

            <div className="loadingSpinner"></div>

            <span>
              Loading attendance...
            </span>

          </div>

        ) : (

          <>

            {/* Desktop / Tablet Table */}

            <div className="attendanceTableWrapper">

              <table className="attendanceTable">

                <thead>

                  <tr>
                    <th>DATE</th>
                    <th>CHECK-IN</th>
                    <th>CHECK-OUT</th>
                    <th>WORKING HOURS</th>
                    <th>STATUS</th>
                  </tr>

                </thead>

                <tbody>

                  {weeklyAttendance.map((item) => (

                    <tr
                      key={item.date}
                      className={`row-${item.status
                        .toLowerCase()
                        .replace(/\s+/g, '-')}`}
                    >

                      <td>

                        <div className="dateCell">

                          <strong>
                            {formatDisplayDate(item.date)}
                          </strong>

                          <span>
                            {item.day}
                          </span>

                        </div>

                      </td>


                      <td>
                        {formatTime(item.checkIn)}
                      </td>


                      <td>
                        {formatTime(item.checkOut)}
                      </td>


                      <td>
                        <strong className="hoursValue">
                          {formatWorkingHours(
                            item.workingHours
                          )}
                        </strong>
                      </td>


                      <td>

                        <span
                          className={`tableStatus status-${item.status
                            .toLowerCase()
                            .replace(/\s+/g, '-')}`}
                        >
                          <span className="statusDot"></span>
                          {item.status}
                        </span>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>


            {/* Mobile Cards */}

            <div className="attendanceMobileList">

              {weeklyAttendance.map((item) => (

                <div
                  className={`attendanceMobileCard mobile-${item.status
                    .toLowerCase()
                    .replace(/\s+/g, '-')}`}
                  key={item.date}
                >

                  <div className="mobileCardTop">

                    <div className="mobileDate">

                      <strong>
                        {formatDisplayDate(item.date)}
                      </strong>

                      <span>
                        {item.day}
                      </span>

                    </div>


                    <span
                      className={`tableStatus status-${item.status
                        .toLowerCase()
                        .replace(/\s+/g, '-')}`}
                    >
                      <span className="statusDot"></span>
                      {item.status}
                    </span>

                  </div>


                  <div className="mobileCardDetails">

                    <div>
                      <span>Check In</span>
                      <strong>
                        {formatTime(item.checkIn)}
                      </strong>
                    </div>

                    <div>
                      <span>Check Out</span>
                      <strong>
                        {formatTime(item.checkOut)}
                      </strong>
                    </div>

                    <div>
                      <span>Hours</span>
                      <strong>
                        {formatWorkingHours(
                          item.workingHours
                        )}
                      </strong>
                    </div>

                  </div>

                </div>

              ))}

            </div>

          </>

        )}

      </div>

    </div>
  );
};

export default Attendance;