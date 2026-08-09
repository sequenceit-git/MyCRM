import { Space, Layout, Divider, Typography } from 'antd';
import logo from '@/style/images/logo.svg';
import useLanguage from '@/locale/useLanguage';
import { useSelector } from 'react-redux';

const { Content } = Layout;
const { Title, Text } = Typography;

export default function SideContent() {
  const translate = useLanguage();

  return (
    <Content
      style={{
        padding: '150px 30px 30px',
        width: '100%',
        maxWidth: '450px',
        margin: '0 auto',
      }}
      className="sideContent"
    >
      <div style={{ width: '100%' }}>
        <img
          src={logo}
          alt="MyCRM"
          style={{ margin: '0 0 30px', display: 'block' }}
          height={54}
          width={220}
        />

        <Title level={1} style={{ fontSize: 28 }}>
          MyCRM System
        </Title>
        <Text>
          Accounting / Invoicing / CRM Platform
        </Text>

        <div className="space20"></div>
      </div>
    </Content>
  );
}
