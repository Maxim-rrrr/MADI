export function getCustomerSuccess(customer) {
  return {
      type: "GET_CUSTOMER_SUCCESS",
      customer
  }
}

export function getCustomer(url) {
  return (dispatch) => {
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
      body: '' // body data type must match "Content-Type" header
    })
      .then(response => {
        if(!response.ok) {
            throw new Error(response.statusText);
        }
        return response;
      })
      .then(response => response.json())
      .then(customer => dispatch(getCustomerSuccess(customer)))
      .catch(()=>{});
  }
}