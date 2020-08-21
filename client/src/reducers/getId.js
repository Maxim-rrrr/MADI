export function getId (state = '', action) {
  switch (action.type) {
    case 'GET_ID_SUCCESS':
      return action.getIdResponse;
    default:
      return state;
  }
}