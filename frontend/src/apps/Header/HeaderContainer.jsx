import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, Dropdown, Layout, Tag, message } from 'antd';
import {
  LogoutOutlined,
  ToolOutlined,
  UserOutlined,
  EyeOutlined,
  DownOutlined,
  ShopOutlined,
  GlobalOutlined,
  DollarOutlined,
} from '@ant-design/icons';

import { selectCurrentAdmin } from '@/redux/auth/selectors';
import { FILE_BASE_URL } from '@/config/serverApiConfig';
import useLanguage from '@/locale/useLanguage';

export default function HeaderContent() {
  const currentAdmin = useSelector(selectCurrentAdmin);
  const { Header } = Layout;
  const navigate = useNavigate();


  const isGuestMode =
    sessionStorage.getItem('isGuestMode') === 'true' ||
    currentAdmin?.role === 'guest' ||
    currentAdmin?.email?.toLowerCase()?.includes('guest');

  const translate = useLanguage();

  // State for Top Nav Dropdowns
  const [selectedLang, setSelectedLang] = useState({ code: 'en_us', flag: '🇺🇸', label: 'English (US)' });
  const [selectedCurrency, setSelectedCurrency] = useState({ code: 'USD', symbol: '$', flag: '🇺🇸', label: 'USD ($)' });
  const [selectedCompany, setSelectedCompany] = useState({ id: 'main', name: 'Main' });

  // 1. Language Dropdown Items
  const languageOptions = [
    { key: 'en_us', flag: '🇺🇸', label: 'English (US)' },
    { key: 'en_gb', flag: '🇬🇧', label: 'English (UK)' },
    { key: 'es_es', flag: '🇪🇸', label: 'Español' },
    { key: 'fr_fr', flag: '🇫🇷', label: 'Français' },
    { key: 'de_de', flag: '🇩🇪', label: 'Deutsch' },
    { key: 'ja_jp', flag: '🇯🇵', label: '日本語' },
    { key: 'zh_cn', flag: '🇨🇳', label: '中文' },
    { key: 'ar_ar', flag: '🇸🇦', label: 'العربية' },
  ];

  const languageMenuItems = languageOptions.map((l) => ({
    key: l.key,
    label: (
      <div
        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0' }}
        onClick={() => {
          setSelectedLang(l);
          message.success(`Language switched to ${l.label}`);
        }}
      >
        <span style={{ fontSize: '16px' }}>{l.flag}</span>
        <span style={{ fontWeight: selectedLang.key === l.key ? '700' : '500' }}>{l.label}</span>
      </div>
    ),
  }));

  // 2. Currency Dropdown Items
  const currencyOptions = [
    { key: 'USD', symbol: '$', flag: '🇺🇸', label: 'USD ($ - US Dollar)' },
    { key: 'EUR', symbol: '€', flag: '🇪🇺', label: 'EUR (€ - Euro)' },
    { key: 'GBP', symbol: '£', flag: '🇬🇧', label: 'GBP (£ - British Pound)' },
    { key: 'JPY', symbol: '¥', flag: '🇯🇵', label: 'JPY (¥ - Japanese Yen)' },
    { key: 'CAD', symbol: '$', flag: '🇨🇦', label: 'CAD ($ - Canadian Dollar)' },
    { key: 'AUD', symbol: '$', flag: '🇦🇺', label: 'AUD ($ - Australian Dollar)' },
  ];

  const currencyMenuItems = currencyOptions.map((c) => ({
    key: c.key,
    label: (
      <div
        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0' }}
        onClick={() => {
          setSelectedCurrency(c);
          message.success(`Currency switched to ${c.key}`);
        }}
      >
        <span style={{ fontWeight: '700', color: '#1677ff' }}>{c.symbol}</span>
        <span style={{ fontSize: '15px' }}>{c.flag}</span>
        <span style={{ fontWeight: selectedCurrency.key === c.key ? '700' : '500' }}>{c.label}</span>
      </div>
    ),
  }));

  // 3. Multi-Company / Branch Dropdown Items
  const companyOptions = [
    { key: 'main', name: 'Main', desc: 'Global Headquarters' },
    { key: 'americas', name: 'Americas LLC', desc: 'San Francisco Branch' },
    { key: 'europe', name: 'Europe BV', desc: 'Amsterdam Branch' },
    { key: 'apac', name: 'Asia-Pacific Pte', desc: 'Singapore Branch' },
  ];

  const companyMenuItems = [
    ...companyOptions.map((comp) => ({
      key: comp.key,
      label: (
        <div
          style={{ display: 'flex', flexDirection: 'column', padding: '4px 0' }}
          onClick={() => {
            setSelectedCompany(comp);
            message.success(`Switched active branch to ${comp.name}`);
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: selectedCompany.key === comp.key ? '700' : '600' }}>
            <ShopOutlined style={{ color: '#1677ff' }} />
            <span>{comp.name}</span>
          </div>
          <span style={{ fontSize: '11px', color: '#9ca3af', marginLeft: '20px' }}>{comp.desc}</span>
        </div>
      ),
    })),
    { type: 'divider' },
    {
      key: 'manageCompany',
      label: (
        <Link to="/settings/multi-company" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1677ff', fontWeight: '600' }}>
          <ToolOutlined /> Manage Multi-Company
        </Link>
      ),
    },
  ];

  const ProfileDropdown = () => (
    <div
      className="profileDropdown"
      onClick={() => navigate('/profile')}
      style={{
        cursor: 'pointer',
        padding: '4px 0',
      }}
    >
      <Avatar
        size="large"
        className="last"
        src={currentAdmin?.photo ? FILE_BASE_URL + currentAdmin?.photo : undefined}
        style={{
          color: '#f56a00',
          backgroundColor: currentAdmin?.photo ? 'none' : '#fde3cf',
          boxShadow: 'rgba(150, 190, 238, 0.35) 0px 0px 6px 1px',
        }}
      >
        {isGuestMode ? 'G' : currentAdmin?.name?.charAt(0)?.toUpperCase()}
      </Avatar>
      <div className="profileDropdownInfo" style={{ marginLeft: '12px' }}>
        <p
          style={{
            margin: 0,
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#1f2937',
          }}
        >
          {isGuestMode ? 'Guest Admin' : `${currentAdmin?.name} ${currentAdmin?.surname}`}
          {isGuestMode && (
            <Tag
              color="orange"
              style={{
                fontSize: '11px',
                lineHeight: '18px',
                padding: '0 6px',
                borderRadius: '4px',
                margin: 0,
                fontWeight: '600',
              }}
            >
              View Only
            </Tag>
          )}
        </p>
        <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6b7280' }}>
          {currentAdmin?.email}
        </p>
      </div>
    </div>
  );

  const profileMenuItems = [
    {
      label: <ProfileDropdown />,
      key: 'ProfileDropdown',
    },
    {
      type: 'divider',
    },
    {
      icon: <UserOutlined />,
      key: 'settingProfile',
      label: <Link to={'/profile'}>{translate('profile_settings')}</Link>,
    },
    {
      icon: <ToolOutlined />,
      key: 'settingApp',
      label: <Link to={'/settings'}>{translate('app_settings')}</Link>,
    },
    {
      type: 'divider',
    },
    {
      icon: <LogoutOutlined />,
      key: 'logout',
      label: <Link to={'/logout'}>{translate('logout')}</Link>,
    },
  ];

  const pillButtonStyle = {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    height: '36px',
    padding: '0 12px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
    fontSize: '13px',
    fontWeight: '600',
    color: '#1f2937',
    userSelect: 'none',
    transition: 'all 0.2s',
  };

  return (
    <Header
      style={{
        padding: '16px 36px 0',
        background: 'transparent',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      {/* 1. Language Dropdown Button */}
      <Dropdown menu={{ items: languageMenuItems }} trigger={['click']} placement="bottom">
        <div style={pillButtonStyle} className="top-nav-pill">
          <span style={{ fontSize: '16px', lineHeight: 1 }}>{selectedLang.flag}</span>
          <DownOutlined style={{ fontSize: '10px', color: '#9ca3af' }} />
        </div>
      </Dropdown>

      {/* 2. Currency Dropdown Button */}
      <Dropdown menu={{ items: currencyMenuItems }} trigger={['click']} placement="bottom">
        <div style={pillButtonStyle} className="top-nav-pill">
          <span style={{ fontWeight: '700', color: '#1677ff' }}>{selectedCurrency.symbol}</span>
          <span style={{ fontSize: '15px', lineHeight: 1 }}>{selectedCurrency.flag}</span>
          <DownOutlined style={{ fontSize: '10px', color: '#9ca3af' }} />
        </div>
      </Dropdown>

      {/* 3. Multi-Company / Branch Dropdown Button */}
      <Dropdown menu={{ items: companyMenuItems }} trigger={['click']} placement="bottom">
        <div style={{ ...pillButtonStyle, minWidth: '90px' }} className="top-nav-pill">
          <span>{selectedCompany.name}</span>
          <DownOutlined style={{ fontSize: '10px', color: '#9ca3af' }} />
        </div>
      </Dropdown>

      {/* 4. User Profile Dropdown */}
      <Dropdown
        menu={{
          items: profileMenuItems,
        }}
        trigger={['click']}
        placement="bottomRight"
        style={{ width: '280px' }}


      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            padding: '2px 4px',
            borderRadius: '24px',
          }}
        >
          {isGuestMode && (
            <Tag
              color="warning"
              icon={<EyeOutlined />}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '12px',
                padding: '3px 10px',
                borderRadius: '16px',
                fontWeight: '600',
                border: '1px solid #ffe58f',
                background: '#fffbe6',
                color: '#d46b08',
                margin: 0,
              }}
            >
              View Only
            </Tag>
          )}

          <Avatar
            className="last"
            src={currentAdmin?.photo ? FILE_BASE_URL + currentAdmin?.photo : undefined}
            style={{
              color: '#f56a00',
              backgroundColor: currentAdmin?.photo ? 'none' : '#fde3cf',
              boxShadow: 'rgba(150, 190, 238, 0.35) 0px 0px 10px 2px',
              cursor: 'pointer',
            }}
            size="large"
          >
            {isGuestMode ? 'G' : currentAdmin?.name?.charAt(0)?.toUpperCase()}
          </Avatar>
        </div>
      </Dropdown>
    </Header>
  );
}
