
import { MaterialType, RecyclingDelivery, RecyclingSummary, WeightUnit } from "@/types/recycling";
import { toast } from "sonner";

// This is a mock API service that would be replaced with real API calls
// In a production environment, you would connect this to your backend

const LOCAL_STORAGE_KEY = "recyclafy-deliveries";

// Helper to get data from localStorage
const getStoredDeliveries = (): RecyclingDelivery[] => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

// Helper to save data to localStorage
const saveDeliveries = (deliveries: RecyclingDelivery[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(deliveries));
};

export const recyclafyAPI = {
  // Submit a new recycling delivery
  submitDelivery: async (delivery: RecyclingDelivery): Promise<RecyclingDelivery> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Validate the delivery data
      if (!delivery.date || !delivery.classId || !delivery.className || !delivery.unit) {
        throw new Error("Missing required fields");
      }
      
      if (!delivery.materials || delivery.materials.length === 0) {
        throw new Error("At least one material must be added");
      }
      
      // In a real API, this would be generated on the server
      const newDelivery: RecyclingDelivery = {
        ...delivery,
        id: `delivery-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Save to local storage (simulating database)
      const deliveries = getStoredDeliveries();
      deliveries.push(newDelivery);
      saveDeliveries(deliveries);
      
      return newDelivery;
    } catch (error) {
      console.error("Error submitting delivery:", error);
      throw error;
    }
  },
  
  // Get all recycling deliveries
  getDeliveries: async (): Promise<RecyclingDelivery[]> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const deliveries = getStoredDeliveries();
      return deliveries;
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      throw error;
    }
  },
  
  // Get recycling summary statistics
  getRecyclingSummary: async (): Promise<RecyclingSummary> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 700));
      
      const deliveries = getStoredDeliveries();
      
      // Calculate total recycled (in kg)
      let totalRecycled = 0;
      const materialBreakdown: {[key in MaterialType]?: number} = {};
      const classTotals: {[key: string]: {classId: string, className: string, total: number}} = {};
      
      // For weekly progress, create a map of week -> total
      const weeklyMap: {[key: string]: number} = {};
      
      deliveries.forEach(delivery => {
        delivery.materials.forEach(material => {
          // Convert to kg if needed
          const quantityInKg = material.unit === WeightUnit.GRAMS 
            ? material.quantity / 1000 
            : material.quantity;
            
          // Update total
          totalRecycled += quantityInKg;
          
          // Update material breakdown
          if (!materialBreakdown[material.type]) {
            materialBreakdown[material.type] = 0;
          }
          materialBreakdown[material.type]! += quantityInKg;
          
          // Update class totals
          const classKey = delivery.classId;
          if (!classTotals[classKey]) {
            classTotals[classKey] = {
              classId: delivery.classId,
              className: delivery.className,
              total: 0
            };
          }
          classTotals[classKey].total += quantityInKg;
          
          // Update weekly progress
          const deliveryDate = new Date(delivery.date);
          const weekStart = new Date(deliveryDate);
          weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start of week (Sunday)
          const weekKey = weekStart.toISOString().split('T')[0];
          
          if (!weeklyMap[weekKey]) {
            weeklyMap[weekKey] = 0;
          }
          weeklyMap[weekKey] += quantityInKg;
        });
      });
      
      // Convert class totals to array and sort
      const topClasses = Object.values(classTotals)
        .sort((a, b) => b.total - a.total)
        .slice(0, 5); // Top 5 classes
        
      // Convert weekly progress to array and sort by date
      const weeklyProgress = Object.entries(weeklyMap)
        .map(([week, total]) => ({ week, total }))
        .sort((a, b) => a.week.localeCompare(b.week));
      
      return {
        totalRecycled,
        materialBreakdown,
        topClasses,
        weeklyProgress,
      };
    } catch (error) {
      console.error("Error getting recycling summary:", error);
      throw error;
    }
  },

  // Demo data for testing
  addDemoData: async (): Promise<void> => {
    try {
      // Sample data to demonstrate the app
      const now = new Date();
      
      // Create dates for the last 4 weeks
      const dates = [];
      for (let i = 0; i < 28; i++) {
        const date = new Date();
        date.setDate(now.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
      }
      
      const classes = [
        { id: "class1", name: "3º Ano A" },
        { id: "class2", name: "2º Ano B" },
        { id: "class3", name: "1º Ano C" },
        { id: "class4", name: "4º Ano A" },
        { id: "class5", name: "5º Ano B" },
      ];
      
      const units = ["Unidade Norte", "Unidade Sul", "Unidade Leste", "Unidade Oeste"];
      
      const materialTypes = Object.values(MaterialType);
      
      // Generate 20 sample deliveries
      const sampleDeliveries: RecyclingDelivery[] = [];
      
      for (let i = 0; i < 20; i++) {
        const randomClass = classes[Math.floor(Math.random() * classes.length)];
        const randomUnit = units[Math.floor(Math.random() * units.length)];
        const randomDate = dates[Math.floor(Math.random() * dates.length)];
        
        // Generate 1-3 materials per delivery
        const materials = [];
        const numMaterials = Math.floor(Math.random() * 3) + 1;
        
        for (let j = 0; j < numMaterials; j++) {
          const randomType = materialTypes[Math.floor(Math.random() * materialTypes.length)];
          const isKg = Math.random() > 0.5;
          
          materials.push({
            type: randomType,
            quantity: isKg ? Math.round(Math.random() * 10 * 10) / 10 : Math.round(Math.random() * 5000),
            unit: isKg ? WeightUnit.KG : WeightUnit.GRAMS
          });
        }
        
        sampleDeliveries.push({
          id: `demo-${i}`,
          date: randomDate,
          classId: randomClass.id,
          className: randomClass.name,
          unit: randomUnit,
          materials,
          notes: Math.random() > 0.7 ? "Coleta realizada com sucesso." : undefined,
          createdAt: new Date(randomDate).toISOString(),
          updatedAt: new Date(randomDate).toISOString()
        });
      }
      
      // Save demo data to local storage
      saveDeliveries(sampleDeliveries);
      toast.success("Dados de demonstração adicionados");
    } catch (error) {
      console.error("Error adding demo data:", error);
      throw error;
    }
  },
  
  // Clear all data
  clearAllData: async (): Promise<void> => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      toast.success("Todos os dados foram removidos");
    } catch (error) {
      console.error("Error clearing data:", error);
      throw error;
    }
  }
};
