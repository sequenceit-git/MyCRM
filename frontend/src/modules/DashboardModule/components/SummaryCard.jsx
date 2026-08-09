import { useState } from 'react';
import { Col, Skeleton, Dropdown } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import { useMoney } from '@/settings';
import { selectMoneyFormat } from '@/redux/settings/selectors';
import { useSelector } from 'react-redux';

export default function SummaryCard({
  title,
  themeColor = 'green',
  data = 0,
  isLoading = false,
  onFilterChange,
  span = { xs: 24, sm: 12, md: 8, lg: 8 },
}) {
  const { moneyFormatter } = useMoney();
  const money_format_settings = useSelector(selectMoneyFormat);
  const [selectedLabel, setSelectedLabel] = useState('From Begining');

  const filterItems = [
    { key: 'yesterday', label: 'Yesterday' },
    { key: 'last_week', label: 'Last Week' },
    { key: 'last_month', label: 'Last Month' },
    { key: 'last_year', label: 'Last Year' },
    { key: 'all', label: 'From Begining' },
  ];

  const handleMenuClick = ({ key }) => {
    const item = filterItems.find((f) => f.key === key);
    if (item) {
      setSelectedLabel(item.label);
      if (onFilterChange) {
        onFilterChange(key);
      }
    }
  };

  const themeStyles = {
    green: {
      bg: '#f6ffed',
      color: '#389e0d',
      border: '1px solid #d9f7be',
    },
    red: {
      bg: '#fff1f0',
      color: '#cf1322',
      border: '1px solid #ffccc7',
    },
    blue: {
      bg: '#e6f4ff',
      color: '#0958d9',
      border: '1px solid #bae0ff',
    },
    purple: {
      bg: '#f9f0ff',
      color: '#531dab',
      border: '1px solid #efdbff',
    },
  };

  const style = themeStyles[themeColor] || themeStyles.green;

  return (
    <Col
      className="gutter-row"
      xs={span.xs || 24}
      sm={span.sm || 12}
      md={span.md || 8}
      lg={span.lg || 8}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #edf2f7',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%',
          minHeight: '170px',
          transition: 'all 0.3s ease',
        }}
      >
        <h4
          style={{
            color: '#22075e',
            fontSize: '15px',
            fontWeight: '700',
            margin: '0 0 16px',
            letterSpacing: '-0.2px',
            textAlign: 'center',
          }}
        >
          {title}
        </h4>

        <div
          style={{
            width: '100%',
            background: style.bg,
            color: style.color,
            border: style.border,
            borderRadius: '8px',
            padding: '10px 16px',
            textAlign: 'center',
            fontSize: '20px',
            fontWeight: '700',
            letterSpacing: '-0.5px',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)',
          }}
        >
          {isLoading ? (
            <Skeleton.Button active size="small" style={{ width: '120px', height: '24px', borderRadius: '6px' }} />
          ) : (
            moneyFormatter({
              amount: data || 0,
              currency_code: money_format_settings?.default_currency_code,
            })
          )}
        </div>

        <div style={{ marginTop: '16px' }}>
          <Dropdown
            menu={{
              items: filterItems,
              onClick: handleMenuClick,
            }}
            trigger={['click']}
            placement="bottomCenter"
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '12px',
                fontWeight: '500',
                color: '#4b5563',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                padding: '4px 10px',
                background: '#ffffff',
                cursor: 'pointer',
                userSelect: 'none',
                boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                transition: 'all 0.2s ease',
              }}
            >
              <span>{selectedLabel}</span>
              <span
                style={{
                  borderLeft: '1px solid #e5e7eb',
                  paddingLeft: '6px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <CalendarOutlined style={{ color: '#6366f1', fontSize: '13px' }} />
              </span>
            </span>
          </Dropdown>
        </div>
      </div>
    </Col>
  );
}
