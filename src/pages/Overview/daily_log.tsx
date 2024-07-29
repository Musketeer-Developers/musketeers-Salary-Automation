import { PropsWithChildren, useState } from "react";
import { List } from "@refinedev/antd";
import { Col, Row, Flex, Table, Card, Typography } from "antd";
import { DatePicker, Space, Button } from "antd";
import { Monthlylog } from "../../components/index";

import { ClockCircleOutlined, ArrowLeftOutlined, ControlOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { API_URL } from "../../constants";
import { Account } from "../../types";

const token =
  "04d155e0017ee802a2dac456300b42b8bff2698e093c26ae76037c76d07bc6b7c85a396f2eb82ef62c9a86cebd12baeaa35416a2274790e87a80845df9caf983132cfa60460dec70db95ce3260fc294fef311efabdf31aa4ce7f5e32b59b93a1935c7e9fa5b73b730ca3953388fe8984a3f86fde6969ea94ee956f13ea1271a5";

// const token = "9bd8af6b6900627b415eded84617f1d87d0a74136d3491a75b00c94127d77dd29763855f802afa232aedc294bc78e1c66e18c7cc854c28644288877aa7aafea65012ac05aa18230be1db9197bbed78381e8b6c2ca9ddacb5385427b594e660fabd6e269fac2464ba1e717c6b6ee48f7131ec5fb2647cf08ee83a8d761b9545b1";

export const Dailylog = ({ children }: PropsWithChildren) => {
  const { id, monthID, activeParam } = useParams<{
    id: string;
    monthID: string;
    activeParam: string;
  }>();
  const [dailyData, setdailyData] = useState<any[] | null>([]);
  const [person, setPerson] = useState<Account | null>(null);

  const BackButton = () => {
    const navigate = useNavigate();

    return (
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(`/profile/${id}`)}
      >
        {/* Back */}
      </Button>
    );
  };

  useEffect(() => {
    const fetchEmployee = async () => {
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

    const fetchPerson = async () => {
      try {
        const attributes = await fetchEmployee();
        const imageUrl = "http://localhost:1337" + attributes.image?.url;
        setPerson({ ...attributes, imageUrl });
      } catch (error) {
        console.log("Error while fetching person", error);
      }
    };

    const fetchDailyWork = async () => {
      try {
        const attributes = await fetchEmployee();
        const monthlySalaries = attributes.monthly_salaries;
    
        let dailyWorkData = [];
    
        if (monthID !== undefined) {
          const selectedMonth = monthlySalaries.find(item => item.id == monthID);
          console.log("selectedMonth:", selectedMonth);
    
          if (selectedMonth) {
            // Fetch all daily work records associated with the selected month
            const response = await axios.get(
              `${API_URL}/daily-works?filters[salaryMonth][id][$eq]=${selectedMonth.id}&populate=*`,
              {
                headers: {
                  Authorization: "Bearer " + token,
                  "Content-Type": "application/json",
                },
              }
            );
    
            const dailyRecords = response.data.data;
            dailyWorkData = dailyRecords.map(dailyDataAttributes => {
              const manualHours = dailyDataAttributes.manualHours;
              const hubstaffHours = dailyDataAttributes.hubstaffHours;
              const date = dailyDataAttributes.workDate;
              const hourRate = dailyDataAttributes.salaryMonth?.monthlyRate;
              const totalHours = dailyDataAttributes.hubstaffHours + dailyDataAttributes.manualHours;
              const earnedAmount = totalHours * hourRate;
    
              return {
                manualHours,
                hubstaffHours,
                date,
                hourRate,
                totalHours,
                earnedAmount,
              };
            });
          }
        } else {
          // Fetch data for all months
          dailyWorkData = await Promise.all(
            monthlySalaries.map(async (item) => {
              const response = await axios.get(
                `${API_URL}/daily-works?filters[salaryMonth][id][$eq]=${item.id}&populate=*`,
                {
                  headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
                  },
                }
              );
    
              const dailyRecords = response.data.data;
              return dailyRecords.map(dailyDataAttributes => {
                const manualHours = dailyDataAttributes.manualHours;
                const hubstaffHours = dailyDataAttributes.hubstaffHours;
                const date = dailyDataAttributes.workDate;
                const hourRate = dailyDataAttributes.salaryMonth?.monthlyRate;
                const totalHours = dailyDataAttributes.hubstaffHours + dailyDataAttributes.manualHours;
                const earnedAmount = totalHours * hourRate;
    
                return {
                  manualHours,
                  hubstaffHours,
                  date,
                  hourRate,
                  totalHours,
                  earnedAmount,
                };
              });
            })
          );
    
          // Flatten the nested arrays
          dailyWorkData = dailyWorkData.flat();
        }
    
        console.log("dailyWorkData:", dailyWorkData);
        setdailyData(dailyWorkData || []);
      } catch (error) {
        console.log("Error while fetching daily", error);
      }
    };
    
    fetchPerson();
    fetchDailyWork();
    
    
    fetchPerson();
    fetchDailyWork();
    
    fetchPerson();
    fetchDailyWork();
  }, [id]);

  const { RangePicker } = DatePicker;
  return (
    <>
      <List
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <BackButton />
            <span style={{ marginLeft: "10px" }}>Details</span>
          </div>
        }
        contentProps={{
          style: {
            padding: 0,
            background: "transparent",
            boxShadow: "none",
          },
        }}
      >
        <Row>
          <Col span={24}>
            <Flex
              gap={16}
              justify="space-between"
              style={{ marginBottom: "20px" }}
            >
              <Flex gap={16} align="center">
                <img
                  src={person?.imageUrl || "https://via.placeholder.com/150"} // Updated to use dynamic image URL
                  style={{
                    borderRadius: "30px",
                    maxWidth: "200px",
                    height: "150px",
                  }}
                  alt="Employee"
                />
                <h1>{person?.Name || "Name of Employee"}</h1>
              </Flex>
              <Space direction="vertical" size={12}>
                <h3>Select:</h3>
                <RangePicker />
              </Space>
            </Flex>
          </Col>
        </Row>
        <Col>
          <Space
            direction="vertical"
            size={16}
            style={{ width: "100%", marginBottom: "30px" }}
          >
            <Card
              bordered={false}
              title={
                <Flex gap={12} align="center">
                  <ClockCircleOutlined />
                  <Typography.Text>Daily Details</Typography.Text>
                </Flex>
              }
              styles={{
                header: {
                  padding: "0 16px",
                },
                body: {
                  padding: "0",
                },
              }}
            >
              <Table dataSource={dailyData || []} rowKey="id">
                <Table.Column
                  title="Date"
                  dataIndex="date"
                  key="date"
                  width={80}
                  sorter
                />
                <Table.Column
                  title="Total Hours"
                  dataIndex="totalHours"
                  key="totalHours"
                  width={80}
                />
                <Table.Column
                  title="Hubstaff Hours"
                  dataIndex="hubstaffHours"
                  key="hubstaffHours"
                  width={80}
                />
                <Table.Column
                  title="Manual Hours"
                  dataIndex="manualHours"
                  key="manualHours"
                  width={80}
                />
                <Table.Column
                  title="Hour Rate"
                  dataIndex="hourRate"
                  key="hourRate"
                  width={80}
                />
                <Table.Column
                  title="Earned Amount"
                  dataIndex="earnedAmount"
                  key="earnedAmount"
                  width={80}
                />
              </Table>
            </Card>
          </Space>
          {activeParam === "true" ? <Monthlylog  /> : null}
        </Col>
      </List>

      {children}
    </>
  );
};
