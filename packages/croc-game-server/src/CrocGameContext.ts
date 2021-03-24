import { buildActionMessage } from 'croc-messages';
import { Actions } from 'croc-actions';
import { GameContext } from './GameContext';
import { CrocGameData } from './CrocGameData';
import { CrocGameStateActions } from './states/CrocGameState';

export class CrocGameContext extends GameContext<
  CrocGameStateActions,
  CrocGameData
> {
  public handleMessage(
    fromId: string,
    message: CrocGameStateActions[keyof CrocGameStateActions],
  ): void {
    if (!message) {
      return;
    }

    if (message.type === 'newPlayer') {
      this.state.triggerAction('playerConnected', message, fromId);
    } else if (message.type === 'disconnected') {
      this.state.triggerAction('playerDisconnected', message, fromId);
    } else if (message.type === 'deletePlayer') {
      this.state.triggerAction('playerDeleted', message, fromId);
    } else {
      this.state.triggerAction(message.type, message, fromId);
    }
  }

  public sendActionToAll(action: Actions, fromId = 'server'): void {
    this.responder.enqueueResponseForAll([buildActionMessage(action, fromId)]);
  }

  public sendActionTo(toId: string, action: Actions, fromId = 'server'): void {
    this.responder.enqueueResponseForOne(toId, [
      buildActionMessage(action, fromId),
    ]);
  }

  public sendActionToAllButOne(
    onesId: string,
    action: Actions,
    fromId = 'server',
  ): void {
    this.responder.enqueueResponseForAllButOne(onesId, [
      buildActionMessage(action, fromId),
    ]);
  }

  private wordGetter: RandomWordGetter | undefined;

  public getRandomWord(): string {
    if (!this.data.gameSettings?.wordBase) {
      return '';
    }

    if (
      !this.wordGetter ||
      !this.wordGetter.isSameBase(this.data.gameSettings.wordBase)
    ) {
      this.wordGetter = new RandomWordGetter(this.data.gameSettings.wordBase);
    }

    return this.wordGetter.getWord();
  }
}

class RandomWordGetter {
  private wordbase: string[];
  private shuffledIndexes: number[] = [];
  private currentIndex = 0;

  constructor(wordbase: string[]) {
    this.wordbase = wordbase;
    this.createShuffledIndexes();
  }

  private createShuffledIndexes() {
    this.shuffledIndexes = this.wordbase
      .map((_, index) => index)
      .sort(() => Math.random() - 0.5);
  }

  public isSameBase(wordbase: string[]) {
    return wordbase === this.wordbase;
  }

  public getWord(): string {
    if (this.currentIndex >= this.shuffledIndexes.length) {
      this.createShuffledIndexes();
    }

    return this.wordbase[this.currentIndex++];
  }
}
