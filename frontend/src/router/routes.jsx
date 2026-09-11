import { Navigate } from 'react-router-dom';

import Logout from '@/pages/Logout.jsx';
import NotFound from '@/pages/NotFound.jsx';

import Dashboard from '@/pages/Dashboard';
import Customer from '@/pages/Customer';
import People from '@/pages/People';
import Company from '@/pages/Company';
import Lead from '@/pages/Lead';
import Offer from '@/pages/Offer';
import Product from '@/pages/Product';
import ProductCategory from '@/pages/ProductCategory';
import Order from '@/pages/Order';
import Expense from '@/pages/Expense';
import ExpenseCategory from '@/pages/ExpenseCategory';
import Report from '@/pages/Report';

import Invoice from '@/pages/Invoice';
import InvoiceCreate from '@/pages/Invoice/InvoiceCreate';
import InvoiceRead from '@/pages/Invoice/InvoiceRead';
import InvoiceUpdate from '@/pages/Invoice/InvoiceUpdate';
import InvoiceRecordPayment from '@/pages/Invoice/InvoiceRecordPayment';

import Quote from '@/pages/Quote';
import QuoteCreate from '@/pages/Quote/QuoteCreate';
import QuoteRead from '@/pages/Quote/QuoteRead';
import QuoteUpdate from '@/pages/Quote/QuoteUpdate';

import Payment from '@/pages/Payment/index';
import PaymentRead from '@/pages/Payment/PaymentRead';
import PaymentUpdate from '@/pages/Payment/PaymentUpdate';
import PaymentMode from '@/pages/PaymentMode';

import Taxes from '@/pages/Taxes';
import Settings from '@/pages/Settings/Settings';
import Admin from '@/pages/Admin';
import Currency from '@/pages/Currency';
import ApiKeySettings from '@/pages/Settings/ApiKeySettings';
import EmailTemplateSettings from '@/pages/Settings/EmailTemplateSettings';
import MultiCompanySettings from '@/pages/Settings/MultiCompanySettings';
import PublicFormSettings from '@/pages/Settings/PublicFormSettings';
import AiSettings from '@/pages/Settings/AiSettings';
import Profile from '@/pages/Profile';
import About from '@/pages/About';

let routes = {
  expense: [],
  default: [
    {
      path: '/login',
      element: <Navigate to="/" />,
    },
    {
      path: '/logout',
      element: <Logout />,
    },
    {
      path: '/about',
      element: <About />,
    },
    {
      path: '/',
      element: <Dashboard />,
    },
    {
      path: '/dashboard',
      element: <Dashboard />,
    },
    {
      path: '/customer',
      element: <Customer />,
    },
    {
      path: '/people',
      element: <People />,
    },
    {
      path: '/company',
      element: <Company />,
    },
    {
      path: '/lead',
      element: <Lead />,
    },
    {
      path: '/offer',
      element: <Offer />,
    },
    {
      path: '/product',
      element: <Product />,
    },
    {
      path: '/product/category',
      element: <ProductCategory />,
    },
    {
      path: '/order',
      element: <Order />,
    },
    {
      path: '/expense',
      element: <Expense />,
    },
    {
      path: '/expense/category',
      element: <ExpenseCategory />,
    },
    {
      path: '/report',
      element: <Report />,
    },
    {
      path: '/invoice',
      element: <Invoice />,
    },
    {
      path: '/invoice/create',
      element: <InvoiceCreate />,
    },
    {
      path: '/invoice/read/:id',
      element: <InvoiceRead />,
    },
    {
      path: '/invoice/update/:id',
      element: <InvoiceUpdate />,
    },
    {
      path: '/invoice/pay/:id',
      element: <InvoiceRecordPayment />,
    },
    {
      path: '/quote',
      element: <Quote />,
    },
    {
      path: '/quote/create',
      element: <QuoteCreate />,
    },
    {
      path: '/quote/read/:id',
      element: <QuoteRead />,
    },
    {
      path: '/quote/update/:id',
      element: <QuoteUpdate />,
    },
    {
      path: '/payment',
      element: <Payment />,
    },
    {
      path: '/payment/read/:id',
      element: <PaymentRead />,
    },
    {
      path: '/payment/update/:id',
      element: <PaymentUpdate />,
    },
    {
      path: '/admin',
      element: <Admin />,
    },
    {
      path: '/currency',
      element: <Currency />,
    },
    {
      path: '/settings',
      element: <Settings />,
    },
    {
      path: '/settings/edit/:settingsKey',
      element: <Settings />,
    },
    {
      path: '/settings/api-key',
      element: <ApiKeySettings />,
    },
    {
      path: '/settings/ai',
      element: <AiSettings />,
    },
    {
      path: '/settings/email-template',
      element: <EmailTemplateSettings />,
    },
    {
      path: '/settings/multi-company',
      element: <MultiCompanySettings />,
    },
    {
      path: '/settings/public-form',
      element: <PublicFormSettings />,
    },
    {
      path: '/payment/mode',
      element: <PaymentMode />,
    },
    {
      path: '/taxes',
      element: <Taxes />,
    },
    {
      path: '/profile',
      element: <Profile />,
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ],
};

export default routes;
