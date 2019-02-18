import { connect } from 'react-redux';
import Playground from '../components/Playground';
import { Store } from '../store';
import { getGameStatus } from '../modules/game';

const mapStateToProps = (store: Store) => {
  return {
    status: getGameStatus(store),
    remainingTime: store.game.remainingTimeFromStart,
    roundStartedAt: store.game.roundStartedAt,
    secretWord: store.game.secretWord,
  };
};
export default connect(mapStateToProps)(Playground);
