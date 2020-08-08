export function code (state = '', action) {
  switch (action.type) {
      case 'CODE_SUCCESS':
          return action.code;
      default:
          return state;
  }
}