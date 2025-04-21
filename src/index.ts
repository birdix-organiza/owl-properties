import { Component, xml, useState } from '@odoo/owl';
import { Tab, TabItemShape } from '@/components/tab/Tab';
import { classNames } from '@/utils/classNames';
import { Empty } from '@/components/empty/Empty';
import {
  PropertiesWrapper,
  BaseProperty,
  PropertyWithHiddenShape,
} from '@/components/properties-wrapper/PropertiesWrapper';
import './index.scss';

export interface TabProps {
  label: string;
  key: string;
  icon?: string;
  component?: Component;
  props?: Record<string, any>;
  properties?: Array<BaseProperty>;
}

export interface PropertiesPanelProps {
  defaultActive?: string;
  tabs?: Array<TabProps>;
  forceRender?: boolean;
  onChangeTab?: (tab: string) => void;
}

/**
 * Tab属性验证器
 */
export const TabShape = {
  label: String,
  key: String,
  icon: {
    type: String,
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
export const PropertiesPanelPropsValidator = {
  defaultActive: {
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
};

export class PropertiesPanel extends Component<PropertiesPanelProps> {
  static props = PropertiesPanelPropsValidator;

  static defaultProps = {
    defaultActive: '',
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
      <PropertiesWrapper properties="tab.properties"/>
    </t>
  `;

  static template = xml`
    <div class="${classNames('&properties-panel')}">
      <div t-if="props.tabs.length" class="${classNames('&properties-tabs-container')}">
        <Tab tabs="omitProps()" active="state.active" onChange.bind="onChangeTab" className="'${classNames('&properties-tab')}'"/>
        <div class="${classNames('&properties-tab-content-container')}">
          <t t-if="props.forceRender">
            <div t-foreach="props.tabs" t-as="tab" t-key="tab.key" 
               class="${classNames('&properties-tab-content')}"
               t-att-class="{ invisible: state.active !== tab.key, '${classNames('&properties-tab-active')}': state.active === tab.key }">
              ${PropertiesPanel.componentTemplate}
            </div>
          </t>
          <t t-else="">
            <t t-foreach="props.tabs.filter((tab) => tab.key === state.active)" t-as="tab" t-key="tab.key">
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

  state = useState({
    active: this.props.defaultActive,
  });

  omitProps() {
    return this.props.tabs.map(({ label, key, icon }) => {
      return {
        label,
        key,
        icon,
      };
    });
  }

  onChangeTab(key: string) {
    this.state.active = key;
    this.props.onChangeTab?.(key);
  }
}
