export enum RoastLevel {
  LIGHT = 'LIGHT',
  MEDIUM = 'MEDIUM',
  DARK = 'DARK',
}

export interface Coffee {
  id: number;
  name: string;
  brand: string;
  roastLevel: RoastLevel;
  origin: string;
  shopName: string;
  purchaseDate: string;
  initialQuantity: number;
  currentQuantity: number;
  pricePerBag: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  usageLogs?: UsageLog[];
}

export interface UsageLog {
  id: number;
  coffeeId: number;
  coffee?: Coffee;
  amountUsed: number;
  usageDate: string;
  notes?: string;
  createdAt: string;
}

export interface CoffeeMachine {
  id: number;
  name: string;
  brand: string;
  model: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  recipes?: Recipe[];
  machineUsageLogs?: MachineUsageLog[];
}

export interface Recipe {
  id: number;
  machineId: number;
  machine?: CoffeeMachine;
  name: string;
  volumeMl: number;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  machineUsageLogs?: MachineUsageLog[];
}

export interface MachineUsageLog {
  id: number;
  recipeId: number;
  recipe?: Recipe;
  machineId: number;
  machine?: CoffeeMachine;
  volumeMl: number;
  usageDate: string;
  notes?: string;
  createdAt: string;
}

export interface RecipeStats {
  recipeId: number;
  recipeName: string;
  count: number;
  totalVolume: number;
}

export interface MachineStats {
  machine: CoffeeMachine;
  totalDrinksPrepared: number;
  totalVolumeConsumed: number;
  recipeStats: RecipeStats[];
  mostPopular: RecipeStats | null;
}

export interface OverallStats {
  coffee: {
    totalCoffees: number;
    totalCurrentWeight: number;
    totalUsageWeight: number;
  };
  machine: {
    totalMachines: number;
    totalRecipes: number;
    totalDrinksPrepared: number;
    totalVolumeConsumed: number;
  };
}
