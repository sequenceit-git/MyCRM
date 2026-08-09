import { ErpContextProvider } from '@/context/erp';
import { Layout } from 'antd';

const { Content } = Layout;

export default function ErpLayout({ children }) {
  return (
    <ErpContextProvider>
      <Content
        className="whiteBox shadow"
        style={{
          margin: '0 auto 30px',
          width: '100%',
          maxWidth: '100%',
          flex: 'none',
          borderRadius: '12px',
          background: '#ffffff',
          border: '1px solid #edf2f7',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
          padding: '24px 28px',
        }}
      >
        {children}
      </Content>
    </ErpContextProvider>
  );
}
