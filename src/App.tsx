import { Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import { ThemedLayoutV2, useNotificationProvider } from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import routerBindings, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { DataProvider } from "@refinedev/strapi-v4";
import { App as AntdApp } from "antd";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { authProvider, axiosInstance } from "./authProvider";
import { API_URL } from "./constants";
import { ColorModeContextProvider } from "./contexts/color-mode";

import { Header, OverviewPageList, EmployeeProfile } from "./components/index";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <AntdApp>
            <DevtoolsProvider>
              <Refine
                authProvider={authProvider}
                dataProvider={DataProvider(API_URL + `/api`, axiosInstance)}
                notificationProvider={useNotificationProvider}
                routerProvider={routerBindings}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  useNewQueryKeys: true,
                  projectId: "5BDGdF-zJCTf9-YjUmiY",
                }}
              >
                {/* <Header/> */}
                <Routes>
                  <Route index  element={
                    <ThemedLayoutV2 Header={() => <Header />} Sider={() => null}>
                    <div
                      style={{
                        maxWidth: "1280px",
                        padding: "24px",
                        margin: "0 auto",
                      }}
                    >
                      <OverviewPageList>
                        <Outlet />
                      </OverviewPageList>
                    </div>
                  </ThemedLayoutV2>
                  } />
                  <Route path="/profile" element={
                    <ThemedLayoutV2 Header={() => <Header />} Sider={() => null}>
                    <div
                      style={{
                        maxWidth: "1280px",
                        padding: "24px",
                        margin: "0 auto",
                      }}
                    >
                      <EmployeeProfile/>
                    </div>
                  </ThemedLayoutV2>
                    } />
                </Routes>
                
                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
              <DevtoolsPanel />
            </DevtoolsProvider>
          </AntdApp>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
