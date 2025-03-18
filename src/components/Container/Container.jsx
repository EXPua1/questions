import React from 'react';
import css from './Container.module.css';

const Container = ({ children, className = '', style = {} }) => {
  return (
    <div className={`${css.container} ${className}`} style={style}>
      {children}
    </div>
  );
};

export default Container;
