export function getCustomer (state = '', action) {
  switch (action.type) {
    case 'GET_CUSTOMER_SUCCESS':
      return action.customer;
    default:
      return state;
  }
}