import SendBird from "sendbird";

const APP_ID = "2D80A73D-02C2-4C6D-8ECA-45268AAE3507"; // Replace with your SendBird App ID

// Initialize SendBird instance
const sb = new SendBird({ appId: APP_ID });

// Function to connect a user
export const connectUser = async (userId, nickname) => {
  return new Promise((resolve, reject) => {
    sb.connect(userId, (user, error) => {
      if (error) {
        reject(error);
      } else {
        sb.updateCurrentUserInfo(nickname, null, (response, err) => {
          if (err) reject(err);
          resolve(user);
        });
      }
    });
  });
};

// Function to create or join a chat channel
export const createOrJoinChannel = async (channelUrl) => {
  return new Promise((resolve, reject) => {
    sb.GroupChannel.getChannel(channelUrl, (channel, error) => {
      if (error) {
        sb.GroupChannel.createChannelWithUserIds([channelUrl], true, (newChannel, err) => {
          if (err) reject(err);
          resolve(newChannel);
        });
      } else {
        resolve(channel);
      }
    });
  });
};

// Function to send a message
export const sendMessage = (channel, messageText) => {
  return new Promise((resolve, reject) => {
    const params = new sb.UserMessageParams();
    params.message = messageText;
    
    channel.sendUserMessage(params, (message, error) => {
      if (error) reject(error);
      resolve(message);
    });
  });
};

// Function to receive messages
export const receiveMessages = (channel, callback) => {
  const channelHandler = new sb.ChannelHandler();
  channelHandler.onMessageReceived = (channel, message) => {
    callback(message);
  };

  sb.addChannelHandler("UNIQUE_HANDLER_ID", channelHandler);
};
