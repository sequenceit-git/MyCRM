import { Tabs, Row, Col } from 'antd';

const SettingsLayout = ({ children }) => {
  return (
    <Col className="gutter-row" order={0}>
      <div
        className="whiteBox shadow"
        style={{
          minHeight: '480px',
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #edf2f7',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
        }}
      >
        <div className="pad40">{children}</div>
      </div>
    </Col>
  );
};

const TopCard = ({ pageTitle }) => {
  return (
    <div
      className="whiteBox shadow"
      style={{
        color: '#595959',
        fontSize: 13,
        height: '70px',
        minHeight: 'auto',
        marginBottom: '20px',
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #edf2f7',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <h3 style={{ color: '#22075e', margin: 0, fontWeight: '700', fontSize: '18px' }}>
        {pageTitle}
      </h3>
    </div>
  );
};

const RightMenu = ({ children, pageTitle }) => {
  return (
    <Col
      className="gutter-row"
      xs={{ span: 24 }}
      sm={{ span: 24 }}
      md={{ span: 7 }}
      lg={{ span: 6 }}
      order={1}
    >
      <TopCard pageTitle={pageTitle} />
      <div
        className="whiteBox shadow"
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #edf2f7',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
        }}
      >
        <div className="pad25" style={{ width: '100%', paddingBottom: 0 }}>
          {children}
        </div>
      </div>
    </Col>
  );
};

export default function TabsContent({ content, defaultActiveKey, pageTitle }) {
  const items = content.map((item, index) => {
    return {
      key: item.key ? item.key : index + '_' + item.label.replace(/ /g, '_'),
      label: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {item.icon} <span style={{ paddingRight: 30 }}>{item.label}</span>
        </div>
      ),
      children: <SettingsLayout>{item.children}</SettingsLayout>,
    };
  });

  const renderTabBar = (props, DefaultTabBar) => (
    <RightMenu pageTitle={pageTitle}>
      <DefaultTabBar {...props} />
    </RightMenu>
  );

  return (
    <Row gutter={[24, 24]} className="tabContent">
      <Tabs
        tabPosition="right"
        defaultActiveKey={defaultActiveKey}
        hideAdd={true}
        items={items}
        renderTabBar={renderTabBar}
      />
    </Row>
  );
}
