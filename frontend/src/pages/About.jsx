import { Result } from 'antd';
import useLanguage from '@/locale/useLanguage';

const About = () => {
  const translate = useLanguage();
  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #edf2f7',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
        padding: '40px 24px',
        maxWidth: '800px',
        margin: '0 auto',
      }}
    >
      <Result
        status="info"
        title={'MyCRM'}
        subTitle={translate('Modern Cloud CRM & Sales Platform')}
        extra={
          <div style={{ color: '#4b5563', fontSize: '14px', lineHeight: '1.8' }}>
            <p style={{ margin: 0, fontWeight: '600' }}>Version : 1.0.0</p>
            <p style={{ margin: 0 }}>All-in-one Business Management & Invoicing Solution</p>
          </div>
        }
      />
    </div>
  );
};

export default About;
