import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import type { PageContext } from '../types';
import { useChatStore } from '../stores/chatStore';

export const useContext = () => {
  const location = useLocation();
  const setContext = useChatStore((state) => state.setContext);

  useEffect(() => {
    const getPageContext = (pathname: string): PageContext => {
      if (pathname.includes('/clients')) {
        return {
          route: pathname,
          pageType: 'clients',
          availableActions: ['Criar cliente'],
          relevantHelp: ['Como criar cliente', 'Tipos de cliente']
        };
      }
      
      if (pathname.includes('/operations')) {
        return {
          route: pathname,
          pageType: 'operations',
          availableActions: ['Nova operação', 'Acompanhar status', 'Ver histórico'],
          relevantHelp: ['Como criar operação', 'Status das operações', 'Tipos de crédito']
        };
      }

      return {
        route: pathname,
        pageType: 'dashboard',
        availableActions: ['Navegar menu', 'Ver resumo'],
        relevantHelp: ['Navegação geral', 'Primeiros passos']
      };
    };

    const context = getPageContext(location.pathname);
    setContext(context);
  }, [location.pathname, setContext]);

  return location.pathname;
};
