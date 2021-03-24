import { buildActionMessage, AnyMessage, isActionMessage } from 'croc-messages';
import { Actions } from 'croc-actions';
import { Responder } from './interfaces/Responder';
import { Game } from './Game';
import { CrocGameData } from './CrocGameData';
import { CrocGameContext } from './CrocGameContext';
import { WaitState } from './states/WaitState';
import { CrocGameStateActions } from './states/CrocGameState';

interface CrocGameConfig {
  reconnectionTimeout: number;
  timeForRound: number;
  pickWord: () => string;
  pickLeaderStrategy: (playerIds: string[]) => string;
}

export class CrocGame extends Game<CrocGameStateActions, CrocGameData> {
  constructor(params: {
    responder: Responder;
    config: CrocGameConfig;
    gameDataInitializer: () => CrocGameData;
  }) {
    super({
      responder: params.responder,
      gameDataInitializer: params.gameDataInitializer,
      config: {
        reconnectionTimeout: params.config.reconnectionTimeout,
        deletePlayerMessageCreator: (id: string) => {
          return (buildActionMessage(
            Actions.deletePlayer(id),
            'server',
          ) as unknown) as AnyMessage;
        },
        addPlayersMessageCreator: (players) => {
          return (buildActionMessage(
            Actions.addPlayers(players),
            'server',
          ) as unknown) as AnyMessage;
        },
      },
    });

    this.data.pickWord = params.config.pickWord;
    this.data.pickLeaderStrategy = params.config.pickLeaderStrategy;
    this.data.timePerRound = params.config.timeForRound;
  }

  protected initializeContext(): CrocGameContext {
    const state = new WaitState();

    return new CrocGameContext(state, this.data, this.responder);
  }

  public handleMessage(fromId: string, message: AnyMessage): void {
    if (isActionMessage(message)) {
      this.context.handleMessage(fromId, message.action);
    } else {
      this.context.handleMessage(fromId, message as any);
    }
  }
}
