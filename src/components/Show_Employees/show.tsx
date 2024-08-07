import type { PropsWithChildren } from "react";
import { CreateButton, EditButton, List, NumberField } from "@refinedev/antd";
import { useState, useEffect } from "react";
import { EyeOutlined } from "@ant-design/icons";
import { Flex, Table } from "antd";
import { useNavigate } from "react-router-dom";
import { Account } from "../../types";
import { API_URL } from "../../constants";
import Holiday from "../add_buttons/add_holiday";
import Month from "../add_buttons/add_month";
import HubstaffFile from "../add_buttons/add_hubstaffFile";
import { axiosInstance } from "../../authProvider";
import { AddnewEmployee } from "../add_new_employee/add_new_emp";

export const ShowEmployees = ({ children }: PropsWithChildren) => {
  const [visibleModal, setVisibleModal] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshData, setRefreshData] = useState(false);

  const handleClose = () => {
    setVisibleModal("");
  };

  const fetchEmployee = async (id:number) => {
    try {
      const response = await axiosInstance.get(
        `${API_URL}/employees/${id}?populate=*`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.log("Error while fetching employee", error);
    }
  };

  const fetchDailyWork = async (id: number) => {
    try {
      const attributes = await fetchEmployee(id);
      const monthlySalariesID =
        attributes.monthly_salaries[attributes.monthly_salaries.length - 1]?.id;
      const resp = await axiosInstance.get(
        `${API_URL}/monthly-salaries/${monthlySalariesID}?populate=*`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const msAttribtes = resp.data.data;
      const dailyData = await Promise.all(
        msAttribtes.dailyWorks.map(async (item: any) => {
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
  const fetchAllMonthlyReport = async (id: number) => {
    try {
      const attributesDaily = await fetchDailyWork(id);
      if (attributesDaily) {
        const workedHours = attributesDaily.dailyData.reduce(
          (total, item) => total + item.totalHours,
          0
        );
        const workedAmount = attributesDaily.dailyData.reduce(
          (total, item) => total + item.earnedAmount,
          0
        );
        return {
          workedHours,
          workedAmount,
        };
      } else {
        throw new Error("Failed to fetch daily work data");
      }
    } catch (error) {
      console.log("Error while fetching all monthly report", error);
      return null; // or rethrow the error: throw error;
    }
  };

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(
        `${API_URL}/employees?populate=*`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const employees = await Promise.all(
        response.data.data.map(async (item: any) => {
          const imageUrl = item.image?.url;
          const report = await fetchAllMonthlyReport(item.id);
          let hoursLogged = 0;
          let income = 0;
          if (report) {
            hoursLogged = report.workedHours;
            income = report.workedAmount;
          } else {
            console.log("Failed to fetch all monthly report");
          }
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
      setLoading(false);
    } catch (error) {
      console.log("Error while fetching data", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, []);

  useEffect(() => {
    if (refreshData) {
      setLoading(true);
      fetchData();
      setRefreshData(false);
    }
  }, [refreshData]);

  const navigate = useNavigate();
  const goToprofile = (id: number) => {
    console.log(`goToprofile of ${id} clicked`);
    navigate(`/profile/${id}`);
  };
  return (
    <>
      <List
        title="Employees"
        headerButtons={() => {
          return (
            <>
              <CreateButton size="large" onClick={() => setVisibleModal("2")}>
                Month
              </CreateButton>
              <CreateButton size="large" onClick={() => setVisibleModal("1")}>
                Holiday
              </CreateButton>
              <CreateButton size="large" onClick={() => setVisibleModal("4")}>
                New Employee
              </CreateButton>
              <CreateButton size="large" onClick={() => setVisibleModal("3")}>
                Import
              </CreateButton>
              <AddnewEmployee
                isVisible={visibleModal === "4"}
                handleClose={handleClose}
                setRefreshData={setRefreshData}
              />
              <Holiday
                isVisible={visibleModal === "1"}
                handleClose={handleClose}
              />
              <Month
                isVisible={visibleModal === "2"}
                handleClose={handleClose}
              />
              <HubstaffFile
                isVisible={visibleModal === "3"}
                handleClose={handleClose}
                setRefreshData={setRefreshData}
              />
            </>
          );
        }}
      >
        <Table dataSource={data} rowKey="id" loading={loading}>
          {/* <Table.Column title="ID" dataIndex="id" key="id" width={20} /> */}
          <Table.Column title="MUSK ID" dataIndex="empNo" key="empNo" width={120} align="center" />
          <Table.Column
            title="Name"
            dataIndex="Name"
            key="Name"
            width={180}
            render={(text: string, record: Account) => (
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={`${API_URL.slice(0, -4)}${record.imageUrl}`}
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
            render={(total) => (
              <NumberField
                value={total}
                options={{ maximumFractionDigits: 1 }}
              />
            )}
          />
          <Table.Column
            title="Income"
            dataIndex="income"
            key="income"
            width={120}
            align="center"
            render={(total) => (
              <NumberField
                value={total}
                options={{
                  style: "currency",
                  currency: "pkr",
                  maximumFractionDigits: 2,
                }}
              />
            )}
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
