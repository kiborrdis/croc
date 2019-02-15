import React, { ReactElement } from 'react';
import classNames from 'classnames';
import './Section.css';

interface SectionProps {
  children: ReactElement<any>[] | ReactElement<any> | string,
  className?: string,
};

const Section = (props: SectionProps) => (
  <div className={classNames('Section', props.className)}>
    {props.children}
  </div>
);

export default Section;
