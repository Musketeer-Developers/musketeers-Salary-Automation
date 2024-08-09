import type { PropsWithChildren } from "react";
import { CreateButton, List, NumberField } from "@refinedev/antd";
import { useState, useEffect } from "react";
import { Flex, Table } from "antd";
import { useNavigate } from "react-router-dom";
import { Account } from "../../types";
import { API_URL } from "../../constants";
import { EditButton, ExportButton } from "@refinedev/antd";
import { EyeOutlined,ExportOutlined } from "@ant-design/icons";
import { axiosInstance } from "../../authProvider";
import Calculate from "../../components/add_buttons/calculateSalary";

export const EmployeeOverview = ({ children }: PropsWithChildren) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [monthName, setMonthName] = useState("");
  const [refreshData, setRefreshData] = useState(false);

  const fetchEmployee = async () => {
    try {
      const response = await axiosInstance.get(
        `${API_URL}/employees?populate=*`,
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

  const fetchData = async () => {
    try {
      const empAttributes = await fetchEmployee();
      // console.log("empAttributes:", empAttributes);

      const empInfo = await Promise.all(
        empAttributes.map(async (item: any) => {
          const imageURL = API_URL.slice(0, -4) + item.image?.url;
          // console.log("name: ", item.Name);
          // console.log("item:", item);
          const lastmonthTotal = item.monthly_salaries;
          const len = lastmonthTotal.length;
          const lastmonth = lastmonthTotal[len-2]; // second last month data   (last month in array would be current month)
          const WHT = lastmonth.WTH || 0;
          // console.log("WHT:", WHT);
          const basicSalary = lastmonth.basicSalary || 0;
          // console.log("basicSalary:", basicSalary);
          const grossSalaryEarned = lastmonth?.grossSalaryEarned || 0;
          // console.log("grossSalaryEarned:", grossSalaryEarned);
          const medicalAllowance = lastmonth?.medicalAllowance || 0;
          // console.log("medicalAllowance:", medicalAllowance);
          const netSalary =
            parseInt(grossSalaryEarned) + parseInt(medicalAllowance) - WHT;
          // console.log("netSalary:", netSalary);
          // console.log("Month:", lastmonth.id);
          return {
            ...item,
            Monthid: lastmonth.id,
            imageUrl: imageURL,
            WHT: WHT,
            basicSalary: basicSalary,
            grossSalaryEarned: grossSalaryEarned,
            medicalAllowance: medicalAllowance,
            netSalary: netSalary,
          };
        })
      );
      const response = await axiosInstance.get(
        `${API_URL}/monthly-salaries/${empInfo[0].Monthid}?populate=*`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const monthName =
        response.data.data.month_data.month.charAt(0).toUpperCase() +
        response.data.data.month_data.month.slice(1);
      // console.log("empInfo : ", empInfo);
      setData(empInfo);
      setMonthName(monthName);
      setLoading(false);
      // console.log("monthName:", monthName);
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
  
  const goToSalary = (id: number) => {
    console.log(`goToprofile of ${id} clicked`);
    navigate(`/allemployees/invoice/${id}`);
  };

  const exportToCSV = () => {
    const headers = [
      "ID",
      "Name",
      "WHT",
      "Basic Salary",
      "Medical Allowance",
      "Gross Salary",
      "Net Salary",
    ];
    const rows = data.map((item) => [
      item.empNo,
      item.Name,
      item.WHT,
      item.basicSalary,
      item.medicalAllowance,
      item.grossSalaryEarned,
      item.netSalary,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      headers.join(",") +
      "\n" +
      rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "employees.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [visibleModal, setVisibleModal] = useState("");
  const handleClose = () => {
    setVisibleModal("");
  };

  return (
    <>
      <List
        title={ `Salary List of ${monthName}`}
        headerButtons={() => {
          return (
            <>
              <CreateButton size="middle" onClick={() => setVisibleModal("1")}>
                Calculate
              </CreateButton>
              <ExportButton
               onClick={exportToCSV} />
              <Calculate
                isVisible={visibleModal === "1"}
                handleClose={handleClose}
                setRefreshData={setRefreshData}
              />
            </>
          );
        }}
      >
        <Table dataSource={data} rowKey="id" loading={loading}>
          {/* <Table.Column
            title="M. ID"
            dataIndex="Monthid"
            key="monthid"
            width={60}
          /> */}
          <Table.Column
            title="ID"
            dataIndex="empNo"
            key="empNo"
            width={100}
            align="center"
          />
          <Table.Column
            title="Name"
            dataIndex="Name"
            key="Name"
            width={80}
            render={(text: string, record: Account) => (
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={record.imageUrl}
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
          />
          <Table.Column
            title="Withholding tax"
            dataIndex="WHT"
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
            key="basicSalary"
            align="center"
            width={100}
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
            key="medicalAllowance"
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
            key="grossSalaryEarned"
            align="center"
            width={100}
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
            key="netSalary"
            align="center"
            width={100}
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
            title="Actions  "
            key="actions"
            fixed="right"
            align="center"
            width={30}
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
                <EditButton
                  onClick={() => {
                    goToSalary(record.id);
                  }}
                  hideText
                  icon={<ExportOutlined />}
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
