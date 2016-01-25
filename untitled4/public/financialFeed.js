/**
 * Created by Rahil on 11-01-2016.
 */
"use strict";
function msToTime(s) {
    var days, hours, minutes, seconds, x;
    x = s / 1000;
    seconds = Math.floor(x % 60);
    x /= 60;
    minutes = Math.floor(x % 60);
    x /= 60;
    hours = Math.floor(x % 24);
    x /= 24;
    days = Math.floor(x);
    if (((days==0)&&(hours==0)&&(minutes==0))){
        return  seconds + " Seconds Ago" ;
    }
    else  if ((days==0) && (hours==0))
    {
        return minutes + " Minutes Ago";
    }
    else if (days==0){
        return    hours + " Hours Ago";
    }
    else {
        if (days==1){
            return "Yesterday";
        }
        return days + " Days Ago";
    }
}

function startAjaxPolling(){
   setInterval(function() {
       //first get all the urls
       var url = "";
       var uniqueIds =[];
       var ticker = [];
       var state = [];
       var type = [];
       var priceInitial = [];
       var priceStopLoss =[];
       var priceTarget = [];
       for(var i =0;i< $(".message.ideass").length;i++){
           var jj =  $(".message.ideass")[i].attributes;
           if (jj["data-url"].nodeValue != ""){  //it will be empty when its not a stock identified idea
               url += jj["data-url"].nodeValue;
               uniqueIds.push(jj["data-objid"].nodeValue);
               var tt = jj["data-url"].nodeValue.split(":");
               priceInitial.push(jj["data-priceinitial"].nodeValue);
               priceStopLoss.push(jj["data-pricestoploss"].nodeValue);
               priceTarget.push(jj["data-pricetarget"].nodeValue);
               state.push(jj["data-state"].nodeValue);
               type.push(jj["data-type"].nodeValue);
               tt = tt[1];
               tt = tt.slice(0, -1);
               ticker.push(tt);
           }
       }
       console.log(type);
      $.ajax({
            url: "http://www.google.com/finance/info?infotype=infoquoteall&q=" + url,
            type: "get", dataType: "text",
            success: function (data) {
                data = data.substring(3);
                var dataJ = JSON.parse(data);
                var len = dataJ.length;
                for (var i = 0; i < len; i++) {
                    var tempId = "#" + uniqueIds[i];
                    if ($(tempId).length > 0){
                        //it exists //update the node with our value
                        var classs = "#curPrice" + uniqueIds[i];
                        //also if objectId matches ....check if getElementById returns true or not
                        //if not then dont update as that ticker has gone out of scope
                        var curPrice = dataJ[i].l;
                        if (state[i]==0){

                          if ((curPrice > priceInitial[i]) && (curPrice < priceTarget[i])){
                              var nameleft = ".label.left.leftside." + uniqueIds[i];
                              var valuesleft = "#leftside" + uniqueIds[i];
                              var nameright = ".label.left.rightside." + uniqueIds[i];
                              var valuesright = "#rightside" + uniqueIds[i];
                              if (type[i]==133) {  //buy
                                  $(nameleft).text("Initial Price");
                                  $(valuesleft).text(priceInitial[i]);
                                  $(nameright).text("Target Price");
                                  $(valuesright).text(priceTarget[i]);
                              }
                              else {
                                  $(nameright).text("Initial Price");
                                  $(valuesright).text(priceInitial[i]);
                                  $(nameleft).text("Target Price");
                                  $(valuesleft).text(priceTarget[i]);
                              }
                          }
                          else if ((curPrice > priceStopLoss[i]) && (curPrice < priceInitial[i])){
                              var nameleft = ".label.left.leftside." + uniqueIds[i];
                              var valuesleft = "#leftside" + uniqueIds[i];
                              var nameright = ".label.left.rightside." + uniqueIds[i];
                              var valuesright = "#rightside" + uniqueIds[i];
                              if (type[i]==133) {  //buy
                                  $(nameleft).text("StopLoss Price");
                                  $(valuesleft).text(priceStopLoss[i]);
                                  $(nameright).text("Target Price");
                                  $(valuesright).text(priceTarget[i]);
                              }
                              else {
                                  $(nameright).text("StopLoss Price");
                                  $(valuesright).text(priceStopLoss[i]);
                                  $(nameleft).text("Target Price");
                                  $(valuesleft).text(priceTarget[i]);
                              }
                          }
                            else if ((curPrice >= priceTarget[i])){
                              var nameleft = ".label.left.leftside." + uniqueIds[i];
                              var valuesleft = "#leftside" + uniqueIds[i];
                              var nameright = ".label.left.rightside." + uniqueIds[i];
                              var valuesright = "#rightside" + uniqueIds[i];
                              if (type[i]==133) {  //buy
                                  $(nameleft).text("Initial Price");
                                  $(valuesleft).text(priceInitial[i]);
                                  $(nameright).text("Target Price");
                                  $(valuesright).text(priceTarget[i]);
                                  var returns = ( priceTarget[i] - (priceInitial[i]) )/priceInitial[i];
                                  var returnClass = "#return" + uniqueIds[i];
                                  $(returnClass).text(returns.toFixed(2));
                              }
                              else {
                                  $(nameright).text("Initial Price");
                                  $(valuesright).text(priceInitial[i]);
                                  $(nameleft).text("Target Price");
                                  $(valuesleft).text(priceTarget[i]);
                                  var returns = ( priceInitial[i] - (priceTarget[i]) )/priceInitial[i];
                                  var returnClass = "#return" + uniqueIds[i];
                                  $(returnClass).text(returns.toFixed(2));
                              }
                          }
                            else if ((curPrice <= priceStopLoss[i])){
                              var nameleft = ".label.left.leftside." + uniqueIds[i];
                              var valuesleft = "#leftside" + uniqueIds[i];
                              var nameright = ".label.left.rightside." + uniqueIds[i];
                              var valuesright = "#rightside" + uniqueIds[i];

                              if (type[i]==133) {  //buy
                                  $(nameleft).text("Initial Price");
                                  $(valuesleft).text(priceInitial[i]);
                                  $(nameright).text("StopLoss Price");
                                  $(valuesright).text(priceStopLoss[i]);
                                  var returns =  (priceStopLoss[i] - priceInitial[i])/priceInitial[i];
                                  var returnClass = "#return" + uniqueIds[i];
                                  $(returnClass).text(returns.toFixed(2));
                              }
                              else {
                                  $(nameright).text("Initial Price");
                                  $(valuesright).text(priceInitial[i]);
                                  $(nameleft).text("Target Price");
                                  $(valuesleft).text(priceTarget[i]);
                                  var returns =  (priceInitial[i] - priceStopLoss[i])/priceInitial[i];
                                  var returnClass = "#return" + uniqueIds[i];
                                  $(returnClass).text(returns.toFixed(2));
                              }
                          }
                        }

                        $(classs).text(dataJ[i].l);
                    }
                    else {
                        console.log("it does not exists!!!!!");
                    }
                }
            },
            error: function (request, status, error) {
                alert(request.responseText);
                console.log(request.responseText);
                console.log(error);
            }
        });
    },4000);
}

