import { saga as connectionSaga } from '../modules/connections';

function getDefaultSagas(): { [key: string]: any } {
  return {
    connectionSaga
  };
}

export default getDefaultSagas();