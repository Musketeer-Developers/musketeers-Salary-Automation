import {
  BookOutlined,
  MailOutlined,
  PhoneOutlined,
  ExportOutlined,
  ContainerOutlined,
  ClockCircleOutlined,
  KeyOutlined,
  DollarOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

import {
  DeleteButton,
  DateField,
  NumberField,
  ShowButton,
  Show,
} from "@refinedev/antd";
import { ErrorComponent } from "@refinedev/antd";
import { API_URL } from "../../constants";
import { useEffect, useState } from "react";
import axios from "axios";
import { Col, Row } from "antd";
import { Account, EmployeeAttributes } from "../../types";
import { Flex, Form, Card, Divider, Typography, Table } from "antd";
import { PostShow } from "../../components/index";
import { ShowTextAndIcon } from "../../components/forms/ShowForm";

import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Button } from "antd"; // Assuming you're using antd for UI components
import { token } from "../../constants";
import { useParams } from "react-router-dom";
import { EditEmployee } from "../../components/index";
import ButtonsComponent from "../../components/add_buttons/Buttons";
import HubstaffHours from "../../components/add_buttons/add_hubstaff";
import { isDate } from "util/types";

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <Button
      type="link"
      icon={<ArrowLeftOutlined />}
      onClick={() => navigate("/")}
    >
      {/* Back */}
    </Button>
  );
};

