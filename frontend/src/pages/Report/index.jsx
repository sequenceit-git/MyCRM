import { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Table, Tag, Progress, Divider, Spin } from 'antd';
import {
  DollarCircleOutlined,
  FileTextOutlined,
  RiseOutlined,
  FallOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { request } from '@/request';
import { useMoney } from '@/settings';
import { useSelector } from 'react-redux';
import { selectMoneyFormat } from '@/redux/settings/selectors';

export default function Report() {
  const { moneyFormatter } = useMoney();
  const money_format_settings = useSelector(selectMoneyFormat);
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState({
    invoices: [],
    payments: [],
    expenses: [],
    quotes: [],
    totalInvoiced: 0,
    totalPaid: 0,
    totalUnpaid: 0,
    totalExpenses: 0,
    netProfit: 0,
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [invRes, payRes, expRes, qteRes] = await Promise.all([
        request.listAll({ entity: 'invoice' }),
        request.listAll({ entity: 'payment' }),
        request.listAll({ entity: 'expense' }),
        request.listAll({ entity: 'quote' }),
      ]);

      const invoices = invRes?.result || [];
      const payments = payRes?.result || [];
      const expenses = expRes?.result || [];
      const quotes = qteRes?.result || [];

      const totalInvoiced = invoices.reduce((acc, curr) => acc + (curr.total || 0), 0);
      const totalPaid = payments.reduce((acc, curr) => acc + (curr.amount || 0), 0);
      const totalUnpaid = invoices
        .filter((i) => i.paymentStatus !== 'paid')
        .reduce((acc, curr) => acc + ((curr.total || 0) - (curr.credit || 0)), 0);
      const totalExpenses = expenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);
      const netProfit = totalPaid - totalExpenses;

      setReportData({
        invoices,
        payments,
        expenses,
        quotes,
        totalInvoiced,
        totalPaid,
        totalUnpaid,
        totalExpenses,
        netProfit,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const collectionRate =
    reportData.totalInvoiced > 0
      ? Math.round((reportData.totalPaid / reportData.totalInvoiced) * 100)
      : 0;

  const columns = [
    {
      title: 'Invoice / Ref',
      dataIndex: 'number',
      render: (num, record) => `#${num || record._id?.slice(-6)}`,
    },
    {
      title: 'Client',
      dataIndex: ['client', 'name'],
      render: (name) => name || 'N/A',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      render: (d) => (d ? new Date(d).toLocaleDateString() : 'N/A'),
    },
    {
      title: 'Amount',
      dataIndex: 'total',
      render: (val, record) =>
        moneyFormatter({
          amount: val,
          currency_code: record.currency || money_format_settings?.default_currency_code,
        }),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (st) => {
        const color =
          st === 'paid' ? 'green' : st === 'sent' ? 'blue' : st === 'pending' ? 'orange' : 'default';
        return <Tag color={color}>{(st || 'Draft').toUpperCase()}</Tag>;
      },
    },
  ];

  return (
    <div style={{ padding: '4px 0 24px' }}>
      <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0a143c', margin: '0 0 20px' }}>
        📊 Financial & Performance Reports
      </h2>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* Top 4 KPI Metrics */}
          <Row gutter={[20, 20]}>
            <Col xs={24} sm={12} lg={6}>
              <Card style={{ borderRadius: '12px', border: '1px solid #edf2f7' }}>
                <Statistic
                  title="Total Revenue (Collected)"
                  value={reportData.totalPaid}
                  precision={2}
                  valueStyle={{ color: '#15803d', fontWeight: '800' }}
                  prefix={<DollarCircleOutlined style={{ marginRight: '8px' }} />}
                  formatter={(val) =>
                    moneyFormatter({
                      amount: Number(val),
                      currency_code: money_format_settings?.default_currency_code,
                    })
                  }
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card style={{ borderRadius: '12px', border: '1px solid #edf2f7' }}>
                <Statistic
                  title="Outstanding (Unpaid)"
                  value={reportData.totalUnpaid}
                  precision={2}
                  valueStyle={{ color: '#b91c1c', fontWeight: '800' }}
                  prefix={<ClockCircleOutlined style={{ marginRight: '8px' }} />}
                  formatter={(val) =>
                    moneyFormatter({
                      amount: Number(val),
                      currency_code: money_format_settings?.default_currency_code,
                    })
                  }
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card style={{ borderRadius: '12px', border: '1px solid #edf2f7' }}>
                <Statistic
                  title="Total Operating Expenses"
                  value={reportData.totalExpenses}
                  precision={2}
                  valueStyle={{ color: '#fa8c16', fontWeight: '800' }}
                  prefix={<FallOutlined style={{ marginRight: '8px' }} />}
                  formatter={(val) =>
                    moneyFormatter({
                      amount: Number(val),
                      currency_code: money_format_settings?.default_currency_code,
                    })
                  }
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card style={{ borderRadius: '12px', border: '1px solid #edf2f7' }}>
                <Statistic
                  title="Net Income (Profit)"
                  value={reportData.netProfit}
                  precision={2}
                  valueStyle={{
                    color: reportData.netProfit >= 0 ? '#1677ff' : '#cf1322',
                    fontWeight: '800',
                  }}
                  prefix={<RiseOutlined style={{ marginRight: '8px' }} />}
                  formatter={(val) =>
                    moneyFormatter({
                      amount: Number(val),
                      currency_code: money_format_settings?.default_currency_code,
                    })
                  }
                />
              </Card>
            </Col>
          </Row>

          <div style={{ height: '24px' }} />

          {/* Middle Progress Bars & Breakdown */}
          <Row gutter={[20, 20]}>
            <Col xs={24} lg={12}>
              <Card
                title="📈 Revenue Collection Rate"
                style={{ borderRadius: '12px', border: '1px solid #edf2f7', height: '100%' }}
              >
                <div style={{ padding: '16px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: '600' }}>Invoiced vs Collected</span>
                    <span style={{ fontWeight: '700', color: '#1677ff' }}>{collectionRate}%</span>
                  </div>
                  <Progress
                    percent={collectionRate}
                    status="active"
                    strokeColor={{ from: '#108ee9', to: '#87d068' }}
                  />
                  <Divider style={{ margin: '20px 0' }} />
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <div style={{ color: '#6b7280', fontSize: '13px' }}>Gross Total Invoiced</div>
                      <div style={{ fontSize: '18px', fontWeight: '700', color: '#111827' }}>
                        {moneyFormatter({
                          amount: reportData.totalInvoiced,
                          currency_code: money_format_settings?.default_currency_code,
                        })}
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{ color: '#6b7280', fontSize: '13px' }}>Total Payments Recorded</div>
                      <div style={{ fontSize: '18px', fontWeight: '700', color: '#15803d' }}>
                        {moneyFormatter({
                          amount: reportData.totalPaid,
                          currency_code: money_format_settings?.default_currency_code,
                        })}
                      </div>
                    </Col>
                  </Row>
                </div>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card
                title="📋 Pipeline Volume Overview"
                style={{ borderRadius: '12px', border: '1px solid #edf2f7', height: '100%' }}
              >
                <Row gutter={[16, 24]} style={{ padding: '12px 0' }}>
                  <Col span={12}>
                    <Statistic
                      title="Total Invoices Created"
                      value={reportData.invoices.length}
                      prefix={<FileTextOutlined style={{ color: '#1677ff' }} />}
                      valueStyle={{ fontWeight: '700' }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Total Quotes Issued"
                      value={reportData.quotes.length}
                      prefix={<RiseOutlined style={{ color: '#722ed1' }} />}
                      valueStyle={{ fontWeight: '700' }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Payments Processed"
                      value={reportData.payments.length}
                      prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                      valueStyle={{ fontWeight: '700' }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Expense Entries"
                      value={reportData.expenses.length}
                      prefix={<FallOutlined style={{ color: '#fa8c16' }} />}
                      valueStyle={{ fontWeight: '700' }}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>

          <div style={{ height: '24px' }} />

          {/* Bottom Table */}
          <Card
            title="📄 Recent Financial Transactions"
            style={{ borderRadius: '12px', border: '1px solid #edf2f7' }}
          >
            <Table
              dataSource={reportData.invoices.slice(0, 8)}
              columns={columns}
              rowKey="_id"
              pagination={false}
            />
          </Card>
        </>
      )}
    </div>
  );
}
