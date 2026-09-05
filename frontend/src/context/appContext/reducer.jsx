import * as actionTypes from './types';

const getInitialAiSidebarState = () => {
  try {
    const saved = localStorage.getItem('mycrm_ai_sidebar_open');
    return saved !== null ? JSON.parse(saved) : false;
  } catch (e) {
    return false;
  }
};

export const initialState = {
  isNavMenuClose: false,
  currentApp: 'default',
  isAiSidebarOpen: getInitialAiSidebarState(),
};

export function contextReducer(state, action) {
  switch (action.type) {
    case actionTypes.OPEN_NAV_MENU:
      return {
        ...state,
        isNavMenuClose: false,
      };
    case actionTypes.CLOSE_NAV_MENU:
      return {
        ...state,
        isNavMenuClose: true,
      };
    case actionTypes.COLLAPSE_NAV_MENU:
      return {
        ...state,
        isNavMenuClose: !state.isNavMenuClose,
      };
    case actionTypes.OPEN_AI_SIDEBAR: {
      localStorage.setItem('mycrm_ai_sidebar_open', JSON.stringify(true));
      return {
        ...state,
        isAiSidebarOpen: true,
      };
    }
    case actionTypes.CLOSE_AI_SIDEBAR: {
      localStorage.setItem('mycrm_ai_sidebar_open', JSON.stringify(false));
      return {
        ...state,
        isAiSidebarOpen: false,
      };
    }
    case actionTypes.COLLAPSE_AI_SIDEBAR: {
      const nextVal = !state.isAiSidebarOpen;
      localStorage.setItem('mycrm_ai_sidebar_open', JSON.stringify(nextVal));
      return {
        ...state,
        isAiSidebarOpen: nextVal,
      };
    }
    case actionTypes.CHANGE_APP:
      return {
        ...state,
        currentApp: action.playload,
      };
    case actionTypes.DEFAULT_APP:
      return {
        ...state,
        currentApp: 'default',
      };

    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

