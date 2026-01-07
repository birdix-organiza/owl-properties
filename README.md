# owl-properties

基于Odoo OWL 2的属性面板组件库

## 简介

owl-properties 是一个基于 Odoo OWL 2 框架设计的属性面板组件库，提供简洁易用的标签页切换功能，适用于需要分类展示属性或内容的场景。

## 安装

```bash
# 使用pnpm
pnpm add owl-properties

# 使用npm
npm install owl-properties

# 使用yarn
yarn add owl-properties
```

## 组件

### PropertiesPanel

属性面板主组件，提供标签页切换和内容显示功能。

#### 属性

| 属性          | 类型                  | 默认值 | 说明                       |
| ------------- | --------------------- | ------ | -------------------------- |
| defaultActive | string                | ''     | 默认激活的标签页值         |
| tabs          | Array&lt;TabProps&gt; | []     | 标签页配置数组             |
| forceRender   | boolean               | false  | 是否强制渲染所有标签页内容 |
| onChangeTab   | function              | -      | 标签页切换回调函数         |

#### TabProps类型说明

| 属性      | 类型      | 必选 | 说明                                   |
| --------- | --------- | ---- | -------------------------------------- |
| label     | string    | 是   | 标签页显示的文本                       |
| value     | string    | 是   | 标签页的唯一标识                       |
| component | Component | 否   | 标签页内容对应的组件                   |
| props     | Object    | 否   | 传递给组件的属性                       |
| icon      | string    | 否   | 标签页图标html片段，需要使用markup包裹 |

#### 使用示例

```javascript
import { PropertiesPanel } from 'owl-properties';
import { Component, markup } from '@odoo/owl';

class MyComponent extends Component {
  static components = { PropertiesPanel };

  static template = xml`
    <PropertiesPanel 
      defaultActive="'tab1'" 
      tabs="tabs" 
      onChangeTab.bind="onTabChange"
    />
  `;

  setup() {
    this.tabs = [
      {
        label: '标签1',
        value: 'tab1',
        component: TabContent1,
        props: {
          /* 传递给组件的属性 */
        },
      },
      {
        label: '标签2',
        value: 'tab2',
        component: TabContent2,
        icon: markup('<span>icon</span>'),
      },
    ];

    this.onTabChange = (tabValue) => {
      console.log('当前激活标签:', tabValue);
    };
  }
}
```

### Tab

标签页组件，用于显示和切换标签。

#### 属性

| 属性      | 类型                  | 默认值 | 说明               |
| --------- | --------------------- | ------ | ------------------ |
| active    | string                | -      | 当前激活的标签页值 |
| tabs      | Array&lt;TabProps&gt; | -      | 标签页配置数组     |
| onChange  | function              | -      | 标签页切换回调函数 |
| className | string                | -      | 自定义类名         |

### Empty

空状态组件，当没有内容时显示。

## 开发

```bash
# 安装依赖
pnpm install

# 启动开发服务
pnpm start

# 构建
pnpm build

# 代码检查
pnpm eslint
```

## 许可证

MIT
