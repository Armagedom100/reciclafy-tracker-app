
import { Layout } from "@/components/Layout";
import DeliveriesList from "@/components/DeliveriesList";
import { recyclafyAPI } from "@/services/recyclafyAPI";
import { RecyclingDelivery } from "@/types/recycling";
import { useEffect, useState } from "react";

const DeliveriesListPage = () => {
  const [deliveries, setDeliveries] = useState<RecyclingDelivery[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDeliveries = async () => {
      try {
        setIsLoading(true);
        const data = await recyclafyAPI.getDeliveries();
        
        // Sort by date (newest first)
        const sorted = [...data].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        setDeliveries(sorted);
      } catch (error) {
        console.error("Error loading deliveries:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDeliveries();
  }, []);

  return (
    <Layout>
      <div className="space-y-8">
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-bold">Entregas Registradas</h1>
          <p className="text-muted-foreground mt-2">
            Visualize e gerencie todas as entregas de materiais recicláveis
          </p>
        </div>

        <DeliveriesList deliveries={deliveries} isLoading={isLoading} />
      </div>
    </Layout>
  );
};

export default DeliveriesListPage;
