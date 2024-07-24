import { useState, ChangeEvent } from "react";
import {
  Input,
  Select,
  Form,
  Switch,
  Modal,
  Button,
  Upload,
  InputNumber,
  DatePicker,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import { useModal } from "../../contexts/context-modal";

const token =
  "04d155e0017ee802a2dac456300b42b8bff2698e093c26ae76037c76d07bc6b7c85a396f2eb82ef62c9a86cebd12baeaa35416a2274790e87a80845df9caf983132cfa60460dec70db95ce3260fc294fef311efabdf31aa4ce7f5e32b59b93a1935c7e9fa5b73b730ca3953388fe8984a3f86fde6969ea94ee956f13ea1271a5";

export const AddnewEmployee = () => {
  const { isModalOpen, hideModal } = useModal();
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log("Received values of form: ", values);
      // Here you would typically send a request to your backend API to add the new employee
      hideModal();
      postData(values);
      // Optionally reset form
      form.resetFields();
    } catch (error) {
      console.error("Validation Failed:", error);
    }
  };

  const [phoneNumber, setPhoneNumber] = useState("");
  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // Only allow digits by replacing non-digit characters with an empty string
    const filteredValue = value.replace(/[^\d]/g, "");
    form.setFieldsValue({ phoneNo: filteredValue });
    setPhoneNumber(filteredValue);
  };

  const { Option } = Select;
  const prefixSelector = (
    <Form.Item name="prefix" noStyle initialValue="+92">
      <Select style={{ width: 70 }}>
        <Option value="+92">+92</Option>
      </Select>
    </Form.Item>
  );

  const [ImageID, setImageID] = useState();

  interface FormData {
    EmpNo: string;
    Name: string;
    Designation: string;
    email: string;
    phoneNo: string;
    employementStatus: "intern" | "probation" | "permanent";
    hubstaffEnabled: boolean;
    salarySlipRequired: boolean;
    leavesRemaining: number;
    grossSalary: number;
    joinDate: moment.Moment; // Using moment.js if your DatePicker is configured with it
    permanentDate?: moment.Moment;
    lastWorkingDay?: moment.Moment;
    prefix: string;
    image: number;
  }

  async function postData(formData: FormData) {
    const formattedData = {
      data: {
        empNo: formData.EmpNo,
        Name: formData.Name,
        Designation: formData.Designation,
        joinDate: formData.joinDate.format("YYYY-MM-DD"),
        permanentDate: formData.permanentDate?.format("YYYY-MM-DD"),
        hubstaffEnabled: formData.hubstaffEnabled,
        employementStatus: formData.employementStatus,
        grossSalary: formData.grossSalary,
        leavesRemaining: formData.leavesRemaining,
        salarySlipRequired: formData.salarySlipRequired,
        lastWorkingDay: formData.lastWorkingDay?.format("YYYY-MM-DD"),
        phoneNo: formData.prefix + formData.phoneNo,
        email: formData.email,
        image: ImageID,
      },
    };
    console.log(formattedData);
    try {
      const response = await axios.post(
        "http://localhost:1337/api/employees",
        JSON.stringify(formattedData),
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Response:", response.data);
    } catch (error) {
      console.error(
        "Error posting data:",
        error.response ? error.response.data : error
      );
    }
  }

  const [inputValue, setInputValue] = useState("MUSK-");
  const handleChange2 = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    // Ensure the 'MUSK-' prefix is maintained.
    const base = "MUSK-";
    let formattedInput = base;
    const digitsPart = value.replace(/[^0-9]/g, ""); // Strip non-digits to ensure correct processing.

    // Insert digits and hyphen as appropriate.
    if (digitsPart.length > 0) {
      // First two digits
      formattedInput += digitsPart.slice(0, 2);
      if (digitsPart.length == 2) {
        formattedInput += "-";
      }
      // Add hyphen and the next four digits if more than two digits are present
      if (digitsPart.length > 2) {
        formattedInput += "-" + digitsPart.slice(2, 6);
      }
    }

    // Set input value state and update form field.
    setInputValue(formattedInput);
    form.setFieldsValue({ EmpNo: formattedInput });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent deletion of 'MUSK-' prefix
    if (
      inputValue.length <= 5 &&
      (e.key === "Backspace" || e.key === "Delete")
    ) {
      e.preventDefault();
    }
  };

  const onfinish = (values: any) => {
    console.log("Received values from form:", values);
  };

  const customUpload = async ({ file, onSuccess, onError }: any) => {
    const formData = new FormData();
    formData.append("files", file);
    try {
      const response = await axios.post(
        "http://localhost:1337/api/upload",
        formData,
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      onSuccess(response.data);
      setImageID(response.data[0].id);
    } catch (error) {
      onError(error);
    }
  };

  return (
    <>
      <Modal
        title="Add New Employee"
        // visible={isModalVisible}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={hideModal}
        footer={[
          <Button key="back" onClick={hideModal}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Submit
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            salarySlipRequired: false,
            hubstaffEnabled: false,
          }}
          onFinish={onfinish}
        >
          <Form.Item label="Employee ID">
            <Form.Item
              name="EmpNo"
              rules={[
                { required: true, message: "Please input the employee ID!" },
                {
                  pattern: new RegExp(`^MUSK-\\d{2}-\\d{4}$`),
                  message: "Employee ID must follow the MUSK-YY-NNNN format!",
                },
              ]}
              noStyle
              initialValue={inputValue}
            >
              <Input
                placeholder="MUSK-YY-NNNN"
                value={inputValue}
                onChange={handleChange2}
                onKeyDown={handleKeyDown}
                maxLength={12}
              />
            </Form.Item>
            <span
              style={{
                marginLeft: "5px",
                fontSize: "small",
                font: "small-caption",
                marginBottom: "10px",
              }}
            >
              Employee ID i.e MUSK-
              {new Date().getFullYear().toString().slice(-2)}-1234
            </span>
          </Form.Item>
          <Form.Item label="Name">
            <Form.Item
              name="Name"
              rules={[
                { required: true, message: "Please input the employee name!" },
              ]}
              noStyle
            >
              <Input />
            </Form.Item>
          </Form.Item>
          <Form.Item label="Designation">
            <Form.Item
              name="Designation"
              rules={[
                { required: true, message: "Please input the designation!" },
              ]}
              noStyle
            >
              <Select
                showSearch
                placeholder="Select Designation"
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={[
                  { value: "Frontend Developer", label: "Frontend Developer" },
                  { value: "Backend Developer", label: "Backend Developer" },
                  {
                    value: "Full Stack Developer",
                    label: "Full Stack Developer",
                  },
                  { value: "UI/UX Designer", label: "UI/UX Designer" },
                  { value: "Unity Developer", label: "Unity Developer" },
                  { value: "Project Manager", label: "Project Manager" },
                  { value: "HR Manager", label: "HR Manager" },
                ]}
              />
            </Form.Item>
          </Form.Item>
          <Form.Item label="Email">
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Please input a valid email!",
                },
              ]}
              noStyle
            >
              <Input />
            </Form.Item>
          </Form.Item>
          <Form.Item label="Phone Number">
            <Form.Item
              name="phoneNo"
              rules={[
                { required: true, message: "Please input your phone number!" },
                {
                  pattern: new RegExp(/^\d{10}$/),
                  message: "Phone number must be exactly 10 digits!",
                },
              ]}
              noStyle
            >
              <Input
                addonBefore={prefixSelector}
                value={phoneNumber}
                onChange={handlePhoneChange}
                maxLength={10}
                placeholder="Enter your phone number"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Form.Item>
          <Form.Item label="Employee Status">
            <Form.Item
              name="employementStatus"
              rules={[
                { required: true, message: "Please select employee status!" },
              ]}
              noStyle
            >
              <Select
                showSearch
                placeholder="Select Designation"
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={[
                  { value: "Intern", label: "Intern" },
                  { value: "Probation", label: "Probation" },
                  { value: "Permanent", label: "Permanent" },
                ]}
              />
            </Form.Item>
          </Form.Item>
          <Form.Item label="Hubstaff Enabled">
            <Form.Item name="hubstaffEnabled" valuePropName="checked" noStyle>
              <Switch />
            </Form.Item>
          </Form.Item>
          <Form.Item label="Salary Slip Required">
            <Form.Item
              name="salarySlipRequired"
              valuePropName="checked"
              noStyle
            >
              <Switch />
            </Form.Item>
          </Form.Item>
          <Form.Item label="Leaves Remaining">
            <Form.Item name="leavesRemaining" initialValue={0} noStyle>
              <InputNumber
                min={0}
                onKeyDown={(e) => {
                  if (
                    !/[0-9]/.test(e.key) &&
                    e.key !== "Backspace" &&
                    e.key !== "ArrowLeft" &&
                    e.key !== "ArrowRight"
                  ) {
                    e.preventDefault();
                  }
                }}
              />
            </Form.Item>
          </Form.Item>

          <Form.Item label="Salary">
            <Form.Item
              name="grossSalary"
              rules={[
                { required: true, message: "Please input the salary!" },
                {
                  type: "number",
                  min: 0,
                  message: "Salary must be a non-negative number!",
                },
              ]}
              initialValue={0}
              noStyle
            >
              {/* Using InputNumber for better control over numerical input */}
              <InputNumber
                min={0}
                onKeyDown={(e) => {
                  if (
                    !/[0-9]/.test(e.key) &&
                    e.key !== "Backspace" &&
                    e.key !== "ArrowLeft" &&
                    e.key !== "ArrowRight"
                  ) {
                    e.preventDefault();
                  }
                }}
              />
            </Form.Item>
          </Form.Item>
          <Form.Item label="Date of Joining">
            <Form.Item
              name="joinDate"
              rules={[
                { required: true, message: "Please enter the date of joining" },
              ]}
              noStyle
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Form.Item>
          <Form.Item label="Date of Permanent Status">
            <Form.Item name="permanentDate" noStyle>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Form.Item>
          <Form.Item label="Date of Last Working Day">
            <Form.Item name="lastWorkingDay" noStyle>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Form.Item>
          <Form.Item label="Upload">
            <span style={{ font: "small-caption" }}>
              (Image Format = square){" "}
              <a href="https://squareanimage.com/">Click here to format</a>
            </span>
            <Form.Item
              name="image"
              valuePropName="file"
              getValueFromEvent={({ file }) => file}
              noStyle
            >
              <Upload
                customRequest={customUpload}
                listType="picture"
                maxCount={1}
                accept="image/*"
              >
                <button style={{ border: 0, background: "none" }} type="button">
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </button>
              </Upload>
            </Form.Item>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
