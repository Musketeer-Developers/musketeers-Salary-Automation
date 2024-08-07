import { PropsWithChildren, useState, useEffect } from "react";
import { List, NumberField } from "@refinedev/antd";
import { Col, Row, Space, Table, Card, Typography, Button, Flex } from "antd";
import { ClockCircleOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../constants";
import { Account } from "../../types";
import { Monthlylog } from "../../components/index";
import { axiosInstance } from "../../authProvider";

interface TableData {
  date: string;
}

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
      />
    );
  };

  useEffect(() => {
    const fetchEmployee = async () => {
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

    const fetchPerson = async () => {
      try {
        const attributes = await fetchEmployee();
        const imageUrl = API_URL.slice(0, -4) + attributes.image?.url;
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
            (item: any) => item.id == monthID
          );

          if (selectedMonth) {
            const response = await axiosInstance.get(
              `${API_URL}/daily-works?filters[salaryMonth][id][$eq]=${selectedMonth.id}&populate=*`,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            const dailyRecords = response.data.data;
            dailyWorkData = dailyRecords.map((dailyDataAttributes: any) => {
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
        // console.log("dailyWorkData", dailyWorkData);
        setdailyData(dailyWorkData || []);
      } catch (error) {
        console.log("Error while fetching daily", error);
      }
    };

    fetchPerson();
    fetchDailyWork();
  }, [id, monthID]);

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
            <Flex gap={16} justify="space-between">
              <Flex gap={16} align="center">
                <img
                  src={person?.imageUrl || "https://via.placeholder.com/150"}
                  style={{
                    borderRadius: "30px",
                    maxWidth: "200px",
                    height: "150px",
                  }}
                  alt="Employee"
                />
                <h1>{person?.Name || "Name of Employee"}</h1>
              </Flex>
            </Flex>
          </Col>
        </Row>
        <Row
          gutter={32}
          style={{
            marginTop: "32px",
          }}
        ></Row>
        <Row>
          <Col span={24}>
            <Space
              direction="vertical"
              size={16}
              style={{ width: "100%", marginBottom: "30px" }}
            >
              <Card
                bordered={false}
                title={
                  <Space align="center">
                    <ClockCircleOutlined />
                    <Typography.Text>Daily Details</Typography.Text>
                  </Space>
                }
              >
                <Table
                  dataSource={
                    dailyData?.map((item) => ({ ...item, key: item.id })) || []
                  }
                  rowKey="id"
                >
                  <Table.Column
                    title="Date"
                    dataIndex="date"
                    key="daily_date"
                    width={80}
                    defaultSortOrder={"ascend"}
                    sorter={(a: TableData, b: TableData) =>
                      new Date(a.date)?.getTime() - new Date(b.date)?.getTime()
                    }
                  />
                  <Table.Column
                    title="Total Hours"
                    dataIndex="totalHours"
                    key="daily_totalHours"
                    width={80}
                  />
                  <Table.Column
                    title="Hubstaff Hours"
                    dataIndex="hubstaffHours"
                    key="daily_hubstaffHours"
                    width={80}
                  />
                  <Table.Column
                    title="Manual Hours"
                    dataIndex="manualHours"
                    key="daily_manualHours"
                    width={80}
                  />
                  <Table.Column
                    title="Hour Rate"
                    dataIndex="hourRate"
                    key="daily_hourRate"
                    width={80}
                    render={(total) => (
                      <NumberField
                        value={total}
                        options={{ style: "currency", currency: "pkr" }}
                      />
                    )}
                  />
                  <Table.Column
                    title="Earned Amount"
                    dataIndex="earnedAmount"
                    key="daily_earnedAmount"
                    width={80}
                    render={(total) => (
                      <NumberField
                        value={total}
                        options={{ style: "currency", currency: "pkr" }}
                      />
                    )}
                  />
                </Table>
              </Card>
            </Space>
            {activeParam === "true" ? (
              <Monthlylog id={id || ""} monthID={monthID || ""} />
            ) : null}
          </Col>
        </Row>
      </List>
      {children}
    </>
  );
};
