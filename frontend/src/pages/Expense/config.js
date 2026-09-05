export const fields = {
  name: {
    type: 'string',
    required: true,
  },
  amount: {
    type: 'currency',
    required: true,
  },
  ref: {
    type: 'string',
  },
  date: {
    type: 'date',
    required: true,
  },
  description: {
    type: 'textarea',
  },
};