var IdeaFeed = React.createClass({
    getInitialState : function() {
        return {
            resultState : this.props.results,
            uniqueKeys : this.props.uniqueKeys, //will help in uniquely identifying the objects
            parameterToStopOngoingHits: 1, //for 0 stop making it enter the loop
            parameterForScrollDownLock : 0 //for 0 if we get empty array
        };
    },
    render: function(){
        var res = this.state.resultState;
        var len = res.length;
        var tempCommentBoxArray=[];
        for (var i=0;i<len;i++){
            var ideaObjectId = res[i].id;
            tempCommentBoxArray.push(<IdeaBox passedObj={res[i]} key={ideaObjectId}/>);
        }
        return (
            <div className="primary">
                <ul className="item-post-create">
                    <li className="item post-create wide">
                        <form className="form-post"   autoComplete="off">
                            <div className="body">
                                <div className="form-post-symbol">
                                    <h3>Share your idea</h3>
                                    <textarea className="left addButtonUser" type="text" style={{marginLeft:'3%'}}  maxLength="100" placeholder="Enter your idea : eg Sell Nifty with target 7100 and SL 8050" />
                                    <a href="#" className="button right " onClick={this.handleNewIdea}>Publish</a>
                                    <div className="clear"></div>
                                </div>
                                <div className="row" id={"ideaSubmitMsg"} style={{  display : 'none'}}>
                                    <div className="alert alert-danger" >
                                        <a href="#" className="close" data-dismiss="alert" aria-label="close">&times;</a>
                                        <strong>"Idea Posted Successfully"</strong>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </li>
                </ul>
            <div className="items">
                <ul>
                    {tempCommentBoxArray}
                </ul>
            </div>
                </div>
                   );
    },
    handleSubmit : function (){
        return false;
    },
    componentWillMount:function(){
    },
    componentDidMount: function() {
        window.addEventListener('scroll', this.handleScroll);
        console.log("making ajax request!!!0");
       startAjaxPolling();
    },
    componentWillUnmount: function() {
        window.removeEventListener('scroll', this.handleScroll);
    },
    handleScroll: function(event) {
        var tempCounter = this.state.parameterToStopOngoingHits;
        var resultState=this.state.resultState;
        var that = this;
        var uniqueKeys = this.state.uniqueKeys;
        var updatedAt = resultState[resultState.length-1].toJSON().updatedAt;
        var updatedAtForScrollUp = resultState[0].toJSON().updatedAt;
        var parameterForScrollDownLock = this.state.parameterForScrollDownLock;
        if (($(window).scrollTop() >= ($(document).height() - $(window).height())*0.86) && tempCounter == 1  )
        {
            tempCounter=0;
            this.setState({
             parameterToStopOngoingHits:tempCounter
            });
            Parse.Cloud.run("getFinancialFeed",{ currentUser:"fhDsaUqN6S",  pageSize:25 , updatedAt:updatedAt }).then(function(resultt){
                tempCounter=1;
                var len = resultt.length;
                console.log(resultt);
                console.log("length of result!!!");
                for(var i=0;i<len;i++){
                    var sizeOfresultState = resultState.length;

                    if (uniqueKeys.indexOf(resultt[i].id)<0){
                        uniqueKeys.push(resultt[i].id);
                        resultState.push(resultt[i]);
                    }
                    if (sizeOfresultState >=40){
                        var id = "#" + resultState[0].id + "liItem";
                        window.scrollBy(0,-Math.abs($(id).height()));
                        uniqueKeys.shift();
                        resultState.shift();
                    }
                }

                that.setState({
                    resultState : resultState,
                    parameterToStopOngoingHits:tempCounter,
                    uniqueKeys:uniqueKeys
                });
            },function(err){
                console.log(err);
            });
        }
           else  if (($(window).scrollTop() <= ($(document).height() - $(window).height())*0.15) && tempCounter == 1)
        {
            updatedAt = updatedAtForScrollUp;
            tempCounter=0;
            console.log(parameterForScrollDownLock);
            this.setState({
                parameterToStopOngoingHits:tempCounter
            });
            Parse.Cloud.run("getFinancialFeed",{ currentUser:"fhDsaUqN6S",  pageSize:25 , updatedAt:updatedAt , flag:true }).then(function(resultt){
                tempCounter=1;
                var len = resultt.length;
                console.log(JSON.stringify(resultt));

                for(var i=0;i<len;i++){
                    var sizeOfresultState = resultState.length;

                    if (uniqueKeys.indexOf(resultt[i].id)<0){
                        //this will most probably show older objectId only
                        // to insert it on top remove the resultt id on that index
                        // use splice for that.....................
                        uniqueKeys.splice(0, 0, resultt[i].id);
                        resultState.splice(0,0,resultt[i]);
                    }
                    if (sizeOfresultState >=40){
                        //pop last
                        //push first
                        var id = "#" + resultState[0].id + "liItem";
                        window.scrollBy(0,Math.abs($(id).height()));
                        uniqueKeys.pop();
                        resultState.pop();
                        //find current box id from it find its height and then scroll the user up
                        //based on it
                    }
                }

                that.setState({
                    resultState : resultState,
                    parameterToStopOngoingHits:tempCounter,
                    uniqueKeys:uniqueKeys,
                });
            },function(err){
                console.log(err);
            });
        }

    },
    handleNewIdea: function(event) {

        var currentUser = Parse.User.current();
        if (currentUser) {
            // do stuff with the user
            var msg  = $(".addButtonUser").val();
            var that = this ;

            var resultState=this.state.resultState;
            console.log("making a dummy item for now");
         var item=   {
                "createdAt": "2016-01-12T16:20:53.899Z",
                "creatorId": {
                "__type": "Pointer",
                    "className": "_User",
                    "objectId": "fhDsaUqN61"
            },
                "ideaText": "Add",
                "type": 1,
                "updatedAt": "2016-01-12T16:20:54.347Z",
                "objectId": "Roqa8ZNMz1"
            };
            item.ideaText=msg;
            console.log(resultState);
            if(msg.length>0){
                Parse.Cloud.run("newIdea",{ currentUser:"fhDsaUqN6S",  message:msg }).then(function(result){
                    console.log(result);
                    console.log("message was successfully saved");
                    console.log("if it was successful the0n insert the list at first position");
                    console.log(resultState[0]);
                   // resultState.unshift(item);
                    $("#ideaSubmitMsg").fadeIn(1000,function(){
                        setTimeout( function() {
                            $("#ideaSubmitMsg").fadeOut();
                        },1000);
                    });
                    that.setState({
                        resultState:resultState,
                    });

                },function(err){
                    console.log(err);
                });

            }
            else {
                console.log("empty message");
            }
        } else {
            // show the signup or login page
            $("#modal-signup").modal();

        }

}
});

