import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, Divider, notification, message, Space } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import { SaveOutlined, DeleteOutlined } from '@ant-design/icons';
import SetingsSection from '../components/SetingsSection';
import AiSettingForm from './forms/AiSettingForm';
import useLanguage from '@/locale/useLanguage';
import { settingsAction } from '@/redux/settings/actions';
import { selectSettings } from '@/redux/settings/selectors';
import { selectCurrentAdmin } from '@/redux/auth/selectors';
import Loading from '@/components/Loading';

export default function AiSettingsModule({ config }) {
  const translate = useLanguage();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { result, isLoading } = useSelector(selectSettings);
  const currentAdmin = useSelector(selectCurrentAdmin);

  const isGuestMode =
    sessionStorage.getItem('isGuestMode') === 'true' ||
    currentAdmin?.role === 'guest' ||
    currentAdmin?.email?.toLowerCase()?.includes('guest');

  // Load initial settings
  useEffect(() => {
    if (isGuestMode) {
      const localKey = localStorage.getItem('mycrm_local_openai_key') || '';
      const localModel = localStorage.getItem('mycrm_local_ai_model') || 'gpt-4o-mini';
      const localCustomModel = localStorage.getItem('mycrm_local_custom_ai_model') || '';

      form.setFieldsValue({
        openai_api_key: localKey,
        ai_model: localModel,
        custom_ai_model: localCustomModel,
      });
    } else {
      const dbSettings = result?.ai_settings || {};
      const localKey = localStorage.getItem('mycrm_local_openai_key') || '';

      form.setFieldsValue({
        openai_api_key: dbSettings.openai_api_key || localKey || '',
        ai_model: dbSettings.ai_model || 'gpt-4o-mini',
        custom_ai_model: dbSettings.custom_ai_model || '',
      });
    }
  }, [result, isGuestMode]);

  const onFinish = (values) => {
    if (isGuestMode) {
      // 1. Guest Preview Mode: Save to browser localStorage (Never touches public DB)
      localStorage.setItem('mycrm_local_openai_key', values.openai_api_key ? values.openai_api_key.trim() : '');
      localStorage.setItem('mycrm_local_ai_model', values.ai_model || 'gpt-4o-mini');
      localStorage.setItem('mycrm_local_custom_ai_model', values.custom_ai_model ? values.custom_ai_model.trim() : '');

      notification.success({
        message: 'Saved to Browser (Guest Preview)',
        description: 'Your API key and model were saved locally to your browser. AI Copilot will use your key on this device without modifying the public database.',
        duration: 4,
      });
    } else {
      // 2. Authenticated / Signed-Up User: Save permanently to MongoDB
      const settings = [
        { settingKey: 'openai_api_key', settingValue: values.openai_api_key ? values.openai_api_key.trim() : '', settingCategory: 'ai_settings' },
        { settingKey: 'ai_model', settingValue: values.ai_model || 'gpt-4o-mini', settingCategory: 'ai_settings' },
        { settingKey: 'custom_ai_model', settingValue: values.custom_ai_model ? values.custom_ai_model.trim() : '', settingCategory: 'ai_settings' },
      ];

      dispatch(settingsAction.updateMany({ entity: config.entity, jsonData: { settings } }));

      // Clean up temporary guest key now that it is persisted in the database
      localStorage.removeItem('mycrm_local_openai_key');
      localStorage.removeItem('mycrm_local_ai_model');
      localStorage.removeItem('mycrm_local_custom_ai_model');

      notification.success({
        message: 'Saved to Database',
        description: 'Your AI configuration has been saved permanently to your private CRM database.',
        duration: 4,
      });
    }
  };

  const handleClearLocalKey = () => {
    localStorage.removeItem('mycrm_local_openai_key');
    localStorage.removeItem('mycrm_local_ai_model');
    localStorage.removeItem('mycrm_local_custom_ai_model');
    form.setFieldsValue({
      openai_api_key: '',
      ai_model: 'gpt-4o-mini',
      custom_ai_model: '',
    });
    message.info('Local browser API key cleared.');
  };

  return (
    <>
      <PageHeader
        title={config.SETTINGS_TITLE}
        ghost={false}
        style={{ padding: '20px 0px' }}
      />
      <Divider />
      <Loading isLoading={isLoading}>
        <Form
          form={form}
          onFinish={onFinish}
          labelCol={{ span: 8 }}
          labelAlign="left"
          wrapperCol={{ span: 16 }}
        >
          <SetingsSection
            title={translate('AI Copilot Configuration')}
            description={translate('Set your OpenAI API key and select your preferred intelligence model')}
          >
            <AiSettingForm isGuestMode={isGuestMode} />
          </SetingsSection>

          <Form.Item style={{ marginTop: 20 }}>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                {isGuestMode ? translate('Save to Browser (Guest)') : translate('Save to Database')}
              </Button>
              {isGuestMode && (
                <Button onClick={handleClearLocalKey} icon={<DeleteOutlined />}>
                  {translate('Clear Local Key')}
                </Button>
              )}
            </Space>
          </Form.Item>
        </Form>
      </Loading>
    </>
  );
}
