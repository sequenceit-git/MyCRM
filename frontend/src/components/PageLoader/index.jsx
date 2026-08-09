import { Skeleton, Row, Col } from 'antd';
import TableSkeleton from '@/components/TableSkeleton';

const PageLoader = () => {
  return (
    <div
      style={{
        width: '100%',
        padding: '10px 0',
      }}
    >
      {/* Top 4 KPI Cards Skeleton */}
      <Row gutter={[20, 20]} style={{ marginBottom: '24px' }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Col xs={24} sm={12} lg={6} key={i}>
            <div
              style={{
                background: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #edf2f7',
                padding: '20px 24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '14px',
              }}
            >
              <Skeleton.Input active size="small" style={{ width: 100, height: 16 }} />
              <Skeleton.Button active style={{ width: '100%', height: 42, borderRadius: 8 }} />
              <Skeleton.Button active size="small" style={{ width: 110, height: 24, borderRadius: 6 }} />
            </div>
          </Col>
        ))}
      </Row>

      {/* Main Table Skeleton Box */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #edf2f7',
          padding: '24px 28px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <Skeleton.Input active style={{ width: 180, height: 28 }} />
          <div style={{ display: 'flex', gap: '10px' }}>
            <Skeleton.Input active style={{ width: 160, height: 32 }} />
            <Skeleton.Button active style={{ width: 90, height: 32 }} />
            <Skeleton.Button active type="primary" style={{ width: 120, height: 32 }} />
          </div>
        </div>
        <TableSkeleton rows={7} />
      </div>
    </div>
  );
};

export default PageLoader;
