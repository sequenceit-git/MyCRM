import { Progress, Divider, Skeleton } from 'antd';
import useLanguage from '@/locale/useLanguage';

export default function CustomerPreviewCard({
  isLoading = false,
  activeCustomer = 0,
  newCustomer = 0,
  totalCustomers = 0,
}) {
  const translate = useLanguage();

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #edf2f7',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
        padding: '24px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: '430px',
      }}
    >
      <h4
        style={{
          color: '#22075e',
          fontSize: '15px',
          fontWeight: '700',
          margin: '0 0 24px',
          letterSpacing: '-0.2px',
          textAlign: 'center',
        }}
      >
        {translate('Customers')}
      </h4>

      {isLoading ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            padding: '10px 0',
          }}
        >
          <Skeleton.Avatar active size={140} shape="circle" style={{ margin: '10px auto' }} />
          <div style={{ marginTop: '16px' }}>
            <Skeleton.Input active size="small" style={{ width: 110, height: 16 }} />
          </div>
          <Divider style={{ margin: '20px 0', borderColor: '#f1f5f9' }} />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Skeleton.Input active size="small" style={{ width: 40, height: 12 }} />
            <Skeleton.Input active size="small" style={{ width: 80, height: 22 }} />
          </div>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <div style={{ margin: '10px 0' }}>
            <Progress
              type="circle"
              percent={newCustomer || 0}
              size={150}
              strokeColor="#e2e8f0"
              trailColor="#f8fafc"
              strokeWidth={8}
              format={(percent) => (
                <span
                  style={{
                    fontSize: '28px',
                    fontWeight: '700',
                    color: '#1f2937',
                    letterSpacing: '-0.5px',
                  }}
                >
                  {percent}%
                </span>
              )}
            />
          </div>

          <div
            style={{
              fontSize: '13px',
              fontWeight: '600',
              color: '#4b5563',
              marginTop: '16px',
              textAlign: 'center',
            }}
          >
            Last Month : {totalCustomers || 0}
          </div>

          <Divider style={{ margin: '20px 0', borderColor: '#f1f5f9' }} />

          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '12px',
                color: '#9ca3af',
                fontWeight: '500',
                marginBottom: '4px',
              }}
            >
              Total
            </div>
            <div
              style={{
                fontSize: '22px',
                fontWeight: '800',
                color: '#111827',
                letterSpacing: '-0.5px',
              }}
            >
              {(activeCustomer || 0).toFixed(2)} %
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
