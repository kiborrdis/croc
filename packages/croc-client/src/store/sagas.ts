import { saga as connectionSaga } from '../modules/connections';
import { saga as userSaga } from '../modules/user';

function getDefaultSagas(): { [key: string]: any } {
  return {
    connectionSaga,
    userSaga
  };
}

export default getDefaultSagas();