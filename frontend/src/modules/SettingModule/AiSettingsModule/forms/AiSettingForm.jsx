import React from 'react';
import { Form, Input, Select, Alert, Tag, Space, Typography } from 'antd';
import {
  KeyOutlined,
  RobotOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';

const { Text } = Typography;

export default function AiSettingForm({ isGuestMode = false }) {
  const translate = useLanguage();
  const form = Form.useFormInstance();
  const selectedModel = Form.useWatch('ai_model', form);
  const currentApiKey = Form.useWatch('openai_api_key', form);

  const modelOptions = [
    {
      value: 'gpt-5-mini',
      label: (
        <Space>
          <span style={{ fontWeight: 600 }}>GPT-5 Mini</span>
          <Tag color="cyan" style={{ fontSize: 11, borderRadius: 4 }}>Fast Next-Gen</Tag>
        </Space>
      ),
    },
    {
      value: 'gpt-4o',
      label: (
        <Space>
          <span style={{ fontWeight: 600 }}>GPT-4o</span>
          <Tag color="purple" style={{ fontSize: 11, borderRadius: 4 }}>Omni Intelligence</Tag>
        </Space>
      ),
    },
    {
      value: 'gpt-5',
      label: (
        <Space>
          <span style={{ fontWeight: 600 }}>GPT-5</span>
          <Tag color="magenta" style={{ fontSize: 11, borderRadius: 4 }}>Flagship</Tag>
        </Space>
      ),
    },
    {
      value: 'gpt-4o-mini',
      label: (
        <Space>
          <span style={{ fontWeight: 600 }}>GPT-4o Mini</span>
          <Tag color="blue" style={{ fontSize: 11, borderRadius: 4 }}>Default & Balanced</Tag>
        </Space>
      ),
    },
    {
      value: 'custom',
      label: (
        <Space>
          <span style={{ fontWeight: 600 }}>Custom Model</span>
          <Tag color="orange" style={{ fontSize: 11, borderRadius: 4 }}>Manual Input</Tag>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 720 }}>
      {isGuestMode ? (
        <Alert
          message="Guest Preview Mode: Browser Storage Active"
          description="Because this public preview is shared, your OpenAI API key is stored securely ONLY in your browser (LocalStorage) for this device. It will never be written to the shared public database or seen by other visitors. Once you sign up or log in, your key will be saved directly to your private database."
          type="warning"
          showIcon
          icon={<LockOutlined style={{ color: '#fa8c16' }} />}
          style={{ marginBottom: 24, borderRadius: 8 }}
        />
      ) : (
        <Alert
          message="Authenticated Admin Mode: Permanent Database Storage"
          description="Your OpenAI API Key and Model configuration are stored securely in your private CRM database. No server restart or .env configuration is needed. All authorized team members will be able to utilize this AI Copilot setup."
          type="success"
          showIcon
          icon={<SafetyCertificateOutlined style={{ color: '#52c41a' }} />}
          style={{ marginBottom: 24, borderRadius: 8 }}
        />
      )}

      {/* 1. OpenAI API Key */}
      <Form.Item
        label={
          <Space>
            <span>{translate('OpenAI API Key')}</span>
            {currentApiKey && currentApiKey.trim().length > 10 ? (
              <Tag
                icon={<CheckCircleOutlined />}
                color={isGuestMode ? 'orange' : 'success'}
                style={{ margin: 0 }}
              >
                {isGuestMode ? 'Saved in Browser' : 'Configured in DB'}
              </Tag>
            ) : (
              <Tag color="default" style={{ margin: 0 }}>
                Not Set (Empty)
              </Tag>
            )}
          </Space>
        }
        name="openai_api_key"
        extra="Paste your secret OpenAI API key (starts with sk-). You can generate a key at platform.openai.com/api-keys."
      >
        <Input.Password
          placeholder="sk-proj-..."
          prefix={<KeyOutlined style={{ color: '#9ca3af' }} />}
          style={{ fontFamily: 'monospace', borderRadius: 6 }}
        />
      </Form.Item>

      {/* 2. Model Selection */}
      <Form.Item
        label={translate('AI Model')}
        name="ai_model"
        rules={[{ required: true, message: 'Please select an AI model' }]}
        extra="Choose the intelligence engine for conversational reasoning and function calling."
      >
        <Select
          options={modelOptions}
          placeholder="Select an AI model"
          style={{ width: '100%' }}
        />
      </Form.Item>

      {/* 3. Custom Model Input (Conditionally visible when 'custom' is selected) */}
      {selectedModel === 'custom' && (
        <Form.Item
          label={translate('Custom Model Name')}
          name="custom_ai_model"
          rules={[
            {
              required: true,
              message: 'Please enter your custom OpenAI model identifier (e.g. o3-mini, o1, gpt-4.5-preview)',
            },
          ]}
          extra="Enter the exact OpenAI model name (e.g. o3-mini, o1-mini, gpt-4.5-preview, etc.)."
        >
          <Input
            placeholder="e.g. o3-mini, o1, gpt-4.5-preview"
            prefix={<ThunderboltOutlined style={{ color: '#faad14' }} />}
            style={{ borderRadius: 6 }}
          />
        </Form.Item>
      )}
    </div>
  );
}
