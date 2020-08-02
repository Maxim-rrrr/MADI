export function customersFetchDataSuccess(customers) {
    return {
        type: "CUSTOMERS_FETCH_DATA_SUCCESS",
        customers
    }
}

export function customersFetchData(url) {
    return (dispatch) => {
        fetch(url)
            .then(response => {
                if(!response.ok) {
                    throw new Error(response.statusText);
                }
                return response;
            })
            .then(response => response.json())
            .then(customers => dispatch(customersFetchDataSuccess(customers)))
            .catch(()=>{});
    }
}