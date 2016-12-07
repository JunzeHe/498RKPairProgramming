var PPControllers = angular.module('PPControllers', []);

PPControllers.controller('LandingController', [
  '$scope', 'Backend', 'CommonData', '$location', '$routeParams',
  function($scope, Backend, CommonData, $location, $routeParams) {

    $scope.roomId = $routeParams.roomId;
    $scope.username = "";
    $scope.roomName = "";
    $scope.roomPassword = "";
    CommonData.reset();
    $scope.createRoom = function(isValid) {
      $scope.submitted = true;
      $scope.error = "";
      $scope.hasError = false;
      console.log(isValid);
      if (isValid) {
        CommonData.setUsername($scope.username);
        Backend.createRoom($scope.roomName, $scope.roomPassword).then(function(res) {
          console.log(res);
          CommonData.setRoom(res.data.data);
          $location.url('/room');
        }, function(res) {
          console.log("failure");
          $scope.hasError = true;
          $scope.error = res;
        });
      }
    }
    $scope.joinRoom = function(isValid) {
      $scope.submitted = true;
      $scope.error = "";
      $scope.hasError = false;
      $scope.invalidPassword = false;
      if (isValid) {
        CommonData.setUsername($scope.username);
        Backend.getRoom($scope.roomId, $scope.roomPassword).then(function(res) {
          console.log(res);
          var room = res.data.data;
          if (room.users.includes($scope.username)) {
            console.log("failure");
            $scope.hasError = true;
            $scope.error = "Duplicate username for room " + room.roomName + ". Please enter a unique username.";
          } else {
            CommonData.setRoom(room);
            $location.url('/room');
          }
        }, function(res) {
          console.log("failure");
          $scope.hasError = true;
          $scope.invalidPassword = true;
          $scope.error = res;
          if(res.status == 401)
            $scope.error = "Incorrect password."
        });

        Backend.getMessages($scope.roomId)
          .then(function(messages) {
            CommonData.setMessages(messages.data.data);
          });

        Backend.getEdits($scope.roomId, new Date())
          .then(function(edits) {
            CommonData.setEdits(edits.data.data);
          });
      }
    }
  }
]);

PPControllers.controller('RoomController', ['$scope', 'Backend', 'CommonData', '$mdPanel', function($scope, Backend, CommonData, $mdPanel) {
  var socket = io();
  $scope.room = CommonData.getRoom();
  console.log($scope.room)
  $scope.username = CommonData.getUsername();
  $scope.chatMsg = "";
  $scope.serverResponses = [];
  $scope.messages = CommonData.getMessages();
  $scope.edit = CommonData.getEdit();
  console.log("edits", $scope.edits)


  $scope.shareLink = false;
  $scope.toggleShareLink = function($event) {
    console.log("toggle clicked", $scope.shareLink);
    if ($scope.shareLink == true) {
      $scope.hideShareLink($event);
    } else {
      $scope.showShareLink($event);
    }
  }
  $scope.showShareLink = function($event) {
    $scope.shareLink = true;
    console.log("show share link", $scope.shareLink);
    var panelPosition = $mdPanel.newPanelPosition().absolute('.share-link')
      .centerHorizontally().centerVertically();

    var link = window.location.href.split("/");
    var host = link[0] + "//" + link[2]

    var config = {
      attachTo: angular.element(document.body),
      position: panelPosition,
      targetEvent: $event,
      // templateUrl: './partials/shareLink.html',
      template: '<md-card class="share-link-box"><md-card-title>' +
        '<md-card-title-text><h2>Click to copy this link:</h2></md-card-title-text></md-card-title>' +
        '<md-card-content><span id="share-link-text" value="' + host + '/#/landing/' + $scope.room._id +
        '" ngclipboard data-clipboard-target="#share-link-text">' +
        host + '/#/landing/' + $scope.room._id + '</span>' +
        '</md-card-content></md-card>',
      clickOutsideToClose: true,
      escapeToClose: true,
      focusOnOpen: true,
      hasBackdrop: true,
      disableParentScroll: true,
      onDomRemoved: function() {
        $scope.shareLink = false;
        console.log($scope.shareLink);
      }
    }

    $mdPanel.open(config)
      .then(function(result) {
        $scope.mdPanelRef = result;
      });
  }

  $scope.hideShareLink = function($event) {
    var panelRef = $scope.mdPanelRef;
    console.log("hiding", $scope.shareLink);
    panelRef.close().then(function() {
      angular.element(document.querySelector('.share-link')).focus();
      panelRef.destroy();
    });
  }
  Backend.joinRoom($scope.room._id, $scope.username);

  socket.emit('store username and roomId', { username: $scope.username, roomId: $scope.room._id });
  socket.on('response', function(res) {
    $scope.$apply(function() {
      $scope.serverResponses.push(res.data);
    });
  });

  socket.on('new user', function(newUserName) {
    room = CommonData.getRoom();
    room.users.push(newUserName);
    CommonData.setRoom(room);
    $scope.room = room;
  });

  socket.on('user has left room', function(oldUserName) {
    room = CommonData.getRoom();
    room.users.splice(room.users.indexOf(oldUserName), 1);
    CommonData.setRoom(room);
    $scope.room = room;
  });

  $scope.sendMsg = function(isValid) {
    if (!isValid) {
      return;
    }

    var message = {
      dateCreated: new Date(),
      userName: $scope.username,
      roomName: $scope.room.roomName,
      roomId: $scope.room._id,
      message: $scope.chatMsg
    }
    socket.emit('chat message', message);
    $scope.messages.push(message);
    $scope.chatMsg = "";
  }

  socket.on('new chat message', function(data) {
    $scope.$apply(function() { $scope.messages.push(data.data); });
  });

  $scope.editorOptions = {
    lineWrapping: true,
    lineNumbers: true,
    viewportMargin: Infinity
  };

  $scope.codemirrorLoaded = function(_editor) {
    _editor.focus();
    // _editor.setValue("console.log('Hello world!');");
    // _editor.setCursor({ line: 1, ch: 0 })
    var doc = _editor.getDoc()
    socket.emit('new edit', {
      dateCreated: new Date(),
      userName: $scope.username,
      roomName: $scope.room.roomName,
      roomId: $scope.room._id,
      edit: doc.getValue()
    });
    // Backend.getEdits($scope.room._id, {lastCreated: new Date()})
    //   .then(function(edits) {
    //     CommonData.setEdits(edits.data.data);
    //     $scope.edits = CommonData.getEdits();
    //   });
    // var changesMade = doc.historySize().undo + doc.historySize().redo;
    var justSynced = false;
    _editor.on("change", function(instance, changeObjs) {
      if(justSynced == false) {
        var edit = {
          dateCreated: new Date(),
          userName: $scope.username,
          roomName: $scope.room.roomName,
          roomId: $scope.room._id,
          edit: doc.getValue()
        }
        socket.emit('new edit', edit);
        // if(changesMade != doc.historySize().undo + doc.historySize().redo) {
        //   console.log("history changed size");
        // }
        // changesMade = doc.historySize().undo + doc.historySize().redo  
      } else {
        justSynced = false;
      }
      
    })

    socket.on('new edit', function(data) {
      $scope.edit = data.data;
      var cursor = doc.getCursor();
      console.log($scope.edit.edit)
      justSynced = true;
      doc.setValue($scope.edit.edit)
      doc.setCursor(cursor);
    });

  }
}]);
