import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, Dropdown, Layout, Badge, Button, Tag, Tooltip } from 'antd';

// import Notifications from '@/components/Notification';

import { LogoutOutlined, ToolOutlined, UserOutlined, EyeOutlined } from '@ant-design/icons';

import { selectCurrentAdmin } from '@/redux/auth/selectors';

import { FILE_BASE_URL } from '@/config/serverApiConfig';

import useLanguage from '@/locale/useLanguage';

import UpgradeButton from './UpgradeButton';

export default function HeaderContent() {
  const currentAdmin = useSelector(selectCurrentAdmin);
  const { Header } = Layout;
  const isGuestMode =
    sessionStorage.getItem('isGuestMode') === 'true' ||
    currentAdmin?.role === 'guest' ||
    currentAdmin?.email?.toLowerCase()?.includes('guest');

  const translate = useLanguage();

  const ProfileDropdown = () => {
    const navigate = useNavigate();
    return (
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
  };

  const DropdownMenu = ({ text }) => {
    return <span style={{}}>{text}</span>;
  };

  const items = [
    {
      label: <ProfileDropdown className="headerDropDownMenu" />,
      key: 'ProfileDropdown',
    },
    {
      type: 'divider',
    },
    {
      icon: <UserOutlined />,
      key: 'settingProfile',
      label: (
        <Link to={'/profile'}>
          <DropdownMenu text={translate('profile_settings')} />
        </Link>
      ),
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

  return (
    <Header
      style={{
        padding: '16px 36px 0',
        background: 'transparent',
        display: 'flex',
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '15px',
      }}
    >
      <Dropdown
        menu={{
          items,
        }}
        trigger={['click']}
        placement="bottomRight"
        style={{ width: '280px', float: 'right' }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            padding: '2px 6px',
            borderRadius: '24px',
            transition: 'background 0.2s',
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

      {/* <AppsButton /> */}
    </Header>
  );
}
