import assert from "assert/strict";
import EventEmitter from "events";
import * as React from "react";
import * as Renderer from "react-test-renderer";

var user = new EventEmitter();

function renderUserInterface() {
  var [userName, setUserName] = React.useState(null);

  function hearName(name) {
    setUserName(name);
  }

  function listenForUserSpeaking() {
    user.addListener("speakName", hearName);
  }

  React.useEffect(listenForUserSpeaking);

  if (userName === null) {
    return "Hello, what is your name?";
  } else {
    return "Nice to meet you, " + userName + "!";
  }
}

var myApplication;

function mountMyApplication() {
  myApplication = Renderer.create(React.createElement(renderUserInterface));
}

Renderer.act(mountMyApplication);

assert.equal(myApplication.toTree().rendered, "Hello, what is your name?");

user.emit("speakName", "Michael Cera");

assert.equal(myApplication.toTree().rendered, "Nice to meet you, Michael Cera!");
