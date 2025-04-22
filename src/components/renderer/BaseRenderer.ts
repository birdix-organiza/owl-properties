import { Component, type EventBus } from '@odoo/owl';
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
  // notify in bus if need
  fireChange(value: any) {
    this.env.bus.trigger(this.props.key, value);
  }
}
