export function validInvite(state = '', action) {
  switch (action.type) {
    case 'VALID_INVITE_SUCCESS':
      return action.validInviteResponse;
    default:
      return state;
  }
}