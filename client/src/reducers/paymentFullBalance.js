export function paymentFullBalance (state = '', action) {
  switch (action.type) {
    case 'PAYMENT_FULL_BALANCE_SUCCESS':
      return action.response;
    default:
      return state;
  }
}