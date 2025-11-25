export const COLUMNS = 5
export const ROWS = 3
export const KEY_COUNT = ROWS * COLUMNS

// export function getControlIdFromIndex(index: number): string {
// 	const column = index % COLUMNS
// 	const row = Math.floor(index / COLUMNS)

// 	return getControlIdFromXy(column, row)
// }

export function getControlIdFromXy(column: number, row: number): string {
	return `${row * COLUMNS + column}`
}

export function mapButton(input: number): number {
	const map = '4 3 2 1 0 9 8 7 6 5 14 13 12 11 10'.split(/ /)
	if (input < 0) {
		return -1
	}

	return parseInt(map[input])
}

export function reverseButton(input: number): number | undefined {
	const map = '4 3 2 1 0 9 8 7 6 5 14 13 12 11 10'.split(/ /)
	for (let pos = 0; pos < map.length; pos++) {
		if (Number(map[input]) == pos) return pos
	}

	return
}
