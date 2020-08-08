export function editUser (state = '', action) {
  switch (action.type) {
      case 'EDIT_USER_SUCCESS':
          return action.user;
      default:
          return state;
  }
}