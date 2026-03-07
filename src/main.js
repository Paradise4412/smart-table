import './fonts/ys-display/fonts.css'
import './style.css'

import { initData } from './data.js'
import { processFormData } from './lib/utils.js'

import { initFiltering } from './components/filtering.js'
import { initPagination } from './components/pagination.js'
import { initSearching } from './components/searching.js'
import { initSorting } from './components/sorting.js'
import { initTable } from './components/table.js'

const api = initData()

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function getState() {
	const state = processFormData(new FormData(table.container))

	const rowsPerPage = parseInt(state.rowsPerPage)
	const page = parseInt(state.page ?? 1)

	return {
		...state,
		rowsPerPage,
		page,
	}
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
async function render(action) {
	const state = getState() // состояние полей из таблицы
	let query = {}

	if (typeof applySearch === 'function') {
		query = applySearch(query, state, action)
	}
	if (typeof applyFilter === 'function') {
		query = applyFilter(query, state, action)
	}
	if (typeof applySort === 'function') {
		query = applySort(query, state, action)
	}
	if (typeof applyPage === 'function') {
		query = applyPage(query, state, action)
	}

	const { total, items } = await api.getRecords(query)
	refreshPager(total, query)

	table.render(items)
}

const table = initTable(
	{
		tableTemplate: 'table',
		rowTemplate: 'row',
		before: ['search', 'header', 'filter'],
		after: ['pagination'],
	},
	render,
)

const { applyPage, refreshPager } = initPagination(
	table.pagination.elements,
	(el, page, isCurrent) => {
		const input = el.querySelector('input')
		const label = el.querySelector('span')
		input.value = page
		input.checked = isCurrent
		label.textContent = page
		return el
	},
)

const applySort = initSorting([
	table.header.elements.sortByDate,
	table.header.elements.sortByTotal,
])

const { applyFilter, fillOptions } = initFiltering(table.filter.elements)

const applySearch = initSearching('search')

const appRoot = document.querySelector('#app')
appRoot.appendChild(table.container)

async function init() {
	const indexes = await api.getIndexes()

	fillOptions(table.filter.elements, {
		searchBySeller: indexes.sellers,
	})
}

init().then(render)
