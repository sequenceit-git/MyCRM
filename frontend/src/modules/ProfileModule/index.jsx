import Profile from './components/Profile';
import ProfileLayout from '@/layout/ProfileLayout';
import { Layout } from 'antd';
import { Content } from 'antd/lib/layout/layout';

export default function ProfileModule({ config }) {
  return (
    <ProfileLayout>
      <Layout className="site-layout">
        <Content
          className="whiteBox shadow"
          style={{
            padding: '36px 40px',
            margin: '0 auto 40px',
            width: '100%',
            maxWidth: '1100px',
            borderRadius: '12px',
            background: '#ffffff',
            border: '1px solid #edf2f7',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
          }}
        >
          <Profile config={config} />
        </Content>
      </Layout>
    </ProfileLayout>
  );
}
