import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import useLanguage from '@/locale/useLanguage';

import { Form, Button, Divider } from 'antd';
import { IdcardOutlined } from '@ant-design/icons';

import { login } from '@/redux/auth/actions';
import { selectAuth } from '@/redux/auth/selectors';
import LoginForm from '@/forms/LoginForm';
import Loading from '@/components/Loading';
import AuthModule from '@/modules/AuthModule';

const LoginPage = () => {
  const translate = useLanguage();
  const { isLoading, isSuccess } = useSelector(selectAuth);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const dispatch = useDispatch();
  const onFinish = (values) => {
    if (values.email?.toLowerCase()?.includes('guest')) {
      sessionStorage.setItem('isGuestMode', 'true');
    } else {
      sessionStorage.removeItem('isGuestMode');
    }
    dispatch(login({ loginData: values }));
  };

  const handleGuestAdminLogin = () => {
    sessionStorage.setItem('isGuestMode', 'true');
    const guestCredentials = {
      email: 'guest@admin.com',
      password: 'guest123',
      remember: true,
    };
    form.setFieldsValue(guestCredentials);
    dispatch(login({ loginData: guestCredentials }));
  };

  useEffect(() => {
    if (isSuccess) navigate('/');
  }, [isSuccess]);

  const FormContainer = () => {
    return (
      <Loading isLoading={isLoading}>
        <Form
          form={form}
          layout="vertical"
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <LoginForm />
          <Form.Item style={{ marginBottom: '12px' }}>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              loading={isLoading}
              size="large"
              block
              style={{
                height: '44px',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '15px',
              }}
            >
              {translate('Log in')}
            </Button>
          </Form.Item>

          <Divider plain style={{ margin: '16px 0', color: '#8c8c8c', fontSize: '13px' }}>
            or
          </Divider>

          <Button
            type="default"
            size="large"
            block
            icon={<IdcardOutlined style={{ fontSize: '18px', color: '#1677ff' }} />}
            loading={isLoading}
            onClick={handleGuestAdminLogin}
            style={{
              height: '44px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '15px',
              borderColor: '#d9d9d9',
              color: '#1f2937',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
              transition: 'all 0.3s ease',
            }}
          >
            Explore As a Guest Admin
          </Button>
        </Form>
      </Loading>
    );
  };

  return <AuthModule authContent={<FormContainer />} AUTH_TITLE="Sign in" />;
};

export default LoginPage;
