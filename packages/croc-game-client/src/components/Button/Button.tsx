import React, { MouseEventHandler } from 'react';

interface ButtonProps {
  text: string;
  onClick?: MouseEventHandler;
}

const Button = (props: ButtonProps) => {
  const { text, ...rest } = props;

  return (
    <button {...rest}>
      {text}
    </button>
  );
};

export default Button;
