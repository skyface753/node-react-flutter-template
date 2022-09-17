const redis = require('redis');
const config = require('../config.json');

class RedisClient {
  constructor() {
    this.client = redis.createClient({
      url: 'redis://' + config.REDIS.host + ':' + config.REDIS.port,
    });
    this.client.on('error', (err) => {
      console.log('Error ' + err);
    });
    this.ready = false;
    this.connect();
  }
  async connect() {
    await this.client.connect();
    this.ready = true;
  }

  async set(key, value) {
    if (!this.ready) return;
    if (!key) return;
    await this.client.set(key, value);
  }

  async get(key) {
    if (!this.ready) return;
    if (!key) return;
    return await this.client.get(key);
  }

  async del(key) {
    if (!this.ready) return;
    if (!key) return;
    await this.client.del(key);
  }
}

module.exports = new RedisClient();
