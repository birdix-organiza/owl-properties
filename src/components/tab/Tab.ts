import { Component, xml, useState, onMounted, onPatched, useRef } from '@odoo/owl';
import './Tab.scss';
import { classNames } from '../../utils/classNames';

export interface TabsProps {
  active?: string;
  tabs?: Array<{
    label: string;
    key: string;
    icon?: string;
  }>;
  onChange?: (value: string) => void;
  className?: string;
}

/**
 * Tab项目验证器
 */
export const TabItemShape = {
  label: String,
  key: String,
  icon: {
    type: String,
    optional: true,
  },
};

/**
 * Tab组件的验证器
 */
export const TabPropsValidator = {
  className: {
    type: String,
    optional: true,
  },
  active: {
    type: String,
    optional: true,
  },
  tabs: {
    type: Array,
    optional: true,
    element: {
      type: Object,
      shape: TabItemShape,
    },
  },
  onChange: {
    type: Function,
    optional: true,
  },
};

export class Tab extends Component<TabsProps> {
  state: {
    indicatorStyle: string;
  };

  tabContainerRef = useRef('tabContainer');

  tabIndicatorRef = useRef('tabIndicator');

  static props = TabPropsValidator;

  static template = xml`
    <div class="${classNames('&tab')}" t-att-class="props.className">
      <div class="${classNames('&tab-container')}" t-ref="tabContainer">
        <t t-foreach="props.tabs || []" t-as="tab" t-key="tab.key">
          <div 
            class="${classNames('&tab-item')}" 
            t-att-class="{'active': props.active === tab.key}"
            t-on-click="() => this.onTabClick(tab.key)"
            t-att-data-value="tab.key"
          >
            <t t-if="tab.icon">
              <span class="${classNames('&tab-icon')} material-icons">
                <t t-out="tab.icon"/>
              </span>
            </t>
            <span class="${classNames('&tab-label')}"><t t-esc="tab.label"/></span>
          </div>
        </t>
        <div 
          class="${classNames('&tab-indicator')}"
          t-ref="tabIndicator"
          t-att-style="state.indicatorStyle"
        />
      </div>
    </div>
  `;

  setup() {
    this.state = useState({
      indicatorStyle: 'display: none;',
    });

    onMounted(() => {
      this.updateIndicator();
    });

    onPatched(() => {
      this.updateIndicator();
    });
  }

  /**
   * 更新指示器位置
   */
  updateIndicator() {
    const activeTab = this.props.active;
    if (!activeTab || !this.props.tabs || !this.props.tabs.length) {
      this.state.indicatorStyle = 'display: none;';
      return;
    }

    // 使用容器引用和选择器查找活动标签
    if (this.tabContainerRef.el) {
      const container = this.tabContainerRef.el;
      const activeTabElement = container.querySelector(
        `.${classNames('&tab-item').replace('&', 'pro-')}[data-value="${activeTab}"]`,
      ) as HTMLElement;

      if (activeTabElement) {
        // 计算指示器位置
        const { offsetLeft, offsetWidth } = activeTabElement;

        // 确保活动标签在可视区域中
        this.scrollTabIntoView(activeTabElement, container);

        // 设置指示器位置 - 因为指示器现在在容器内部，不需要调整滚动偏移
        this.state.indicatorStyle = `left: ${offsetLeft}px; width: ${offsetWidth}px;`;
      }
    }
  }

  /**
   * 确保选中的标签在可视区域内
   */
  scrollTabIntoView(tabElement: HTMLElement, container: HTMLElement) {
    const tabLeft = tabElement.offsetLeft;
    const tabRight = tabLeft + tabElement.offsetWidth;
    const containerLeft = container.scrollLeft;
    const containerRight = containerLeft + container.offsetWidth;

    if (tabLeft < containerLeft) {
      // 如果标签在可视区域左侧外部，滚动到可以看到它
      container.scrollLeft = tabLeft;
    } else if (tabRight > containerRight) {
      // 如果标签在可视区域右侧外部，滚动到可以看到它
      container.scrollLeft = tabRight - container.offsetWidth;
    }
  }

  onTabClick(key: string) {
    if (this.props.onChange && key !== this.props.active) {
      this.props.onChange(key);
    }
  }
}
