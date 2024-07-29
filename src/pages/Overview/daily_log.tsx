import { PropsWithChildren, useState } from "react";
import { List } from "@refinedev/antd";
import { Col, Row, Flex, Table, Card, Typography } from "antd";
import { DatePicker, Space, Button } from "antd";
import { Monthlylog } from "../../components/index";

import { ClockCircleOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { API_URL } from "../../constants";
import { Account } from "../../types";
import { token } from "../../constants";

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
          const selectedMonth = monthlySalaries.find(
            (item) => item.id == monthID
          );

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
            dailyWorkData = dailyRecords.map((dailyDataAttributes) => {
              const manualHours = dailyDataAttributes.manualHours;
              const hubstaffHours = dailyDataAttributes.hubstaffHours;
              const date = dailyDataAttributes.workDate;
              const hourRate = dailyDataAttributes.salaryMonth?.monthlyRate;
              const totalHours =
                dailyDataAttributes.hubstaffHours +
                dailyDataAttributes.manualHours;
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
        }
        setdailyData(dailyWorkData || []);
      } catch (error) {
        console.log("Error while fetching daily", error);
      }
    };

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
          {activeParam === "true" ? <Monthlylog id={id || ""} monthID={monthID || ""} /> : null}

        </Col>
      </List>

      {children}
    </>
  );
};
