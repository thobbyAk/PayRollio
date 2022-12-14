export default (state, action) => {
	switch (action.type) {
		case "ADD_USER":
			return {
				...state,
				users: action.payload,
			};
		case "INITIALIZE_MARKETDATA":
			return {
				...state,
				marketData: action.payload,
			};
		default:
			break;
	}
};
