import _classNames from 'classnames';

const PREFIX = 'pro';

type Value = string | number | boolean | undefined | null;
type Mapping = { [key: string]: Value | boolean };
type Argument = Value | Mapping | Array<Value | Mapping>;

/**
 * 自定义className合并函数，用于给带&的className添加前缀
 * @param names - className参数
 * @returns 合并后的className字符串
 */
export const classNames = (...names: Argument[]): string => {
  const result = _classNames(...names);
  if (result === '') {
    return '';
  }
  return result
    .split(' ')
    .map((name) => {
      if (name.startsWith('&')) {
        return `${PREFIX}-${name.slice(1)}`;
      }
      return name;
    })
    .join(' ');
};
