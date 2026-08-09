import './style/app.css';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '@/redux/store';
import IdurarOs from './apps/IdurarOs';

export default function RoutApp() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <IdurarOs />
      </Provider>
    </BrowserRouter>
  );
}
