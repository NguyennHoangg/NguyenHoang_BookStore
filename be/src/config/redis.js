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
    reconnectStrategy: () => {
      return 60000;
    },
    //thời gian chờ kết nối redis (mặc định 10s)
    connectTimeout: 10000,
    //thời gian chờ gửi lệnh sau khi kết nối (mặc định 10s)
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
    console.error("[Redis] Kết nối thất bại, app vẫn chạy không có Redis:", error.message);
    isConnected = false;
    // Không throw — để app tiếp tục chạy bình thường mà không có Redis
    return client;
  }
};

//function get client redis — trả về createClient (instance thực)
const getRedis = () => {
  // client luôn là createClient sau khi init()
  return client; 
};

const getRedisStatus = () =>{
  return isConnected;
}
//function close redis
const closeRedis = async () => {
  if (client) {
    await client.quit(); 
    client = null;
    isConnected = false;
    console.log("[Redis] Đã đóng kết nối.");
  }
};

module.exports = { init, getRedis,isConnected,closeRedis, getRedisStatus };
