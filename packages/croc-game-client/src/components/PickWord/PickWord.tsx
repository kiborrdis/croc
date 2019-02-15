import React from 'react';
import Section from '../Section';
import Button from '../Button';
import ApplicableInput from '../ApplicableInput';

interface PickWordProps {
  needToPick: boolean;
  pickWord: (text: string) => void;
  pickRandowWord: () => void;
}

const PickWord = (props: PickWordProps) => (
  <Section>
    {(
      props.needToPick
      ? (
        <div>
          <ApplicableInput onApply={props.pickWord} />
          <Button text={'Pick random word'} onClick={props.pickRandowWord} />
        </div>
      )
      : <div>'Waiting for word to be picked'</div>
    )}
  </Section>
);

export default PickWord;