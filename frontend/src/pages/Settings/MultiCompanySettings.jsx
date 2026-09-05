import { Card, Form, Input, Button, Switch, Divider, Space, Tag, Row, Col, message } from 'antd';
import { ShopOutlined, CheckOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';

export default function MultiCompanySettings() {
  const onFinish = () => {
    message.success('Multi-company organization settings saved successfully!');
  };

  return (
    <div style={{ maxWidth: 850, margin: '0 auto', padding: '10px 0 30px' }}>
      <Card
        title={
          <Space>
            <ShopOutlined style={{ color: '#1677ff' }} />
            <span>Multi-Company & Entity Management</span>
          </Space>
        }
        style={{ borderRadius: '12px', border: '1px solid #edf2f7' }}
      >
        <Form layout="vertical" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Primary Parent Entity" name="primary_company" initialValue="MyCRM Global HQ">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Tax ID / Registration Number" name="tax_id" initialValue="US-98374829-X">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Default Billing Currency" name="currency" initialValue="USD ($)">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Headquarters Country" name="country" initialValue="United States">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <h4>Branch Entities & Subsidiaries</h4>
          <div style={{ marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Tag color="blue">MyCRM Americas LLC (Active)</Tag>
            <Tag color="green">MyCRM Europe BV (Active)</Tag>
            <Tag color="purple">MyCRM Asia-Pacific Pte (Active)</Tag>
          </div>

          <Form.Item label="Enable Separate Invoicing Sequences per Branch" valuePropName="checked" initialValue={true}>
            <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} defaultChecked />
          </Form.Item>

          <Form.Item label="Allow Inter-Company Data Sharing & Lead Transfers" valuePropName="checked" initialValue={true}>
            <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} defaultChecked />
          </Form.Item>

          <Button type="primary" htmlType="submit">
            Save Multi-Company Settings
          </Button>
        </Form>
      </Card>
    </div>
  );
}
