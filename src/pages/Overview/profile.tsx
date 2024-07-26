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
  CreateButton,
  EditButton,
  DeleteButton,
  DateField,
  NumberField,
  ShowButton,
  Show,
} from "@refinedev/antd";
import { ErrorComponent } from "@refinedev/antd";

import { useEffect, useState } from "react";
import axios from "axios";
import { Col, Row } from "antd";
import { Account } from "../../types";
import { Flex, Form, Card, Divider, Typography, Table } from "antd";
import { PostShow } from "../../components/index";
import { ShowTextAndIcon } from "../../components/forms/ShowForm";

import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Button } from "antd"; // Assuming you're using antd for UI components

import { useParams } from "react-router-dom";
import { EditEmployee } from "../../components/index";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      type="link"
      icon={<ArrowLeftOutlined />}
      onClick={() => navigate(-1)}
    >
      {/* Back */}
    </Button>
  );
};

// const token =
//   "04d155e0017ee802a2dac456300b42b8bff2698e093c26ae76037c76d07bc6b7c85a396f2eb82ef62c9a86cebd12baeaa35416a2274790e87a80845df9caf983132cfa60460dec70db95ce3260fc294fef311efabdf31aa4ce7f5e32b59b93a1935c7e9fa5b73b730ca3953388fe8984a3f86fde6969ea94ee956f13ea1271a5";

const token = "9bd8af6b6900627b415eded84617f1d87d0a74136d3491a75b00c94127d77dd29763855f802afa232aedc294bc78e1c66e18c7cc854c28644288877aa7aafea65012ac05aa18230be1db9197bbed78381e8b6c2ca9ddacb5385427b594e660fabd6e269fac2464ba1e717c6b6ee48f7131ec5fb2647cf08ee83a8d761b9545b1";

export const EmployeeProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [person, setPerson] = useState<Account | null>(null);

  useEffect(() => {
    const fetchPerson = async () => {
      try {
        const response = await axios.get(
          `http://localhost:1337/api/employees/${id}?populate=*`,
          {
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          }
        );
        const attributes = response.data.data.attributes;
        const imageUrl =
          "http://localhost:1337" + attributes.image?.data?.attributes?.url;
        const bankDetails =
          response.data.data.attributes.bank_detail?.data?.attributes;
          const bankDetailsID =
          response.data.data.attributes.bank_detail?.data?.id;
        console.log(response.data.data.attributes.image?.data?.attributes)
        console.log(bankDetails);
        console.log(response);
        setPerson({ ...attributes, imageUrl, bankDetails,bankDetailsID});
      } catch (error) {
        console.log("Error while fetching person", error);
      }
    };

    fetchPerson();
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
                  src={
                    person.imageUrl ||
                    "data:image/png;base64,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"
                  } // Updated to use dynamic image URL
                  style={{
                    borderRadius: "30px",
                    // width: "150px",
                    height: "150px",
                  }}
                  alt="Employee"
                />
                <h1>{person.Name || "Name of Employee"}</h1>
              </Flex>
              <Flex gap={16}>
                <CreateButton
                  size="large"
                  style={{
                    width: "100%",
                    marginTop: 24,
                  }}
                  // onClick={() =>
                  // go({
                  //   to: { resource: "accounts", action: "create" },
                  //   options: { keepQuery: true },
                  // })
                  // }
                >
                  Add Manual Hours
                </CreateButton>

                <CreateButton
                  size="large"
                  style={{
                    width: "100%",
                    marginTop: 24,
                  }}
                  // onClick={() =>
                  // go({
                  //   to: { resource: "accounts", action: "create" },
                  //   options: { keepQuery: true },
                  // })
                  // }
                >
                  Add Absence
                </CreateButton>
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
                    <EditEmployee {...person}/>
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
              <Table rowKey={"id"}>
                <Table.Column
                  title="Date"
                  dataIndex="date"
                  key="date"
                  render={(date) => (
                    <DateField value={date} format="D MMM YYYY" />
                  )}
                />
                <Table.Column title="Total Hours" />
                <Table.Column title="Hubstaff Hours" />
                <Table.Column title="Manual Hours" />
                <Table.Column title="Hour Rate" />
                <Table.Column
                  title="Earned Amount"
                  dataIndex="total"
                  key="total"
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
              <Table>
                <Table.Column
                  title="Month"
                  dataIndex="date"
                  key="date"
                  render={(date) => (
                    <DateField value={date} format="MMMM YYYY" />
                  )}
                />
                <Table.Column title="Required Hr" dataIndex="id" key="id" />
                <Table.Column title="Worked Hr" dataIndex="id" key="id" />
                <Table.Column title="Absences" dataIndex="id" key="id" />
                <Table.Column
                  title="Paid Leaves"
                  align="center"
                  dataIndex="id"
                  key="id"
                />
                <Table.Column
                  title="Late Count"
                  align="center"
                  dataIndex="id"
                  key="id"
                />

                <Table.Column
                  title="Earned"
                  dataIndex="total"
                  key="total"
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
                  width={64}
                  render={() => {
                    return <ShowButton hideText icon={<ExportOutlined />} />;
                  }}
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
              <Table>
                <Table.Column
                  title="Month"
                  render={(date) => (
                    <DateField value={date} format="MMMM YYYY" />
                  )}
                />
                <Table.Column title="Required Hours" dataIndex="id" key="id" />
                <Table.Column title="Worked Hours" dataIndex="id" key="id" />
                <Table.Column
                  title="Net Salary"
                  dataIndex="total"
                  key="total"
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
                  width={64}
                  render={() => {
                    return <ShowButton hideText icon={<ExportOutlined />} />;
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
