import React from "react";
import {
  Modal,
  Button,
  Form,
  Divider,
  Typography,
  DatePicker,
  InputNumber,
} from "antd";
import { useNotification } from "@refinedev/core";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { token } from "../../constants";

interface HubstaffHoursProps {
  isVisible: boolean;
  handleClose: () => void;
}

const HubstaffHours: React.FC<HubstaffHoursProps> = ({
  isVisible,
  handleClose,
}) => {
  const { id } = useParams<{ id: string }>();
  const { open, close } = useNotification();
  const [form] = Form.useForm();
  const { Title } = Typography;
  const [checkDate, setcheckDate] = useState(false);
  const [hubstaffHours, sethubstaffHours] = useState<Number>(0);
  const [dailyWorkID, setdailyWorkID] = useState(0);
  const [Count, setCount] = useState(0);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log("Received values of form: ", values);
      handleClose();
      putData(values);
      form.resetFields();
    } catch (error) {
      console.error("Validation Failed:", error);
    }
  };

  interface FormData {
    workDate: moment.Moment;
    hubstaffHours: Number;
  }

  useEffect(() => {
    if (dailyWorkID !== 0) {
      const Data2 = {
        data: {
          hubstaffHours: hubstaffHours,
        },
      };
      async function update() {
        try {
          const response = await axios.put(
            `http://localhost:1337/api/daily-works/${dailyWorkID}`,
            JSON.stringify(Data2),
            {
              headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "application/json",
              },
            }
          );
          console.log("Response-daily:", response.data);
        } catch (error: any) {
          console.error("Error posting data:", error);
        }
      }
      update();
    }
  }, [dailyWorkID]);

  async function Employee() {
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
      console.log("Response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error posting data:", error);
    }
  }

  async function putData(formData: FormData) {
    const date = formData.workDate?.format("YYYY-MM-DD");
    sethubstaffHours(formData.hubstaffHours);
    let attributes = await Employee();
    const MonthlySalaries = attributes.data.monthly_salaries;
    MonthlySalaries.map(async (item: any) => {
      try {
        const response = await axios.get(
          `http://localhost:1337/api/monthly-salaries/${item.id}?populate=*`,
          {
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Response:", response.data);
        const dailyWorks = response.data.data?.dailyWorks;
        dailyWorks.map((data: any) => {
          if (data.workDate == date) {
            console.log("found");
            setcheckDate(true);
            setdailyWorkID(data.id);
          }
        });
      } catch (error: any) {
        console.error("Error posting data:", error);
      }
    });
  }

  return (
    <Modal
      title="Add Hubstaff Hours"
      visible={isVisible}
      onCancel={handleClose}
      footer={[
        <Button key="back" onClick={handleClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Submit
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" initialValues={{}}>
        <Divider></Divider>
        <Form.Item label="Date">
          <Form.Item
            name={"workDate"}
            rules={[{ required: true, message: "Please enter the Date" }]}
            noStyle
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Form.Item>
        <Form.Item label="Hubstaff Hours">
          <Form.Item
            name={"hubstaffHours"}
            rules={[
              { required: true, message: "Please enter the manual hours" },
            ]}
            noStyle
          >
            <InputNumber
              min={0}
              max={24}
              defaultValue={0}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Form.Item>
        <Divider></Divider>
      </Form>
    </Modal>
  );
};

export default HubstaffHours;
