export function setTask (state = '', action) {
  switch (action.type) {
    case 'SET_TASK_SUCCESS':
      return action.subject;
    default:
      return state;
  }
}