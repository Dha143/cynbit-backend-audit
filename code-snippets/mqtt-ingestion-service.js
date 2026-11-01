import mqtt from 'mqtt';
import { createClient } from 'redis';

const mqttClient = mqtt.connect('mqtt://emqx.cynbit.local');
const redis = createClient();
await redis.connect();

let batch = [];
mqttClient.on('connect', () => {
  mqttClient.subscribe('cynbit/+/telemetry');
});

mqttClient.on('message', async (topic, payload) => {
  try {
    const deviceId = topic.split('/')[1];
    const data = JSON.parse(payload.toString());
    batch.push({ deviceId, ts: Date.now(), temp: data.t, vibration: data.v });
    
    // Cache latest for fast dashboard load
    await redis.setEx(`device:${deviceId}:latest`, 5, JSON.stringify(data));
    
    if(batch.length >= 500) {
      await flushToTimescaleDB(batch);
      batch = [];
    }
  } catch(e) { console.error('Invalid payload', e); }
});

async function flushToTimescaleDB(rows) {
  console.log(`Flushing ${rows.length} rows to TimescaleDB`);
  // DB insert logic here
}
