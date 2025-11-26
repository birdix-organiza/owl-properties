import { xml, useRef, useEffect } from '@odoo/owl';
import { BaseRenderer } from './BaseRenderer';
import Pickr from '@simonwep/pickr';
import '@simonwep/pickr/dist/themes/nano.min.css';

export class Color extends BaseRenderer {
  static template = xml`
<div
  t-ref="refer"
  class="color"
  t-att-class="props.className"
/>
  `;

  refer = useRef('refer');

  pickr?: Pickr;

  get pickrSwatches() {
    return [
      'rgba(244, 67, 54, 1)',
      'rgba(233, 30, 99, 0.95)',
      'rgba(156, 39, 176, 0.9)',
      'rgba(103, 58, 183, 0.85)',
      'rgba(63, 81, 181, 0.8)',
      'rgba(33, 150, 243, 0.75)',
      'rgba(3, 169, 244, 0.7)',
      'rgba(0, 188, 212, 0.7)',
      'rgba(0, 150, 136, 0.75)',
      'rgba(76, 175, 80, 0.8)',
      'rgba(139, 195, 74, 0.85)',
      'rgba(205, 220, 57, 0.9)',
      'rgba(255, 235, 59, 0.95)',
      'rgba(255, 193, 7, 1)',
    ];
  }

  get pickrComponents() {
    return {
      // Main components
      preview: true,
      opacity: true,
      hue: true,

      // Input / output Options
      interaction: {
        hex: false,
        rgba: false,
        hsla: false,
        hsva: false,
        cmyk: false,
        input: true,
        clear: false,
        cancel: true,
        save: true,
      },
    };
  }

  get i18n() {
    return {
      // Strings visible in the UI
      'ui:dialog': 'color picker dialog',
      'btn:toggle': 'toggle color picker dialog',
      'btn:swatch': 'color swatch',
      'btn:last-color': 'use previous color',
      'btn:save': 'Save',
      'btn:cancel': 'Cancel',
      'btn:clear': 'Clear',

      // Strings used for aria-labels
      'aria:btn:save': 'save and close',
      'aria:btn:cancel': 'cancel and close',
      'aria:btn:clear': 'clear and close',
      'aria:input': 'color input field',
      'aria:palette': 'color selection area',
      'aria:hue': 'hue selection slider',
      'aria:opacity': 'selection slider',
    };
  }

  format(value: any) {
    return value ?? '#CE1F1F';
  }

  onChangeText(ev: Event) {
    const val = (ev.target as HTMLInputElement).value;
    this.state.value = val;
    this.onChange?.(val);
  }

  getColor(pickr: Pickr) {
    return {
      previous: pickr.getSelectedColor().toHEXA().toString(),
      current: pickr.getColor().toHEXA().toString(),
    };
  }

  setup(): void {
    super.setup();

    useEffect(
      () => {
        this.pickr = Pickr.create({
          el: this.refer.el,
          theme: 'nano',
          disabled: this.props.readonly,
          default: this.state.value,

          swatches: this.pickrSwatches,

          components: this.pickrComponents,
          i18n: this.i18n,
        });
        this.pickr
          .on('hide', (instance) => {
            const colors = this.getColor(instance);
            this.pickr?.setColor(colors.previous);
          })
          .on('change', (color, source, instance) => {
            this.props.extra?.onPreview?.(color.toHEXA().toString());
          })
          .on('save', (color, instance) => {
            this.onChange(color.toHEXA().toString());
          })
          .on('cancel', (instance) => {
            const colors = this.getColor(instance);
            this.props.extra?.onPreview?.(colors.current);
          });

        return () => {
          this.pickr?.destroyAndRemove();
        };
      },
      () => [],
    );
  }
}
