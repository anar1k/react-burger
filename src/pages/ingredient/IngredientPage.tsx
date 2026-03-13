import { useAppDispatch, useAppSelector } from '@/services/hooks';
import { useGetIngredientsQuery } from '@/services/ingredient/api';
import {
  setSelectedIngredient,
  clearSelectedIngredient,
} from '@/services/selectedIngredient/reducer';
import { getSelectedIngredient } from '@/services/selectedIngredient/selectors';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { IngredientDetails } from '@components/ingredient-details';
import { Modal } from '@components/modal';

export const IngredientPage = (): React.JSX.Element | null => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const selectedIngredient = useAppSelector(getSelectedIngredient);
  const { data: ingredients = [], isLoading } = useGetIngredientsQuery();

  const ingredient =
    selectedIngredient?._id === id
      ? selectedIngredient
      : ingredients.find((item) => item._id === id);

  useEffect(() => {
    if (ingredient && id) {
      dispatch(setSelectedIngredient(ingredient));
    }
  }, [id, ingredient, dispatch]);

  useEffect(() => {
    if (!isLoading && id && ingredients.length > 0 && !ingredient) {
      void navigate('/', { replace: true });
    }
  }, [isLoading, id, ingredients.length, ingredient, navigate]);

  const handleClose = (): void => {
    dispatch(clearSelectedIngredient());
    void navigate('/');
  };

  if (!id) return null;
  if (isLoading) return <Preloader />;
  if (!ingredient) return null;

  return (
    <Modal header="Детали ингредиента" onClose={handleClose}>
      <IngredientDetails />
    </Modal>
  );
};

export default IngredientPage;
