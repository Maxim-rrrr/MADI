export function customers (state = [], action) {
    switch (action.type) {
        case "CUSTOMERS_FETCH_DATA_SUCCESS":
            return action.customers;
        default:
            return state;
    }
}