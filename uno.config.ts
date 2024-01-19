import transformerVariantGroup from '@unocss/transformer-variant-group';
import { defineConfig, presetUno } from 'unocss';
import presetAnimations from 'unocss-preset-animations';
import { presetScrollbar } from 'unocss-preset-scrollbar';
import { presetShadcn } from 'unocss-preset-shadcn';

export default defineConfig({
  presets: [
    presetUno(),
    presetAnimations(),
    presetShadcn(),
    presetScrollbar({
      scrollbarWidth: '0.375rem',
      scrollbarThumbColor: 'hsl(var(--primary))',
      scrollbarTrackColor: 'hsl(var(--muted))',
      scrollbarThumbRadius: '9999px',
      scrollbarTrackRadius: '9999px',
    }),
  ],
  transformers: [transformerVariantGroup()],
});
