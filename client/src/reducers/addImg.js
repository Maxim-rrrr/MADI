export function addImg (state = '', action) {
  switch (action.type) {
      case 'ADD_IMG_SUCCESS':
          return action.img;
      default:
          return state;
  }
}