var IdeaBox = React.createClass({
    //we will need to toggle the upvote/downvote
    // so add an object to toggle field
    // like upvoteCount + didHeAlreadyUpvote
    getInitialState : function() {
        var downvoteCountObj = {downvoteCnt : this.props.passedObj.get("downvoteCount") , downvotedByUser : this.props.passedObj.get("downvotedByUser") };
        var upvoteCountObj = {upvoteCnt : this.props.passedObj.get("upvoteCount") , upvotedByUser : this.props.passedObj.get("upvotedByUser")};
        var fieldLeft = {name : "",value :""};
        var rightField = {name:"",value:""};
        return {
            currentIdeaId : this.props.passedObj.id,
            passedObj : this.props.passedObj,
            upvoteCount : upvoteCountObj,
            downvoteCount : downvoteCountObj,
            errorMsg : "",
            flagToSeeIfItVoteIsWritten : 0,
            fieldLeft : fieldLeft,
            fieldRight : rightField
        };
    },
    render: function() {
        var passedObj = this.state.passedObj;
        var ideaText = passedObj.get("ideaText");
        var rating = passedObj.get("rating");
        var score = passedObj.get("score");
        var shareCount = passedObj.get("shareCount");
        var userObjectId = passedObj.get("creatorId").id;
        var username = passedObj.get("creatorId").get("username");
        var profilePic = passedObj.get("creatorId").get("profilePic");

        var updatedAt  = msToTime(new Date().getTime()- new Date(passedObj.toJSON().updatedAt).getTime());
        var voteClassName="icon size-16 agree";
        if (this.state.upvoteCount.upvotedByUser){
             voteClassName="icon size-16 customVoteImg";
        }
        var downVoteClassName = "icon size-16 disagree";
        if (this.state.downvoteCount.downvotedByUser){
            downVoteClassName ="icon size-16 customDownVoteImg";
        }

        //now calling the field row tab
        var type = this.state.passedObj.get("type");
        var classForBuySell="";
        var hideClass = "";
        var ticker = "";
        var innerText = "";
        var statGrpLeft = "stat-group left";
        var statGrpRight = "stat-group right";
        if (type == 133){
            classForBuySell="buyClassColor";
            ticker = this.state.passedObj.get("stock").get("ticker");
            innerText = "Buy";
        }
        else if (type == 137){
            classForBuySell="sellClassColor";
            ticker = this.state.passedObj.get("stock").get("ticker");
            innerText = "Sell";
        }
        else if(type == 1){
            hideClass = "classToDisplayStuff";
            statGrpRight = "stat-group right classToDisplayStuff";
            statGrpLeft = "stat-group left classToDisplayStuff";
        }
        else {
            hideClass="item-stats classToDisplayStuff";
            statGrpRight = "stat-group right classToDisplayStuff";
            statGrpLeft = "stat-group left classToDisplayStuff";
        }

 // changing the order of leftSide and RightSide
        var dummyUrl = "";
       if(this.state.passedObj.get("stock")){
           dummyUrl = this.state.passedObj.get("stock").get("exchange") + ":" + this.state.passedObj.get("stock").get("ticker") + ",";
       }
        var priceInitial = parseInt(passedObj.get("priceInitial")).toFixed(2);
        if (isNaN(priceInitial)){
            priceInitial = "";
        }
        var priceStopLoss = parseInt(passedObj.get("priceStopLoss")).toFixed(2);
        if (isNaN(priceStopLoss)){
            priceStopLoss ="";
        }
        var priceTarget = parseInt(passedObj.get("priceTarget")).toFixed(2);
        if (isNaN(priceTarget)){
            priceTarget = "";
        }
        var returns = parseInt(passedObj.get("currentReturn")).toFixed(2);
            if (isNaN(returns)){
                returns ="";
            }

        var state ;
        if (passedObj.has("state")){
           state = passedObj.get("state");
        }
        else
        {
            state = 2;
        }
        if (state == 0 ) //active
        {
            //let the AjaxPoller do its work
            //pass state,priceTarget,priceStopLoss,initialPrice
            returns = "";

        }
        else if (state == 1){     //target-hit
            //target was hits //dont pass anything
            //make changes over here and store it in the state
            var fieldLeft = {};
            var fieldRigth = {};
            if (type == 133){
                fieldLeft.name = "Initial Price";
                fieldLeft.value= priceInitial;

                fieldRight.name = "Target Price";
                fieldRight.value = priceTarget;
                returns = ((priceTarget - priceInitial)/priceInitial).toFixed(2);
                this.setState({
                    fieldLeft:fieldLeft,
                    fieldRight:fieldRigth
                });

            }
            else {
                fieldLeft.name = "Target Price";
                fieldLeft.value= priceTarget;

                fieldRight.name = "Initial Price";
                fieldRight.value = priceInitial;
                returns = ((priceInitial - priceTarget)/priceInitial).toFixed(2);
                this.setState({
                    fieldLeft:fieldLeft,
                    fieldRight:fieldRigth
                });

            }


        }
        else if (state == -1){     //stop loss hit
            //dont pass anything
            //make changes over here and store it in the state
            var fieldLeft = {};
            var fieldRigth = {};
            if (type == 133) {
                fieldLeft.name = "Initial Price";
                fieldLeft.value= priceInitial;
                fieldRight.name = "StopLoss Price";
                fieldRight.value = priceStopLoss;
                returns = ((priceStopLoss - priceInitial)/priceInitial).toFixed(2);
                this.setState({
                    fieldLeft:fieldLeft,
                    fieldRight:fieldRigth
                });
            }
            else {
                fieldLeft.name = "StopLoss Price";
                fieldLeft.value= priceStopLoss;
                fieldRight.name = "Initial Price";
                fieldRight.value = priceInitial;
                returns = ((priceInitial - priceStopLoss)/priceInitial).toFixed(2);
                this.setState({
                    fieldLeft:fieldLeft,
                    fieldRight:fieldRigth
                });
            }
        }
        else {                      //error

        }

        return (
             <li className="item item-post wide" id={this.state.currentIdeaId + "liItem"} >
                    <div className="item-header">
				<span className="username left" itemProp="reviewer">
				<a href={userObjectId}>@{username}</a>
				</span> <span className="timestamp right" style={{marginRight:'10px'}}>{updatedAt}</span>
                        <div className="clear"></div>
                    </div>
                    <div className="item-body">
                        <div className="avatar size-48 left img-circle " >
                            <img className="img-circle" src={profilePic}></img>
                            <a href={this.state.currentIdeaId}>
                                <div className="avatar-rating pos" title="Percentile">{score}</div>
                            </a>
                        </div>
                        <div className="message ideass" id={this.state.currentIdeaId} itemProp="summary" data-objid={this.state.currentIdeaId} data-url={dummyUrl} data-pricestoploss={priceStopLoss} data-priceinitial={priceInitial} data-pricetarget={priceTarget} data-state={state} data-type={type}>
                           <p style={{marginTop:'11px'}} ><span className="ideaFeedCstClr">{this.state.passedObj.get("creatorId").get("displayName")}</span><span className={hideClass}>&nbsp;
                               initiated</span> <span className={classForBuySell + hideClass}>{innerText}</span><span className={hideClass}> on</span> <span className={"ideaFeedCstClr" + hideClass}>{ticker}</span> </p>
                        </div>
                        <div className="clear"></div>
                        <div className="ideaTextClass" style={{fontWeight:400}}>{ideaText}</div>
                    </div>
                        <div className="item-stats">
                            <div className={statGrpLeft}>
                                <div className="stat">
                                    <span className="label left">Current Price</span>
                                      <span className={"value right" } id={"curPrice"+ this.state.currentIdeaId}></span>
                                </div>
                                <div className="stat">
                                    <span className={"label left leftside " + this.state.currentIdeaId}>{this.state.fieldLeft.name}</span>
                                    <span className={"value right"} id={"leftside" + this.state.currentIdeaId}>{this.state.fieldLeft.value}</span>
                                </div>
                            </div>
                            <div className={statGrpRight}>
                                <div className="stat">
                                    <span className="label left">Return</span>
                                    <span className="value right" id={"return" + this.state.currentIdeaId}>{returns}</span>
                                </div>
                                <div className="stat">
                                    <span className={"label left rightside " + this.state.currentIdeaId}>{this.state.fieldRight.name}</span>
                                    <span className={"value right"} id={"rightside" + this.state.currentIdeaId}>{this.state.fieldRight.value}</span>
                                </div>
                            </div>
                            <div className="clear"></div>
                        </div>

                 <div className="item-footer">
                     <ul className="actions hor left">
                         <li className="">
                             <a className="agree-button" onClick={this.handleUpVote}>
                                 <i className={voteClassName} title="Agree"></i>
                                 <span>{this.state.upvoteCount.upvoteCnt}</span>
                             </a>
                         </li>
                         <li className="">
                             <a className="comment-button" onClick={this.handleChat} >
                                 <i className="icon size-16 comment" title="Comment"></i>
                                 <span></span>
                             </a>
                         </li>
                         <li className="">
                             <a className="disagree-button" onClick={this.handleDownVote} >
                                 <i className={downVoteClassName} title="Disagree"></i>
                                 <span>{this.state.downvoteCount.downvoteCnt}</span>
                             </a>
                         </li>
                     </ul>
                     <button type="button" className="btn customButton" onClick={this.handleShare} >Share</button>
                     <div className="clear"></div>
                 </div>
                 <div className="row" id={"alert" + this.state.currentIdeaId} style={{ marginBottom: '-17px', marginTop: '45px' , display : 'none'}}>
                     <div className="alert alert-danger" >
                         <a href="#" className="close" data-dismiss="alert" aria-label="close">&times;</a>
                         <strong>{this.state.errorMsg}</strong>
                     </div>
                 </div>
                </li>
        );
    },
    dosomething :function(event){
      console.log("came here");

    },
    handleShare : function(event){
        var currentUser = Parse.User.current();
        if (currentUser) {
            // do stuff with the user
        } else {
            // show the signup or login page
            $("#modal-signup").modal();
        }
    },
    handleUpVote : function(event){
        if (this.state.flagToSeeIfItVoteIsWritten == 0){
            this.setState({
                flagToSeeIfItVoteIsWritten:1
            });
        var currentUser = Parse.User.current();
        console.log(currentUser);
        if (currentUser) {
            // do stuff with the user
            console.log(currentUser);
            var currentObjectId = this.state.currentIdeaId;
            console.log("currentObjecID" + currentObjectId);
            var downvoteCountObj = this.state.downvoteCount;
            var upvoteCountObj = this.state.upvoteCount;
            //do not upvote if he has already upvoted
            //this thing should be maintained from backend
            //and we should only update the value when we get a positive return value
            //this thing can be done by backend sending 1,-1 for upvote toggle
            var that = this;
            if (!upvoteCountObj.upvotedByUser){
                Parse.Cloud.run("toggleActivityUpvote",{ currentUser:"fhDsaUqN6S",  ideaId:currentObjectId }).then(function(result) {
                    console.log(result + "upvote was successfull");
                    console.log("now increase the upvote count locally");
                    var upvoteCnt =parseInt(upvoteCountObj.upvoteCnt);
                    console.log(upvoteCnt);
                    if (isNaN(upvoteCnt)){
                        upvoteCnt = 0;
                    }
                    upvoteCnt = upvoteCnt + 1 ;
                    upvoteCountObj.upvoteCnt = upvoteCnt;
                    upvoteCountObj.upvotedByUser = true;
                    if (downvoteCountObj.downvotedByUser){
                        Parse.Cloud.run("toggleActivityDownvote",{ currentUser:"fhDsaUqN6S",  ideaId:currentObjectId });
                        downvoteCountObj.downvotedByUser=false;
                        downvoteCountObj.downvoteCnt -= 1;
                    }
                    that.setState({
                        upvoteCount:upvoteCountObj,
                        downvoteCnt:downvoteCountObj,
                        flagToSeeIfItVoteIsWritten : 0
                    });
                },function(error){
                    console.log(error);
                });
            }else{
                console.log("you have already upvoted on this now remove your upvote");
                Parse.Cloud.run("toggleActivityUpvote",{ currentUser:"fhDsaUqN6S",  ideaId:currentObjectId }).then(function(result) {
                    console.log(result + "upvote downgrade was successfull");
                    console.log("now increase the upvote count locally");
                    var upvoteCnt =parseInt(upvoteCountObj.upvoteCnt);
                    console.log(upvoteCnt);
                    if (isNaN(upvoteCnt)){
                        upvoteCnt = 0;
                    }
                    upvoteCnt = upvoteCnt - 1 ;
                    upvoteCountObj.upvoteCnt = upvoteCnt;
                    upvoteCountObj.upvotedByUser = false;
                    that.setState({
                        upvoteCount:upvoteCountObj,
                        flagToSeeIfItVoteIsWritten : 0
                    });
                },function(error){
                    console.log(error);
                });

            }
        } else {
            // show the signup or login page
            $("#modal-signup").modal();
        }
        }
    },
    handleDownVote : function (event) {
        if (this.state.flagToSeeIfItVoteIsWritten == 0) {
            this.setState({
                flagToSeeIfItVoteIsWritten: 1
            });
            var currentUser = Parse.User.current();
            console.log(currentUser);
            if (currentUser) {
                // do stuff with the user
                console.log(currentUser);
                var currentObjectId = this.state.currentIdeaId;
                console.log("currentObjecID" + currentObjectId);
                var downvoteCountObj = this.state.downvoteCount;
                var upvoteCountObj = this.state.upvoteCount;
                //do not upvote if he has already upvoted
                //this thing should be maintained from backend
                //and we should only update the value when we get a positive return value
                //this thing can be done by backend sending 1,-1 for upvote toggle
                var that = this;
                if (!downvoteCountObj.downvotedByUser) {
                    Parse.Cloud.run("toggleActivityDownvote", {
                        currentUser: "fhDsaUqN6S",
                        ideaId: currentObjectId
                    }).then(function (result) {
                        console.log(result + "upvote was successfull");
                        console.log("now increase the upvote count locally");
                        var downvoteCnt = parseInt(downvoteCountObj.downvoteCnt);
                        if (isNaN(downvoteCnt)) {
                            downvoteCnt = 0;
                        }
                        console.log(downvoteCnt);
                        downvoteCnt = downvoteCnt + 1;
                        downvoteCountObj.downvoteCnt = downvoteCnt;
                        downvoteCountObj.downvotedByUser = true;
                        if (upvoteCountObj.upvotedByUser) {
                            Parse.Cloud.run("toggleActivityUpvote", {
                                currentUser: "fhDsaUqN6S",
                                ideaId: currentObjectId
                            });
                            upvoteCountObj.upvotedByUser = false;
                            upvoteCountObj.upvoteCnt -= 1;
                        }
                        that.setState({
                            downvoteCount: downvoteCountObj,
                            upvoteCount: upvoteCountObj,
                            flagToSeeIfItVoteIsWritten: 0
                        });
                    }, function (error) {
                        console.log(error);
                    });
                } else {
                    console.log("you have already upvoted on this now remove your upvote");
                    Parse.Cloud.run("toggleActivityDownvote", {
                        currentUser: "fhDsaUqN6S",
                        ideaId: currentObjectId
                    }).then(function (result) {
                        console.log(result + "upvote downgrade was successfull");
                        console.log("now increase the upvote count locally");
                        var downvoteCnt = parseInt(downvoteCountObj.downvoteCnt);
                        downvoteCnt = downvoteCnt - 1;
                        downvoteCountObj.downvoteCnt = downvoteCnt;
                        downvoteCountObj.downvotedByUser = false;
                        that.setState({
                            downvoteCount: downvoteCountObj,
                            flagToSeeIfItVoteIsWritten: 0
                        });
                    }, function (error) {
                        console.log(error);
                    });

                }
            } else {
                // show the signup or login page
                $("#modal-signup").modal();
            }
        }
    },
    handleFollow : function(event){
        var currentUser = Parse.User.current();
        if (currentUser) {
            // do stuff with the user
        } else {
            // show the signup or login page
            $("#modal-signup").modal();
        }
    },
    handleChat : function(event){
        var currentUser = Parse.User.current();
        if (currentUser) {
            // do stuff with the user
        } else {
            // show the signup or login page
            $("#modal-signup").modal();
        }
    }
});


