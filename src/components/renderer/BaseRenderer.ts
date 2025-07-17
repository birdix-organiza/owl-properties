import { Component, type EventBus, useState, useEffect } from '@odoo/owl';
import { PropertyRendererProps } from '../properties-wrapper/PropertyRenderer';

type BaseRendererProps = PropertyRendererProps['property'] & {
  className?: string;
};

export class BaseRenderer extends Component<
  BaseRendererProps,
  {
    bus: EventBus;
  }
> {
  static props = {
    span: {
      type: Number,
      optional: true,
    },
    label: String,
    key: String,
    placeholder: {
      type: String,
      optional: true,
    },
    value: {
      optional: true,
    },
    type: {
      type: String,
      optional: true,
    },
    extra: {
      type: Object,
      optional: true,
    },
    required: {
      type: Boolean,
      optional: true,
    },
    readonly: {
      type: Function,
      optional: true,
    },
    onChange: {
      type: Function,
      optional: true,
    },
    className: {
      type: String,
      optional: true,
    },
  };

  get readonly() {
    return this.props.readonly?.();
  }

  state = useState({
    value: this.format(this.props.value),
  });

  /**
   * inherit this func to change the render value
   * @param value
   * @returns
   */
  format(value: any) {
    return value;
  }

  // notify in bus if need
  fireChange(value: any) {
    this.env.bus.trigger(this.props.key, value);
  }

  setup(): void {
    useEffect(
      () => {
        this.state.value = this.format(this.props.value);
      },
      () => [this.props.value],
    );
  }
}
