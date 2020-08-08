export function addUser (state = '', action) {
  switch (action.type) {
      case 'ADD_USER_SUCCESS':
          return action.user;
      default:
          return state;
  }
}