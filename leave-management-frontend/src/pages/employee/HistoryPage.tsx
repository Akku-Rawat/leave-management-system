import React from "react";
import Layout from "../../components/Layout";
import Header from "../../components/Header";
import History from "./HistoryPage"; // ✅ no props needed now

const HistoryPage: React.FC = () => {
  return (
    <Layout>
      <Header name="Shivangi" />
      <div className="max-w-3xl mx-auto">
        <History />  {/* ✅ no props */}
      </div>
    </Layout>
  );
};

export default HistoryPage;
