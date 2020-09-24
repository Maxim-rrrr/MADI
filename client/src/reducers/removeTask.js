export function removeTask (state = '', action) {
  switch (action.type) {
    case 'REMOVE_TASKS_SUCCESS':
      return action.task;
    default:
      return state;
  }
}