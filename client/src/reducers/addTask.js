export function addTask (state = '', action) {
  switch (action.type) {
    case 'ADD_TASK_SUCCESS':
      return action.task;
    default:
      return state;
  }
}