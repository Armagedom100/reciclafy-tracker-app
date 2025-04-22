
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MaterialType, RecyclingDelivery, WeightUnit } from "@/types/recycling";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Save, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { recyclafyAPI } from "@/services/recyclafyAPI";

// Form validation schema
const deliverySchema = z.object({
  date: z.string().min(1, "Data é obrigatória"),
  classId: z.string().min(1, "Turma é obrigatória"),
  className: z.string().min(1, "Nome da turma é obrigatório"),
  unit: z.string().min(1, "Unidade é obrigatória"),
  notes: z.string().optional(),
  materials: z.array(
    z.object({
      type: z.nativeEnum(MaterialType, {
        errorMap: () => ({ message: "Tipo de material é obrigatório" }),
      }),
      quantity: z.number().positive("A quantidade deve ser maior que zero"),
      unit: z.nativeEnum(WeightUnit, {
        errorMap: () => ({ message: "Unidade de medida é obrigatória" }),
      }),
    })
  ).min(1, "Pelo menos um material deve ser adicionado"),
});

type DeliveryFormValues = z.infer<typeof deliverySchema>;

export default function DeliveryForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form with default values
  const form = useForm<DeliveryFormValues>({
    resolver: zodResolver(deliverySchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0], // Today's date
      classId: "",
      className: "",
      unit: "",
      notes: "",
      materials: [
        {
          type: MaterialType.PAPER,
          quantity: 1,
          unit: WeightUnit.KG,
        },
      ],
    },
  });

  // Material type options for the select
  const materialTypeOptions = Object.values(MaterialType).map((type) => {
    const labels: Record<MaterialType, string> = {
      [MaterialType.PAPER]: "Papel",
      [MaterialType.PLASTIC]: "Plástico",
      [MaterialType.GLASS]: "Vidro",
      [MaterialType.METAL]: "Metal",
      [MaterialType.ORGANIC]: "Orgânico",
      [MaterialType.ELECTRONIC]: "Eletrônico",
      [MaterialType.OTHER]: "Outro",
    };

    return {
      value: type,
      label: labels[type],
    };
  });

  // Add new material to form
  const addMaterial = () => {
    const materials = form.getValues("materials") || [];
    form.setValue("materials", [
      ...materials,
      {
        type: MaterialType.PAPER,
        quantity: 1,
        unit: WeightUnit.KG,
      },
    ]);
  };

  // Remove material from form
  const removeMaterial = (index: number) => {
    const materials = form.getValues("materials");
    if (materials.length > 1) {
      form.setValue(
        "materials",
        materials.filter((_, i) => i !== index)
      );
    } else {
      toast.error("Pelo menos um material deve ser informado");
    }
  };

  // Handle form submission
  const onSubmit = async (data: DeliveryFormValues) => {
    try {
      setIsSubmitting(true);
      await recyclafyAPI.submitDelivery(data as RecyclingDelivery);
      toast.success("Entrega registrada com sucesso!");
      // Reset form
      form.reset({
        date: new Date().toISOString().split("T")[0],
        classId: "",
        className: "",
        unit: "",
        notes: "",
        materials: [
          {
            type: MaterialType.PAPER,
            quantity: 1,
            unit: WeightUnit.KG,
          },
        ],
      });
    } catch (error) {
      toast.error("Erro ao registrar entrega: " + (error instanceof Error ? error.message : "Erro desconhecido"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Nova Entrega de Reciclagem</CardTitle>
        <CardDescription>
          Registre uma nova entrega de materiais recicláveis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data da Entrega</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unidade</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a unidade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Unidade Norte">Unidade Norte</SelectItem>
                        <SelectItem value="Unidade Sul">Unidade Sul</SelectItem>
                        <SelectItem value="Unidade Leste">Unidade Leste</SelectItem>
                        <SelectItem value="Unidade Oeste">Unidade Oeste</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="classId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID da Turma</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: turma123" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="className"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Turma</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: 3º Ano A" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Materiais</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addMaterial}
                >
                  <Plus size={16} className="mr-1" />
                  Adicionar Material
                </Button>
              </div>

              <div className="space-y-4 mt-4">
                {form.watch("materials")?.map((_, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-3 items-end bg-muted/40 rounded-md p-3"
                  >
                    <div className="col-span-5">
                      <FormField
                        control={form.control}
                        name={`materials.${index}.type`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo de Material</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {materialTypeOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-3">
                      <FormField
                        control={form.control}
                        name={`materials.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantidade</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                value={field.value}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-3">
                      <FormField
                        control={form.control}
                        name={`materials.${index}.unit`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Unidade</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Unidade" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value={WeightUnit.KG}>Kg</SelectItem>
                                <SelectItem value={WeightUnit.GRAMS}>Gramas</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeMaterial(index)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Informações adicionais sobre esta entrega (opcional)"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CardFooter className="px-0 pt-6">
              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                {isSubmitting ? "Enviando..." : (
                  <>
                    <Save size={18} className="mr-2" />
                    Registrar Entrega
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