//i am not using this function anywhere in my code
var AddButton = React.createClass({
    render : function(){
        return(
            <ul className="item-post-create">
                <li className="item post-create wide">
                    <form className="form-post"  autoComplete="off">
                        <div className="body">
                            <div className="form-post-symbol">
                                <h3>Share your idea</h3>
                                <input className="left addButtonUser" type="text" name="symbol" maxLength="100" placeholder="Enter a symbol" />
                                <a href="#" className="button right " onClick={this.handleClick}>Add</a>
                                <div className="clear"></div>
                            </div>
                        </div>
                    </form>
                </li>
            </ul>
        );
    },
    handleClick: function(event) {
        console.log("now create new idea");
        var msg  = $(".addButtonUser").val();
        console.log(msg);
       if(msg.length>0){
           Parse.Cloud.run("newIdea",{ currentUser:"fhDsaUqN6S",  message:msg }).then(function(result){
           console.log(result);
           console.log("message was successfully saved");
               console.log("now adding new message to react list!!!!!");
           },function(err){
               console.log(err);
           });
       }
        else {
           console.log("empty message");
       }
    }
});

var HeaderLoggedIn =  React.createClass({
   render : function(){
       return(
               <div className="content">
                   <div className="logo-container left">
                       <a className="logo" href="/" title="Talkoot"><img src="logo.png" className="lj-logo-1x"/> </a>
                       <div className="loader hidden">
                           <div className="clock">
                               <div className="face">
                                   <div className="hand hour"></div>
                                   <div className="hand minute"></div>
                               </div>
                           </div>
                       </div>
                   </div>
                   <nav>
                       <ul className="nav hor left">
                           <li className="current"><a href="/">Stock Tips</a></li>
                           <li className=""><a href="/discover">Discover</a></li>
                           <li className=""><a href="/charts">Charts</a></li>
                           <li className=""><a href="/collections">Collections</a></li>
                           <li className=""><a href="/community">Community</a></li>
                       </ul>
                   </nav>

                   <nav>
                       <div id="main-menu" className="dropdown left">
                           <a className="dd-button"><i className="size-16 menu left"></i>Menu</a>
                           <div className="dd-menu width-300">
                               <div className="arrow">
                                   <div>
                                       <div className="outer"></div>
                                       <div className="inner"></div>
                                   </div>
                               </div>
                               <ul className="ver center">
                                   <li className="current"><a href="/">Stock Tips</a></li>
                                   <li className=""><a href="/discover">Discover</a></li>
                                   <li className=""><a href="/charts">Charts</a></li>
                                   <li className=""><a href="/collections">Collections</a></li>
                                   <li className=""><a href="/community">Community</a></li>
                               </ul>
                           </div>
                       </div>
                   </nav>
                   <nav>
                       <div id="account-menu" className="dropdown right">
                           <a className="dd-button">
                               <div className="avatar size-32" ></div>
                               <div className="arrow"><div></div></div>
                           </a>
                           <div className="dd-menu width-300">
                               <div className="arrow">
                                   <div>
                                       <div className="outer"></div>
                                       <div className="inner"></div>
                                   </div>
                               </div>
                               <ul className="ver center">
                                   <li className="user ">
                                       <a href="/rahils">
                                           <div className="avatar big margin-auto default" >
                                               <img src={this.props.curUser.get("profilePic")} className="img-circle userProfileImageRound"/>
                                           </div>
                                           <div className="details margin-auto">
                                               <div className="name">{this.props.curUser.get("displayName")}</div>
                                               <div className="username">{"@" + this.props.curUser.get("username")}</div>
                                           </div>
                                           <div className="clear"></div>
                                       </a>
                                   </li>
                                   <li><a href="/rahils/collections">My Collections</a></li>
                                   <li><a href="/rahils/stocks">Stocks I’m Following</a></li>
                                   <li><a href="/rahils/people">People I’m Following</a></li>
                                   <li><a href="https://itunes.apple.com/us/app/id883723875" target="_blank">iPhone App</a></li>
                                   <li><a href="/settings/profile">Settings</a></li>
                                   <li className="neg" onClick={this.handleUserLogout}><a href="">Log Out</a></li>
                               </ul>
                           </div>
                       </div>
                   </nav>

                   <a className="notification-count right empty" href="/notifications">0</a>

                   <div className="searchbox right">
                       <i className="size-16 search"></i>
                       <form action="/stocks" method="get" autoComplete="off">
                           <input className="right" name="symbol" type="text" placeholder="Search" value="" />
                       </form>
                       <div className="results width-300">
                           <div className="arrow">
                               <div>
                                   <div className="outer"></div>
                                   <div className="inner"></div>
                               </div>
                           </div>
                           <div className="results-list">
                               <div className="message">Search for a stock,company or analyst.</div>
                           </div>
                       </div>
                   </div>
               </div>
       );
   } ,
    handleUserLogout : function(event){
        console.log("logout the user and take him to some logout page !!!!");
        Parse.User.logOut().then(function(success){
            console.log("user logged out successfull");
            location.reload();
        },function(err){
            console.log("some error occured while logging out !!!!");
        })
    }
});



