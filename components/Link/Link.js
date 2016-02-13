import React, {PropTypes} from 'react';

import styles from './Link.less';

/**
 * Стандартная ссылка.
 *
 * Все свойства передаются в элемент *<a>*.
 */
class Link extends React.Component {
  static propTypes = {
    href: PropTypes.string,

    disabled: PropTypes.bool,
  };

  static defaultProps = {
    href: 'javascript:',
  };

  render() {
    var props = {
      className: styles.root,
      href: this.props.href,
    };
    if (this.props.disabled) {
      props.className += ' ' + styles.disabled;
      props.tabIndex = '-1';
    }
    return <a {...this.props} {...props}>{this.props.children}</a>;
  }
}

export default Link;