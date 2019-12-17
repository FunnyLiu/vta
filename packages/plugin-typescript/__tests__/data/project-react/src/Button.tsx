/* eslint-disable */

import React from "react";
import PropTypes from "prop-types";

export declare type ButtonType = "button" | "submit" | "reset";

export declare interface ButtonProps {
  type?: ButtonType;
  children: React.ReactNode;
}

const Button: React.FunctionComponent<ButtonProps> = ({ type, children }) => {
  return <button type={type}>{children}</button>;
};
Button.propTypes = {
  type: PropTypes.oneOf<ButtonType>(["button", "submit", "reset"]),
  children: PropTypes.node.isRequired,
};

export default Button;
