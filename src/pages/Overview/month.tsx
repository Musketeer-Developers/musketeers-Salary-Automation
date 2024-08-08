import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { axiosInstance } from "../../authProvider";
import { API_URL } from "../../constants";
import type { PropsWithChildren } from "react";
import Holiday from '../../components/add_buttons/add_holiday';
import { Typography } from 'antd';
import {WarningOutlined} from '@ant-design/icons';

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
  const [events, setEvents] = useState<EventInterface[]>([
    // Dummy event for Independence Day
    {
      title: "Independence Day",
      start: new Date(2024, 7, 14), // Note: JavaScript months are zero-indexed, August is 7
      end: new Date(2024, 7, 14),
      allDay: true,
      color: "green"
    }
  ]);
  const [ismonth, setismonth] = useState(true);
  const [visibleModal, setVisibleModal] = useState("");
  const [validRange, setValidRange] = useState<DateRange>({
    start: new Date(),
    end: new Date()
  });

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
      }
      else {
        setismonth(false);
      }
    } catch (error) {
      console.error("Failed to fetch valid months", error);
    }
  };

  useEffect(() => {
    fetchValidMonths();
  }, []);

  const handleDateClick = (arg: any) => {
    const dayOfWeek = arg.date.getDay();
    if (dayOfWeek === 6 || dayOfWeek === 0) {
      console.log('Weekend clicked: No action taken');
    } else {
      console.log('Date clicked', arg.dateStr);
      setVisibleModal("1");
    }
  };

  return (
    <>
      {ismonth ?
        <>
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
          />
          <Holiday
            isVisible={visibleModal === "1"}
            handleClose={handleClose}
          />
        </>
        :
        <>
          <Title level={4}><WarningOutlined style={{color:"#ffcc00"}}/> No Month Available</Title>
        </>
    }
      {children}
    </>
  );
};

export default Month;
