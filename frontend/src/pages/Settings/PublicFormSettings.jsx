import { Card, Form, Input, Button, Switch, Divider, Space, Typography, Tag, message } from 'antd';
import { FormOutlined, CheckOutlined, CloseOutlined, CopyOutlined } from '@ant-design/icons';

const { Text, Paragraph } = Typography;

export default function PublicFormSettings() {
  const publicLeadUrl = 'http://localhost:3000/public/lead-form';

  const copyUrl = () => {
    navigator.clipboard.writeText(publicLeadUrl);
    message.success('Public Lead Form URL copied to clipboard!');
  };

  const onFinish = () => {
    message.success('Public form configuration saved!');
  };

  return (
    <div style={{ maxWidth: 850, margin: '0 auto', padding: '10px 0 30px' }}>
      <Card
        title={
          <Space>
            <FormOutlined style={{ color: '#1677ff' }} />
            <span>Public Lead & Contact Capture Forms</span>
          </Space>
        }
        style={{ borderRadius: '12px', border: '1px solid #edf2f7' }}
      >
        <Form layout="vertical" onFinish={onFinish}>
          <div style={{ marginBottom: 20 }}>
            <Text strong>Embeddable Lead Form Link</Text>
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <Input value={publicLeadUrl} readOnly />
              <Button type="primary" icon={<CopyOutlined />} onClick={copyUrl}>
                Copy URL
              </Button>
            </div>
          </div>

          <Divider />

          <Form.Item label="Form Title Header" name="title" initialValue="Contact Our Enterprise Sales Team">
            <Input />
          </Form.Item>

          <Form.Item label="Success Confirmation Message" name="success_msg" initialValue="Thank you! Our sales representative will reach out within 24 business hours.">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item label="Enable CAPTCHA Bot Protection" valuePropName="checked" initialValue={true}>
            <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} defaultChecked />
          </Form.Item>

          <Form.Item label="Auto-Create Deal / Lead in CRM on Submission" valuePropName="checked" initialValue={true}>
            <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} defaultChecked />
          </Form.Item>

          <Form.Item label="Notify Admin via Email on New Submission" valuePropName="checked" initialValue={true}>
            <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} defaultChecked />
          </Form.Item>

          <Button type="primary" htmlType="submit">
            Save Public Form Settings
          </Button>
        </Form>
      </Card>
    </div>
  );
}
