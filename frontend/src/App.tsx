import Layout from "./components/layout/Layout";
import FileList from "./components/files/FileList";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route
            path="/workspaces/:workspaceId/files"
            element={
              <Layout>
                <FileList />
              </Layout>
            }
          />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
