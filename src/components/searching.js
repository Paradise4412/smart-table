export function initSearching(searchField) {
	return (query, state) => {
		return state[searchField]
			? Object.assign({}, query, { search: state[searchField] })
			: query
	}
}
