define(["exports", "module"], function (exports, module) {
  "use strict";

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var Fauxnix = (function () {
    function Fauxnix(events) {
      var _this = this;

      _classCallCheck(this, Fauxnix);

      this.replies = [];
      this.onopen = function () {};
      events.apply(this);

      setTimeout(function () {
        _this.readyState = 1;
        _this.onopen();
      }, 500);
    }

    _createClass(Fauxnix, [{
      key: "receive",
      value: function receive(topic, event, callback) {
        this.replies.push({ topic: topic, event: event, callback: callback });
      }
    }, {
      key: "send",
      value: function send(rawMessage) {
        var _this2 = this;

        var message = JSON.parse(rawMessage);
        var reply = this._findReplyFor(message);

        if (reply) {
          (function () {
            var response = _this2._buildResponse(message, reply);
            var stringResponse = JSON.stringify(response);

            setTimeout(function () {
              _this2.onmessage({ data: stringResponse });
            }, 10);
          })();
        } else {
          console.warn("Unhandled message: " + rawMessage);
        }
      }
    }, {
      key: "_findReplyFor",
      value: function _findReplyFor(message) {
        return this.replies.find(function (reply) {
          var eventMatches = message.event.match(reply.event);
          var topicMatches = message.topic.match(reply.topic);

          return eventMatches && topicMatches;
        });
      }
    }, {
      key: "_buildResponse",
      value: function _buildResponse(message, reply) {
        var payload = reply.callback(message.payload);
        return {
          topic: message.topic,
          event: "phx_reply",
          payload: {
            status: payload.status,
            response: payload.response || {}
          },
          ref: message.ref
        };
      }
    }]);

    return Fauxnix;
  })();

  Fauxnix.doItLive = Fauxnix.inject = function (socket) {
    window.WebSocket = function () {
      return socket;
    };
  };

  module.exports = Fauxnix;
});
