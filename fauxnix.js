class Fauxnix {
  constructor(events) {
    this.replies = [];
    this.onopen = function() {};
    events.apply(this);

    setTimeout(() => {
      this.readyState = 1;
      this.onopen();
    }, 500);
  }

  receive(topic, event, callback) {
    this.replies.push({ topic: topic, event: event, callback: callback });
  }

  send(rawMessage) {
    const message = JSON.parse(rawMessage);
    const reply = this._findReplyFor(message);

    if (reply) {
      const response = this._buildResponse(message, reply);
      const stringResponse = JSON.stringify(response);

      setTimeout(() => {
        this.onmessage({ data: stringResponse });
      }, 10);
    } else {
      console.warn(`Unhandled message: ${rawMessage}`);
    }
  }

  _findReplyFor(message) {
    return this.replies.find((reply) => {
      const eventMatches = message.event.match(reply.event);
      const topicMatches = message.topic.match(reply.topic);

      return eventMatches && topicMatches;
    });
  }

  _buildResponse(message, reply) {
    const payload = reply.callback(message.payload);
    return {
      topic: message.topic,
      event: "phx_reply",
      payload: {
        status: payload.status,
        response: payload.response || {},
      },
      ref: message.ref,
    };
  }
}

Fauxnix.doItLive = Fauxnix.inject = function(socket) {
  window.WebSocket = function() {
    return socket;
  };
};

export default Fauxnix;
