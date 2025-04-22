import { xml } from '@odoo/owl';
import { BaseRenderer } from './BaseRenderer';

export class Number extends BaseRenderer {
  static template = xml`
<input
    class="input"
    t-att-class="props.className"
    t-att-disabled="props.readonly"
    t-att-value="this.numberFormatter(props.value?.())"
    type="number"
    t-att-step="props.extra.step"
    t-att-min="props.extra.min"
    t-att-max="props.extra.max"
    t-on-change="onChangeFloat"
/>
  `;

  getDecimals() {
    return this.props.extra.decimals ?? 1;
  }

  numberFormatter(value?: number) {
    if (value === undefined) {
      return '';
    }
    return value.toFixed(this.getDecimals());
  }

  onChangeFloat(ev: Event) {
    let val = parseFloat((ev.target as HTMLInputElement).value);
    if (isNaN(val)) {
      val = 0;
    }
    const decimals = this.getDecimals();
    const factor = Math.pow(10, decimals);
    // 根据指定的小数位数进行四舍五入
    val = Math.round(val * factor) / factor;
    (ev.target as HTMLInputElement).value = val.toString();
    this.props.onChange?.(val);
  }
}