var HeaderGuest =  React.createClass({
    componentDidMount:function(){
        $(".loginHeader").click(function(){
            $('#modal-signup').modal();
            return false;
        });
      //  mountUnmountHeader();
    },
    render:function(){
        return(
                <div className="content">
                    <div className="logo-container left">
                        <a className="logo" href="/" title="Talkoot"><img src="logo.png" className="lj-logo-1x"/> </a>
                        <div className="loader hidden">
                            <div className="clock">
                                <div className="face">
                                    <div className="hand hour"></div>
                                    <div className="hand minute"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <nav>
                        <ul className="nav hor left">
                            <li className="current"><a href="/search">Stock Tips</a></li>
                            <li className=""><a href="/discover">Discover</a></li>
                            <li className=""><a href="/charts">Charts</a></li>
                            <li className=""><a href="/collections">Collections</a></li>
                            <li className=""><a href="/community">Community</a></li>
                        </ul>
                    </nav>
                    <nav>
                        <div id="main-menu" className="dropdown left">
                            <a className="dd-button"><i className="size-16 menu left"></i>Menu</a>
                            <div className="dd-menu width-300">
                                <div className="arrow">
                                    <div>
                                        <div className="outer"></div>
                                        <div className="inner"></div>
                                    </div>
                                </div>
                                <ul className="ver center">
                                    <li className="current"><a href="/search">Stock Tips</a></li>
                                    <li className=""><a href="/discover">Discover</a></li>
                                    <li className=""><a href="/charts">Charts</a></li>
                                    <li className=""><a href="/collections">Collections</a></li>
                                    <li className=""><a href="/community">Community</a></li>
                                    <li className="loginHeader"><a href="">Login</a></li>
                                    <li className="loginHeader"><a href="">Signup</a></li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                    <nav>
                        <ul className="nav hor right margin-left-20">
                            <li className="loginHeader"><a href="">Login</a></li>
                            <li className="outlined loginHeader"><a href="">Signup</a></li>
                        </ul>
                    </nav>
                    <div className="searchbox right" style={{'marginRight':0}}>
                        <i className="size-16 search"></i>
                        <form action="/stocks" method="get" autoComplete="off">
                            <input className="right" name="symbol" type="text" placeholder="Search" value="" />
                        </form>
                        <div className="results width-300">
                            <div className="arrow">
                                <div>
                                    <div className="outer"></div>
                                    <div className="inner"></div>
                                </div>
                            </div>
                            <div className="results-list">
                                <div className="message">Search for a stock,company or analyst.</div>
                            </div>
                        </div>
                    </div>
                </div>
        );
    }
});



