import CrudModule from '@/modules/CrudModule/CrudModule';
import CurrencyForm from '@/forms/CurrencyForm';

import useLanguage from '@/locale/useLanguage';

export default function Currency() {
  const translate = useLanguage();
  const entity = 'currency';
  const searchConfig = {
    displayLabels: ['name', 'symbol'],
    searchFields: 'name,symbol',
  };
  const deleteModalLabels = ['name', 'symbol'];

  const fields = {
    name: {
      type: 'string',
      required: true,
    },
    symbol: {
      type: 'string',
      required: true,
    },
    decimal_separator: {
      type: 'string',
    },
    thousand_separator: {
      type: 'string',
    },
    isDefault: {
      type: 'boolean',
    },
  };

  const Labels = {
    PANEL_TITLE: translate('currency'),
    DATATABLE_TITLE: translate('currency_list'),
    ADD_NEW_ENTITY: translate('add_new_currency'),
    ENTITY_NAME: translate('currency'),
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
      createForm={<CurrencyForm isUpdateForm={false} />}
      updateForm={<CurrencyForm isUpdateForm={true} />}
      config={config}
    />
  );
}
