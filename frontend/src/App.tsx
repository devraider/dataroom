import Layout from "./components/layout/Layout";
import FileList from "./components/files/FileList";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";

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
    </BrowserRouter>
  );
}

export default App;
