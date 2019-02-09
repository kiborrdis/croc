import React, { ChangeEvent, RefObject, FocusEventHandler, ChangeEventHandler } from 'react';

interface InputProps {
  value?: string;
  placeholder?: string;
  onChange?: ChangeEventHandler;
  onBlur?: FocusEventHandler;
  onFocus?: FocusEventHandler;
  inputRef?: RefObject<HTMLInputElement>;

}

const TextInput = (props: InputProps) => {
  const { inputRef, ...rest } = props;

  return (
    <input {...rest}/>
  );
}

export default TextInput;

