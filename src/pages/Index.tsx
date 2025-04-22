import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/Layout";
import { recyclafyAPI } from "@/services/recyclafyAPI";
import { LineChart, Recycle, Trash2, Upload } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const handleAddDemoData = async () => {
    await recyclafyAPI.addDemoData();
  };

  const handleClearData = async () => {
    await recyclafyAPI.clearAllData();
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-primary">
            Bem-vindo ao Reciclafy
          </h1>
          <p className="text-xl text-muted-foreground mt-2">
            Sistema de rastreamento e análise de reciclagem para escolas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-accent border-primary/20">
            <CardHeader>
              <div className="bg-primary/10 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                <Upload size={24} className="text-primary" />
              </div>
              <CardTitle>Nova Entrega</CardTitle>
              <CardDescription>
                Registre uma nova entrega de materiais recicláveis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Adicione detalhes sobre os materiais reciclados por turma, incluindo quantidade e tipo de material.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to="/nova-entrega">Registrar Entrega</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <div className="bg-muted w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                <Recycle size={24} className="text-recyclafy-leaf-green" />
              </div>
              <CardTitle>Entregas Registradas</CardTitle>
              <CardDescription>
                Visualize todas as entregas de materiais recicláveis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Consulte o histórico completo de entregas, com detalhes sobre turmas, materiais e datas.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link to="/entregas">Ver Entregas</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <div className="bg-muted w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                <LineChart size={24} className="text-recyclafy-water-blue" />
              </div>
              <CardTitle>Dashboard</CardTitle>
              <CardDescription>
                Acompanhe métricas e estatísticas de reciclagem
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Visualize gráficos e relatórios sobre o desempenho das turmas e a evolução da reciclagem ao longo do tempo.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link to="/dashboard">Ver Dashboard</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* API Documentation Card */}
        <Card className="mt-6 bg-muted/30 border-dashed">
          <CardHeader>
            <CardTitle className="text-lg">Documentação da API</CardTitle>
            <CardDescription>
              Informações para desenvolvedores sobre a API RESTful
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Endpoints Disponíveis:</h3>
                <ul className="space-y-1 text-sm">
                  <li className="font-mono bg-muted p-1 rounded">GET /api/deliveries</li>
                  <li className="font-mono bg-muted p-1 rounded">POST /api/deliveries</li>
                  <li className="font-mono bg-muted p-1 rounded">GET /api/summary</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Documentação:</h3>
                <p className="text-sm text-muted-foreground">
                  A documentação completa da API está disponível no formato
                  Swagger/OpenAPI para facilitar a integração com outros sistemas.
                </p>
                <div className="mt-2">
                  <Button size="sm" variant="ghost">
                    Ver documentação
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dados de demonstração */}
        <div className="border rounded-lg p-4 mt-6">
          <h3 className="font-medium mb-2">Dados de Demonstração</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Para testar o sistema, você pode adicionar ou remover dados de demonstração
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={handleAddDemoData}>
              <Recycle size={16} className="mr-2" />
              Adicionar Dados de Demonstração
            </Button>
            <Button variant="outline" onClick={handleClearData}>
              <Trash2 size={16} className="mr-2" />
              Limpar Todos os Dados
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
