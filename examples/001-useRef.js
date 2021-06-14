import assert from "assert/strict";
import EventEmitter from "events";
import * as React from "react";
import * as Renderer from "react-test-renderer";

function MyUserInterface(props) {
  const userName = React.useRef(null);

  function setUserName(name) {
    userName.current = name;
  }

  function listenForUserSpeaking() {
    props.user.addListener("speakName", setUserName);
  }

  React.useEffect(listenForUserSpeaking);

  if (userName.current === null) {
    return "Hello, what is your name?";
  } else {
    return "Nice to meet you, " + userName.current + "!";
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

function updateRenderer() {
  const props = {
    user: myUser,
  };
  myRenderer.update(React.createElement(MyUserInterface, props));
}

Renderer.act(createRenderer);

assert.equal(myRenderer.toTree().rendered, "Hello, what is your name?");

myUser.emit("speakName", "Michael Cera");

assert.equal(myRenderer.toTree().rendered, "Hello, what is your name?");

Renderer.act(updateRenderer);

assert.equal(myRenderer.toTree().rendered, "Nice to meet you, Michael Cera!");
