import React, { useState } from 'react';
import { Modal, Button, Form, Divider, Typography,Input } from 'antd';
import { UploadOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { useNotification } from "@refinedev/core";
import Papa from 'papaparse';
import moment from 'moment';
import axios from 'axios';
import {API_URL} from '../../constants';

interface HubstaffFileProps {
    isVisible: boolean;
    handleClose: () => void;
}

const HubstaffFile: React.FC<HubstaffFileProps> = ({ isVisible, handleClose }) => {
    const { id } = useParams<{ id: string }>();
    const { open, close } = useNotification();
    const [form] = Form.useForm();
    const [data, setData] = useState<any[]>([]);

    const handleOk = async () => {
        putData();
    };

    function convertTimeToHours(time: string) {
        let [hours, minutes, seconds] = time.split(":").map(Number);
        let totalHours = hours + minutes / 60 + seconds / 3600;
        return Number(totalHours.toFixed(2));
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: function (results) {
                    if (results.meta && results.meta.fields) {
                        const requiredHeaders = ['Member', 'Date', 'Time'];
                        const areHeadersValid = requiredHeaders.every(header => results?.meta?.fields?.includes(header));
                        if (areHeadersValid) {
                            let employees: { [key: string]: any } = {};
                            results.data.forEach((row: any) => {
                                const employeeName = row.Member;
                                const date = moment(row.Date, "DD-MM-YY").format("YYYY-MM-DD");
                                const hubstaffHours = convertTimeToHours(row.Time);
                                if (!employees[employeeName]) {
                                    employees[employeeName] = {
                                        employeeName: employeeName,
                                        dailyWorkEntries: []
                                    };
                                }
                                employees[employeeName].dailyWorkEntries.push({
                                    date: date,
                                    hubstaffHours: hubstaffHours
                                });
                            });
                            setData(Object.values(employees));
                            console.log(Object.values(employees));
                        } else {
                            open?.({ type: 'error', message: 'Invalid file format. Please make sure the file contains the required headers: Member, Date, Time.' });
                        }
                    } else {
                        open?.({ type: 'error', message: 'Failed to read file headers. Please check the file format.' });
                    }
                }
            });
        }
    };

    async function putData() {
        try {
            const response = await axios.post(`${API_URL}/daily-works/bulk-create`, JSON.stringify(data),
                {
                    headers: {
                        'Authorization': "Bearer 9bd8af6b6900627b415eded84617f1d87d0a74136d3491a75b00c94127d77dd29763855f802afa232aedc294bc78e1c66e18c7cc854c28644288877aa7aafea65012ac05aa18230be1db9197bbed78381e8b6c2ca9ddacb5385427b594e660fabd6e269fac2464ba1e717c6b6ee48f7131ec5fb2647cf08ee83a8d761b9545b1",
                        'Content-Type': "application/json"
                    }
                });
            console.log('Response bank:', response.data);
            open?.({ type: 'success', message: 'Success!', description: 'Successfully added!' });
        } catch (error: any) {
            console.error('Error posting data:', error);
            open?.({ type: 'error', message: `Error!`, description: `${error?.response?.data?.error?.message}` });
        }
    }

    return (
        <Modal
            title="Upload Hubstaff CSV File"
            visible={isVisible}
            onCancel={handleClose}
            footer={[
                <Button key="back" onClick={handleClose}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk}>
                    Import
                </Button>
            ]}
        >
            <Divider />
            <input type="file" accept=".csv" onChange={handleFileChange} style={{padding:"" , color:"blue"}}></input>
            <Divider />
        </Modal>
    );
};

export default HubstaffFile;
