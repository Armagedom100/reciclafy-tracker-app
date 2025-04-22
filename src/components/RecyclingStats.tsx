
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MaterialType, RecyclingSummary } from "@/types/recycling";
import { BarChart, LineChart, PieChart } from "recharts";
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface RecyclingStatsProps {
  summary: RecyclingSummary | null;
  isLoading: boolean;
}

export default function RecyclingStats({ summary, isLoading }: RecyclingStatsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-6 bg-muted rounded w-1/3"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-40 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-bold">Sem dados disponíveis</h2>
        <p className="text-muted-foreground mt-2">
          Registre algumas entregas para visualizar estatísticas.
        </p>
      </div>
    );
  }

  // Prepare data for material breakdown chart
  const materialData = Object.entries(summary.materialBreakdown).map(([material, amount]) => {
    const materialLabels: Record<string, string> = {
      [MaterialType.PAPER]: "Papel",
      [MaterialType.PLASTIC]: "Plástico",
      [MaterialType.GLASS]: "Vidro",
      [MaterialType.METAL]: "Metal",
      [MaterialType.ORGANIC]: "Orgânico",
      [MaterialType.ELECTRONIC]: "Eletrônico",
      [MaterialType.OTHER]: "Outro",
    };

    return {
      name: materialLabels[material as MaterialType],
      value: Number(amount.toFixed(2)),
    };
  });

  // Colors for pie chart
  const COLORS = [
    "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#F44336"
  ];

  // Prepare data for top classes chart
  const classData = summary.topClasses.map((cls) => ({
    name: cls.className,
    quantidade: Number(cls.total.toFixed(2)),
  }));

  // Prepare data for weekly progress chart
  const weeklyData = summary.weeklyProgress.map((week) => ({
    name: new Date(week.week).toLocaleDateString("pt-BR", {
      month: "short",
      day: "numeric",
    }),
    quantidade: Number(week.total.toFixed(2)),
  }));

  // Calculate target and progress
  const targetKg = 100; // Example target
  const progress = (summary.totalRecycled / targetKg) * 100;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Reciclado</CardTitle>
            <CardDescription>Quantidade em kg</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {summary.totalRecycled.toFixed(2)} kg
            </div>
            <div className="mt-2">
              <p className="text-xs text-muted-foreground mb-1">Meta: {targetKg} kg</p>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Turmas Participantes</CardTitle>
            <CardDescription>Total de turmas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{summary.topClasses.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Maior Contribuidor</CardTitle>
            <CardDescription>Turma com maior volume</CardDescription>
          </CardHeader>
          <CardContent>
            {summary.topClasses.length > 0 ? (
              <>
                <div className="text-xl font-medium">{summary.topClasses[0].className}</div>
                <div className="text-muted-foreground">
                  {summary.topClasses[0].total.toFixed(2)} kg
                </div>
              </>
            ) : (
              <div className="text-muted-foreground">Sem dados</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Material Predominante</CardTitle>
            <CardDescription>Tipo mais reciclado</CardDescription>
          </CardHeader>
          <CardContent>
            {materialData.length > 0 ? (
              <>
                <div className="text-xl font-medium">
                  {materialData.sort((a, b) => b.value - a.value)[0].name}
                </div>
                <div className="text-muted-foreground">
                  {materialData.sort((a, b) => b.value - a.value)[0].value} kg
                </div>
              </>
            ) : (
              <div className="text-muted-foreground">Sem dados</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Distribuição por Material</CardTitle>
            <CardDescription>Quantidade reciclada por tipo de material</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={materialData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {materialData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Melhores Turmas</CardTitle>
            <CardDescription>Quantidade reciclada por turma (kg)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={classData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" scale="band" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="quantidade"
                    name="Quantidade (kg)"
                    fill="#4CAF50"
                    radius={[4, 4, 0, 0]}
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Evolução Semanal</CardTitle>
            <CardDescription>Progresso ao longo do tempo (kg)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="quantidade"
                    name="Quantidade (kg)"
                    stroke="#03A9F4"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
