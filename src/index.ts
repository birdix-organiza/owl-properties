import { Component, xml, useState, useEffect, useSubEnv, EventBus, onRendered, reactive } from '@odoo/owl';
import { classNames } from './utils/classNames';
import { BaseRenderer } from './components/renderer/BaseRenderer';
import { Input } from './components/renderer/Input';
import { Number } from './components/renderer/Number';
import { Select } from './components/renderer/Select';
import { Text } from './components/renderer/Text';
import { Switch } from './components/renderer/Switch';
import { Slider } from './components/renderer/Slider';
import { PropertiesWrapper } from './components/properties/PropertiesWrapper';
import type { PropertyItem, TabItem } from './type';

import './index.scss';

interface PropertiesPanelProps {
  tabs: TabItem[];
  active: string;
  onChangeTab?: (key: string) => void;
  forceRender?: boolean;
  ref?: (ref: PropertiesPanel) => void;
  bus?: EventBus;
}

const registry = new Map<string, typeof BaseRenderer>();

class PropertiesPanel extends Component<PropertiesPanelProps> {
  static props = {
    tabs: {
      type: Array,
      optional: true,
    },
    active: {
      type: String,
      optional: true,
    },
    onChangeTab: {
      type: Function,
      optional: true,
    },
    forceRender: {
      type: Boolean,
      optional: true,
    },
    ref: {
      type: Function,
      optional: true,
    },
    bus: {
      type: Object,
      optional: true,
    },
  };

  static defaultProps = {
    tabs: [],
    forceRender: false,
    bus: new EventBus(),
  };

  static components = {
    PropertiesWrapper,
  };

  state = useState({
    activeTab: this.props.active || this.props.tabs[0]?.key,
  });

  get currentTab() {
    // 首先尝试找到当前激活且可见的tab
    const activeVisibleTab = this.props.tabs.find((tab) => tab.key === this.state.activeTab && this.isTabVisible(tab));

    if (activeVisibleTab) {
      return activeVisibleTab;
    }

    // 如果没有找到，则返回第一个可见的tab
    return this.props.tabs.find((tab) => this.isTabVisible(tab));
  }

  isTabVisible(tab: TabItem) {
    // 如果tab有自定义组件，则始终显示
    if (tab.component) {
      return true;
    }

    // 如果tab没有properties或properties为空数组，则不显示
    if (!tab.properties || tab.properties.length === 0) {
      return false;
    }

    // 如果所有属性都是invisible，则不显示该tab
    return !tab.properties.every((property) => property.invisible?.());
  }

  get visibleTabs() {
    return this.props.tabs.filter((tab) => this.isTabVisible(tab));
  }

  switchTab(key: string) {
    this.state.activeTab = key;
    this.props.onChangeTab?.(key);
  }

  setup() {
    useEffect(
      () => {
        this.props.ref?.(this);
      },
      () => [],
    );

    useEffect(
      () => {
        if (this.props.active) {
          this.state.activeTab = this.props.active;
        }
      },
      () => [this.props.active],
    );

    useSubEnv({
      registry,
      bus: this.props.bus,
    });
  }

  static componentTemplate = `
    <t t-if="tab.component" t-component="tab.component" t-props="tab"/>
    <t t-else="">
      <PropertiesWrapper tab="tab"/>
    </t>
  `;

  static template = xml`
<div class="${classNames('&properties-panel')}">
  <div class="${classNames('&properties-panel-tabs')}">
    <div class="${classNames('&properties-panel-tabs-inner')}">
      <t t-foreach="visibleTabs" t-as="tab" t-key="tab.key">
        <div
          class="${classNames('&properties-panel-tab')}"
          t-att-class="{'active': this.state.activeTab === tab.key}"
          t-on-click="() => this.switchTab(tab.key)"
        >
          <t t-esc="tab.label"/>
        </div>
      </t>
    </div>
  </div>
  
  <div class="${classNames('&properties-panel-content')}">
    <t t-if="props.forceRender">
      <div t-foreach="visibleTabs" t-as="tab" t-key="tab.key"
        class="${classNames('&properties-panel-tab-content')}"
        t-att-class="{ active: state.activeTab === tab.key }">
        ${PropertiesPanel.componentTemplate}
      </div>
    </t>
    <t t-else="">
      <t t-set="tab" t-value="currentTab"/>
      <div t-if="currentTab" class="${classNames('&properties-panel-tab-content', 'active')}">
        ${PropertiesPanel.componentTemplate}
      </div>
    </t>
  </div>
</div>
  `;
}

registry.set('input', Input);
registry.set('text', Text);
registry.set('number', Number);
registry.set('select', Select);
registry.set('switch', Switch);
registry.set('slider', Slider);

export { BaseRenderer, PropertiesPanel, registry };
export type { PropertyItem, TabItem };
