
export interface RecyclingDelivery {
  id?: string;
  date: string;
  classId: string;
  className: string;
  unit: string;
  materials: RecyclingMaterial[];
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RecyclingMaterial {
  type: MaterialType;
  quantity: number;
  unit: WeightUnit;
}

export enum MaterialType {
  PAPER = "PAPER",
  PLASTIC = "PLASTIC",
  GLASS = "GLASS",
  METAL = "METAL",
  ORGANIC = "ORGANIC",
  ELECTRONIC = "ELECTRONIC",
  OTHER = "OTHER",
}

export enum WeightUnit {
  KG = "KG",
  GRAMS = "GRAMS",
}

export interface RecyclingSummary {
  totalRecycled: number;
  materialBreakdown: {
    [key in MaterialType]?: number;
  };
  topClasses: {
    classId: string;
    className: string;
    total: number;
  }[];
  weeklyProgress: {
    week: string;
    total: number;
  }[];
}
