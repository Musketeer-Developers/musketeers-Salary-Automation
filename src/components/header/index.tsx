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
  const navigate = useNavigate();
  const location = useLocation();
  const [activeKey, setActiveKey] = useState(getActiveKey(location.pathname));
  const toggleMode = () => setMode(mode === "light" ? "dark" : "light");
  useEffect(() => {
    setActiveKey(getActiveKey(location.pathname)); // Update active key when the location changes
  }, [location.pathname]);

  function getActiveKey(pathname: string): string {
    switch (pathname) {
      case '/':
        return "1";
      case '/allemployees':
        return "2";
      case '/month':
        return "3";
      default:
        return "1";
    }
  }

  const onChange = (key: string) => {
    setActiveKey(key); // Update the state to the new key
    if (key === "1") {
      navigate("/");
    } else if (key === "2") {
      navigate("/allemployees");
    } else if (key === "3") {
      navigate("/month");
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
    {
      key: "3",
      label: "Month",
    },
  ];

  return (
    <AntdLayout.Header className={`header ${mode}`}>
      <div className="header-content justify-between ">
        <Space>
          <img
            src={logo}
            alt="Logo"
            onClick={() => onChange("1")}
            style={{ cursor: "pointer", height: "40px" }}
          />
          <Text
            strong
            className="title"
            onClick={() => onChange("1")}
            style={{ cursor: "pointer" }}
          >
            Automator
          </Text>
        </Space>
        <Space style={{ marginTop: "25px",
        //  marginLeft: "200px"
          }} >
          <Tabs
            size="large"
            activeKey={activeKey}
            items={items}
            onChange={onChange}
            onTabClick={(key) => onChange(key)} // Synchronize tab clicking
          />
        </Space>
        <Flex gap="50px" justify="flex-end">
          {/* <Input.Search placeholder="Search..." style={{ width: 200 }} /> */}
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
