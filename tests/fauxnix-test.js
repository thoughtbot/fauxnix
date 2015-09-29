import sinon from "sinon";
import Fauxnix from "../fauxnix";

QUnit.asyncTest("Fauxnix calls onopen", function(assert) {
  expect(1);
  const socket = new Fauxnix(function() {});

  socket.onopen = function() {
    assert.ok(true);
    start();
  }
});

QUnit.asyncTest("Fauxnix replies with valid response", function(assert) {
  expect(5);

  const socket = new Fauxnix(function() {
    this.receive("foo", "bar", function() {
      return { status: "ok", response: { id: 1 } };
    });
  });

  socket.onmessage = function(rawMessage) {
    const message = JSON.parse(rawMessage.data)
    assert.equal(message.topic, "foo");
    assert.equal(message.event, "phx_reply");
    assert.equal(message.payload.status, "ok");
    assert.deepEqual(message.payload.response, { id: 1 });
    assert.equal(message.ref, 1);

    start();
  };

  const message = { topic: "foo", event: "bar", payload: { id: 1 }, ref: 1 };

  socket.send(JSON.stringify(message));
});

QUnit.test("Fuaxnix warns when there's an unhandled response", function(assert) {
  expect(1);

  const socket = new Fauxnix(function() {});
  const message = { topic: "foo", event: "bar", payload: { id: 1 }, ref: 1 };
  const stringMessage = JSON.stringify(message);
  sinon.stub(console, "warn");

  socket.send(stringMessage);

  assert.equal(
    console.warn.getCall(0).args[0],
    `Unhandled message: ${stringMessage}`
  );
});

QUnit.test("Fauxnix replaces Websocket instances with given object", function(assert) {
  const socket = new Fauxnix(function() {});
  const otherSocket = new Fauxnix(function() {});

  Fauxnix.doItLive(socket);
  assert.equal(new WebSocket(), socket);

  Fauxnix.inject(otherSocket);
  assert.equal(new WebSocket(), otherSocket);
});

QUnit.asyncTest("Fauxnix receive callbacks are passed in the payload", function(assert) {
  expect(1);

  const message = { topic: "foo", event: "bar", payload: { id: 1 }, ref: 1 };

  const socket = new Fauxnix(function() {
    this.receive("foo", "bar", function(payload) {
      assert.deepEqual(payload, message.payload);
      start();

      return { status: "ok", response: [] };
    });
  });
  socket.onmessage = function() {};

  socket.send(JSON.stringify(message));
});
