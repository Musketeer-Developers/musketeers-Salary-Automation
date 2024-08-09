import { Flex, Table, Card, Typography, Space } from "antd";
import { DollarOutlined, CalendarOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { API_URL } from "../../constants";
import { NumberField } from "@refinedev/antd";
import { axiosInstance } from "../../authProvider";

interface MonthlylogProps {
  id: string;
  monthID: string;
}

export const Monthlylog = ({ id, monthID }: MonthlylogProps) => {
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [holidaysCount, setHolidaysCount] = useState(0); //holidaysCount is being used in table (NO error)
  const [paidLeaves, setPaidLeaves] = useState(0); //paidLeaves is being used in table (NO error)
  const [netSalary, setNetSalary] = useState(0); //netSalary is being used in table (NO error)

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
        const monthlySalaries = attributes.monthly_salaries;

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

        if (monthID !== undefined) {
          const selectedMonth = monthlySalaries.find(
            (item: any) => item.id == monthID
          );
          const paidLeaves = selectedMonth?.paidLeavesUsed;
          const netSalary =
            parseInt(selectedMonth?.grossSalaryEarned || 0) +
            parseInt(selectedMonth?.medicalAllowance || 0) -
            parseInt(selectedMonth?.WTH || 0);
          setNetSalary(netSalary);
          setPaidLeaves(paidLeaves);

          const updatedSelectedMonth = {
            ...selectedMonth,
            holidaysCount,
            paidLeaves,
            netSalary,
          };
          setMonthlyData(updatedSelectedMonth ? [updatedSelectedMonth] : []);
        }
      } catch (error) {
        console.log("Error while fetching daily work", error);
      }
    };

    fetchDailyWork();
  }, [id, monthID]);

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
          <Table
            dataSource={
              monthlyData?.map((item, index) => ({
                ...item,
                key: item.id || index,
              })) || []
            }
            rowKey="key"
            pagination={false}
          >
            <Table.Column
              title="Paid leaves used"
              dataIndex="paidLeaves"
              key="monthly_paidLeaves"
              width={80}
              align="center"
            />
            <Table.Column
              title="No of absence"
              dataIndex="absentCount"
              key="monthly_absentCount"
              width={80}
              align="center"
            />
            <Table.Column
              title="Late count"
              dataIndex="lateCount"
              key="monthly_lateCount"
              width={80}
              align="center"
            />
            <Table.Column
              title="Salary paid"
              dataIndex="paidSalary"
              key="monthly_paidSalary"
              width={80}
              render={(total) => (
                <NumberField
                  value={total}
                  options={{
                    style: "currency",
                    currency: "pkr",
                    maximumFractionDigits: 0,
                  }}
                />
              )}
              align="center"
            />
            <Table.Column
              title="Public holidays"
              dataIndex="holidaysCount"
              key="monthly_holidaysCount"
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
          <Table
            dataSource={
              monthlyData?.map((item) => ({ ...item, key: item.id })) || []
            }
            rowKey="id"
            pagination={false}
          >
            <Table.Column
              title="Withholding tax"
              dataIndex="WTH"
              key="monthly_WTH"
              width={80}
              align="center"
              render={(total) => (
                <NumberField
                  value={total}
                  options={{
                    style: "currency",
                    currency: "pkr",
                    maximumFractionDigits: 0,
                  }}
                />
              )}
            />
            <Table.Column
              title="Basic Salary"
              dataIndex="basicSalary"
              key="monthly_basicSalary"
              align="center"
              width={80}
              render={(total) => (
                <NumberField
                  value={total}
                  options={{
                    style: "currency",
                    currency: "pkr",
                    maximumFractionDigits: 0,
                  }}
                />
              )}
            />
            <Table.Column
              title="Medical Allowance"
              dataIndex="medicalAllowance"
              key="monthly_medicalAllowance"
              align="center"
              width={80}
              render={(total) => (
                <NumberField
                  value={total}
                  options={{
                    style: "currency",
                    currency: "pkr",
                    maximumFractionDigits: 0,
                  }}
                />
              )}
            />
            <Table.Column
              title="Gross Salary"
              dataIndex="grossSalaryEarned"
              key="monthly_grossSalaryEarned"
              align="center"
              width={80}
              render={(total) => (
                <NumberField
                  value={total}
                  options={{
                    style: "currency",
                    currency: "pkr",
                    maximumFractionDigits: 0,
                  }}
                />
              )}
            />
            <Table.Column
              title="Net salary"
              dataIndex="netSalary"
              key="monthly_netSalary"
              align="center"
              width={80}
              render={(total) => (
                <NumberField
                  value={total}
                  options={{
                    style: "currency",
                    currency: "pkr",
                    maximumFractionDigits: 0,
                  }}
                />
              )}
            />
          </Table>
        </Card>
      </Space>
    </>
  );
};
