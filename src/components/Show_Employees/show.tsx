import type { PropsWithChildren } from "react";
import { CreateButton, EditButton, List } from "@refinedev/antd";
import { useState, useEffect } from "react";
import { EyeOutlined } from "@ant-design/icons";
import { Flex, Table } from "antd";
import axios from "axios";
import { useModal } from "../../contexts/context-modal";
import { useNavigate } from "react-router-dom";
import { Account } from "../../types";
import { API_URL } from "../../constants";
import Holiday from "../add_buttons/add_holiday";
import Month from "../add_buttons/add_month";
import HubstaffFile from "../add_buttons/add_hubstaffFile";
import { token } from "../../constants";
import { EmployeeAttributes } from "../../types";

export const ShowEmployees = ({ children }: PropsWithChildren) => {
  const [visibleModal, setVisibleModal] = useState("");
  const { showModal } = useModal();
  const [data, setData] = useState<any[]>([]);
  const handleClose = () => {
    setVisibleModal("");
  };

  const fetchEmployee = async (id) => {
    try {
      const response = await axios.get(
        `${API_URL}/employees/${id}?populate=*`,
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.log("Error while fetching employee", error);
    }
  };

  const fetchDailyWork = async (id) => {
    try {
      const attributes = await fetchEmployee(id);
      const monthlySalariesID =
        attributes.monthly_salaries[attributes.monthly_salaries.length - 1]?.id;
      const resp = await axios.get(
        `${API_URL}/monthly-salaries/${monthlySalariesID}?populate=*`,
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        }
      );
      const msAttribtes = resp.data.data;
      const dailyData = await Promise.all(
        msAttribtes.dailyWorks.map(async (item) => {
          const hubstaffHours = item.hubstaffHours || 0;
          const manualHours = item.manualHours || 0;
          const totalHours = hubstaffHours + manualHours;
          const hourRate = msAttribtes.monthlyRate;
          return {
            ...item,
            totalHours,
            earnedAmount: totalHours * hourRate,
            hourRate,
          };
        })
      );
      return { dailyData };
    } catch (error) {
      console.log("Error while fetching daily", error);
    }
  };
  const fetchAllMonthlyReport = async (id) => {
    try {
      const attributesDaily = await fetchDailyWork(id);
      if (attributesDaily) {
        const workedHours = attributesDaily.dailyData.reduce(
          (total, item) => total + item.totalHours,
          0
        );
        return workedHours;
      } else {
        throw new Error("Failed to fetch daily work data");
      }
    } catch (error) {
      console.log("Error while fetching all monthly report", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/employees?populate=*`, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      });
      const employees = await Promise.all(
        response.data.data.map(async (item) => {
          const imageUrl = item.image?.url;
          const monthlyData = item.monthly_salaries;
          const report = (await fetchAllMonthlyReport(item.id)) || 0;
          const hoursLogged = report; // Assign the report value to hoursLogged
          const income =
            monthlyData[monthlyData.length - 1]?.hoursLogged *
              monthlyData[monthlyData.length - 1]?.monthlyRate || 0;
          let hubstaffEnable = "";
          if (item.hubstaffEnabled) {
            hubstaffEnable = "Enabled";
          } else {
            hubstaffEnable = "Exempt";
          }
          return {
            ...item,
            imageUrl,
            hubstaffEnable,
            hoursLogged,
            income,
          };
        })
      );
      setData(employees);
    } catch (error) {
      console.log("Error while fetching data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const navigate = useNavigate();
  const goToprofile = (id: number) => {
    console.log(`goToprofile of ${id} clicked`);
    navigate(`/profile/${id}`);
  };
  return (
    <>
      <List
        title="Overview"
        headerButtons={() => {
          return (
            <>
              <CreateButton size="large" onClick={() => setVisibleModal("2")}>
                Month
              </CreateButton>
              <CreateButton size="large" onClick={() => setVisibleModal("1")}>
                Holiday
              </CreateButton>
              <CreateButton size="large" onClick={showModal}>
                New Employee
              </CreateButton>
              <CreateButton size="large" onClick={() => setVisibleModal("3")}>
                Import 
              </CreateButton>
              <Holiday isVisible={visibleModal === "1"} handleClose={handleClose} />
              <Month isVisible={visibleModal === "2"} handleClose={handleClose} />
              <HubstaffFile isVisible={visibleModal === "3"} handleClose={handleClose} />
            </>
          );
        }}
      >
        <Table dataSource={data} rowKey="id">
          <Table.Column title="ID" dataIndex="id" key="id" width={20} />
          <Table.Column title="ID" dataIndex="empNo" key="empNo" width={120} />
          <Table.Column
            title="Name"
            dataIndex="Name"
            key="Name"
            width={180}
            render={(text: string, record: Account) => (
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={`http://localhost:1337${record.imageUrl}`}
                  alt="Avatar"
                  style={{
                    width: "30px",
                    height: "30px",
                    marginRight: "10px",
                    borderRadius: "50%",
                  }}
                />
                <span>{text}</span>
              </div>
            )}
            align="center"
          />
          <Table.Column
            title="Designation"
            dataIndex="Designation"
            key="Designation"
            width={80}
            align="center"
          />
          <Table.Column
            title="Email"
            dataIndex="email"
            key="email"
            width={80}
            align="center"
          />
          <Table.Column
            title="Hubstaff"
            dataIndex="hubstaffEnable"
            key="hubstaffEnable"
            width={80}
            align="center"
          />
          <Table.Column
            title="Hours Logged"
            dataIndex="hoursLogged"
            key="hoursLogged"
            width={60}
            align="center"
          />
          <Table.Column
            title="Income"
            dataIndex="income"
            key="income"
            width={80}
            align="center"
          />
          <Table.Column
            title="Profile"
            key="actions"
            fixed="right"
            align="center"
            width={40}
            render={(record) => {
              return (
                <Flex align="center" justify="center" gap={8}>
                  <EditButton
                    onClick={() => {
                      goToprofile(record.id);
                    }}
                    hideText
                    icon={<EyeOutlined />}
                  />
                </Flex>
              );
            }}
          />
        </Table>
      </List>
      {children}
    </>
  );
};
