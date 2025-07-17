import { xml } from '@odoo/owl';
import { BaseRenderer } from './BaseRenderer';

export class Number extends BaseRenderer {
  static template = xml`
<input
    class="input"
    t-att-class="props.className"
    t-att-disabled="readonly"
    t-model="state.value"
    type="number"
    t-att-placeholder="props.placeholder"
    t-att-step="props.extra?.step"
    t-att-min="props.extra?.min"
    t-att-max="props.extra?.max"
    t-on-change="onChangeFloat"
/>
  `;

  format(value: any) {
    return this.numberFormatter(value);
  }

  getDecimals() {
    return this.props.extra?.decimals ?? 1;
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
    const newValue = this.numberFormatter(val);
    this.state.value = newValue;
    this.props.onChange?.(newValue);
    this.fireChange(newValue);
  }
}
