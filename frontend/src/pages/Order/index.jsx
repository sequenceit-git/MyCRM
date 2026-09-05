import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';

import useLanguage from '@/locale/useLanguage';

export default function Order() {
  const translate = useLanguage();
  const entity = 'order';
  const searchConfig = {
    displayLabels: ['number', 'clientName'],
    searchFields: 'number,clientName',
  };
  const deleteModalLabels = ['number', 'clientName'];

  const Labels = {
    PANEL_TITLE: translate('order') || 'Order',
    DATATABLE_TITLE: 'Order List',
    ADD_NEW_ENTITY: 'Add New Order',
    ENTITY_NAME: 'Order',
  };
  const configPage = {
    entity,
    ...Labels,
  };
  const config = {
    ...configPage,
    fields,
    searchConfig,
    deleteModalLabels,
  };
  return (
    <CrudModule
      createForm={<DynamicForm fields={fields} />}
      updateForm={<DynamicForm fields={fields} />}
      config={config}
    />
  );
}
