exports.handler = function(context, event, callback) {

	let client = context.getTwilioClient();

	const to = sanitizeNumber(event.To);
    const from = sanitizeNumber(event.From);
    const message = event.Message;

    const response = new Twilio.Response();
    response.appendHeader('Access-Control-Allow-Origin', '*');
    response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST');
    response.appendHeader('Content-Type', 'application/json');
    response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

    client.messages.create({
        body: message,
        to: to,
        from: from
    })
    .then((message) => {
        console.log(message.sid);

        console.log(context.TWILIO_SYNC_SID);
        console.log(context.TWILIO_SYNC_MAP);

        client.sync.services(context.TWILIO_SYNC_SID)
           .syncMaps(context.TWILIO_SYNC_MAP)
           .syncMapItems
           .create({
                key: message.sid,
                data: {
                    worker: event.Worker
                }
            })
           .then(sync_map_item => {
               console.log(sync_map_item.key);
               callback(null, response);
            })
           .done();
    });

    function sanitizeNumber(number) {
        if (number.length === 10)
            return `+1${number}`;
        if (number.charAt(0) !== '+')
            return `+${number}`;
        else return number;
    }
};
