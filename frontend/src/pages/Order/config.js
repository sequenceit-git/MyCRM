export const fields = {
  number: {
    type: 'number',
    required: true,
  },
  clientName: {
    type: 'string',
    required: true,
    label: 'Client',
  },
  status: {
    type: 'selectWithTranslation',
    options: [
      { value: 'pending', label: 'pending', color: 'orange' },
      { value: 'processing', label: 'in_negociation', color: 'blue' },
      { value: 'completed', label: 'paid', color: 'green' },
      { value: 'cancelled', label: 'canceled', color: 'red' },
    ],
    defaultValue: 'pending',
  },
  total: {
    type: 'currency',
    required: true,
  },
  date: {
    type: 'date',
    required: true,
  },
  notes: {
    type: 'textarea',
  },
};
