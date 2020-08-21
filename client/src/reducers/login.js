export function login (state = '', action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return action.loginResponse;
    default:
      return state;
  }
}