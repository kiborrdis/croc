import { connect } from 'react-redux';
import Playground from '../components/Playground';
import { Store } from '../store';
import { getGameStatus } from '../modules/game';

const mapStateToProps = (store: Store) => {
  return {
    status: getGameStatus(store),
  };
}

export default connect(mapStateToProps)(Playground);