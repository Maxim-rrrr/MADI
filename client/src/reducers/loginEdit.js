export function loginEdit (state = '', action) {
  switch (action.type) {
      case 'LOGIN_EDIT_SUCCESS':
          return action.user;
      default:
          return state;
  }
}