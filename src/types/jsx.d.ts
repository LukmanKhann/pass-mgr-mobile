import React from 'react';

/**
 * Global JSX namespace augmentation so component signatures can use
 * `JSX.Element` as the return type annotation without importing React.JSX
 * everywhere (React 19 moved the JSX namespace under React.JSX).
 */
declare global {
  namespace JSX {
    type Element = React.JSX.Element;
    type ElementClass = React.JSX.ElementClass;
    type IntrinsicElements = React.JSX.IntrinsicElements;
  }
}

export {};