export function initFiltering(elements) {
	const fillOptions = (elements, indexes) => {
		Object.keys(indexes).forEach(elementName => {
			elements[elementName].append(
				...Object.values(indexes[elementName]).map(name => {
					const el = document.createElement('option')
					el.textContent = name
					el.value = name
					return el
				}),
			)
		})
	}

	const applyFilter = (query, state, action) => {
		if (action && action.name === 'clear') {
			const field = action.dataset.field
			const parent = action.parentElement || action.closest('form') || document
			const input = parent.querySelector(
				`input[name="${field}"], select[name="${field}"]`,
			)
			if (input) input.value = ''
			if (state && field in state) state[field] = ''
		}

		const filter = {}
		Object.keys(elements).forEach(key => {
			if (elements[key]) {
				if (
					['INPUT', 'SELECT'].includes(elements[key].tagName) &&
					elements[key].value
				) {
					filter[`filter[${elements[key].name}]`] = elements[key].value
				}
			}
		})

		return Object.keys(filter).length ? Object.assign({}, query, filter) : query
	}

	return {
		fillOptions,
		applyFilter,
	}
}
