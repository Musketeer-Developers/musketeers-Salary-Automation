import { PropsWithChildren, useState, useEffect } from "react";
import { List, NumberField } from "@refinedev/antd";
import { Col, Row, Space, Table, Button, Flex, Card } from "antd";
import { FilePdfOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../constants";
import { Account } from "../../types";
import { axiosInstance } from "../../authProvider";

export const Invoice = ({ children }: PropsWithChildren) => {
  const { id, monthID } = useParams<{
    id: string;
    monthID: string;
    activeParam: string;
  }>();
  const [data, setData] = useState<any[]>([]);
  const [person, setPerson] = useState<Account | null>(null);
  const [salary, setSalary] = useState<any[]>([]);

  const BackButton = () => {
    const navigate = useNavigate();
    return (
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(`/allemployees`)}
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

    const fetchAllMonthlyReport = async () => {
      try {
        // const attributesEmployee = await fetchEmployee();
        const emp = await fetchEmployee();
        const lastMonth = emp.monthly_salaries[emp.monthly_salaries.length - 2];
        const paidLeaves = lastMonth.paidLeavesUsed;
        const workedHours = lastMonth.hoursLogged;
        const requiredHours = lastMonth.TotalHoursMonth;
        const monthID = lastMonth.id;
        const absences = lastMonth.absentCount || 0;
        const lateCount = lastMonth.lateCount || 0;
        const mID = await fetchData();
        const response = await axiosInstance.get(
          `${API_URL}/monthly-salaries/${mID}?populate=*`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const numberOfHolidays = response.data.data.month_data.holidayCount;
        const numberOfWorkingDays = response.data.data.month_data.workingDays;
        const monthName = response.data.data.month_data.month;

        const report = {
          requiredHours,
          workedHours,
          absences,
          paidLeaves,
          lateCount,
          loan: lastMonth.loanDeduction || 0,
          hourlyRate: lastMonth.monthlyRate || 0,
          tax: lastMonth.WTH || 0,
          monthID,
          numberOfHolidays,
          numberOfWorkingDays,
          monthName,
        };
        // console.log("report:", report);
        return report;
      } catch (error) {
        console.log("Error while fetching All monthly report", error);
      }
    };

    const fetchData = async () => {
      try {
        const empAttributes = await fetchEmployee();
        const lastmonthTotal = empAttributes.monthly_salaries;
        const len = lastmonthTotal.length;
        const lastmonth = lastmonthTotal[len - 2]; // second last month data   (last month in array would be current month)
        const WHT = lastmonth.WTH || 0;
        const basicSalary = lastmonth.basicSalary || 0;
        const grossSalaryEarned = lastmonth?.grossSalaryEarned || 0;
        const medicalAllowance = lastmonth?.medicalAllowance || 0;
        const netSalary =
          parseInt(grossSalaryEarned) + parseInt(medicalAllowance) - WHT;
        const empInfo = [
          {
            basicSalary: basicSalary,
            grossSalaryEarned: grossSalaryEarned,
            medicalAllowance: medicalAllowance,
            netSalary: netSalary,
            WHT: WHT,
          },
        ];
        setData(empInfo);
        return lastmonth.id;
      } catch (error) {
        console.log("Error while fetching data", error);
      }
    };

    const fetchSalaryDetails = async () => {
      try {
        const attributes = await fetchAllMonthlyReport();
        const workingDays =
          attributes?.numberOfWorkingDays - attributes?.numberOfHolidays;
        const requiredHours = attributes?.requiredHours;
        const daysWorked = workingDays - attributes?.absences;
        const paidLeavesHours = attributes?.paidLeaves * 8;
        const holidayHours = attributes?.numberOfHolidays * 8;
        const workedHours =
          attributes?.workedHours - paidLeavesHours - holidayHours;
        const hourlyRate = attributes?.hourlyRate;
        const earnedAmountByWork = hourlyRate * workedHours;
        const earnedAmountByHolidays = hourlyRate * holidayHours;
        const earnedAmountByPaidLeaves = hourlyRate * paidLeavesHours;
        const absentHours = attributes?.absences * 8;
        const deductedAmountByAbsences = hourlyRate * absentHours;
        const daysByLate = Math.floor(attributes?.lateCount / 5);
        const lateHours = daysByLate * 8;
        const deductedAmountByLate = hourlyRate * lateHours;
        const loanDeduction = attributes?.loan;
        const tax = attributes?.tax;
        const sumByEarnedHours = earnedAmountByWork + earnedAmountByHolidays;
        const sumByDeductions = deductedAmountByLate;
        const sumAdjustment = earnedAmountByPaidLeaves - sumByDeductions;
        const totalSum = sumByEarnedHours + sumAdjustment;
        const medicalBeforeTax = totalSum / 1.1;
        const medical = medicalBeforeTax * 0.1;
        const gross = totalSum - medical;
        const netSalary = gross + medical;
        const netSalaryAfterTax = netSalary - tax;
        const netSalaryAfterLoan = netSalaryAfterTax - loanDeduction;
        const salary = [
          {
            requiredHours: requiredHours,
            daysWorked: daysWorked,
            workingDays: workingDays,
            orignalWorkedHours: attributes?.workedHours,
            workedHours: workedHours.toFixed(2),
            hourlyRate: hourlyRate,
            paidLeavesHours: paidLeavesHours,
            paidLeaves: attributes?.paidLeaves,
            earnedAmountByWork: earnedAmountByWork.toFixed(2),
            earnedAmountByHolidays: earnedAmountByHolidays.toFixed(2),
            earnedAmountByPaidLeaves: earnedAmountByPaidLeaves.toFixed(2),
            absentHours: absentHours,
            absentDays: absentHours / 8,
            deductedAmountByAbsences: deductedAmountByAbsences.toFixed(2),
            daysByLate: daysByLate,
            deductedAmountByLate: deductedAmountByLate.toFixed(2),
            loanDeduction: loanDeduction.toFixed(2),
            tax: tax.toFixed(2),
            sumByEarnedHours: sumByEarnedHours.toFixed(2),
            sumByDeductions: sumByDeductions.toFixed(2),
            sumAdjustment: sumAdjustment.toFixed(2),
            totalSum: totalSum.toFixed(2),
            medicalBeforeTax: medicalBeforeTax.toFixed(2),
            medical: medical.toFixed(2),
            gross: gross.toFixed(2),
            netSalary: netSalary.toFixed(2),
            netSalaryAfterTax: netSalaryAfterTax.toFixed(2),
            netSalaryAfterLoan: netSalaryAfterLoan.toFixed(2),
          },
        ];
        console.log("salary:", salary);
        setSalary(salary);
      } catch (error) {
        console.log("Error while fetching All monthly report", error);
      }
    };

    fetchPerson();
    fetchData();
    fetchSalaryDetails();
  }, [id, monthID]);

  return (
    <>
      <List
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <BackButton />
            <span style={{ marginLeft: "10px" }}>Salary Details</span>
          </div>
        }
        headerButtons={() => (
          <>
            <Button icon={<FilePdfOutlined />} onClick={() => window.print()}>
              Export PDF
            </Button>
          </>
        )}
        contentProps={{
          style: {
            padding: "0",
          },
        }}
      >
        <div style={{ display: "none" }}>
          <style>
            {`
      @media print {
        .header,
        .headerButtons,
        .other-elements {
          display: none;
        }
        body {
          margin: 0;
        }
      }
    `}
          </style>
        </div>

        <Row>
          <Col span={24}>
            <Flex gap={8} justify="space-start" align="center">
              <img
                src={person?.imageUrl || "https://via.placeholder.com/50"}
                style={{
                  borderRadius: "5px",
                  maxWidth: "100px",
                  height: "40px",
                }}
                alt="Employee"
              />
              <Col>
                <div>
                  <h3 style={{ margin: 0 }}>
                    {person?.Name || "Name of Employee"}
                  </h3>
                </div>
                <div>
                  <h5 style={{ color: "gray", margin: 0 }}>
                    {person?.empNo || "Emp # of Employee"}
                  </h5>
                </div>
              </Col>
            </Flex>
          </Col>
        </Row>
        <Row gutter={[8, 8]} style={{ marginTop: "8px" }}>
          <Col span={24}>
            <Card
              style={{
                borderRadius: "10px",
                boxShadow: "none",
                padding: "0px",
              }}
              headStyle={{ borderBottom: "none", fontSize: "1.25rem" }}
              bodyStyle={{ padding: "10px" }}
            >
              <Row gutter={[8, 8]}>
                <Col span={12}>
                  <Card style={{ marginTop: "2px" }}>
                    <Row>
                      <Col span={12}>
                        <strong>Total Work Days :</strong>
                      </Col>
                      <Col span={12}>{salary[0]?.workingDays || 0}</Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <strong>Used Paid Leaves: </strong>
                      </Col>
                      <Col span={12}>{salary[0]?.paidLeaves || 0}</Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <strong>Worked Days :</strong>
                      </Col>
                      <Col span={12}>{salary[0]?.daysWorked || 0}</Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <strong>Total Required Hours :</strong>
                      </Col>
                      <Col span={12}>{salary[0]?.requiredHours || 0}</Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <strong>Hour Rate :</strong>
                      </Col>
                      <Col span={12}>{salary[0]?.hourlyRate || 0}</Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <strong>Worked Hours :</strong>
                      </Col>
                      <Col span={12}>{salary[0]?.workedHours || 0}</Col>
                    </Row>
                    <hr />
                    <Row>
                      <Col span={12}>
                        <strong>Total earned by hours :</strong>
                      </Col>
                      <Col span={12}>{salary[0]?.earnedAmountByWork || 0}</Col>
                    </Row>
                  </Card>
                  <Card style={{ marginTop: "2px" }}>
                    <Row>
                      <Col span={12}>
                        <strong>Public holidays :</strong>
                      </Col>
                      <Col span={12}>{salary[0]?.numberOfHolidays || 0}</Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <strong>Total amount earned by holidays :</strong>
                      </Col>
                      <Col span={12}>
                        {salary[0]?.earnedAmountByHolidays || 0}
                      </Col>
                    </Row>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card style={{ marginTop: "4px" }}>
                    <Row>
                      <Col span={12}>
                        <strong>Number of days of absenence :</strong>
                      </Col>
                      <Col span={12}>{salary[0]?.absentDays || 0}</Col>
                    </Row>
                  </Card>
                  <Card style={{ marginTop: "26px" }}>
                    <Row>
                      <Col span={12}>
                        <strong>Number of late arrival :</strong>
                      </Col>
                      <Col span={12}>{salary[0]?.daysByLate || 0}</Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <strong>Total amount deducted :</strong>
                      </Col>
                      <Col span={12}>
                        {salary[0]?.deductedAmountByLate || 0}
                      </Col>
                    </Row>
                  </Card>
                  <Card style={{ marginTop: "26px" }}>
                    <Row>
                      <Col span={12}>
                        <strong>Number of used Paid leaves:</strong>
                      </Col>
                      <Col span={12}>{salary[0]?.paidLeaves || 0}</Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <strong>Total amount earned :</strong>
                      </Col>
                      <Col span={12}>
                        {salary[0]?.earnedAmountByPaidLeaves || 0}
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
              <Row gutter={[8, 8]} style={{ marginTop: "2px" }}>
                <Col span={24}>
                  <Card>
                    <Row>
                      <Col span={12}>
                        <strong>Total Earned Amount yet :</strong>
                      </Col>
                      <Col span={12}>{salary[0]?.totalSum || 0}</Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
              <Row gutter={[8, 8]} style={{ marginTop: "2px" }}>
                <Col span={24}>
                  <Card>
                    <Row>
                      <Col span={12}>
                        <strong>Medical Allowance :</strong>
                      </Col>
                      <Col span={12}>{salary[0]?.medical || 0}</Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <strong>Gross Salary :</strong>
                      </Col>
                      <Col span={12}>{salary[0]?.gross || 0}</Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
              <Row gutter={[8, 8]} style={{ marginTop: "2px" }}>
                <Col span={24}>
                  <Card>
                    <Row>
                      <Col span={12}>
                        <strong>Monthly Income Tax to pay :</strong>
                      </Col>
                      <Col span={12}>{salary[0]?.tax || 0}</Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <strong>Net Salary :</strong>
                      </Col>
                      <Col span={12}>{salary[0]?.netSalaryAfterTax || 0}</Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
              <Row gutter={[8, 8]} style={{ marginTop: "2px" }}>
                <Col span={24}>
                  <Card>
                    <Row>
                      <Col span={12}>
                        <strong>Loan deduction:</strong>
                      </Col>
                      <Col span={12}>{salary[0]?.loanDeduction || 0}</Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <strong>Payable Salary:</strong>
                      </Col>
                      <Col span={12}>{salary[0]?.netSalaryAfterLoan || 0}</Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </List>
      {children}
    </>
  );
};
