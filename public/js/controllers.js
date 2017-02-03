var PPControllers=angular.module("PPControllers",[]);PPControllers.controller("LandingController",["$scope","Backend","CommonData","$location","$routeParams",function($scope,Backend,CommonData,$location,$routeParams){$scope.roomId=$routeParams.roomId,$scope.username="",$scope.roomName="",$scope.roomPassword="",CommonData.reset(),$scope.createRoom=function(isValid){$scope.submitted=!0,$scope.error="",$scope.hasError=!1,console.log(isValid),isValid&&(CommonData.setUsername($scope.username),Backend.createRoom($scope.roomName,$scope.roomPassword).then(function(res){console.log(res),CommonData.setRoom(res.data.data),$location.url("/room")},function(res){console.log("failure"),$scope.hasError=!0,$scope.error=res}))},$scope.joinRoom=function(isValid){$scope.submitted=!0,$scope.error="",$scope.hasError=!1,$scope.invalidPassword=!1,isValid&&(CommonData.setUsername($scope.username),Backend.getRoom($scope.roomId,$scope.roomPassword).then(function(res){console.log(res);var room=res.data.data;room.users.includes($scope.username)?(console.log("failure"),$scope.hasError=!0,$scope.error="Duplicate username for room "+room.roomName+". Please enter a unique username."):(CommonData.setRoom(room),$location.url("/room"))},function(res){console.log("failure"),$scope.hasError=!0,$scope.invalidPassword=!0,$scope.error=res,401==res.status&&($scope.error="Incorrect password.")}),Backend.getMessages($scope.roomId).then(function(messages){CommonData.setMessages(messages.data.data)}),Backend.getEdits($scope.roomId,new Date).then(function(edit){CommonData.setEdit(edit.data.data)}))}}]),PPControllers.controller("RoomController",["$scope","Backend","CommonData","$mdPanel",function($scope,Backend,CommonData,$mdPanel){var socket=io();$scope.room=CommonData.getRoom(),$scope.username=CommonData.getUsername(),$scope.chatMsg="",$scope.serverResponses=[],$scope.messages=CommonData.getMessages(),$scope.edit=CommonData.getEdit(),$scope.language="python",$scope.changeLanguage=function(){console.log("change language to",$scope.language),$scope.cmEditor.setOption("mode",$scope.language)},console.log($scope.room),$scope.shareLink=!1,$scope.toggleShareLink=function($event){console.log("toggle clicked",$scope.shareLink),1==$scope.shareLink?$scope.hideShareLink($event):$scope.showShareLink($event)},$scope.showShareLink=function($event){$scope.shareLink=!0,console.log("show share link",$scope.shareLink);var panelPosition=$mdPanel.newPanelPosition().absolute(".share-link").centerHorizontally().centerVertically(),link=window.location.href.split("/"),host=link[0]+"//"+link[2],config={attachTo:angular.element(document.body),position:panelPosition,targetEvent:$event,template:'<md-card class="share-link-box"><md-card-title><md-card-title-text><h2>Click link to copy:</h2></md-card-title-text></md-card-title><md-card-content><span id="share-link-text" value="'+host+"/#/landing/"+$scope.room._id+'" ngclipboard data-clipboard-target="#share-link-text">'+host+"/#/landing/"+$scope.room._id+"</span></md-card-content></md-card>",clickOutsideToClose:!0,escapeToClose:!0,focusOnOpen:!0,hasBackdrop:!0,disableParentScroll:!0,onDomRemoved:function(){$scope.shareLink=!1,console.log($scope.shareLink)}};$mdPanel.open(config).then(function(result){$scope.mdPanelRef=result})},$scope.hideShareLink=function($event){var panelRef=$scope.mdPanelRef;console.log("hiding",$scope.shareLink),panelRef.close().then(function(){angular.element(document.querySelector(".share-link")).focus(),panelRef.destroy()})},Backend.joinRoom($scope.room._id,$scope.username),socket.emit("store username and roomId",{username:$scope.username,roomId:$scope.room._id}),socket.on("response",function(res){$scope.$apply(function(){$scope.serverResponses.push(res.data)})}),socket.on("new user",function(newUserName){room=CommonData.getRoom(),room.users.push(newUserName),CommonData.setRoom(room),$scope.room=room}),socket.on("user has left room",function(oldUserName){room=CommonData.getRoom(),room.users.splice(room.users.indexOf(oldUserName),1),CommonData.setRoom(room),$scope.room=room}),$scope.sendMsg=function(isValid){if(isValid){var message={dateCreated:new Date,userName:$scope.username,roomName:$scope.room.roomName,roomId:$scope.room._id,message:$scope.chatMsg};socket.emit("chat message",message),$scope.messages.push(message),$scope.chatMsg=""}},socket.on("new chat message",function(data){$scope.$apply(function(){$scope.messages.push(data.data)})}),$scope.editorOptions={lineWrapping:!0,lineNumbers:!0,viewportMargin:1/0,mode:$scope.language},$scope.codemirrorLoaded=function(_editor){function convertToCursorChange(changeObj,cursor){if(void 0==changeObj)return cursor;console.log("changeObj",changeObj),console.log("cursor",cursor);var newCursor=cursor;return changeObj.from.line<newCursor.line?"+input"==changeObj.origin?2==changeObj.text.length&&newCursor.line++:"+delete"==changeObj.origin&&2==changeObj.removed.length&&newCursor.line--:changeObj.from.line==newCursor.line&&changeObj.from.ch<=newCursor.ch&&("+input"==changeObj.origin?2==changeObj.text.length?(newCursor.line++,newCursor.ch=newCursor.ch-changeObj.from.ch):newCursor.ch++:"+delete"==changeObj.origin&&(2==changeObj.removed.length?(newCursor.line--,newCursor.ch=200):newCursor.ch--)),newCursor}$scope.cmEditor=_editor,_editor.focus();var doc=_editor.getDoc();void 0==$scope.edit&&socket.emit("new edit",{dateCreated:new Date,userName:$scope.username,roomName:$scope.room.roomName,roomId:$scope.room._id,edit:doc.getValue()});var justSynced=!1;Backend.getEdits($scope.room._id).then(function(edits){void 0==$scope.edit?$scope.edit=doc.getValue():(CommonData.setEdit(edits.data.data[0]),$scope.edit=CommonData.getEdit(),justSynced=!0,console.log("$scope.edit",$scope.edit),doc.setValue($scope.edit.edit))}),_editor.on("change",function(instance,changeObj){if(cursor=doc.getCursor(),0==justSynced){var edit={dateCreated:new Date,userName:$scope.username,roomName:$scope.room.roomName,roomId:$scope.room._id,edit:doc.getValue(),changeObj:changeObj};socket.emit("new edit",edit)}else justSynced=!1}),socket.on("new edit",function(data){var cursor=doc.getCursor();$scope.edit=data.data,console.log;var updatedCursor=convertToCursorChange($scope.edit.changeObj,cursor);console.log(updatedCursor),console.log($scope.edit.edit),justSynced=!0,doc.setValue($scope.edit.edit),doc.setCursor(updatedCursor)})}}]);