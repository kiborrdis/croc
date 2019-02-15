import React, { ReactNode } from 'react';
import classNames from 'classnames';
import './Section.css';

interface SectionProps {
  children: ReactNode;
  className?: string;
  tight?: boolean;
};

const Section = (props: SectionProps) => (
  <div className={classNames('Section', props.className, {
    'Section--tight': props.tight,
  })}>
    {props.children}
  </div>
);

export default Section;
