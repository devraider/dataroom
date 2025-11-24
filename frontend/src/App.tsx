import Layout from "./components/layout/Layout";
import FileList from "./components/files/FileList";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { Toaster } from "./components/ui/sonner";
import DemoLoginPage from "./components/layout/DemoLoginPage";
import { isDemoMode } from "./lib/config";
import LoginPage from "./components/layout/LoginPage";
import WorkspaceList from "./components/workspaces/WorkspaceList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={isDemoMode() ? <DemoLoginPage /> : <LoginPage />}
        />
        <Route element={<ProtectedRoute />}>
          <Route path="/workspaces" element={<WorkspaceList />} />

          <Route
            path="/workspaces/:workspaceId/files"
            element={
              <Layout>
                <FileList />
              </Layout>
            }
          />
        </Route>
        <Route path="/" element={<Navigate to="/workspaces" replace />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