console.log("1)Check if user is logged in or not .... 2)If he is logged in then show personalize ideas .....otherwise show ALL IDEAS");
console.log("calling parse cloud code");

Parse.Cloud.run("getFinancialFeed",{ currentUser:"fhDsaUqN6S",  pageSize:25 }).then(function(result){
    console.log("result :" +   JSON.stringify(result));
    console.log("redering diom");
    var len = result.length;
    // nse,nifty
    //  var exchange
    var resId=[];
    for(var i=0;i<len;i++){
        resId.push(result[i].id);
    }
  ReactDOM.render(
        <IdeaFeed results={result} uniqueKeys={resId}  />,
        document.getElementById('customId')
    );
},function(err){
    console.log(err);
});
$(document).on("click", ".dropdown .dd-button", function(a) {
    a.preventDefault();
    $(this).parent().find(".dd-menu").toggle();
});
var currentUser = Parse.User.current();

if (currentUser){
    ReactDOM.render(<HeaderLoggedIn curUser={currentUser} />, document.getElementById('headerId'));

}
else {
    ReactDOM.render(<HeaderGuest  />, document.getElementById('headerId'));

}
function mountUnmountHeader(){
    console.log("came inside unmount");
    var currentUser = Parse.User.current();
    console.log(currentUser);
    ReactDOM.unmountComponentAtNode(document.getElementById('headerId'));
    console.log("component unmounter");
    ReactDOM.render(<HeaderLoggedIn curUser={currentUser}  />, document.getElementById('headerId'));
    console.log("rerendered the login");
    console.log("now adding url");

}
$( "#fbClick" ).click(function() {
    console.log("fbclick");

    fbLogin();
});


