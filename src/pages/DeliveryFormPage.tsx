
import { Layout } from "@/components/Layout";
import DeliveryForm from "@/components/DeliveryForm";

const DeliveryFormPage = () => {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-bold">Nova Entrega</h1>
          <p className="text-muted-foreground mt-2">
            Registre uma nova entrega de materiais recicláveis
          </p>
        </div>
        <DeliveryForm />
      </div>
    </Layout>
  );
};

export default DeliveryFormPage;
