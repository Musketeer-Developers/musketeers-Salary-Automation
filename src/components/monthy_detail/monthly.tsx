import { Flex, Table, Card, Typography, Space } from "antd";
import { DollarOutlined, CalendarOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL} from "../../constants";
import { NumberField } from "@refinedev/antd";
import {axiosInstance } from '../../authProvider';

interface MonthlylogProps {
  id: string;
  monthID: string;
}

export const Monthlylog = ({ id, monthID }: MonthlylogProps) => {
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [holidaysCount, setHolidaysCount] = useState(0);
  const [paidLeaves, setPaidLeaves] = useState(0);
  const [netSalary, setNetSalary] = useState(0);

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

    const fetchDailyWork = async () => {
      try {
        const attributes = await fetchEmployee();
        console.log("Attributes:", attributes);
        const monthlySalaries = attributes.monthly_salaries;
        const paidLeaves = attributes.leavesRemaining;
        setPaidLeaves(paidLeaves);

        const response = await axiosInstance.get(`${API_URL}/months-data`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        let holidaysCount = 0;
        for (let i = 0; i < response.data.data.length; i++) {
          if (response.data.data[i].id == monthID) {
            holidaysCount = response.data.data[i].holidayCount;
          }
        }
        setHolidaysCount(holidaysCount);

        console.log("Holidays Count:", holidaysCount);
        console.log("Paid Leaves:", paidLeaves);
        console.log("Monthly Salaries:", monthlySalaries);

        if (monthID !== undefined) {
          const selectedMonth = monthlySalaries.find(
            (item: any) => item.id == monthID
          );
          const netSalary =
            parseInt(selectedMonth?.basicSalary || 0) +
            parseInt(selectedMonth?.medicalAllowance || 0) -
            parseInt(selectedMonth?.WHT || 0);
          setNetSalary(netSalary);

          const updatedSelectedMonth = {
            ...selectedMonth,
            holidaysCount,
            paidLeaves,
            netSalary,
          };

          console.log("Net Salary:", netSalary);
          console.log("Selected Month:", updatedSelectedMonth);
          setMonthlyData(updatedSelectedMonth ? [updatedSelectedMonth] : []);
        }
      } catch (error) {
        console.log("Error while fetching daily work", error);
      }
    };

    fetchDailyWork();
  }, [id, monthID]);

  useEffect(() => {
    console.log("Monthly Data Updated:", monthlyData);
  }, [monthlyData]);

  return (
    <>
      <Space
        direction="vertical"
        size={16}
        style={{ width: "100%", marginBottom: "30px" }}
      >
        <Card
          bordered={false}
          title={
            <Flex gap={12} align="center">
              <CalendarOutlined />
              <Typography.Text>Monthly Overview</Typography.Text>
            </Flex>
          }
        >
          <Table dataSource={monthlyData} rowKey="id" pagination={false}>
            <Table.Column
              title="Remaining paid leaves till now"
              dataIndex="paidLeaves"
              width={80}
              key="paidLeaves"
              align="center"
            />
            <Table.Column
              title="No of absence"
              dataIndex="absentCount"
              key="absentCount"
              width={80}
              align="center"
            />
            <Table.Column
              title="Late count"
              dataIndex="lateCount"
              key="lateCount"
              width={80}
              align="center"
            />
            <Table.Column
              title="Salary paid"
              dataIndex="paidSalary"
              key="paidSalary"
              width={80}
              render={(total) => (
                <NumberField
                  value={total}
                  options={{ style: "currency", currency: "pkr", maximumFractionDigits: 0 }}
                />
              )}
              align="center"
            />
            <Table.Column
              title="Public holidays"
              dataIndex="holidaysCount"
              key="holidaysCount"
              width={80}
              align="center"
            />
          </Table>
        </Card>
      </Space>

      <Space
        direction="vertical"
        size={16}
        style={{ width: "100%", marginBottom: "30px" }}
      >
        <Card
          bordered={false}
          title={
            <Flex gap={12} align="center">
              <DollarOutlined />
              <Typography.Text>Salary Details</Typography.Text>
            </Flex>
          }
        >
          <Table dataSource={monthlyData} rowKey="id" pagination={false}>
            <Table.Column
              title="Withholding tax"
              dataIndex="WTH"
              width={80}
              align="center"
              render={(total) => (
                <NumberField
                  value={total}
                  options={{ style: "currency", currency: "pkr", maximumFractionDigits: 0 }}
                />
              )}
            />
            <Table.Column
              title="Basic Salary"
              dataIndex="basicSalary"
              key="basicSalary"
              align="center"
              width={80}
              render={(total) => (
                <NumberField
                  value={total}
                  options={{ style: "currency", currency: "pkr", maximumFractionDigits: 0 }}
                />
              )}
            />
            <Table.Column
              title="Medical Allowance"
              dataIndex="medicalAllowance"
              key="medicalAllowance"
              align="center"
              width={80}
              render={(total) => (
                <NumberField
                  value={total}
                  options={{ style: "currency", currency: "pkr", maximumFractionDigits: 0 }}
                />
              )}
            />
            <Table.Column
              title="Gross Salary"
              dataIndex="grossSalaryEarned"
              key="grossSalaryEarned"
              align="center"
              width={80}
              render={(total) => (
                <NumberField
                  value={total}
                  options={{ style: "currency", currency: "pkr", maximumFractionDigits: 0 }}
                />
              )}
            />
            <Table.Column
              title="Net salary"
              dataIndex="netSalary"
              key="netSalary"
              align="center"
              width={80}
              render={(total) => (
                <NumberField
                  value={total}
                  options={{ style: "currency", currency: "pkr", maximumFractionDigits: 0 }}
                />
              )}
            />
          </Table>
        </Card>
      </Space>
    </>
  );
};
