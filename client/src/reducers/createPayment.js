export function createPayment (state = '', action) {
  switch (action.type) {
    case 'CREATE_PAYMENT_SUCCESS':
      return action.payment;
    default:
      return state;
  }
}