function fbLogin(){
    var returnValue = 0;
    // 0 means user was not logged in keep the modal open //1 means user was logged in
    //also change the header field after this
    window.fbAsyncInit = function() {
        Parse.FacebookUtils.init({ // this line replaces FB.init({
            appId      : '456678187869811', // Facebook App ID
            status     : true,  // check Facebook Login status
            cookie     : true,  // enable cookies to allow Parse to access the session
            xfbml      : true,  // initialize Facebook social plugins on the page
            version    : 'v2.3' // point to the latest Facebook Graph API version
        });

        // Run code after the Facebook SDK is loaded.
        console.log("loggin in using fb");
        Parse.FacebookUtils.logIn("public_profile,email,user_likes", {
            success: function(user) {
                returnValue=1;
                if (!user.existed()) {
                    console.log("user does not exist.........lets make call to fb");
                    FB.api('/me?fields=first_name, last_name, picture, email,name', function(response) {
                        console.log(response);
                        var username = response.name;
                        var profile_pic = response.picture.data.url;
                        user.set("displayName",username);
                        user.set("profilePic",profile_pic);
                        user.save().then(function(success){
                            $('#modal-signup').modal('hide');
                            mountUnmountHeader();
                        });
                    });
                } else {
                    console.log("user logged in");
                    console.log("user already in db so it was logged in!!!!!!!");
                    $('#modal-signup').modal('hide');
                    mountUnmountHeader();
                }
            },
            error: function(user, error) {
                console.log(error);
                alert("User cancelled the Facebook login or did not fully authorize.");
            }
        });
    };

    (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

}
