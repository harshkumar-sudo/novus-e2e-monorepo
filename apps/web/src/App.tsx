import { lazy, Suspense, type ReactNode } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import { AssistantPanel } from "./components/AssistantPanel";
import { NavBar } from "./components/NavBar";

const LoginPage = lazy(() => import("./pages/LoginPage").then((m) => ({ default: m.LoginPage })));
const NotebookPage = lazy(() =>
  import("./pages/NotebookPage").then((m) => ({ default: m.NotebookPage }))
);
const NotebooksPage = lazy(() =>
  import("./pages/NotebooksPage").then((m) => ({ default: m.NotebooksPage }))
);
const SettingsPage = lazy(() =>
  import("./pages/SettingsPage").then((m) => ({ default: m.SettingsPage }))
);

function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <p className="fn-main">Loading…</p>;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return (
    <>
      <NavBar />
      <div className="fn-layout">
        <main className="fn-main">
          <Suspense fallback={<p>Loading…</p>}>{children}</Suspense>
        </main>
        <AssistantPanel />
      </div>
    </>
  );
}

export function App() {
  return (
    <Suspense fallback={<p className="fn-main">Loading…</p>}>
      <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <NotebooksPage />
          </RequireAuth>
        }
      />
      <Route
        path="/notebooks/:notebookId"
        element={
          <RequireAuth>
            <NotebookPage />
          </RequireAuth>
        }
      />
      <Route
        path="/settings"
        element={
          <RequireAuth>
            <SettingsPage />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </Suspense>
  );
}
