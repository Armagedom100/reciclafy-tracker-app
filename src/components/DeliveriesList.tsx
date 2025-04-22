
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RecyclingDelivery, MaterialType, WeightUnit } from "@/types/recycling";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect, useState } from "react";

interface DeliveriesListProps {
  deliveries: RecyclingDelivery[];
  isLoading: boolean;
}

export default function DeliveriesList({ deliveries, isLoading }: DeliveriesListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDeliveries, setFilteredDeliveries] = useState<RecyclingDelivery[]>(deliveries);

  // Material type maps
  const materialLabels: Record<MaterialType, string> = {
    [MaterialType.PAPER]: "Papel",
    [MaterialType.PLASTIC]: "Plástico",
    [MaterialType.GLASS]: "Vidro",
    [MaterialType.METAL]: "Metal",
    [MaterialType.ORGANIC]: "Orgânico",
    [MaterialType.ELECTRONIC]: "Eletrônico",
    [MaterialType.OTHER]: "Outro",
  };

  // Material-to-color map
  const materialColors: Record<MaterialType, string> = {
    [MaterialType.PAPER]: "bg-blue-100 text-blue-800 border-blue-200",
    [MaterialType.PLASTIC]: "bg-yellow-100 text-yellow-800 border-yellow-200",
    [MaterialType.GLASS]: "bg-emerald-100 text-emerald-800 border-emerald-200",
    [MaterialType.METAL]: "bg-gray-100 text-gray-800 border-gray-200",
    [MaterialType.ORGANIC]: "bg-green-100 text-green-800 border-green-200",
    [MaterialType.ELECTRONIC]: "bg-purple-100 text-purple-800 border-purple-200",
    [MaterialType.OTHER]: "bg-orange-100 text-orange-800 border-orange-200",
  };

  // Format material quantity with unit
  const formatQuantity = (quantity: number, unit: WeightUnit) => {
    if (unit === WeightUnit.KG) {
      return `${quantity} kg`;
    } else {
      return `${quantity} g`;
    }
  };

  // Filter deliveries based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredDeliveries(deliveries);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = deliveries.filter(
      (delivery) =>
        delivery.className.toLowerCase().includes(query) ||
        delivery.unit.toLowerCase().includes(query) ||
        delivery.classId.toLowerCase().includes(query) ||
        delivery.materials.some(
          (m) => materialLabels[m.type].toLowerCase().includes(query)
        )
    );

    setFilteredDeliveries(filtered);
  }, [searchQuery, deliveries]);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <CardTitle>Todas as Entregas</CardTitle>
            <CardDescription>
              Visualize e gerencie as entregas de materiais recicláveis
            </CardDescription>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Pesquisar entregas..."
              className="w-full sm:w-64 px-4 py-2 rounded-md border border-input bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredDeliveries.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">Nenhuma entrega encontrada</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Turma</TableHead>
                  <TableHead>Unidade</TableHead>
                  <TableHead>Materiais</TableHead>
                  <TableHead>Registrado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeliveries.map((delivery) => (
                  <TableRow key={delivery.id}>
                    <TableCell>
                      {new Date(delivery.date).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{delivery.className}</div>
                        <div className="text-sm text-muted-foreground">
                          ID: {delivery.classId}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{delivery.unit}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {delivery.materials.map((material, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className={materialColors[material.type]}
                          >
                            {materialLabels[material.type]}:{" "}
                            {formatQuantity(material.quantity, material.unit)}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {delivery.createdAt
                          ? formatDistanceToNow(new Date(delivery.createdAt), {
                              addSuffix: true,
                              locale: ptBR,
                            })
                          : "N/A"}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
