import { useReducer, useCallback } from 'react';
import { GameState } from './types';
import { initialGameState } from './data';
import { gameReducer } from './gameLogic';

export function useGame() {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);

  const buyProperty = useCallback((propertyId: string) => {
    dispatch({ type: 'BUY_PROPERTY', payload: { id: propertyId } });
  }, []);

  const sellProperty = useCallback((propertyId: string) => {
    dispatch({ type: 'SELL_PROPERTY', payload: { id: propertyId } });
  }, []);

  const repairProperty = useCallback((propertyId: string) => {
    dispatch({ type: 'REPAIR_PROPERTY', payload: { id: propertyId } });
  }, []);

  const nextTurn = useCallback(() => {
    dispatch({ type: 'NEXT_TURN' });
  }, []);

  const dismissEvent = useCallback(() => {
    dispatch({ type: 'DISMISS_EVENT' });
  }, []);

  const restart = useCallback(() => {
    dispatch({ type: 'RESTART' });
  }, []);

  return {
    state,
    actions: {
      buyProperty,
      sellProperty,
      repairProperty,
      nextTurn,
      dismissEvent,
      restart,
    },
  };
}
