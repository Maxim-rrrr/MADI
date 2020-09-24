export function addImgSuccess(img) {
  return {
      type: "ADD_IMG_SUCCESS",
      img
  }
}

export function addImg(url, imgData = {}) {
  return (dispatch) => {
    fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'no-cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        "Content-Type": "You will perhaps need to define a content-type here"
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *client
      body: imgData // body data type must match "Content-Type" header
    })
      .then(response => {
        if(!response.ok) {
          throw new Error(response.statusText);
        }
        
        return response;
      })
      .then(response => response.json())
      .then(img => dispatch(addImgSuccess(img)))
      .catch(()=>{});
  }
}