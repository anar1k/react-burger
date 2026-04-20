export type TIngredient = {
  _id: string;
  name: string;
  type: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
  __v: number;
};

export type TIngredientWithUniqueId = TIngredient & { uniqueId: string };

export type TGetFetchSuccess<T> = {
  success: boolean;
  data: T;
};

export type TOrder = {
  _id: string;
  ingredients: string[];
  status: string;
  /** В ответе WebSocket может отсутствовать — подставляем заглушку при нормализации. */
  name?: string;
  createdAt: string;
  updatedAt: string;
  number: number;
  owner?: string;
};
