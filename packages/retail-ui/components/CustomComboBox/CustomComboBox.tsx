import * as React from 'react';

import ComboBoxView from './ComboBoxView';
import { Nullable } from '../../typings/utility-types';
import Input from '../Input';
import Menu from '../Menu/Menu';
import InputLikeText from '../internal/InputLikeText';
import shallow from 'fbjs/lib/shallowEqual';
import createReducer from "./reducer";
import { Reducer, reducers as defaultReducers } from "./reducer/default";
import { reducers as autocompleteReducers } from "./reducer/autocomplete";
import { Action, CustomComboBoxState, defaultState, Effect, Props } from "./types";

const defaultReducer = createReducer(defaultReducers);
const autocompleteReducer = createReducer(autocompleteReducers);

class CustomComboBox extends React.Component<
  Props<any>,
  CustomComboBoxState<any>
> {
  public state: CustomComboBoxState<any> = defaultState;
  public input: Nullable<Input>;
  public menu: Nullable<Menu>;
  public inputLikeText: Nullable<InputLikeText>;
  public focused: boolean = false;

  /**
   * @public
   */
  public focus = () => {
    if (this.props.disabled) {
      return;
    }

    this.handleFocus();
  };

  /**
   * @public
   */
  public blur = () => {
    if (this.props.disabled) {
      return;
    }

    this.handleBlur();
  };

  public render() {
    const viewProps = {
      align: this.props.align,
      borderless: this.props.borderless,
      disabled: this.props.disabled,
      disablePortal: this.props.disablePortal,
      editing: this.state.editing,
      error: this.props.error,
      items: this.state.items,
      loading: this.state.loading,
      menuAlign: this.props.menuAlign,
      opened: this.state.opened,
      openButton: !this.props.autocomplete,
      placeholder: this.props.placeholder,
      size: this.props.size,
      textValue: this.state.textValue,
      totalCount: this.props.totalCount,
      value: this.props.value,
      warning: this.props.warning,
      width: this.props.width,
      maxLength: this.props.maxLength,
      maxMenuHeight: this.props.maxMenuHeight,

      onChange: (value: any) => this.dispatch({ type: 'ValueChange', value }),
      onClickOutside: this.handleBlur,
      onFocus: this.handleFocus,
      onFocusOutside: this.handleBlur,
      onInputBlur: this.handleInputBlur,
      onInputChange: (_: any, value: string) =>
        this.dispatch({ type: 'TextChange', value }),
      onInputFocus: this.handleFocus,
      onInputKeyDown: (event: React.KeyboardEvent) => {
        event.persist();
        this.dispatch({ type: 'KeyPress', event });
        if (this.props.onKeyDown){
          this.props.onKeyDown(event)
        }
      },
      onPaste: this.props.onPaste,
      onMouseEnter: this.props.onMouseEnter,
      onMouseOver: this.props.onMouseOver,
      onMouseLeave: this.props.onMouseLeave,
      renderItem: this.props.renderItem,
      renderNotFound: this.props.renderNotFound,
      renderValue: this.props.renderValue,
      renderTotalCount: this.props.renderTotalCount,

      refInput: (input: Nullable<Input>) => {
        this.input = input;
      },
      refMenu: (menu: Nullable<Menu>) => {
        this.menu = menu;
      },
      refInputLikeText: (inputLikeText: Nullable<InputLikeText>) => {
        this.inputLikeText = inputLikeText;
      }
    };

    return <ComboBoxView {...viewProps} />;
  }

  public componentDidMount() {
    this.dispatch({ type: 'Mount' });
    if (this.props.autoFocus) {
      this.focus();
    }
  }

  public shouldComponentUpdate(
    nextProps: Props<any>,
    nextState: CustomComboBoxState<any>
  ) {
    return !shallow(nextProps, this.props) || !shallow(nextState, this.state);
  }

  public componentDidUpdate(prevProps: any, prevState: any) {
    if (prevState.editing && !this.state.editing) {
      this.handleBlur();
    }

    this.dispatch({ type: 'DidUpdate', prevProps, prevState });
  }

  /**
   * @public
   */
  public reset() {
    this.dispatch({ type: 'Reset' });
  }

  private dispatch = (action: Action<any>) => {
    let effects: Array<Effect<any>>;
    // todo: слишком много any
    const reducer = this.props.autocomplete
      ? autocompleteReducer as Reducer
      : defaultReducer as any;

    this.setState(
      state => {
        let nextState;
        let stateAndEffect = reducer(state, this.props, action);
        if (!Array.isArray(stateAndEffect)) {
          stateAndEffect = [stateAndEffect, []];
        }
        [nextState, effects] = stateAndEffect;
        return nextState;
      },
      () => {
        effects.forEach(this.handleEffect);
      }
    );
  };

  private handleEffect = (effect: Effect<any>) => {
    effect(this.dispatch, this.getState, this.getProps, () => this);
  };

  private getProps = () => this.props;

  private getState = () => this.state;

  private handleFocus = () => {
    if (this.focused) {
      return;
    }
    this.focused = true;
    this.dispatch({ type: 'Focus' });
  };

  private handleBlur = () => {
    if (!this.focused) {
      return;
    }
    this.focused = false;
    this.dispatch({ type: 'Blur' });
  };

  private handleInputBlur = () => {
    // If menu opened, RenderLayer is active and
    // it would call handleFocusOutside
    // In that way handleBlur would be called
    if (this.state.opened) {
      return;
    }

    this.handleBlur();
  };
}

export default CustomComboBox;
