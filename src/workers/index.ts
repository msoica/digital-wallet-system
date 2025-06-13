import { initializeBillPaymentWorker } from './billPaymentWorker';

export const initializeWorkers = () => {
  initializeBillPaymentWorker();
  console.log('Workers initialized');
}; 