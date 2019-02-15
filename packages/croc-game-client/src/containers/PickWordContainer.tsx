import PickWord from '../components/PickWord';
import { connect } from 'react-redux';
import { Actions } from 'croc-actions';
import { Store } from '../store';

const mapStateToProps = (store: Store) => {
  return {
    needToPick: store.user.playerId === store.game.picker,
  }
}

const mapDispatchToProps = {
  pickWord: Actions.pickWord,
  pickRandowWord: () => Actions.pickWord(),
}

export default connect(mapStateToProps, mapDispatchToProps)(PickWord);