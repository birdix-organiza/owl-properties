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
      '#F44336',
      '#E91E63',
      '#9C27B0',
      '#673AB7',
      '#3F51B5',
      '#2196F3',
      '#03A9F4',
      '#00BCD4',
      '#009688',
      '#4CAF50',
      '#8BC34A',
      '#CDDC39',
      '#FFEB3B',
      '#FFC107',
    ];
  }

  get pickrComponents() {
    const { extra } = this.props;
    return {
      // Main components
      preview: true,
      opacity: extra?.opacity ?? true,
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
            this.pickr?.setColor(colors.previous, true);
          })
          .on('change', (color, source, instance) => {
            this.props.extra?.onPreview?.(color.toHEXA().toString());
          })
          .on('save', (color, instance) => {
            this.onChange({
              current: color.toHEXA().toString(),
              init: this.state.value,
            });
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
