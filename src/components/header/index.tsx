import type { RefineThemedLayoutV2HeaderProps } from "@refinedev/antd";
import {
  Layout as AntdLayout,
  Space,
  Typography,
  Button,
  Input,
  Flex,
} from "antd";
import React, { useContext, useEffect, useState } from "react";
import { ColorModeContext } from "../../contexts/color-mode";
import logo from "../../logo.png";
import "./style.css";
import { IconMoon } from "./icons/icon-moon";
import { IconSun } from "./icons/icon-sun";
import { useLogout } from "@refinedev/core";
import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs } from "antd";
import type { TabsProps } from "antd";

const { Text } = Typography;
export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = (
) => {
  const { mode, setMode } = useContext(ColorModeContext);
  const { mutate, isLoading } = useLogout();

  const toggleMode = () => setMode(mode === "light" ? "dark" : "light");

  const navigate = useNavigate();
  const location = useLocation();
  const [check,setCheck] = useState(false);
  const goToHomePage = () => {
    console.log("go To Overview clicked");
    navigate("/");
  };
  const goToAllEmployeesPage = () => {
    console.log("go To Salary List clicked");
    navigate("/allemployees");
  };

  const getActiveKey = () => {
    switch(location.pathname) {
      case '/':
        return "1";
      case '/allemployees':
        return "2";
      default:
        return "1"; // default to home if the path does not match known routes
    }
  };

  const onChange = (key: string) => {
    if (key == "1") {
      goToHomePage();
    } else if (key == "2") {
      goToAllEmployeesPage();
    }
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Overview",
    },
    {
      key: "2",
      label: "Salary List",
    },
  ];

  useEffect(()=>{
    if(check==false){
      setCheck(true);
      setCheck(false);
    }
  },[])

  return (
    <AntdLayout.Header className={`header ${mode}`}>
      <div className="header-content justify-between ">
        <Space>
          <img
            src={logo}
            alt="Logo"
            onClick={goToHomePage}
            style={{ cursor: "pointer", height: "40px" }}
          />
          <Text
            strong
            className="title"
            onClick={goToHomePage}
            style={{ cursor: "pointer" }}
          >
            Automator
          </Text>
        </Space>
        <Space style={{ marginTop: "25px", marginLeft: "200px" }} >
          <Tabs
            size="large"
            defaultActiveKey={getActiveKey()}
            items={items}
            onChange={onChange}
            onTabClick={(key) => onChange(key)} // Handle tab click
          />
        </Space>
        <Flex gap="50px" justify="flex-end">
          <Input.Search placeholder="Search..." style={{ width: 200 }} />
          <Button
            className="mode-toggle-button"
            shape="circle"
            onClick={toggleMode}
            icon={mode === "dark" ? <IconSun /> : <IconMoon />}
          />
          <Button
            type="primary"
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              event.preventDefault();
              mutate();
            }}
            disabled={isLoading}
            danger
          >
            Logout
          </Button>
        </Flex>
      </div>
    </AntdLayout.Header>
  );
};
