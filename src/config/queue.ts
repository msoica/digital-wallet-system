import Bull from 'bull';

export const billPaymentQueue = new Bull('bill-payment', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
}); 