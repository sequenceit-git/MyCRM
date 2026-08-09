import { useEffect } from 'react';
import { Row, Col } from 'antd';
import useLanguage from '@/locale/useLanguage';
import { useMoney } from '@/settings';
import { request } from '@/request';
import useFetch from '@/hooks/useFetch';
import useOnFetch from '@/hooks/useOnFetch';

import RecentTable from './components/RecentTable';
import SummaryCard from './components/SummaryCard';
import PreviewCard from './components/PreviewCard';
import CustomerPreviewCard from './components/CustomerPreviewCard';

import { selectMoneyFormat } from '@/redux/settings/selectors';
import { useSelector } from 'react-redux';

export default function DashboardModule() {
  const translate = useLanguage();
  const { moneyFormatter } = useMoney();
  const money_format_settings = useSelector(selectMoneyFormat);

  const getStatsData = async ({ entity, currency, type }) => {
    return await request.summary({
      entity,
      options: { currency, type: type === 'all' ? undefined : type },
    });
  };

  const {
    result: invoiceResult,
    isLoading: invoiceLoading,
    onFetch: fetchInvoicesStats,
  } = useOnFetch();

  const {
    result: quoteResult,
    isLoading: quoteLoading,
    onFetch: fetchQuotesStats,
  } = useOnFetch();

  const {
    result: paymentResult,
    isLoading: paymentLoading,
    onFetch: fetchPaymentsStats,
  } = useOnFetch();

  const { result: clientResult, isLoading: clientLoading } = useFetch(() =>
    request.summary({ entity: 'client' })
  );

  const activeCurrency = money_format_settings.default_currency_code || null;

  useEffect(() => {
    if (activeCurrency) {
      fetchInvoicesStats(getStatsData({ entity: 'invoice', currency: activeCurrency }));
      fetchQuotesStats(getStatsData({ entity: 'quote', currency: activeCurrency }));
      fetchPaymentsStats(getStatsData({ entity: 'payment', currency: activeCurrency }));
    }
  }, [activeCurrency]);

  const renderStatusTag = (status) => {
    const statusLower = status?.toLowerCase() || 'draft';
    const tagStyles = {
      draft: { bg: '#f3f4f6', text: '#374151', border: '#e5e7eb' },
      sent: { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
      pending: { bg: '#f0f9ff', text: '#0284c7', border: '#bae6fd' },
      paid: { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
      accepted: { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
      unpaid: { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca' },
      declined: { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca' },
      partially: { bg: '#fffbeb', text: '#b45309', border: '#fde68a' },
    };

    const style = tagStyles[statusLower] || tagStyles.draft;

    return (
      <span
        style={{
          display: 'inline-block',
          backgroundColor: style.bg,
          color: style.text,
          border: `1px solid ${style.border}`,
          borderRadius: '6px',
          padding: '2px 8px',
          fontSize: '12px',
          fontWeight: '600',
          textTransform: 'capitalize',
        }}
      >
        {status || 'Draft'}
      </span>
    );
  };

  const dataTableColumns = [
    {
      title: translate('Number'),
      dataIndex: 'number',
      render: (num) => (
        <span style={{ fontWeight: '600', color: '#1f2937' }}>{num}</span>
      ),
    },
    {
      title: translate('Client'),
      dataIndex: ['client', 'name'],
      render: (name) => (
        <span style={{ color: '#374151', fontWeight: '500' }}>
          {name || 'N/A'}
        </span>
      ),
    },
    {
      title: translate('Total'),
      dataIndex: 'total',
      onCell: () => ({
        style: {
          textAlign: 'right',
          whiteSpace: 'nowrap',
          direction: 'ltr',
          fontWeight: '600',
          color: '#111827',
        },
      }),
      render: (total, record) =>
        moneyFormatter({
          amount: total,
          currency_code: record.currency || money_format_settings?.default_currency_code,
        }),
    },
    {
      title: translate('Status'),
      dataIndex: 'status',
      render: (status) => renderStatusTag(status),
    },
  ];

  const invoiceStats = [
    { tag: 'draft', value: 0 },
    { tag: 'pending', value: 0 },
    { tag: 'sent', value: 0 },
    { tag: 'paid', value: 0 },
    { tag: 'unpaid', value: 0 },
    { tag: 'partially', value: 0 },
  ].map((def) => {
    const found = invoiceResult?.performance?.find(
      (p) => p.status?.toLowerCase() === def.tag
    );
    return found ? { tag: def.tag, value: found.percentage } : def;
  });

  const quoteStats = [
    { tag: 'draft', value: 0 },
    { tag: 'pending', value: 0 },
    { tag: 'sent', value: 0 },
    { tag: 'declined', value: 0 },
    { tag: 'accepted', value: 0 },
    { tag: 'expired', value: 0 },
  ].map((def) => {
    const found = quoteResult?.performance?.find(
      (p) => p.status?.toLowerCase() === def.tag
    );
    return found ? { tag: def.tag, value: found.percentage } : def;
  });

  const totalInvoiced = invoiceResult?.total || 0;
  const totalPaid = paymentResult?.total || 0;
  const paidPercent = totalInvoiced > 0 ? Math.round((totalPaid / totalInvoiced) * 100) : 0;

  const collectionStats = [
    { tag: 'paid', label: 'Collected Rate', value: Math.min(100, paidPercent) },
    {
      tag: 'partially',
      label: 'Partially Paid',
      value: invoiceStats.find((s) => s.tag === 'partially')?.value || 0,
    },
    {
      tag: 'pending',
      label: 'Pending Due',
      value: invoiceStats.find((s) => s.tag === 'pending')?.value || 0,
    },
    {
      tag: 'unpaid',
      label: 'Unpaid Balance',
      value: invoiceStats.find((s) => s.tag === 'unpaid')?.value || 0,
    },
    {
      tag: 'overdue',
      label: 'Overdue Balance',
      value: invoiceStats.find((s) => s.tag === 'overdue')?.value || 0,
    },
    {
      tag: 'accepted',
      label: 'Quote Conversion',
      value: quoteStats.find((s) => s.tag === 'accepted')?.value || 0,
    },
  ];

  if (!money_format_settings) return <></>;

  return (
    <div style={{ padding: '4px 0 24px' }}>
      {/* 1. TOP 4 KPI CARDS */}
      <Row gutter={[20, 20]}>
        <SummaryCard
          title="Paid Invoice"
          themeColor="green"
          isLoading={paymentLoading}
          data={paymentResult?.total || 0}
          span={{ xs: 24, sm: 12, md: 12, lg: 6 }}
          onFilterChange={(filterType) => {
            fetchPaymentsStats(
              getStatsData({ entity: 'payment', currency: activeCurrency, type: filterType })
            );
          }}
        />
        <SummaryCard
          title="Unpaid Invoice"
          themeColor="red"
          isLoading={invoiceLoading}
          data={invoiceResult?.total_undue || 0}
          span={{ xs: 24, sm: 12, md: 12, lg: 6 }}
          onFilterChange={(filterType) => {
            fetchInvoicesStats(
              getStatsData({ entity: 'invoice', currency: activeCurrency, type: filterType })
            );
          }}
        />
        <SummaryCard
          title="Total Invoiced"
          themeColor="purple"
          isLoading={invoiceLoading}
          data={invoiceResult?.total || 0}
          span={{ xs: 24, sm: 12, md: 12, lg: 6 }}
          onFilterChange={(filterType) => {
            fetchInvoicesStats(
              getStatsData({ entity: 'invoice', currency: activeCurrency, type: filterType })
            );
          }}
        />
        <SummaryCard
          title="Quote"
          themeColor="blue"
          isLoading={quoteLoading}
          data={quoteResult?.total || 0}
          span={{ xs: 24, sm: 12, md: 12, lg: 6 }}
          onFilterChange={(filterType) => {
            fetchQuotesStats(
              getStatsData({ entity: 'quote', currency: activeCurrency, type: filterType })
            );
          }}
        />
      </Row>

      {/* 2. MIDDLE PROGRESS SECTION + CUSTOMER CIRCULAR GAUGE */}
      <div style={{ height: '24px' }} />
      <Row gutter={[20, 20]}>
        {/* Left 3-Column Status Progress Box */}
        <Col xs={24} lg={18}>
          <div
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #edf2f7',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
              padding: '24px 16px',
              minHeight: '430px',
            }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={8}>
                <PreviewCard
                  title="Invoices"
                  isLoading={invoiceLoading}
                  statistics={invoiceStats}
                />
              </Col>
              <Col xs={24} sm={8}>
                <PreviewCard
                  title="Quotes For Customers"
                  isLoading={quoteLoading}
                  statistics={quoteStats}
                />
              </Col>
              <Col xs={24} sm={8}>
                <PreviewCard
                  title="Collection & Revenue"
                  isLoading={invoiceLoading || paymentLoading}
                  statistics={collectionStats}
                />
              </Col>
            </Row>
          </div>
        </Col>

        {/* Right Customer Gauge Card */}
        <Col xs={24} lg={6}>
          <CustomerPreviewCard
            isLoading={clientLoading}
            activeCustomer={clientResult?.active || 0}
            newCustomer={clientResult?.new || 0}
            totalCustomers={clientResult?.total || 0}
          />
        </Col>
      </Row>

      {/* 3. BOTTOM TABLES (Recent Invoices & Recent Quotes) */}
      <div style={{ height: '24px' }} />
      <Row gutter={[20, 20]}>
        <Col xs={24} lg={12}>
          <div
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #edf2f7',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
              padding: '24px',
              height: '100%',
            }}
          >
            <h4
              style={{
                color: '#22075e',
                fontSize: '16px',
                fontWeight: '700',
                margin: '0 0 18px',
                letterSpacing: '-0.2px',
              }}
            >
              Recent Invoices
            </h4>
            <RecentTable entity="invoice" dataTableColumns={dataTableColumns} />
          </div>
        </Col>

        <Col xs={24} lg={12}>
          <div
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #edf2f7',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
              padding: '24px',
              height: '100%',
            }}
          >
            <h4
              style={{
                color: '#22075e',
                fontSize: '16px',
                fontWeight: '700',
                margin: '0 0 18px',
                letterSpacing: '-0.2px',
              }}
            >
              Recent Quotes
            </h4>
            <RecentTable entity="quote" dataTableColumns={dataTableColumns} />
          </div>
        </Col>
      </Row>
    </div>
  );
}
