
import { Layout } from "@/components/Layout";
import RecyclingStats from "@/components/RecyclingStats";
import { recyclafyAPI } from "@/services/recyclafyAPI";
import { RecyclingSummary } from "@/types/recycling";
import { useEffect, useState } from "react";

const DashboardPage = () => {
  const [summary, setSummary] = useState<RecyclingSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        setIsLoading(true);
        const data = await recyclafyAPI.getRecyclingSummary();
        setSummary(data);
      } catch (error) {
        console.error("Error loading summary:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSummary();
  }, []);

  return (
    <Layout>
      <div className="space-y-8">
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Visualize estatísticas e métricas de reciclagem
          </p>
        </div>

        <RecyclingStats summary={summary} isLoading={isLoading} />
      </div>
    </Layout>
  );
};

export default DashboardPage;
