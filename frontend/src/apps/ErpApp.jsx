import { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Layout } from 'antd';

import Navigation from '@/apps/Navigation/NavigationContainer';
import HeaderContent from '@/apps/Header/HeaderContainer';
import PageLoader from '@/components/PageLoader';
// import AiChatbotSidebar from '@/components/AiChatbot/AiChatbotSidebar';

import { settingsAction } from '@/redux/settings/actions';
import { selectSettings } from '@/redux/settings/selectors';

import AppRouter from '@/router/AppRouter';
import useResponsive from '@/hooks/useResponsive';

export default function ErpCrmApp() {
  const { Content } = Layout;
  const { isMobile } = useResponsive();
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    dispatch(settingsAction.list({ entity: 'setting' }));
  }, []);

  const { isSuccess: settingIsloaded } = useSelector(selectSettings);

  return (
    <Layout hasSider style={{ minHeight: '100vh', background: '#f0f5fa' }}>
      <Navigation />

      {isMobile ? (
        <Layout style={{ marginLeft: 0 }}>
          <HeaderContent />
          <Content
            style={{
              margin: '40px auto 30px',
              overflow: 'initial',
              width: '100%',
              padding: '0 25px',
              maxWidth: 'none',
            }}
          >
            {settingIsloaded ? <AppRouter /> : <PageLoader />}
          </Content>
        </Layout>
      ) : (
        <Layout style={{ background: '#f0f5fa', minHeight: '100vh' }}>
          <HeaderContent />
          <Content
            style={{
              margin: '16px 0 40px',
              overflow: 'initial',
              width: '100%',
              padding: '0 36px',
              maxWidth: 'none',
            }}
          >
            {settingIsloaded ? <AppRouter /> : <PageLoader />}
          </Content>
        </Layout>
      )}

      {/* Global AI Assistant Sidebar (Disabled for now) */}
      {/* <AiChatbotSidebar /> */}
    </Layout>
  );
}

