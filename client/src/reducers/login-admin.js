export function loginAdmin (state = '', action) {
  switch (action.type) {
    case 'LOGIN_ADMIN_SUCCESS':
      return action.loginResponse;
    default:
      return state;
  }
}