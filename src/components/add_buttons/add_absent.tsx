import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Divider, Typography, DatePicker } from 'antd';
import { useNotification } from "@refinedev/core";
import axios from 'axios';
import { useParams } from "react-router-dom";
import { token } from "../../constants";
interface AbsentProps {
    isVisible: boolean;
    handleClose: () => void;
}

const Absent: React.FC<AbsentProps> = ({ isVisible, handleClose }) => {
    const { id } = useParams<{ id: string }>();
    const { open, close } = useNotification();
    const [form] = Form.useForm();
    const { Title } = Typography;
    const [checkDate, setcheckDate] = useState(false);
    const [dailyWorkID, setdailyWorkID] = useState(0);
    const [SalaryMonthID, setSalaryMonthID] = useState(0);
    const [Count, setCount] = useState(0);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            console.log('Received values of form: ', values);
            handleClose();
            putData(values);
            form.resetFields();
        } catch (error) {
            console.error('Validation Failed:', error);
        }
    };

    interface Date {
        workDate: moment.Moment;
    }

    useEffect(() => {
        if (dailyWorkID !== 0) {
            const Data2 = {
                data: {
                    isLeave: true
                }
            };
            async function update() {
                try {
                    const response = await axios.put(`http://localhost:1337/api/daily-works/${dailyWorkID}`, JSON.stringify(Data2),
                        {
                            headers: {
                                Authorization: "Bearer " + token,
                                "Content-Type": "application/json",
                            }
                        });
                    console.log('Response-daily:', response.data);
                } catch (error: any) {
                    console.error('Error posting data:', error);
                }
            }
            update();
        }
    }, [dailyWorkID])

    useEffect(() => {
        if (SalaryMonthID !== 0) {
            const Data1 = {
                data: {
                    absentCount: Count + 1
                }
            };
            async function update() {
                try {
                    const response = await axios.put(`http://localhost:1337/api/monthly-salaries/${SalaryMonthID}`, JSON.stringify(Data1),
                        {
                            headers: {
                                Authorization: "Bearer " + token,
                                "Content-Type": "application/json",
                            }
                        });
                    console.log('Response-monthly:', response.data);
                } catch (error: any) {
                    console.error('Error posting data:', error);
                }
                setCount(0);
            }
            update();
        }
    }, [SalaryMonthID])

    async function Employee() {
        try {
            const response = await axios.get(`http://localhost:1337/api/employees/${id}?populate=*`,
                {
                    headers: {
                        Authorization: "Bearer " + token,
                        "Content-Type": "application/json",
                    }
                });
            console.log('Response:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('Error posting data:', error);
        }
    }

    async function putData(formData: Date) {
        const date = formData.workDate?.format('YYYY-MM-DD');
        let attributes = await Employee();
        const MonthlySalaries = attributes.data.monthly_salaries;
        MonthlySalaries.map(async (item: any) => {
            try {
                const response = await axios.get(`http://localhost:1337/api/monthly-salaries/${item.id}?populate=*`,
                    {
                        headers: {
                            Authorization: "Bearer " + token,
                            "Content-Type": "application/json",
                        }
                    });
                console.log('Response:', response.data);
                const dailyWorks = response.data.data?.dailyWorks;
                dailyWorks.map((data: any) => {
                    if (data.workDate == date) {
                        console.log("found");
                        setcheckDate(true);
                        setdailyWorkID(data.id);
                        setSalaryMonthID(item.id);
                        setCount(item.absentCount);
                    }
                })
            } catch (error: any) {
                console.error('Error posting data:', error);
            }
        });
    }

    return (
        <Modal
            title="Add Absent"
            visible={isVisible}
            onCancel={handleClose}
            footer={[
                <Button key="back" onClick={handleClose}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk}>
                    Submit
                </Button>
            ]}
        >
            <Form form={form} layout="vertical" initialValues={{}}>
                <Divider></Divider>
                <Form.Item label="Date">
                    <Form.Item
                        name={"workDate"}
                        rules={[{ required: true, message: 'Please enter the Date' }]}
                        noStyle
                    >
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>
                </Form.Item>
                <Divider></Divider>
            </Form>
        </Modal >
    );
};

export default Absent;