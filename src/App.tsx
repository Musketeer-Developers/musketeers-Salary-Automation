import { Authenticated, Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { NavigateToResource } from "@refinedev/react-router-v6";
import { ThemedLayoutV2, useNotificationProvider, ErrorComponent } from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import routerBindings, {
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";

import {
  CatchAllNavigate,
} from "@refinedev/react-router-v6";

import { App as AntdApp } from "antd";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { authProvider } from "./authProvider";
import { ColorModeContextProvider } from "./contexts/color-mode";
import { Header, OverviewPageList, EmployeeProfile, Dailylog, EmployeeOverview } from "./components/index";
import { Login } from "./pages/Overview/login";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <AntdApp>
              <Refine
                authProvider={authProvider}
                notificationProvider={useNotificationProvider}
                routerProvider={routerBindings}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  useNewQueryKeys: true,
                  projectId: "5BDGdF-zJCTf9-YjUmiY",
                }}
              >
                <Routes>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-routes"
                        fallback={<CatchAllNavigate to="/login" />}
                      >
                        <ThemedLayoutV2
                          Header={() => <Header />}
                          Sider={() => null}
                        >
                          <div
                            style={{
                              maxWidth: "1280px",
                              padding: "24px",
                              margin: "0 auto",
                            }}
                          >
                            <Outlet />
                          </div>
                        </ThemedLayoutV2>
                      </Authenticated>
                    }
                  >
                    <Route path='/' element={
                      <ThemedLayoutV2 Header={() => null} Sider={() => null}>
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
                    <Route path='/allemployees' element={
                      <ThemedLayoutV2 Header={() => null} Sider={() => null}>
                        <div
                          style={{
                            maxWidth: "1280px",
                            padding: "24px",
                            margin: "0 auto",
                          }}
                        >
                          <EmployeeOverview >
                            <Outlet />
                          </EmployeeOverview>
                        </div>
                      </ThemedLayoutV2>
                    } />
                    <Route path="/profile/:id" element={
                      <ThemedLayoutV2 Header={() => null} Sider={() => null}>
                        <div
                          style={{
                            maxWidth: "1280px",
                            padding: "24px",
                            margin: "0 auto",
                          }}
                        >
                          <EmployeeProfile />
                        </div>
                      </ThemedLayoutV2>
                    } />
                    <Route path='/daily/:id/:monthID/:activeParam' element={
                      <ThemedLayoutV2 Header={() => null} Sider={() => null}>
                        <div
                          style={{
                            maxWidth: "1280px",
                            padding: "24px",
                            margin: "0 auto",
                          }}
                        >
                          <Dailylog>
                            <Outlet />
                          </Dailylog>
                        </div>
                      </ThemedLayoutV2>
                    } />
                    <Route path="*" element={<ErrorComponent />} />
                  </Route>

                  <Route
                    element={
                      <Authenticated key="auth-pages" fallback={<Outlet />}>
                        <NavigateToResource />
                      </Authenticated>
                    }
                  >
                    <Route
                      path="/login"
                      element={<Login />}
                    />
                  </Route>
                </Routes>
                <RefineKbar />
                <UnsavedChangesNotifier />
              </Refine>
          </AntdApp>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter >
  );
}

export default App;
