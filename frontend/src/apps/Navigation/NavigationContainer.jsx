import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Drawer, Layout, Menu } from 'antd';

import { useAppContext } from '@/context/appContext';

import useLanguage from '@/locale/useLanguage';
import logoIcon from '@/style/images/logo-icon.svg';

import useResponsive from '@/hooks/useResponsive';

import {
  SettingOutlined,
  CustomerServiceOutlined,
  ContainerOutlined,
  FileSyncOutlined,
  DashboardOutlined,
  TagOutlined,
  TagsOutlined,
  UserOutlined,
  CreditCardOutlined,
  MenuOutlined,
  FileOutlined,
  ShopOutlined,
  FilterOutlined,
  WalletOutlined,
  ShoppingCartOutlined,
  PieChartOutlined,
  ScheduleOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

export default function Navigation() {
  const { isMobile } = useResponsive();

  return isMobile ? <MobileSidebar /> : <Sidebar collapsible={false} />;
}

function Sidebar({ collapsible, isMobile = false }) {
  let location = useLocation();

  const { state: stateApp, appContextAction } = useAppContext();
  const { isNavMenuClose } = stateApp;
  const { navMenu } = appContextAction;
  const [showLogoApp, setLogoApp] = useState(isNavMenuClose);
  const [currentPath, setCurrentPath] = useState(location.pathname.slice(1));

  const translate = useLanguage();
  const navigate = useNavigate();

  const items = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link to={'/'}>{translate('dashboard')}</Link>,
    },
    {
      key: 'invoice',
      icon: <ContainerOutlined />,
      label: <Link to={'/invoice'}>{translate('invoices')}</Link>,
    },
    {
      key: 'payment',
      icon: <CreditCardOutlined />,
      label: <Link to={'/payment'}>{translate('payments')}</Link>,
    },
    {
      key: 'quote',
      icon: <FileSyncOutlined />,
      label: <Link to={'/quote'}>{translate('quotes')}</Link>,
    },
    {
      key: 'customer',
      icon: <CustomerServiceOutlined />,
      label: <Link to={'/customer'}>{translate('customers')}</Link>,
    },
    {
      key: 'people',
      icon: <UserOutlined />,
      label: <Link to={'/people'}>{translate('peoples')}</Link>,
    },
    {
      key: 'company',
      icon: <ShopOutlined />,
      label: <Link to={'/company'}>{translate('companies')}</Link>,
    },
    {
      key: 'lead',
      icon: <FilterOutlined />,
      label: <Link to={'/lead'}>{translate('leads')}</Link>,
    },
    {
      key: 'offer',
      icon: <FileOutlined />,
      label: <Link to={'/offer'}>{translate('offer_leads') || 'Offers for Leads'}</Link>,
    },
    {
      key: 'product',
      icon: <TagOutlined />,
      label: <Link to={'/product'}>{translate('products')}</Link>,
    },
    {
      key: 'productCategory',
      icon: <TagsOutlined />,
      label: <Link to={'/product/category'}>{translate('products_category')}</Link>,
    },
    {
      key: 'order',
      icon: <ShoppingCartOutlined />,
      label: <Link to={'/order'}>{translate('order') || 'Order'}</Link>,
    },
    {
      key: 'expense',
      icon: <WalletOutlined />,
      label: <Link to={'/expense'}>{translate('expenses')}</Link>,
    },
    {
      key: 'expenseCategory',
      icon: <ScheduleOutlined />,
      label: <Link to={'/expense/category'}>{translate('expenses_category')}</Link>,
    },
    {
      key: 'report',
      icon: <PieChartOutlined />,
      label: <Link to={'/report'}>Report</Link>,
    },
    {
      key: 'settingsGroup',
      icon: <SettingOutlined />,
      label: translate('settings'),
      children: [
        {
          key: 'settings',
          label: <Link to={'/settings'}>Settings</Link>,
        },
        {
          key: 'admin',
          label: <Link to={'/admin'}>Admin</Link>,
        },
        {
          key: 'apiKey',
          label: <Link to={'/settings/api-key'}>Developer Api Key</Link>,
        },
        {
          key: 'about',
          label: <Link to={'/about'}>About</Link>,
        },
        {
          key: 'emailTemplates',
          label: <Link to={'/settings/email-template'}>Email Templates</Link>,
        },
        {
          key: 'multiCompany',
          label: <Link to={'/settings/multi-company'}>Multi-company</Link>,
        },
        {
          key: 'currencies',
          label: <Link to={'/currency'}>Currencies</Link>,
        },
        {
          key: 'publicForm',
          label: <Link to={'/settings/public-form'}>Public Form</Link>,
        },
        {
          key: 'taxes',
          label: <Link to={'/taxes'}>Tax</Link>,
        },
        {
          key: 'paymentMode',
          label: <Link to={'/payment/mode'}>Payments Mode</Link>,
        },
      ],
    },
  ];

  useEffect(() => {
    if (location) {
      if (currentPath !== location.pathname) {
        if (location.pathname === '/') {
          setCurrentPath('dashboard');
        } else {
          setCurrentPath(location.pathname.slice(1));
        }
      }
    }
  }, [location, currentPath]);

  useEffect(() => {
    if (isNavMenuClose) {
      setLogoApp(isNavMenuClose);
    }
    const timer = setTimeout(() => {
      if (!isNavMenuClose) {
        setLogoApp(isNavMenuClose);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [isNavMenuClose]);

  const onCollapse = () => {
    navMenu.collapse();
  };

  return (
    <Sider
      collapsible={collapsible}
      collapsed={collapsible ? isNavMenuClose : collapsible}
      onCollapse={onCollapse}
      className="navigation"
      width={240}
      style={{
        height: isMobile ? '100vh' : 'calc(100vh - 36px)',
        position: 'sticky',
        top: isMobile ? 0 : '18px',
        left: isMobile ? 0 : '20px',
        margin: isMobile ? 0 : '18px 0 18px 20px',
        borderRadius: isMobile ? 0 : '14px',
        background: '#ffffff',
        border: isMobile ? 'none' : '1px solid #edf2f7',
        boxShadow: isMobile ? 'none' : '0 2px 10px rgba(0, 0, 0, 0.03)',
        zIndex: 100,
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
      theme={'light'}
    >
      <div
        className="logo"
        onClick={() => navigate('/')}
        style={{
          cursor: 'pointer',
          padding: '20px 20px 16px',
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          userSelect: 'none',
        }}
      >
        <img src={logoIcon} alt="MyCRM" style={{ height: '34px', width: '34px', flexShrink: 0 }} />

        {!showLogoApp && (
          <span
            style={{
              fontSize: '20px',
              fontWeight: '800',
              color: '#0a143c',
              letterSpacing: '-0.5px',
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            }}
          >
            My<span style={{ color: '#1677ff' }}>CRM</span>
          </span>
        )}
      </div>
      <Menu
        items={items}
        mode="inline"
        theme={'light'}
        selectedKeys={[currentPath]}
        defaultOpenKeys={['settingsGroup']}
        style={{
          width: '100%',
          borderRight: 'none',
          background: 'transparent',
          paddingBottom: '20px',
        }}
      />
    </Sider>
  );
}

function MobileSidebar() {
  const [visible, setVisible] = useState(false);
  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  return (
    <>
      <Button
        type="text"
        size="large"
        onClick={showDrawer}
        className="mobile-sidebar-btn"
        style={{ marginLeft: 25 }}
      >
        <MenuOutlined style={{ fontSize: 18 }} />
      </Button>
      <Drawer
        width={250}
        placement={'left'}
        closable={false}
        onClose={onClose}
        open={visible}
      >
        <Sidebar collapsible={false} isMobile={true} />
      </Drawer>
    </>
  );
}
