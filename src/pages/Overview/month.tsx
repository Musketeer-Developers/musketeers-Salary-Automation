import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { axiosInstance } from "../../authProvider";
import { API_URL } from "../../constants";
import type { PropsWithChildren } from "react";
import Holiday from '../../components/add_buttons/add_holiday';
import { Typography } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Spin } from 'antd';

const { Title } = Typography;

interface DateRange {
  start: Date;
  end: Date;
}

interface EventInterface {
  title: string;
  start: Date;
  end: Date;
  allDay: boolean,
  color?: string;
}

export const Month: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [events, setEvents] = useState<EventInterface[]>([]);
  const [ismonth, setismonth] = useState(true);
  const [visibleModal, setVisibleModal] = useState("");
  const [validRange, setValidRange] = useState<DateRange>({
    start: new Date(),
    end: new Date()
  });
  const [selectedDate, setSelectedDate] = useState(moment());
  const [isLoading, setIsLoading] = useState(false);
  const [refreshData, setRefreshData] = useState(false);

  const handleClose = () => {
    setVisibleModal("");
  };

  const months: { [key: string]: number } = {
    "january": 0,
    "february": 1,
    "march": 2,
    "april": 3,
    "may": 4,
    "june": 5,
    "july": 6,
    "august": 7,
    "september": 8,
    "october": 9,
    "november": 10,
    "december": 11,
  };

  const lastDayOfMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 1);
  };

  const fetchValidMonths = async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/months-data`);
      if (response.data.data.length > 0) {
        const startData = response.data.data[0];
        const endData = response.data.data[response.data.data.length - 1];

        const startMonthNumber = months[startData.month.toLowerCase()];
        const endMonthNumber = months[endData.month.toLowerCase()];

        const start = new Date(startData.year, startMonthNumber, 1);
        const end = lastDayOfMonth(endData.year, endMonthNumber);

        setValidRange({
          start: start,
          end: end
        });
        setismonth(true);
        await fetchEventsForMonth(start, end);
      }
      else {
        setismonth(false);
      }
    } catch (error) {
      console.error("Failed to fetch valid months", error);
    }
  };

  const handleDateClick = (arg: any) => {
    if (isLoading === false) {
      const dayOfWeek = arg.date.getDay();
      if (dayOfWeek === 6 || dayOfWeek === 0) {
        console.log('Weekend clicked: No action taken');
      } else {
        console.log('Date clicked', arg.dateStr);
        setSelectedDate(moment(arg.dateStr));
        setVisibleModal("1");
      }
    }
  };

  const fetchEventsForMonth = async (start: Date, end: Date) => {
    let current = new Date(start);
    const prevevent = [];
    while (current < end) {
      const dateStr = moment(current).format("DD-MM-YYYY");
      const response = await axiosInstance.get(`${API_URL}/month-data/get-holiday-info?date=${dateStr}`, {
        headers: {
          "Content-Type": "application/json",
        }
      })
      if (response.data.holidayName !== "No holiday name provided") {
        prevevent.push({
          title: response.data.holidayName,
          start: new Date(current),
          end: new Date(current),
          allDay: true,
          color: "green"
        });
      }
      current = new Date(current.setDate(current.getDate() + 1));
    }
    setEvents(prevevent);
    setIsLoading(false);
  };


  useEffect(() => {
    setIsLoading(true);
    fetchValidMonths();
  }, []);

  useEffect(() => {
    if (refreshData) {
      setIsLoading(true);
      fetchValidMonths();
      setRefreshData(false);
    }
  }, [refreshData]);

  return (
    <>
      {ismonth ?
        <>
          {isLoading && <Spin
            size="large"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 100
            }}
          />}
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            validRange={validRange}
            dateClick={handleDateClick}
            events={events}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,dayGridWeek,dayGridDay'
            }}
            loading={(isLoading) => {
              setIsLoading(isLoading);
            }}
          />
          <Holiday
            isVisible={visibleModal === "1"}
            handleClose={handleClose}
            selectedDate={selectedDate}
            setRefreshData={setRefreshData}
          />
        </>
        :
        <>
          <Title level={4}><WarningOutlined style={{ color: "#ffcc00" }} /> No Month Available</Title>
        </>
      }
      {children}
    </>
  );
};

export default Month;
