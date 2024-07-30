import React from 'react';
import { DownOutlined, UserOutlined, FormOutlined,PlusSquareOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Dropdown, Space } from 'antd';
import Absent from './add_absent';
import ManualHours from './add_manualhours';
import HubstaffHours from './add_hubstaff';
import LateCount from './add_latecount';
import { useState } from 'react';


const ButtonsComponent: React.FC = () => {
    const [visibleModal, setVisibleModal] = useState('');

    const handleClick: MenuProps['onClick'] = (e) => {
        setVisibleModal(e.key);
    };
    
    const items: MenuProps['items'] = [
        {
            label: 'Absent',
            key: '1',
            icon: <PlusSquareOutlined />,
        },
        {
            label: 'Manual Hours',
            key: '2',
            icon: <PlusSquareOutlined />,
        },
        {
            label: 'HubStaff Hours',
            key: '3',
            icon: <PlusSquareOutlined />,
        },
        {
            label: 'Late',
            key: '4',
            icon: <PlusSquareOutlined />,
        }
    ];
    
    const menuProps = {
        items,
        onClick: handleClick,
    };

    const handleClose = () => {
        setVisibleModal('');
    };
    return (
        <>
            <Space wrap>
                <Dropdown menu={menuProps}>
                    <Button
                        type="primary"
                        size="large"
                        style={{
                            width: "155px",
                        }}
                    >
                        Add
                        <DownOutlined />
                    </Button>
                </Dropdown>
            </Space>
            <Absent isVisible={visibleModal==="1"} handleClose={handleClose}/>
            <ManualHours isVisible={visibleModal==="2"} handleClose={handleClose}/>
            <HubstaffHours isVisible={visibleModal==="3"} handleClose={handleClose}/>
            <LateCount isVisible={visibleModal==="4"} handleClose={handleClose}/>
        </>
    )
}

export default ButtonsComponent;