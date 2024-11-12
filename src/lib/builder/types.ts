import type { Writable } from 'svelte/store';
import type { createVisualization } from './create.js';
import type { BuilderReturn } from '@melt-ui/svelte/internal/types';
export type { VisualizationComponentEvents } from './events.js';

export type CreateVisualizationProps = {
	/**
	 * Default values for the visualization.
	 *
	 * @default { left: 0.6, right: 0.4, topLeft: 0.7, bottomLeft: 0.3, topRight: 0.2, bottomRight: 0.8 }
	 */
	defaultRatios?: {
		left: number;
		right: number;
		topLeft: number;
		bottomLeft: number;
		topRight: number;
		bottomRight: number;
	};

	/**
	 * Optionally pass a writable store to control the ratios of the visualization.
	 * If provided, this will override the value of the `defaultRatios` prop.
	 */
	ratios?: Writable<{
		left: number;
		right: number;
		topLeft: number;
		bottomLeft: number;
		topRight: number;
		bottomRight: number;
	}>;
};

export type Visualization = BuilderReturn<typeof createVisualization>;
export type VisualizationElements = Visualization['elements'];
export type VisualizationOptions = Visualization['options'];
export type VisualizationStates = Visualization['states'];
