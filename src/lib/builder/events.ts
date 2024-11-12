import type { GroupedEvents, MeltComponentEvents } from '@melt-ui/svelte/internal/types';

export const visualizationEvents = {
	root: ['pointerup', 'pointermove'] as const,
	'horizontal-trigger': ['pointerdown', 'pointerenter', 'pointerleave', 'focus', 'blur'] as const,
	'vertical-trigger': ['pointerdown', 'pointerenter', 'pointerleave', 'focus', 'blur'] as const,
	box: ['pointerenter', 'pointerleave'] as const
};

export type VisualizationEvents = GroupedEvents<typeof visualizationEvents>;
export type VisualizationComponentEvents = MeltComponentEvents<VisualizationEvents>;
