import type { PropsWithChildren } from "react";
import { getDefaultFilter, useGo } from "@refinedev/core";
import {
    CreateButton,
    EditButton,
    List,
    NumberField,
    Show,
    useForm,
} from "@refinedev/antd";
import { useState, ChangeEvent, useEffect } from "react";
import { EyeOutlined, SearchOutlined, BookOutlined } from "@ant-design/icons";
import { Col, Row, Avatar, Divider, Flex, Input, Select, Table, Form, Card, message, Switch, Typography, Modal, Button, Upload, InputNumber, DatePicker } from "antd";
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import axios, { AxiosError } from "axios";
import moment from 'moment';
import { useModal } from '../../contexts/context-modal';
import { useNotification } from "@refinedev/core";
import { API_URL,token } from "../../constants";

export const AddnewEmployee = () => {
    const {open,close} = useNotification();
    const { isModalOpen, hideModal } = useModal();
    const [form] = Form.useForm();
    const { Option } = Select;
    const [ImageID, setImageID] = useState(1);
    const [isDisable, setisDisable] = useState(false);
    const [isCash, setisCash] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [inputValue, setInputValue] = useState('MUSK-');
    const { Title } = Typography;
    let isImage: boolean = false;
    const MuskImageID: number = 1;

    interface FormData {
        EmpNo: string;
        Name: string;
        Designation: string;
        email: string;
        phoneNo: string;
        employementStatus: 'intern' | 'probation' | 'permanent';
        hubstaffEnabled: boolean;
        salarySlipRequired: boolean;
        leavesRemaining: number;
        grossSalary: number;
        joinDate: moment.Moment;
        permanentDate?: moment.Moment;
        lastWorkingDay?: moment.Moment;
        prefix: string;
        image: number;
        bankName: string,
        accountTitle: string,
        accountIBAN: string
    }

    const handleStatusChange = (value: string): void => {
        setisDisable(value !== "Permanent");
    };

    useEffect(() => {
        isDisable ? form.setFieldsValue({ leavesRemaining: 0 }) : null
    }, [isDisable])

    const onSwtichChange = (value: boolean): void => {
        setisCash(value);
    };

    useEffect(() => {
        isCash ?
            form.setFieldsValue({ accountTitle: "Cash Salary", accountIBAN: ".......Cash Salary......", bankName: "Cash Salary" })
            : form.setFieldsValue({ accountTitle: "", accountIBAN: "", bankName: "" })
    }, [isCash])

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            console.log('Received values of form: ', values);
            hideModal();
            postData(values);
            form.resetFields();
        } catch (error) {
            console.error('Validation Failed:', error);
        }
    };

    const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        // Only allow digits by replacing non-digit characters with an empty string
        const filteredValue = value.replace(/[^\d]/g, '');
        form.setFieldsValue({ phoneNo: filteredValue });
        setPhoneNumber(filteredValue);
    };

    const prefixSelector = (
        <Form.Item name="prefix" noStyle initialValue="+92">
            <Select style={{ width: 70 }}>
                <Option value="+92">+92</Option>
            </Select>
        </Form.Item>
    );

    async function postData(formData: FormData) {
        const EmployeeData = {
            data: {
                empNo: formData.EmpNo,
                Name: formData.Name,
                Designation: formData.Designation,
                joinDate: formData.joinDate.format('YYYY-MM-DD'),
                permanentDate: formData.permanentDate?.format('YYYY-MM-DD'),
                hubstaffEnabled: formData.hubstaffEnabled,
                employementStatus: formData.employementStatus,
                grossSalary: formData.grossSalary,
                leavesRemaining: formData.leavesRemaining,
                salarySlipRequired: formData.salarySlipRequired,
                lastWorkingDay: formData.lastWorkingDay?.format('YYYY-MM-DD'),
                phoneNo: (formData.prefix + formData.phoneNo),
                email: formData.email,
                image: ImageID
            }
        };
        console.log(EmployeeData);
        console.log("hh");
        try {
            const response = await axios.post(`${API_URL}/employees`, JSON.stringify(EmployeeData),
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': "application/json"
                    }
                });
            console.log('Response Employee:', response.data);
            open?.( {type:'success',message: 'Success!',description: 'Employee details successfully added!'});
            console.log(response.data.data.id);
            console.log("hh");
            const formattedData = {
                data: {
                    emp_no: response.data.data.id,
                    bankName: formData.bankName,
                    accountTitle: formData.accountTitle,
                    accountIBAN: formData.accountIBAN
                }
            };
            console.log(formattedData);
            try {
                const response = await axios.post(`${API_URL}/bank-details`, JSON.stringify(formattedData),
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': "application/json"
                        }
                    });
                console.log('Response bank:', response.data);
                console.log("hh");
                open?.( {type:'success',message: 'Success!',description: 'Employee bank details successfully added!'});
            } catch (error:any) {
                console.error('Error posting data:', error);
                open?.( {type:'error',message: `Error!`,description: `${error?.response?.data?.error?.message}`});
            }
        } catch (error:any) {
            console.error('Error posting data:', error);
            open?.( {type:'error',message: `Error!`,description: `${(error?.response?.data?.error?.message)}`});
        }
    }


    const handleChange2 = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        const base = "MUSK-";
        let formattedInput = base;
        const digitsPart = value.replace(/[^0-9]/g, '');
        if (digitsPart.length > 0) {
            formattedInput += digitsPart.slice(0, 2);
            if (digitsPart.length == 2) {
                formattedInput += '-'
            }
            if (digitsPart.length > 2) {
                formattedInput += '-' + digitsPart.slice(2, 6);
            }
        }
        setInputValue(formattedInput);
        form.setFieldsValue({ EmpNo: formattedInput });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (inputValue.length <= 5 && (e.key === 'Backspace' || e.key === 'Delete')) {
            e.preventDefault();
        }
    };

    const onfinish = (values: any) => {
        console.log('Received values from form:', values);
    };

    const customUpload = async ({ file, onSuccess, onError }: any) => {
        const formData = new FormData();
        formData.append('files', file);
        try {
            const response = await axios.post(`${API_URL}/upload`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': "multipart/form-data"
                }
            });
            onSuccess(response.data);
            console.log(response.data[0].id)
            setImageID(response.data[0].id);
        } catch (error) {
            onError(error);
        }
    };

    return (
        <>
            <Modal
                forceRender
                title="Add New Employee"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={hideModal}
                footer={[
                    <Button key="back" onClick={hideModal}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleOk}>
                        Submit
                    </Button>
                ]}
                width={800}
            >
                <Form form={form} layout="vertical" initialValues={{
                    salarySlipRequired: false,
                    hubstaffEnabled: false,
                }} onFinish={onfinish}
                >
                    <Divider orientation="left"><Title level={4}>Personal Information</Title></Divider>
                    <Flex gap={"large"}>
                        <Flex vertical>
                            <Form.Item label="Employee ID">
                                <Form.Item
                                    name="EmpNo"
                                    rules={[
                                        { required: true, message: 'Please input the employee ID!' },
                                        { pattern: new RegExp(`^MUSK-\\d{2}-\\d{4}$`), message: 'Employee ID must follow the MUSK-YY-NNNN format!' }
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
                                <span style={{ marginLeft: "5px", fontSize: "small", font: "small-caption", marginBottom: "10px" }}>Employee ID i.e MUSK-{new Date().getFullYear().toString().slice(-2)}-1234</span>
                            </Form.Item>
                            <Form.Item label="Name" style={{ marginTop: "-15px" }}>
                                <Form.Item
                                    name="Name"
                                    rules={[{ required: true, message: 'Please input the employee name!' }]}
                                    noStyle
                                >
                                    <Input />
                                </Form.Item>
                            </Form.Item>
                        </Flex>
                        <Form.Item label="Upload Image">
                            <Form.Item
                                name="image"
                                valuePropName="file"
                                getValueFromEvent={({ file }) => file}
                                noStyle
                            >
                                <Upload
                                    customRequest={customUpload}
                                    listType="picture-card"
                                    maxCount={1}
                                    accept="image/*"
                                    onRemove={() => setImageID(MuskImageID)}
                                >
                                    <button style={{ border: 0, background: 'none' }} type="button">
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </button>
                                </Upload>
                            </Form.Item>
                            <span style={{ font: "small-caption" }}>
                                (Image Format = square)
                                <a href="https://squareanimage.com/" target="_blank" rel="noopener noreferrer"> Click here</a>
                            </span>

                        </Form.Item>
                    </Flex>
                    <Form.Item label="Designation">
                        <Form.Item
                            name="Designation"
                            rules={[{ required: true, message: 'Please input the designation!' }]}
                            noStyle
                        >
                            <Select
                                showSearch
                                placeholder="Select Designation"
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                options={[
                                    { value: 'Frontend Developer', label: 'Frontend Developer' },
                                    { value: 'Backend Developer', label: 'Backend Developer' },
                                    { value: 'Full Stack Developer', label: 'Full Stack Developer' },
                                    { value: 'UI/UX Designer', label: 'UI/UX Designer' },
                                    { value: 'Unity Developer', label: 'Unity Developer' },
                                    { value: 'Project Manager', label: 'Project Manager' },
                                    { value: 'HR Manager', label: 'HR Manager' },
                                    { value: 'React Native Developer', label: 'React Native Developer' },
                                    { value: 'Machine Learning Engineer', label: 'Machine Learning Engineer'},
                                    { value: 'DevOps Engineer', label: 'DevOps Engineer'},
                                    { value: 'SEO Specialist', label: 'SEO Specialist'},
                                    { value: 'AI Engineer', label: 'AI Engineer'},
                                    { value: 'Visual Designer', label: 'Visual Designer'},
                                    { value: 'Upwork Bidder', label: 'Upwork Bidder'},
                                    { value: 'Lead Generation Specialists', label: 'Lead Generation Specialists'},
                                    { value: 'Office Boy', label: 'Office Boy'},
                                ]}
                            />
                        </Form.Item>
                    </Form.Item>
                    <Flex gap={"large"}>
                        <Form.Item label="Email" style={{ width: "100%" }}>
                            <Form.Item
                                name="email"
                                rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}
                                noStyle
                            >
                                <Input />
                            </Form.Item>
                        </Form.Item>
                        <Form.Item label="Phone Number" style={{ width: "100%" }}>
                            <Form.Item
                                name="phoneNo"
                                rules={[
                                    { required: true, message: 'Please input your phone number!' },
                                    {
                                        pattern: new RegExp(/^\d{10}$/),
                                        message: 'Phone number must be exactly 10 digits!'
                                    }
                                ]}
                                noStyle
                            >
                                <Input
                                    addonBefore={prefixSelector}
                                    value={phoneNumber}
                                    onChange={handlePhoneChange}
                                    maxLength={10}
                                    placeholder="Enter your phone number"
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Form.Item>
                    </Flex>
                    <Divider orientation="left"><Title level={4}>Work Details</Title></Divider>
                    <Flex gap={"large"}>
                        <Flex vertical gap={"small"} style={{ width: "100%" }}>
                            <Form.Item label="Employee Status" style={{ width: "100%" }}>
                                <Form.Item
                                    name="employementStatus"
                                    rules={[{ required: true, message: 'Please select employee status!' }]}
                                    noStyle
                                >
                                    <Select
                                        showSearch
                                        placeholder="Select Status"
                                        filterOption={(input, option) =>
                                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                        }
                                        options={[
                                            { value: 'Intern', label: 'Intern' },
                                            { value: 'Probation', label: 'Probation' },
                                            { value: 'Permanent', label: 'Permanent' }
                                        ]}
                                        onChange={handleStatusChange}
                                    />
                                </Form.Item>
                            </Form.Item>
                            <Flex justify={"space-between"}>
                                <Form.Item label="Hubstaff Enabled">
                                    <Form.Item
                                        name="hubstaffEnabled" valuePropName="checked"
                                        noStyle
                                    >
                                        <Switch />
                                    </Form.Item>
                                </Form.Item>
                                <Form.Item label="Salary Slip Required">
                                    <Form.Item name="salarySlipRequired" valuePropName="checked" noStyle>
                                        <Switch />
                                    </Form.Item>
                                </Form.Item>
                            </Flex>
                            <Form.Item label="Date of Joining">
                                <Form.Item
                                    name="joinDate"
                                    rules={[{ required: true, message: 'Please enter the date of joining' }]}
                                    noStyle
                                >
                                    <DatePicker style={{ width: "100%" }} />
                                </Form.Item>
                            </Form.Item>
                        </Flex>
                        <Flex vertical gap={"small"} style={{ width: "100%" }}>
                            <Form.Item label="Salary" style={{ width: "100%" }}>
                                <Form.Item
                                    name="grossSalary"
                                    rules={[
                                        { required: true, message: 'Please input the salary!' },
                                        { type: 'number', min: 0, message: 'Salary must be a non-negative number!' }
                                    ]}
                                    noStyle
                                >
                                    {/* Using InputNumber for better control over numerical input */}
                                    <InputNumber min={0}
                                        onKeyDown={(e) => {
                                            if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                                                e.preventDefault();
                                            }
                                        }}
                                        style={{ width: "100%" }}
                                        placeholder={"Enter Salary"}
                                    />
                                </Form.Item>
                            </Form.Item>
                            <Form.Item label="Leaves Remaining" style={{ width: "100%" }}>
                                <Form.Item name="leavesRemaining" initialValue={0} noStyle>
                                    <InputNumber min={0}
                                        onKeyDown={(e) => {
                                            if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                                                e.preventDefault();
                                            }
                                        }}
                                        style={{ width: "100%" }}
                                        disabled={isDisable}
                                    />
                                </Form.Item>
                            </Form.Item>
                            <Form.Item label="Date of Permanent Status">
                                <Form.Item name="permanentDate" noStyle>
                                    <DatePicker style={{ width: "100%" }} disabled={isDisable} />
                                </Form.Item>
                            </Form.Item>
                        </Flex>
                    </Flex>
                    <Divider orientation="left"><Title level={4}>Bank Details</Title></Divider>
                    <Form.Item name="cashSalary" valuePropName="checked" noStyle>
                        <Title level={5}>For Cash Salary <Switch onChange={onSwtichChange} /></Title>
                    </Form.Item>
                    <Flex gap={"large"} style={{ width: "100%", marginTop: "20px" }}>
                        <Flex vertical gap={"small"} style={{ width: "100%" }}>
                            <Form.Item label="Bank Name" style={{ width: "100%" }}>
                                <Form.Item
                                    name="bankName"
                                    rules={[{ required: true, message: 'Please input the bank name!' }]}
                                    noStyle
                                >
                                    <Input disabled={isCash} />
                                </Form.Item>
                            </Form.Item>
                            <Form.Item label="IBAN" style={{ width: "100%" }}>
                                <Form.Item
                                    name="accountIBAN"
                                    rules={[{ required: true, message: 'Please input the IBAN!' }, { len: 24, message: "Length should be 24" }]}
                                    noStyle
                                >
                                    <Input disabled={isCash} maxLength={24} minLength={24} />
                                </Form.Item>
                            </Form.Item>
                        </Flex>
                        <Form.Item label="Account Title" style={{ width: "100%" }}>
                            <Form.Item
                                name="accountTitle"
                                rules={[{ required: true, message: 'Please input the Account title!' }]}
                                noStyle
                            >
                                <Input disabled={isCash} />
                            </Form.Item>
                        </Form.Item>
                    </Flex>
                    <Divider></Divider>
                </Form>
            </Modal>
        </>
    );
};
