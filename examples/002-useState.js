import assert from "assert/strict";
import EventEmitter from "events";
import * as React from "react";
import * as Renderer from "react-test-renderer";

function MyUserInterface(props) {
  const [userName, setUserName] = React.useState(null);

  function listenForUserSpeaking() {
    props.user.addListener("speakName", setUserName);
  }

  React.useEffect(listenForUserSpeaking);

  if (userName === null) {
    return "Hello, what is your name?";
  } else {
    return "Nice to meet you, " + userName + "!";
  }
}

const myUser = new EventEmitter();

let myRenderer;

function createRenderer() {
  const props = {
    user: myUser,
  };
  myRenderer = Renderer.create(React.createElement(MyUserInterface, props));
}

Renderer.act(createRenderer);

assert.equal(myRenderer.toTree().rendered, "Hello, what is your name?");

myUser.emit("speakName", "Michael Cera");

assert.equal(myRenderer.toTree().rendered, "Nice to meet you, Michael Cera!");
