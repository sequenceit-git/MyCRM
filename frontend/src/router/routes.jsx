import { Navigate } from 'react-router-dom';

import Logout from '@/pages/Logout.jsx';
import NotFound from '@/pages/NotFound.jsx';

import Dashboard from '@/pages/Dashboard';
import Customer from '@/pages/Customer';
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
      path: '/settings',
      element: <Settings />,
    },
    {
      path: '/settings/edit/:settingsKey',
      element: <Settings />,
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
