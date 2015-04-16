# Fauxnix

> **NOTE**: Fauxnix is a new project and is likely to change.

Fauxnix is a mock websocket connection for receiving and responding to
[Phoenix channel] messages and is heavily inspired by [Pretender].

[Phoenix channel]: http://www.phoenixframework.org/v0.11.0/docs/channels
[Pretender]: https://github.com/trek/pretender


## Usage

Fauxnix allows you to create a fake websocket connection and replace the
returned object of `new WebSocket()` calls with the socket you passed in.

```javascript
const socket = new Fauxnix(function() {
  this.receive("topic", "event", function() {
    return { status: "ok", response: { id: 1 } };
  });
});

Fauxnix.inject(socket);
```

Whenever `socket` receives a message from `phoenix.js` with a topic of
`"topic"` and an event of `"event"` Fauxnix will send a reply with the given
`status` and `response` in the return statement.

The call to `Fauxnix.inject` replaces the returned object of all `new
WebSocket()` calls with the `socket` we defined.

The topic and event arguments also accept regular expressions.

## Contributing

See the [CONTRIBUTING] document.
Thank you, [contributors]!

[CONTRIBUTING]: CONTRIBUTING.md
[contributors]: https://github.com/thoughtbot/fuaxnix/graphs/contributors

## License

Fauxnix is Copyright © 2015 thoughtbot. It is free software, and may be
redistributed under the terms specified in the [LICENSE] file.

[LICENSE]: /LICENSE

## About thoughtbot

![thoughtbot](https://thoughtbot.com/logo.png)

Fauxnix is maintained and funded by thoughtbot, inc.
The names and logos for thoughtbot are trademarks of thoughtbot, inc.

We love open source software!
See [our other projects][community] or
[hire us][hire] to design, develop, and grow your product.

[community]: https://thoughtbot.com/community?utm_source=github
[hire]: https://thoughtbot.com?utm_source=github
