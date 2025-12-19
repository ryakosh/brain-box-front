import { Routes, Route } from "react-router-dom";
import Home from "@/routes/entries/CreateEntry";
import Topics from "@/routes/topics/Topics";
import Entries from "@/routes/entries/Entries";
import Entry from "@/routes/entries/Entry";
import LoginPage from "@/routes/auth/Login";
import Layout from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/auth/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/topics/:id?" element={<Topics />} />
          <Route path="/entries" element={<Entries />} />
          <Route path="/entries/:id" element={<Entry />} />
        </Route>
      </Route>
    </Routes>
  );
}
