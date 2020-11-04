export function isAdmin (state = '', action) {
  switch (action.type) {
    case 'IS_ADMIN_SUCCESS':
      return action.isAdminResponse;
    default:
      return state;
  }
}