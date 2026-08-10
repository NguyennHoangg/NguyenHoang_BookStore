const redis = require("redis");
require("dotenv").config();

//flag connect redis hay chua
let isConnected = false;

//Flag client — giữ tham chiếu đến instance thực
let client = null;

//tao client
const createClient = redis.createClient({
  url:
    process.env.NODE_ENV === "development"
      ? process.env.REDIS_URL_DEV
      : process.env.REDIS_URL_PROD,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries >= 10) {
        console.error("Redis reconnect failed");
        throw new Error("Redis max retries reached");
      }
      const delay = Math.min(retries * 300, 3000);
      return delay;
    },
    connectTimeout: 10000,
    keepAlive: 30000,
  },
});

//Error
createClient.on("error", (error) => {
  console.error("redis error", error);
  isConnected = false;
});

//Reconnect
createClient.on("reconnecting", () => {
  console.log("redis reconnecting");
});

//End
createClient.on("end", () => {
  console.log("redis end");
  isConnected = false;
});

//Connect
createClient.on("connect", () => {
  console.log("redis connected");
});

//Ready
createClient.on("ready", () => {
  isConnected = true;
  console.log("redis is ready");
});

//function connect redis
const init = async () => {
  //Nếu đã kết nối thì trả về client
  if (client) {
    return client;
  }
  //Kết nối redis lần đầu tiên
  try {
    await createClient.connect();
    client = createClient; 
    isConnected = true;
    return client;
  } catch (error) {
    console.error("redis connect failed", error);
    isConnected = false;
    throw error;
  }
};

//function get client redis — trả về createClient (instance thực)
const getRedis = () => {
  // client luôn là createClient sau khi init()
  return client; 
};

//function close redis
const closeRedis = async () => {
  if (client) {
    await client.quit(); 
    client = null;
    isConnected = false;
    console.log("[Redis] Đã đóng kết nối.");
  }
};

module.exports = { init, getRedis,isConnected };
