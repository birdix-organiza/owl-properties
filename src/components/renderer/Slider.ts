import { useRef, useState, xml } from '@odoo/owl';
import { BaseRenderer } from './BaseRenderer';

export class Slider extends BaseRenderer {
  static template = xml`
    <div class="slider" t-att-class="props.className">
      <div class="pro-slider"
           t-on-mousedown="onTrackMouseDown"
           t-ref="track">
        <div class="pro-slider-rail"></div>
        <div class="pro-slider-track" t-att-style="'width: ' + getPercent() + '%'"/>
        <div class="pro-slider-handle"
             t-att-style="'left: ' + getPercent() + '%'"
             t-on-mouseenter="onHandleMouseEnter"
             t-on-mouseleave="onHandleMouseLeave"
             t-on-mousedown="onHandleMouseDown"
             t-on-focus="onHandleFocus"
             t-on-blur="onHandleBlur"
             t-ref="handle"
             tabindex="0"
             t-att-class="{'active': sliderState.dragging || sliderState.focused}">
          <t t-if="props.extra?.showBubble || sliderState.showBubble || sliderState.dragging || sliderState.focused">
            <div class="pro-slider-bubble">
              <t t-esc="formatValue(state.value)"/>
            </div>
          </t>
        </div>
      </div>
    </div>
  `;

  trackRef = useRef<HTMLElement>('track');

  get decimals() {
    return this.props.extra?.decimals ?? 0;
  }

  format(value: any) {
    return value ?? this.min;
  }

  formatValue(value: number) {
    return this.props.extra?.format ? this.props.extra.format(value) : value.toFixed(this.decimals);
  }

  get min() {
    return this.props.extra?.min ?? 0;
  }

  get max() {
    return this.props.extra?.max ?? 100;
  }

  get step() {
    return this.props.extra?.step ?? 1;
  }

  sliderState = useState({
    showBubble: false,
    dragging: false,
    focused: false,
  });

  getPercent() {
    return ((this.state.value - this.min) / (this.max - this.min)) * 100;
  }

  setValueFromPosition(clientX: number) {
    const track = this.trackRef.el;
    const rect = track.getBoundingClientRect();
    let percent = (clientX - rect.left) / rect.width;
    percent = Math.max(0, Math.min(1, percent));
    let value = this.min + percent * (this.max - this.min);
    // Snap to step
    value = Math.round(value / this.step) * this.step;
    value = Math.max(this.min, Math.min(this.max, value));
    this.state.value = value;
    this.props.onChange?.(value, {
      isInputing: true,
    });
    this.fireChange(value);
  }

  handleDragStart() {
    this.sliderState.dragging = true;
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  onTrackMouseDown(ev: MouseEvent) {
    if (this.readonly) return;
    this.setValueFromPosition(ev.clientX);
    this.handleDragStart();
  }

  onHandleMouseDown(ev: MouseEvent) {
    if (this.readonly) return;
    ev.stopPropagation();
    this.handleDragStart();
  }

  onMouseMove = (ev: MouseEvent) => {
    if (!this.sliderState.dragging) return;
    this.setValueFromPosition(ev.clientX);
  };

  onMouseUp = () => {
    this.sliderState.dragging = false;
    this.props.onChange?.(this.state.value);
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  };

  onHandleMouseEnter = () => {
    this.sliderState.showBubble = true;
  };

  onHandleMouseLeave = () => {
    this.sliderState.showBubble = false;
  };

  onHandleFocus = () => {
    this.sliderState.focused = true;
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);
  };

  onHandleBlur = () => {
    this.sliderState.focused = false;
    document.removeEventListener('keydown', this.onKeyDown);
    document.removeEventListener('keyup', this.onKeyUp);
    this.clearKeyInterval();
  };

  keyInterval: number | null = null;

  keyTimeout: number | null = null;

  keyDirection: 1 | -1 | null = null;

  onKeyDown = (ev: KeyboardEvent) => {
    if (!this.sliderState.focused) return;
    if (ev.key === 'ArrowLeft' || ev.key === 'ArrowRight') {
      ev.preventDefault();
      const direction = ev.key === 'ArrowLeft' ? -1 : 1;
      if (this.keyDirection !== direction) {
        this.keyDirection = direction;
        this.changeValueByStep(direction);
        this.clearKeyInterval();
        this.keyTimeout = window.setTimeout(() => {
          this.keyInterval = window.setInterval(() => {
            this.changeValueByStep(direction);
          }, 60);
        }, 400);
      }
    }
  };

  onKeyUp = (ev: KeyboardEvent) => {
    if (ev.key === 'ArrowLeft' || ev.key === 'ArrowRight') {
      this.clearKeyInterval();
      this.keyDirection = null;
      this.props.onChange?.(this.state.value);
    }
  };

  clearKeyInterval() {
    if (this.keyInterval) {
      clearInterval(this.keyInterval);
      this.keyInterval = null;
    }
    if (this.keyTimeout) {
      clearTimeout(this.keyTimeout);
      this.keyTimeout = null;
    }
  }

  changeValueByStep(direction: 1 | -1) {
    let value = this.state.value + direction * this.step;
    value = Math.max(this.min, Math.min(this.max, value));
    if (value !== this.state.value) {
      this.state.value = value;
      this.props.onChange?.(value, {
        isInputing: true,
      });
      this.fireChange(value);
    }
  }
}
