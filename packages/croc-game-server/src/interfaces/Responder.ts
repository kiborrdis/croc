import { Message } from 'croc-messages';

export interface Responder {
  enqueueResponseForAll(messages: Message[]): void;
  enqueueResponseForOne(id: string, messages: Message[]): void;
  enqueueResponseForAllButOne(id: string, messages: Message[]): void;
}
