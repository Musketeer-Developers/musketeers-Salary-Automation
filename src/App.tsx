import { GitHubBanner, Refine, WelcomePage } from "@refinedev/core";
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

import { ShowProduct } from "./pages/Overview/show";
import { OverviewPageList } from "./pages/Overview/list";
import {Header} from "./components/index";

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
                <ThemedLayoutV2 Header={() => null} Sider={() => null}>
                  <div
                    style={{
                      maxWidth: "1280px",
                      padding: "24px",
                      margin: "0 auto",
                    }}
                  >
                    <OverviewPageList/>
                  </div>
                </ThemedLayoutV2>
                <Routes>
                  <Route index element={<Header />} />
                  {/* Write Here */}
                  {/* <Route index element={<WelcomePage />} /> */}
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
