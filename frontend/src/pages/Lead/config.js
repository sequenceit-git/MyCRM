export const fields = {
  name: {
    type: 'string',
    required: true,
  },
  type: {
    type: 'select',
    options: [
      { value: 'Company', label: 'Company' },
      { value: 'People', label: 'People' },
    ],
    defaultValue: 'Company',
  },
  status: {
    type: 'selectWithTranslation',
    options: [
      { value: 'new', label: 'new', color: 'blue' },
      { value: 'in_negociation', label: 'in_negociation', color: 'orange' },
      { value: 'won', label: 'won', color: 'green' },
      { value: 'loose', label: 'loose', color: 'red' },
      { value: 'on_hold', label: 'on_hold', color: 'purple' },
      { value: 'canceled', label: 'canceled', color: 'default' },
    ],
    defaultValue: 'new',
  },
  source: {
    type: 'selectWithTranslation',
    options: [
      { value: 'linkedin', label: 'linkedin' },
      { value: 'social_media', label: 'social_media' },
      { value: 'advertising', label: 'advertising' },
      { value: 'friend', label: 'friend' },
      { value: 'professionals_network', label: 'professionals_network' },
      { value: 'customer_referral', label: 'customer_referral' },
      { value: 'sales', label: 'sales' },
      { value: 'other', label: 'other' },
    ],
    defaultValue: 'linkedin',
  },
  email: {
    type: 'email',
  },
  phone: {
    type: 'phone',
  },
  country: {
    type: 'country',
  },
  notes: {
    type: 'textarea',
  },
};
