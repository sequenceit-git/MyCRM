import { useState } from 'react';
import { Card, Button, Input, message, Typography, Divider, Alert, Tag, Space } from 'antd';
import { KeyOutlined, CopyOutlined, ReloadOutlined, LockOutlined } from '@ant-design/icons';

const { Text, Paragraph } = Typography;

export default function ApiKeySettings() {
  const [apiKey, setApiKey] = useState('mycrm_live_key_9f83b2a7e4c19d8327a5e810');
  const [copied, setCopied] = useState(false);

  const generateNewKey = () => {
    const chars = '0123456789abcdef';
    let rand = '';
    for (let i = 0; i < 24; i++) {
      rand += chars[Math.floor(Math.random() * chars.length)];
    }
    const newKey = `mycrm_live_key_${rand}`;
    setApiKey(newKey);
    message.success('New API key generated successfully!');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    message.success('API Key copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '10px 0 30px' }}>
      <Card
        title={
          <Space>
            <KeyOutlined style={{ color: '#1677ff' }} />
            <span>Developer API Key & REST Integration</span>
          </Space>
        }
        style={{ borderRadius: '12px', border: '1px solid #edf2f7' }}
      >
        <Alert
          message="API Key Access Policy"
          description="Use this secret API key to authenticate external webhooks, third-party ERP connectors, and backend microservices. Do not expose this key in client-side code."
          type="info"
          showIcon
          style={{ marginBottom: 24, borderRadius: '8px' }}
        />

        <div style={{ marginBottom: 20 }}>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>
            Live Production API Key
          </Text>
          <div style={{ display: 'flex', gap: 10 }}>
            <Input.Password
              value={apiKey}
              readOnly
              style={{ fontFamily: 'monospace', fontSize: 14 }}
              prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
            />
            <Button
              type="primary"
              icon={<CopyOutlined />}
              onClick={copyToClipboard}
            >
              {copied ? 'Copied' : 'Copy'}
            </Button>
            <Button icon={<ReloadOutlined />} onClick={generateNewKey}>
              Regenerate
            </Button>
          </div>
        </div>

        <Divider />

        <div style={{ marginBottom: 16 }}>
          <Text strong>API Permissions & Rate Limits</Text>
          <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Tag color="blue">Full Read/Write Access</Tag>
            <Tag color="green">REST & GraphQL Endpoints</Tag>
            <Tag color="purple">10,000 req / hour</Tag>
            <Tag color="cyan">SSL Enforced</Tag>
          </div>
        </div>

        <Paragraph style={{ color: '#6b7280', fontSize: 13, marginTop: 16 }}>
          <b>Example Request Header:</b><br />
          <code>Authorization: Bearer {apiKey.slice(0, 16)}...</code>
        </Paragraph>
      </Card>
    </div>
  );
}