export const EmployeeProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [person, setPerson] = useState<Account | null>(null);
  const [monthSalary, setMonthSalary] = useState<any[]>([]);
  const [dailyData, setdailyData] = useState<any[] | null>([]);
  // const [monthlyReporting, setMonthlyReport] = useState<lastMonth>(null);
  const [monthlyReport, setMonthlyReporting] = useState<
    readonly {
      monthName: string;
      requiredHours: number;
      workedHours: number;
      absences: number;
      paidLeaves: number;
      lateCount: number;
      monthlyEarnedAmount: number;
      monthID: number;
    }[]
  >([]);

  const navigate = useNavigate();
  const goToDailyLogs = (monthID: number, activeParam: string) => {
    console.log(monthID, activeParam);
    navigate(`/daily/${id}/${monthID}/${encodeURIComponent(activeParam)}`);
  };

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
      const bankDetails = attributes.bank_detail;
      const bankDetailsID = attributes.bank_detail?.id;
      setPerson({ ...attributes, imageUrl, bankDetails, bankDetailsID });
    } catch (error) {
      console.log("Error while fetching person", error);
    }
  };

  const fetchMonth = async () => {
    try {
      const attributes = await fetchEmployee();
      const monthlySalaries = attributes.monthly_salaries;
      const resp = await axios.get(`${API_URL}/monthly-salaries?populate=*`, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      });
      const msAttribtes = resp.data.data;
      const mID = msAttribtes[msAttribtes.length - 1].month_data.id;
      const monthlySalariesWithNames = await Promise.all(
        monthlySalaries.map(async (item: any) => {
          const response2 = await axios.get(`${API_URL}/months-data/${mID}`, {
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          });
          return {
            id: item.id, // Ensure id is returned
            month:
              response2.data.data.month.charAt(0).toUpperCase() +
              response2.data.data.month.slice(1),
            ...item,
          };
        })
      );
      setMonthSalary(monthlySalariesWithNames || []);
      return monthlySalariesWithNames;
    } catch (error) {
      console.log("Error while fetching month", error);
    }
  };

  const fetchDailyWork = async () => {
    try {
      const attributes = await fetchEmployee();
      const monthlySalariesID = attributes.monthly_salaries[attributes.monthly_salaries.length - 1]?.id;
      const resp = await axios.get(`${API_URL}/monthly-salaries/${monthlySalariesID}?populate=*`, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      });
      const msAttribtes = resp.data.data;
      const dailyData = await Promise.all(
        msAttribtes.dailyWorks.map(async (item: any) => {
          const workDate = item.workDate;
          const hubstaffHours =  item.hubstaffHours || 0;
          const manualHours =  item.manualHours || 0;
          const totalHours = hubstaffHours + manualHours;
          const hourRate = msAttribtes.monthlyRate;
          const earnedAmount = totalHours * hourRate;
          return {
            ...item,
            monthID: msAttribtes.month_data.id,
            month: msAttribtes.month_data.month.charAt(0).toUpperCase() +
            msAttribtes.month_data.month.slice(1),
            workDate,
            totalHours,
            earnedAmount,
            hubstaffHours,
            manualHours,
            hourRate,
          }
        })
      )
      // console.log("dailyData : ",dailyData);
      return {
          dailyData
      }
    } catch (error) {
      console.log("Error while fetching daily", error);
    }
  };

  const fetchLastDayWork = async () => {
    try {
      const allDayWork = await fetchDailyWork(); // Ensure fetchDailyWork is correctly defined and used
      if (!allDayWork) throw new Error("Failed to fetch daily work data");
  
      // Get the last working day
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - 1);
      const formattedDate = currentDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
      console.log(`Current Date: ${formattedDate}`);
  
      // Find the last day's work
      const lastDayWork = allDayWork.dailyData.find((dayWork) => {
        const workDate = new Date(dayWork.workDate);
        const formattedWorkDate = new Date(
          workDate.getFullYear(),
          workDate.getMonth(),
          workDate.getDate()
        ).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        });
        return formattedWorkDate === formattedDate;
      });
  
      console.log(lastDayWork);
      setdailyData([lastDayWork]); // Ensure setdailyData is defined in your scope
      return lastDayWork;
    } catch (error) {
      console.log("Error while fetching daily work data", error);
      return null; // or rethrow the error: throw error;
    }
  };
  
  

  const fetchAllMonthlyReport = async () => {
    try {
      const attributesEmployee: EmployeeAttributes = await fetchEmployee();
      const attributesDaily = await fetchDailyWork();
      const monthAttributes = await fetchLastDayWork();
      const monthName = monthAttributes?.month;
      let requiredHours = 0;
      const workedHoursOfAll: number[] = [];
      const EarnedAmountOfAll: number[] = [];
      if (attributesDaily) {
        requiredHours = attributesDaily?.dailyData.length * 8;
        for (let i = 0; i < attributesDaily?.dailyData.length; i++) {
          workedHoursOfAll.push(attributesDaily?.dailyData[i].totalHours);
          EarnedAmountOfAll.push(attributesDaily?.dailyData[i].earnedAmount);
        }
      }
      const workedHours = workedHoursOfAll.reduce((a, b) => a + b, 0);
      const monthlyEarnedAmount = EarnedAmountOfAll.reduce((a, b) => a + b, 0);
      const paidLeaves = attributesEmployee.leavesRemaining;
      const emp = await fetchEmployee();
      const monthID = emp.monthly_salaries[emp.monthly_salaries.length - 1].id;
      const monthlyy = emp.monthly_salaries[emp.monthly_salaries.length - 1];
      const absences = monthlyy.absentCount;
      const lateCount = monthlyy.lateCount;
      const report = {
        monthName,
        requiredHours,
        workedHours,
        absences,
        paidLeaves,
        lateCount,
        monthlyEarnedAmount,
        monthID
      };
      setMonthlyReporting([report]);
      return report;
    } catch (error) {
      console.log("Error while fetching All monthly report", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchLastDayWork();
      await fetchMonth();
      await fetchPerson();

      await fetchAllMonthlyReport(); // This will ensure monthlyReport is updated after all data is fetched
    };

    fetchData();
  }, [id]);

  if (!person) {
    return <ErrorComponent />; // Added error page
  }

  return (
    <Show
      title={
        <div style={{ display: "flex", alignItems: "center" }}>
          <BackButton />
          <span style={{ marginLeft: "10px" }}>Accounts</span>
        </div>
      }
      headerButtons={() => null}
      contentProps={{
        styles: {
          body: {
            padding: 0,
          },
        },
        style: {
          background: "transparent",
          boxShadow: "none",
        },
      }}
    >
      <Form layout="vertical">
        <Row>
          <Col span={24}>
            <Flex gap={16} justify="space-between">
              <Flex gap={16} align="center">
                <img
                  src={person.imageUrl || "https://via.placeholder.com/150"} // Updated to use dynamic image URL
                  style={{
                    borderRadius: "30px",
                    maxWidth: "200px",
                    height: "150px",
                  }}
                  alt="Employee"
                />
                <h1>{person.Name || "Name of Employee"}</h1>
              </Flex>
              <Flex gap={16}>
                <ButtonsComponent />
              </Flex>
            </Flex>
          </Col>
        </Row>
        <Row
          gutter={32}
          style={{
            marginTop: "32px",
          }}
        >
          <Col xs={{ span: 24 }} xl={{ span: 8 }}>
            <Card
              bordered={false}
              styles={{ body: { padding: 0 } }}
              title={
                <Flex justify="space-between">
                  <Flex gap={12} align="center">
                    <BookOutlined />
                    <Typography.Text>Employee info</Typography.Text>
                  </Flex>
                  <Flex>
                    <EditEmployee {...person} />
                  </Flex>
                </Flex>
              }
            >
              <ShowTextAndIcon
                formItemProps={{
                  name: "id",
                  label: "Employee ID",
                }}
                placeholder={person.empNo || "MUSK-YY-NNNN"}
                icon={<KeyOutlined />}
                variant="text"
                loading={false}
              />
              <Divider style={{ margin: 0 }} />
              <ShowTextAndIcon
                formItemProps={{
                  name: "email",
                  label: "Employee Email",
                }}
                placeholder={person.email || "rehan@gmail.com"}
                icon={<MailOutlined />}
                variant="text"
                loading={false}
              />
              <Divider style={{ margin: 0 }} />
              <ShowTextAndIcon
                formItemProps={{
                  name: "phone",
                  label: "Phone #",
                }}
                placeholder={person.phoneNo || "+92 3xx xxx xxxx"}
                icon={<PhoneOutlined />}
                variant="text"
                loading={false}
              />
              <Divider style={{ margin: 0 }} />
              <ShowTextAndIcon
                formItemProps={{
                  name: "designation",
                  label: "Designation",
                }}
                placeholder={person.Designation || "Software Engineer"}
                icon={<DollarOutlined />}
                variant="text"
                loading={false}
              />

              <Divider style={{ margin: 0 }} />
              <ShowTextAndIcon
                formItemProps={{
                  name: "employement_status",
                  label: "Employement Status",
                }}
                placeholder={person.employementStatus || "Employement Status"}
                icon={<DollarOutlined />}
                variant="text"
                loading={false}
              />
              <Divider style={{ margin: 0 }} />
              <ShowTextAndIcon
                formItemProps={{
                  name: "hubstaff_status",
                  label: "Hubstaff Status",
                }}
                placeholder={person.hubstaffEnabled ? "Enabled" : "Disabled"}
                icon={<ClockCircleOutlined />}
                variant="text"
                loading={false}
              />
              <Divider style={{ margin: 0 }} />
              <ShowTextAndIcon
                formItemProps={{
                  name: "current_salary",
                  label: "Current Salary",
                }}
                placeholder={person.grossSalary?.toString() || "99,999"}
                icon={<DollarOutlined />}
                variant="text"
                loading={false}
              />
              <Divider style={{ margin: 0 }} />
              <ShowTextAndIcon
                formItemProps={{
                  name: "date_of_joining",
                  label: "Date of Joining",
                }}
                placeholder={person.joinDate || "DD MM YYYY"}
                icon={<CalendarOutlined />}
                variant="text"
                loading={false}
              />
              <Divider style={{ margin: 0 }} />
              <ShowTextAndIcon
                formItemProps={{
                  name: "date_of_permanent_staus",
                  label: "Date of Permanent Status",
                }}
                placeholder={person.permanentDate || "Not yet"}
                icon={<CalendarOutlined />}
                variant="text"
                loading={false}
              />
              <Divider style={{ margin: 0 }} />
              <ShowTextAndIcon
                formItemProps={{
                  name: "date_of_last_working_day",
                  label: "Date of Last Working Day",
                }}
                placeholder={person.lastWorkingDay || "Currently Employed"}
                icon={<CalendarOutlined />}
                variant="text"
                loading={false}
              />
            </Card>
            {/*See Bank Details*/}
            <PostShow bankDetails={person.bankDetails} />
            <DeleteButton
              size="large"
              type="text"
              style={{
                marginTop: "16px",
              }}
              onSuccess={() => {
                console.log("success");
              }}
            >
              Delete account
            </DeleteButton>
          </Col>
          <Col xs={{ span: 24 }} xl={{ span: 16 }}>
            <Card
              bordered={false}
              title={
                <Flex gap={12} align="center">
                  <ClockCircleOutlined />
                  <Typography.Text>Yesterday's Report</Typography.Text>
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
              <Table
                dataSource={dailyData || []}
                rowKey={"id"}
                pagination={false}
              >
                <Table.Column
                  title="Date"
                  dataIndex="workDate"
                  key="workDate"
                  align="center"
                  render={(date) => (
                    <DateField value={date} format="D MMM YYYY" />
                  )}
                />
                <Table.Column
                  title="Total Hours"
                  dataIndex="totalHours"
                  key="totalHours"
                  align="center"
                />
                <Table.Column
                  title="Hubstaff Hours"
                  dataIndex="hubstaffHours"
                  key="hubstaffHours"
                  align="center"
                />
                <Table.Column
                  title="Manual Hours"
                  dataIndex="manualHours"
                  key="manualHours"
                  align="center"
                />
                <Table.Column
                  title="Hour Rate"
                  dataIndex="hourRate"
                  key="hourRate"
                  align="center"
                />
                <Table.Column
                  title="Earned Amount"
                  dataIndex="earnedAmount"
                  key="earnedAmount"
                  align="center"
                  render={(total) => (
                    <NumberField
                      value={total}
                      options={{ style: "currency", currency: "pkr" }}
                    />
                  )}
                />
              </Table>
            </Card>

            <Card
              bordered={false}
              title={
                <Flex gap={12} align="center">
                  <CalendarOutlined />
                  <Typography.Text>Monthly Report</Typography.Text>
                </Flex>
              }
              style={{ marginTop: "32px" }}
              styles={{
                header: {
                  padding: "0 16px",
                },
                body: {
                  padding: "0",
                },
              }}
            >
              <Table
                dataSource={monthlyReport || []}
                rowKey={"monthID"}
                pagination={false}
              >
                {/* <Table.Column title="ID" dataIndex="monthID" key="monthID" align="center" /> */}
                <Table.Column
                  title="Month"
                  dataIndex="monthName"
                  key="monthName"
                  align="center"
                />
                <Table.Column
                  title="Required Hours"
                  dataIndex="requiredHours"
                  key="requiredHours"
                  align="center"
                />
                <Table.Column
                  title="Worked Hours"
                  dataIndex="workedHours"
                  key="workedHours"
                  align="center"
                />
                <Table.Column
                  title="Absences"
                  dataIndex="absences"
                  key="absences"
                  align="center"
                />
                <Table.Column
                  title="Paid Leaves"
                  align="center"
                  dataIndex="paidLeaves"
                  key="paidLeaves"
                />
                <Table.Column
                  title="Late Count"
                  align="center"
                  dataIndex="lateCount"
                  key="lateCount"
                />
                <Table.Column
                  title="Earned"
                  dataIndex="monthlyEarnedAmount"
                  key="monthlyEarnedAmount"
                  align="center"
                  width={150}
                  render={(total) => (
                    <NumberField
                      value={total}
                      options={{ style: "currency", currency: "pkr" }}
                    />
                  )}
                />
                <Table.Column
                  title="Details"
                  key="actions"
                  align="center"
                  width={64}
                  render={(records) => (
                    <ShowButton
                      size="small"
                      onClick={() => goToDailyLogs(records.monthID, "false")}
                      hideText
                      icon={<ExportOutlined />}
                    />
                  )}
                />
              </Table>
            </Card>

            <Card
              bordered={false}
              title={
                <Flex gap={12} align="center">
                  <ContainerOutlined />
                  <Typography.Text>Previous Records</Typography.Text>
                </Flex>
              }
              style={{ marginTop: "32px" }}
              styles={{
                header: {
                  padding: "0 16px",
                },
                body: {
                  padding: 0,
                },
              }}
            >
              <Table dataSource={monthSalary}>
                {/* <Table.Column title="ID" dataIndex="id" key="id" align="center" /> */}
                <Table.Column title="Month" dataIndex="month" key="month" align="center" />
                <Table.Column
                  title="Required Hours"
                  dataIndex="TotalHoursMonth"
                  key="TotalHoursMonth"
                  align="center"
                />
                <Table.Column
                  title="Worked Hours"
                  dataIndex="hoursLogged"
                  key="hoursLogged"
                  align="center"
                />
                <Table.Column
                  title="Net Salary"
                  dataIndex="grossSalaryEarned"
                  key="grossSalaryEarned"
                  align="center"
                  render={(total) => (
                    <NumberField
                      value={total}
                      options={{ style: "currency", currency: "pkr" }}
                    />
                  )}
                />
                <Table.Column
                  title="Details"
                  align="center"
                  key="actions"
                  width={64}
                  render={(records) => {
                    return (
                      <ShowButton
                        size="small"
                        onClick={() => goToDailyLogs(records.id, "true")}
                        hideText
                        icon={<ExportOutlined />}
                      />
                    );
                  }}
                />
              </Table>
            </Card>
          </Col>
        </Row>
      </Form>
    </Show>
  );
};
