import { useCallback } from 'react';

export const useActions = (updateAction) => {
  const handleActionChange = useCallback((index, updatedAction) => {
    updateAction(index, updatedAction);
  }, [updateAction]);

  const handleAttackChange = useCallback((index, updatedAttack) => {
    updateAction(index, (prevAction) => ({
      ...prevAction,
      attack: {
        ...(prevAction.attack || {}),
        ...updatedAttack
      }
    }));
  }, [updateAction]);

  const handleSavingThrowChange = useCallback((index, updatedSavingThrow) => {
    updateAction(index, (prevAction) => ({
      ...prevAction,
      savingThrow: {
        ...prevAction.savingThrow,
        ...updatedSavingThrow
      }
    }));
  }, [updateAction]);

  return {
    handleActionChange,
    handleAttackChange,
    handleSavingThrowChange
  };
};