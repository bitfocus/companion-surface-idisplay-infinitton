import type { SurfaceSchemaLayoutDefinition } from '@companion-surface/base'
import { COLUMNS, getControlIdFromXy, ROWS } from './util.js'

export function createSurfaceSchema(): SurfaceSchemaLayoutDefinition {
	const surfaceLayout: SurfaceSchemaLayoutDefinition = {
		stylePresets: {
			default: {
				bitmap: {
					w: 72,
					h: 72,
					format: 'rgb',
				},
			},
		},
		controls: {},
	}

	for (let y = 0; y < ROWS; y++) {
		for (let x = 0; x < COLUMNS; x++) {
			surfaceLayout.controls[getControlIdFromXy(x, y)] = {
				row: y,
				column: x,
			}
		}
	}

	return surfaceLayout
}
