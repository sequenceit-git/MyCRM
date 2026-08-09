import { ErpLayout } from '@/layout';
import { Skeleton, Row, Col } from 'antd';
import { erp } from '@/redux/erp/actions';
import { selectItemById, selectCurrentItem } from '@/redux/erp/selectors';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Payment from './components/Payment';

const PaymentSectionSkeleton = () => (
  <div>
    <Skeleton.Input active style={{ width: 180, height: 28, marginBottom: 20 }} />
    <Row gutter={[24, 24]}>
      <Col xs={24} sm={12}>
        <Skeleton.Input active style={{ width: '100%', height: 38, marginBottom: 16 }} />
        <Skeleton.Input active style={{ width: '100%', height: 38, marginBottom: 16 }} />
      </Col>
      <Col xs={24} sm={12}>
        <Skeleton.Input active style={{ width: '100%', height: 38, marginBottom: 16 }} />
        <Skeleton.Input active style={{ width: '100%', height: 38, marginBottom: 16 }} />
      </Col>
    </Row>
  </div>
);

export default function RecordPaymentModule({ config }) {
  const dispatch = useDispatch();
  const { id } = useParams();

  let item = useSelector(selectItemById(id));

  useEffect(() => {
    if (item) {
      dispatch(erp.currentItem({ data: item }));
    } else {
      dispatch(erp.read({ entity: config.entity, id }));
    }
  }, [item, id]);

  const { result: currentResult } = useSelector(selectCurrentItem);
  item = currentResult;

  useEffect(() => {
    dispatch(erp.currentAction({ actionType: 'recordPayment', data: item }));
  }, [item]);

  return (
    <ErpLayout>
      {item ? <Payment config={config} currentItem={currentResult} /> : <PaymentSectionSkeleton />}
    </ErpLayout>
  );
}
