import { Component, EventBus, useSubEnv, xml } from '@odoo/owl';
import { Empty } from './components/empty/Empty';
import {
  BaseProperty,
  PropertiesWrapper,
  PropertyWithHiddenShape,
} from './components/properties-wrapper/PropertiesWrapper';
import { BaseRenderer } from './components/renderer/BaseRenderer';
import { Input } from './components/renderer/Input';
import { Number } from './components/renderer/Number';
import { Select } from './components/renderer/Select';
import { Text } from './components/renderer/Text';
import { Tab } from './components/tab/Tab';
import { Switch } from './components/renderer/Switch';
import { Slider } from './components/renderer/Slider';
import './index.scss';
import { classNames } from './utils/classNames';

export interface TabProps {
  label: string;
  key: string;
  icon?: string;
  cols?: number;
  component?: Component;
  props?: Record<string, any>;
  properties?: Array<BaseProperty>;
}

export interface PropertiesPanelProps {
  active?: string;
  tabs?: Array<TabProps>;
  forceRender?: boolean;
  onChangeTab?: (tab: string) => void;
  ref?: (instance: PropertiesPanel) => void;
}

/**
 * Tab属性验证器
 */
const TabShape = {
  label: String,
  key: String,
  icon: {
    type: String,
    optional: true,
  },
  cols: {
    type: Number,
    optional: true,
  },
  component: {
    type: Function,
    optional: true,
  },
  props: {
    type: Object,
    optional: true,
  },
  properties: {
    type: Array,
    optional: true,
    element: {
      type: Object,
      shape: PropertyWithHiddenShape,
    },
  },
};

/**
 * 属性面板的Props验证器
 */
const PropertiesPanelPropsValidator = {
  active: {
    type: String,
    optional: true,
  },
  tabs: {
    type: Array,
    optional: true,
    element: {
      type: Object,
      shape: TabShape,
    },
  },
  forceRender: {
    type: Boolean,
    optional: true,
  },
  onChangeTab: {
    type: Function,
    optional: true,
  },
  ref: {
    type: Function,
    optional: true,
  },
};

const registry = new Map<string, typeof BaseRenderer>();

class PropertiesPanel extends Component<PropertiesPanelProps> {
  static props = PropertiesPanelPropsValidator;

  static defaultProps = {
    active: '',
    tabs: [],
    forceRender: false,
  };

  static components = {
    Tab,
    Empty,
    PropertiesWrapper,
  };

  static componentTemplate = `
    <t t-if="tab.component" t-component="tab.component" t-props="tab.props"/>
    <t t-else="">
      <PropertiesWrapper properties="tab.properties" cols="tab.cols"/>
    </t>
  `;

  static template = xml`
    <div class="${classNames('&properties-panel')}">
      <div t-if="props.tabs.length" class="${classNames('&properties-tabs-container')}">
        <Tab tabs="omitProps()" active="props.active" onChange="props.onChangeTab" className="'${classNames('&properties-tab')}'"/>
        <div class="${classNames('&properties-tab-content-container')}">
          <t t-if="props.forceRender">
            <div t-foreach="props.tabs" t-as="tab" t-key="tab.key" 
               class="${classNames('&properties-tab-content')}"
               t-att-class="{ invisible: props.active !== tab.key, '${classNames('&properties-tab-active')}': props.active === tab.key }">
              ${PropertiesPanel.componentTemplate}
            </div>
          </t>
          <t t-else="">
            <t t-foreach="props.tabs.filter((tab) => tab.key === props.active)" t-as="tab" t-key="tab.key">
              <div class="${classNames('&properties-tab-content')} ${classNames('&properties-tab-active')}">
                ${PropertiesPanel.componentTemplate}
              </div>
            </t>
          </t>
        </div>
      </div>
      <div t-else="" class="${classNames('&properties-empty-wrapper')}" style="height: 100%; position: relative;">
        <Empty />
      </div>
    </div>
  `;

  bus: EventBus;

  omitProps() {
    return this.props.tabs.map(({ label, key, icon }) => {
      return {
        label,
        key,
        icon,
      };
    });
  }

  setup(): void {
    this.props.ref?.(this);
    this.bus = new EventBus();
    useSubEnv({
      registry,
      bus: this.bus,
    });
  }
}

registry.set('input', Input);
registry.set('text', Text);
registry.set('number', Number);
registry.set('select', Select);
registry.set('switch', Switch);
registry.set('slider', Slider);

export { BaseRenderer, PropertiesPanel, registry };
