import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';

import useLanguage from '@/locale/useLanguage';

export default function Offer() {
  const translate = useLanguage();
  const entity = 'offer';
  const searchConfig = {
    displayLabels: ['number', 'leadName'],
    searchFields: 'number,leadName',
  };
  const deleteModalLabels = ['number', 'leadName'];

  const Labels = {
    PANEL_TITLE: translate('offer'),
    DATATABLE_TITLE: translate('offer_list'),
    ADD_NEW_ENTITY: translate('add_new_offer'),
    ENTITY_NAME: translate('offer'),
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
