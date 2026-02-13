import type { TIngredient } from '@/utils/types';

export type TabIngredients = {
  label: string;
  value: string;
};

export type GroupedIngredients = Record<string, TIngredient[]>;

export type TabsIngredients = TabIngredients[];
