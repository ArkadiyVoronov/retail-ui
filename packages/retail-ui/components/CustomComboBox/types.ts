import * as React from "react";
import { Nullable } from "../../typings/utility-types";
import CustomComboBox from "./CustomComboBox";
import { ComboBoxProps } from "../ComboBox";

export type Action<T> =
  | { type: 'ValueChange'; value: T }
  | { type: 'TextChange'; value: string }
  | { type: 'KeyPress'; event: React.KeyboardEvent }
  | {
  type: 'DidUpdate';
  prevProps: CustomComboBoxProps<T>;
  prevState: CustomComboBoxState<T>;
}
  | { type: 'Mount' }
  | { type: 'Focus' }
  | { type: 'Blur' }
  | { type: 'Reset' };

export interface CustomComboBoxProps<T> extends ComboBoxProps<T> {
  openButton?: boolean;
  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseOver?: (e: React.MouseEvent) => void;
  onMouseLeave?: (e: React.MouseEvent) => void;
}

export interface CustomComboBoxState<T> {
  editing: boolean;
  loading: boolean;
  opened: boolean;
  textValue: string;
  items: Nullable<T[]>;
}

export type Effect<T> = (
  dispatch: (x0: Action<T>) => void,
  getState: () => CustomComboBoxState<T>,
  getProps: () => CustomComboBoxProps<T>,
  getInstance: () => CustomComboBox
) => void;

export type Reducer<T> = (
  state: CustomComboBoxState<T>,
  props: CustomComboBoxProps<T>,
  action: Action<T>
) => CustomComboBoxState<T> | [CustomComboBoxState<T>, Array<Effect<T>>];

export type Props<T> = CustomComboBoxProps<T>;

export const defaultState = {
  editing: false,
  items: null,
  loading: false,
  opened: false,
  textValue: ''
};
