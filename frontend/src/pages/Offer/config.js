export const fields = {
  number: {
    type: 'number',
    required: true,
  },
  leadName: {
    type: 'string',
    required: true,
    label: 'Lead Name',
  },
  status: {
    type: 'selectWithTranslation',
    options: [
      { value: 'draft', label: 'draft', color: 'default' },
      { value: 'pending', label: 'pending', color: 'blue' },
      { value: 'sent', label: 'sent', color: 'cyan' },
      { value: 'accepted', label: 'accepted', color: 'green' },
      { value: 'declined', label: 'declined', color: 'red' },
      { value: 'expired', label: 'expired', color: 'orange' },
    ],
    defaultValue: 'draft',
  },
  total: {
    type: 'currency',
    required: true,
  },
  date: {
    type: 'date',
    required: true,
  },
  expiredDate: {
    type: 'date',
    required: true,
  },
  notes: {
    type: 'textarea',
  },
};
