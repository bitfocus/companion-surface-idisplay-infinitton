import {
	CardGenerator,
	HostCapabilities,
	SurfaceDrawProps,
	SurfaceContext,
	SurfaceInstance,
	createModuleLogger,
	ModuleLogger,
} from '@companion-surface/base'
import type Infinitton from 'infinitton-idisplay'
import { COLUMNS, mapButton, reverseButton, ROWS } from './util.js'

export class InfinittonWrapper implements SurfaceInstance {
	readonly #logger: ModuleLogger

	readonly #infinitton: Infinitton

	readonly #surfaceId: string
	readonly #context: SurfaceContext

	public get surfaceId(): string {
		return this.#surfaceId
	}
	public get productName(): string {
		return 'Infinitton iDisplay'
	}

	public constructor(surfaceId: string, infinitton: Infinitton, context: SurfaceContext) {
		this.#logger = createModuleLogger(`Instance/${surfaceId}`)
		this.#infinitton = infinitton
		this.#surfaceId = surfaceId
		this.#context = context

		this.#infinitton.on('error', (error) => {
			this.#logger.error(error)
			this.#context.disconnect(error)
		})

		this.#infinitton.on('down', (keyIndex) => {
			const key = reverseButton(keyIndex)
			if (key === undefined) return

			this.#context.keyDownById(key + '')
		})

		this.#infinitton.on('up', (keyIndex) => {
			const key = reverseButton(keyIndex)
			if (key === undefined) return

			this.#context.keyUpById(key + '')
		})

		this.#infinitton.on('error', (error) => {
			console.error(error)
			this.#context.disconnect(error)
		})
	}

	async init(): Promise<void> {
		await this.blank()
	}
	async close(): Promise<void> {
		await this.blank().catch(() => null)

		try {
			this.#infinitton.close()
		} catch (_e) {
			// Ignore
		}
	}

	updateCapabilities(_capabilities: HostCapabilities): void {
		// Not used
	}

	async ready(): Promise<void> {
		// Nothing to do
	}

	async setBrightness(percent: number): Promise<void> {
		this.#infinitton.setBrightness(percent)
	}
	async blank(): Promise<void> {
		const keysTotal = COLUMNS * ROWS
		for (let x = 0; x < keysTotal; x++) {
			this.#infinitton.clearKey(x)
		}
	}
	async draw(_signal: AbortSignal, drawProps: SurfaceDrawProps): Promise<void> {
		if (!drawProps.image) return

		let key = Number(drawProps.controlId)
		if (isNaN(key)) return

		key = mapButton(key)

		if (key >= 0 && !isNaN(key)) {
			try {
				this.#infinitton.fillImage(key, Buffer.from(drawProps.image))
			} catch (e: any) {
				this.#logger.debug(`scale image failed: ${e}\n${e.stack}`)
				this.#context.disconnect(e)
			}
		}
	}
	async showStatus(_signal: AbortSignal, _cardGenerator: CardGenerator): Promise<void> {
		// Not used
	}
}
