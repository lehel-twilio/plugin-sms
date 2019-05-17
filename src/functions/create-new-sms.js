const axios = require('axios');

const CHAT_SERVICE_SID = 'IS25798ff85e9a41909c5534570f51cc6c';
const FLEX_FLOW_SID = 'FOd5accaed56ea7e7f9f3d2fda19eb7008'; // Must be the sms FlexFlow

exports.handler = async function (context, event, callback) {
  const response = new Twilio.Response();
  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST');
  response.appendHeader('Content-Type', 'application/json');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

  const authed = await validateToken(event.Token, context.ACCOUNT_SID, context.AUTH_TOKEN);
  if (typeof authed !== 'object' || !authed.data || authed.data.valid !== true) {
    console.log('couldn\'t auth', event.Token);
    return callback(null, response);
  }

  console.log('successfully authed', authed.data)

  const client = context.getTwilioClient();
  const to = sanitizeNumber(event.To);
  const from = sanitizeNumber(event.From);

  const channelArgs = {
    FlexFlowSid: FLEX_FLOW_SID,
    Identity: event.To,
    Target: event.To,
    ChatUserFriendlyName: event.ToFriendlyName || event.To,
    ChatFriendlyName: event.ChatFriendlyName || `${event.To} chat`,
    PreEngagementData: JSON.stringify({ targetWorker: authed.data.identity })
  };

  const channelResponse = await createChannel(channelArgs, context.ACCOUNT_SID, context.AUTH_TOKEN);

  client.messages.create({
    body: event.Message,
    to: to,
    from: from
  }).then(() => {
    console.log('adding message to', channelResponse.data.sid);
    client.chat.services(CHAT_SERVICE_SID)
      .channels(channelResponse.data.sid)
      .messages
      .create({
        body: event.Message,
        from: from
      }).then(() => callback(null, response));
  }).catch(err => {
    console.error(err);
    callback(err);
  });
}

function sanitizeNumber(number) {
  if (number.length === 10)
    return `+1${number}`;

  if (number.charAt(0) !== '+')
    return `+${number}`;

  return number;
}

async function createChannel(channelArgs, accountSid, authToken) {
  const queryString = Object.keys(channelArgs)
    .map(k => `${k}=${encodeURIComponent(channelArgs[k])}`)
    .join('&');

  console.log('sending', queryString);

  try {
    // Channels API not in twilio-node yet... so axios
    return await axios.post(
      'https://flex-api.twilio.com/v1/Channels',
      queryString,
      { auth: { username: accountSid, password: authToken } }
    )
  } catch (e) {
    console.error('failed to create channel', e.response.data);
    throw e;
  }
}

async function validateToken(token, accountSid, authToken) {
  try {
    return await axios.post(
      `https://iam.twilio.com/v1/Accounts/${accountSid}/Tokens/validate`,
      { token: token },
      { auth: { username: accountSid, password: authToken } }
    )
  } catch (e) {
    console.error('failed to validate token', e.response.data);
    throw e;
  }
}