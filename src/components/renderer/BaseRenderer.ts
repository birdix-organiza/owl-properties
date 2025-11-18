import { Component, type EventBus, useState, useEffect } from '@odoo/owl';

type BaseRendererProps = Omit<PropertyItem, 'readonly' | 'required'> & {
  className?: string;
  readonly: boolean;
  required: boolean;
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
    },
    readonly: {
      type: Boolean,
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

  onChange(value: any, options?: any) {
    if (this.props.readonly) return;

    if (this.props.required) {
      if (!value) {
        return;
      }
    }

    this.props.onChange?.(value, options);
    this.fireChange(value);
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
