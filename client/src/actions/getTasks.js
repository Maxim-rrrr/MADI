export function getTasksSuccess(tasks) {
  return {
      type: "GET_TASKS_SUCCESS",
      tasks
  }
}

export function getTasks(url) {
  return (dispatch) => {
    try {
      fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *client
        body: JSON.stringify() // body data type must match "Content-Type" header
      })
        .then(response => {
          if(!response.ok) {
              throw new Error(response.statusText);
          }
          return response;
        })
        .then(response => response.json())
        .then(tasks => dispatch(getTasksSuccess(tasks)))
        .catch(()=>{});
    } catch (e) {
      console.log(e);
    }
    
  }
}