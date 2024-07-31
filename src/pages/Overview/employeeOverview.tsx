import type { PropsWithChildren } from "react";
import { CreateButton, List, NumberField } from "@refinedev/antd";
import { useState, useEffect } from "react";
import { Flex, Table } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Account } from "../../types";
import { API_URL } from "../../constants";
// import {token} from "../../constants";
import { EditButton, ExportButton } from "@refinedev/antd";
import { EyeOutlined } from "@ant-design/icons";
import { axiosInstance } from "../../authProvider";
import Calculate from '../../components/add_buttons/calculateSalary';

export const EmployeeOverview = ({ children }: PropsWithChildren) => {
  const [data, setData] = useState<any[]>([]);


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
  }

  const fetchData = async () => {
    try {
      const empAttributes = await fetchEmployee();
      console.log("empAttributes:", empAttributes);

      const empInfo = await Promise.all(
        empAttributes.map(async (item: any) => {
          const imageURL = "http://localhost:1337" + item.image?.url;
          const WHT = item.monthly_salaries[length - 1]?.WTH || 0;
          const basicSalary = item.monthly_salaries[length - 1]?.basicSalary || 0;
          const grossSalaryEarned = item.monthly_salaries[length - 1]?.grossSalaryEarned || 0;
          const medicalAllowance = item.monthly_salaries[length - 1]?.medicalAllowance || 0;
          const netSalary = parseInt(basicSalary) + parseInt(medicalAllowance) - WHT;
          console.log("WHT:", WHT);
          return {
            ...item,
            imageUrl: imageURL,
            WHT: WHT,
            basicSalary: basicSalary,
            grossSalaryEarned: grossSalaryEarned,
            medicalAllowance: medicalAllowance,
            netSalary: netSalary
          }
        })
      )

      setData(empInfo);
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

  const exportToCSV = () => {
    const headers = ["ID", "Name", "WHT", "Basic Salary", "Medical Allowance", "Gross Salary", "Net Salary"];
    const rows = data.map((item) => [
      item.empNo,
      item.Name,
      item.WHT,
      item.basicSalary,
      item.medicalAllowance,
      item.grossSalaryEarned,
      item.netSalary,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map((e) => e.join(",")).join("\n");
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
        title="Salary List"
        headerButtons={() => {
          return (
            <>
              <CreateButton size="middle" onClick={() => setVisibleModal("1")}>
                Calculate
              </CreateButton>
              <ExportButton
                onClick={exportToCSV}

              />
              <Calculate isVisible={visibleModal === "1"} handleClose={handleClose} />
            </>
          );
        }}
      >
        <Table dataSource={data} rowKey="id">
          {/* <Table.Column title="ID" dataIndex="id" key="id" width={80} sorter /> */}
          <Table.Column
            title="ID"
            dataIndex="empNo"
            key="empNo"
            width={90}
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
                options={{ style: "currency", currency: "pkr", maximumFractionDigits: 0 }}
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
            width={100}
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
            width={100}
            render={(total) => (
              <NumberField
                value={total}
                options={{ style: "currency", currency: "pkr", maximumFractionDigits: 0 }}
              />
            )}
          />
          <Table.Column
            title="Profile"
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
