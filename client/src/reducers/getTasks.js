export function getTasks (state = '', action) {
  switch (action.type) {
    case 'GET_TASKS_SUCCESS':
      return action.tasks;
    default:
      return state;
  }
}