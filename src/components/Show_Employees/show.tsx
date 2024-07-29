import type { PropsWithChildren } from "react";
import { CreateButton, EditButton, List } from "@refinedev/antd";
import { useState, useEffect } from "react";
import { EyeOutlined } from "@ant-design/icons";
import { Flex, Table } from "antd";
import axios from "axios";
import { useModal } from "../../contexts/context-modal";
import { useNavigate } from "react-router-dom";
import { Account } from "../../types";
import { API_URL } from "../../constants";
import Holiday from "../add_buttons/add_holiday";
import Month from "../add_buttons/add_month";

// const token =
//   "04d155e0017ee802a2dac456300b42b8bff2698e093c26ae76037c76d07bc6b7c85a396f2eb82ef62c9a86cebd12baeaa35416a2274790e87a80845df9caf983132cfa60460dec70db95ce3260fc294fef311efabdf31aa4ce7f5e32b59b93a1935c7e9fa5b73b730ca3953388fe8984a3f86fde6969ea94ee956f13ea1271a5";

const token = "9bd8af6b6900627b415eded84617f1d87d0a74136d3491a75b00c94127d77dd29763855f802afa232aedc294bc78e1c66e18c7cc854c28644288877aa7aafea65012ac05aa18230be1db9197bbed78381e8b6c2ca9ddacb5385427b594e660fabd6e269fac2464ba1e717c6b6ee48f7131ec5fb2647cf08ee83a8d761b9545b1";

export const ShowEmployees = ({ children }: PropsWithChildren) => {
  const [visibleModal, setVisibleModal] = useState('');
  const { showModal } = useModal();
  const [data, setData] = useState<any[]>([]);
  const handleClose = () => {
    setVisibleModal('');
  };
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `${API_URL}employees?populate=*`,
          {
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response);
        // Extract the data from the response
        const employees = response.data.data.map((item: any) => {
          const attributes = item;
          const imageUrl = attributes.image?.url;
          let hubstaffEnable = "";
          if (attributes.hubstaffEnabled) {
            hubstaffEnable = "Enabled";
          } else {
            hubstaffEnable = "Exempt";
          }
          return {
            id: item.id,
            ...attributes,
            imageUrl,
            hubstaffEnable,
          };
        });
        console.log(employees);
        setData(employees);
      } catch (error) {
        console.log("Error while fetching data", error);
      }
    }
    fetchData();
  }, []);

  const navigate = useNavigate();
  const goToprofile = (id: number) => {
    console.log(`goToprofile of ${id} clicked`);
    navigate(`/profile/${id}`);
  };
  return (
    <>
      <List
        title="Overview"
        headerButtons={() => {
          return (
            <>
              <CreateButton size="large" onClick={() => setVisibleModal("2")}>
                Add Month
              </CreateButton>
              <CreateButton size="large" onClick={() => setVisibleModal("1")}>
                Add Holiday
              </CreateButton>
              <CreateButton size="large" onClick={showModal}>
                Add new account
              </CreateButton>
              <Holiday isVisible={visibleModal === "1"} handleClose={handleClose} />
              <Month isVisible={visibleModal === "2"} handleClose={handleClose} />
            </>
          );
        }}
      >
        <Table dataSource={data} rowKey="id">
          <Table.Column title="ID" dataIndex="id" key="id" width={80} sorter />
          <Table.Column
            title="empNo"
            dataIndex="empNo"
            key="empNo"
            width={100}
            sorter
          />
          <Table.Column
            title="Name"
            dataIndex="Name"
            key="Name"
            width={80}
            sorter
            render={(text: string, record: Account) => (
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={`http://localhost:1337${record.imageUrl}`}
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
            title="Designation"
            dataIndex="Designation"
            key="Designation"
            width={80}
          />
          <Table.Column
            title="Email"
            dataIndex="email"
            key="email"
            width={80}
          />
          <Table.Column
            title="Hubstaff"
            dataIndex="hubstaffEnable"
            key="hubstaffEnable"
            width={80}
          />
          <Table.Column
            title="Hours Logged"
            dataIndex="hours"
            key="hours"
            width={100}
          />
          <Table.Column
            title="Income"
            dataIndex="income"
            key="income"
            width={80}
            align="center"
          />
          <Table.Column
            title="Actions"
            key="actions"
            fixed="right"
            align="center"
            width={40}
            render={(record) => {
              return (
                <Flex align="center" gap={8}>
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
