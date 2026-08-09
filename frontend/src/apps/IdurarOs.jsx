import { useSelector } from 'react-redux';
import { selectAuth } from '@/redux/auth/selectors';
import { AppContextProvider } from '@/context/appContext';
import AuthRouter from '@/router/AuthRouter';
import Localization from '@/locale/Localization';
import ErpApp from './ErpApp';

const DefaultApp = () => (
  <Localization>
    <AppContextProvider>
      <ErpApp />
    </AppContextProvider>
  </Localization>
);

export default function IdurarOs() {
  const { isLoggedIn } = useSelector(selectAuth);

  if (!isLoggedIn)
    return (
      <Localization>
        <AuthRouter />
      </Localization>
    );
  else {
    return <DefaultApp />;
  }
}
