import { useState } from 'react';
import { Card, Table, Button, Tag, Space, Modal, Form, Input, message } from 'antd';
import { MailOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';

export default function EmailTemplateSettings() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [templates, setTemplates] = useState([
    {
      id: '1',
      name: 'Invoice Notification',
      subject: 'New Invoice #{number} from MyCRM',
      category: 'Invoicing',
      enabled: true,
      lastUpdated: '2026-08-15',
    },
    {
      id: '2',
      name: 'Payment Receipt Confirmation',
      subject: 'Payment Confirmation for Invoice #{number}',
      category: 'Payments',
      enabled: true,
      lastUpdated: '2026-08-20',
    },
    {
      id: '3',
      name: 'Proposal / Quote Dispatch',
      subject: 'Commercial Proposal #{number} from MyCRM',
      category: 'Quotes',
      enabled: true,
      lastUpdated: '2026-08-22',
    },
    {
      id: '4',
      name: 'Offer for Leads',
      subject: 'Custom Solution Proposal #{number}',
      category: 'Leads',
      enabled: true,
      lastUpdated: '2026-08-25',
    },
    {
      id: '5',
      name: 'Password Reset Notification',
      subject: 'Reset your MyCRM account password',
      category: 'Authentication',
      enabled: true,
      lastUpdated: '2026-08-28',
    },
  ]);

  const handleEdit = (record) => {
    setEditingTemplate(record);
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: 'Template Name',
      dataIndex: 'name',
      render: (text) => <span style={{ fontWeight: 600 }}>{text}</span>,
    },
    {
      title: 'Email Subject',
      dataIndex: 'subject',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      render: (cat) => <Tag color="blue">{cat}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'enabled',
      render: (en) => <Tag color={en ? 'green' : 'default'}>{en ? 'Active' : 'Disabled'}</Tag>,
    },
    {
      title: 'Last Updated',
      dataIndex: 'lastUpdated',
    },
    {
      title: 'Action',
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '10px 0 30px' }}>
      <Card
        title={
          <Space>
            <MailOutlined style={{ color: '#1677ff' }} />
            <span>Email Notification Templates</span>
          </Space>
        }
        style={{ borderRadius: '12px', border: '1px solid #edf2f7' }}
      >
        <Table dataSource={templates} columns={columns} rowKey="id" pagination={false} />
      </Card>

      <Modal
        title={`Edit Template: ${editingTemplate?.name || ''}`}
        open={isModalOpen}
        onOk={() => {
          message.success('Email template updated successfully!');
          setIsModalOpen(false);
        }}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form layout="vertical" initialValues={editingTemplate}>
          <Form.Item label="Email Subject" name="subject">
            <Input defaultValue={editingTemplate?.subject} />
          </Form.Item>
          <Form.Item label="Email Body / Template HTML" name="body">
            <Input.TextArea rows={6} defaultValue={`Hello {client_name},\n\nPlease find attached your document #{number} for total {total_amount}.\n\nBest regards,\nMyCRM Team`} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
