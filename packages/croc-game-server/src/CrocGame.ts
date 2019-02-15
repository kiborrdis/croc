import { buildActionMessage, AnyMessage } from 'croc-messages';
import { Actions } from 'croc-actions';
import { Responder } from './interfaces/Responder';
import { Game } from './Game';
import { CrocGameData } from './CrocGameData';
import { CrocGameContext } from './CrocGameContext';
import { WaitState } from './states/WaitState';

interface CrocGameConfig {
  reconnectionTimeout: number;
  timeForRound: number;
  pickWord: () => string;
  pickLeaderStrategy: (playerIds: string[]) => string;
}

export class CrocGame extends Game<CrocGameData> {

  constructor(params: { responder: Responder, config: CrocGameConfig, gameDataInitializer: () => CrocGameData }) {
    super({
      responder: params.responder,
      gameDataInitializer: params.gameDataInitializer,
      config: {
        reconnectionTimeout: params.config.reconnectionTimeout,
        deletePlayerMessageCreator: (id: string) => buildActionMessage(
          Actions.deletePlayer(id),
          'server',
        ),
        addPlayersMessageCreator: (players) => buildActionMessage(
          Actions.addPlayers(players),
          'server',
        ),
      },
    });

    this.data.pickWord = params.config.pickWord;
    this.data.pickLeaderStrategy = params.config.pickLeaderStrategy;
    this.data.timePerRound = params.config.timeForRound;
  }

  protected initializeContext() {
    const state = new WaitState();

    return new CrocGameContext(state, this.data, this.responder);
  }

  public handleMessage(fromId: string, message: AnyMessage) {
    this.context.handleMessage(fromId, message);
  }
}
