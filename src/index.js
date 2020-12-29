  var socket = io();
  var isAddingSeat = false
  var isAddingTable = false
  var seatCtr = 0;
  var tableCtr = 0;
  var settingPosX = 0;
  var settingPosY = 0;
  var selectedObj;
  var isDraggable = false;
  var isEditable = false;
  var currentFloor = 1;

  function addSeat(data) {
    isAddingSeat = true
    var newChair = $("#chairImage").clone().appendTo("#theCanvas");
    seatCtr++;
    $(newChair).attr("id", "chairCount_" + seatCtr);
    updateSeatingCounter()
  }

  function addTable() {
    isAddingTable = true
    var newTable = $("#tableImage").clone().appendTo("#theCanvas");
    tableCtr++;
    $(newTable).attr("id", "tableCount_" + tableCtr);
  }

  function addTable_L() {
    isAddingTable = true
    var newTable = $("#tableImage_L").clone().appendTo("#theCanvas");
    tableCtr++;
    $(newTable).attr("id", "tableCount_" + tableCtr);
  }

  function addTable_S() {
    isAddingTable = true
    var newTable = $("#tableImage_S").clone().appendTo("#theCanvas");
    tableCtr++;
    $(newTable).attr("id", "tableCount_" + tableCtr);
  }

  function addTable_C() {
    isAddingTable = true
    var newTable = $("#tableImage_C").clone().appendTo("#theCanvas");
    tableCtr++;
    $(newTable).attr("id", "tableCount_" + tableCtr);
  }

  function bug() {
    alert("Save is disabled for now!");
  }


  function changePos(data) {
    selectedObj = data;
    isDraggable = true;
    $("#menuBar").hide();
  }


  function mouseEndPos(e) {
    settingPosX = e.clientX - 20
    settingPosY = e.clientY - 20
    setTimeout(function () {
        try {
            if (isDraggable) {
                $("#" + selectedObj.id).css("left", settingPosX);
                $("#" + selectedObj.id).css("top", settingPosY);
                isDraggable = false
            }
        } catch (theError) {}
    }, 50)
  }

  function mouse_position(e) {

    var offsetValX = 10;
    var offsetValY = 10;
    var xPos = (Math.ceil((e.clientX - offsetValX) / 10) * 10) - offsetValX;
    var yPos = (Math.ceil((e.clientY - offsetValY) / 10) * 10) - offsetValX;
    if (isAddingSeat) {
        $('#chairCount_' + seatCtr).css({
            left: xPos,
            top: yPos
        });
    }

    if (isAddingTable) {
        $('#tableCount_' + tableCtr).css({
            left: xPos,
            top: yPos
        });
    }
  }

  document.addEventListener('dragover', function (e) {
    e.preventDefault();
  })

  function showMenu(data) {
    console.log($(data).hasClass("aSeat"));

    if ($(data).hasClass("aSeat")) {
        var generatedX = $("#" + data.id).css("left").split("px")[0]
        var generatedY = $("#" + data.id).css("top").split("px")[0]
        $("#menuBar").css("left", generatedX - 30)
        $("#menuBar").css("top", generatedY - 40)
        $("#menuBar").show();
        var zoomInDiv = $("#menuBar").children()[1];
        var zoomOutDiv = $("#menuBar").children()[2];
        $(zoomInDiv).hide();
        $(zoomOutDiv).hide();
        rotAngle = 0;
    } else {
        var generatedX = $("#" + data.id).css("left").split("px")[0]
        var generatedY = $("#" + data.id).css("top").split("px")[0]
        $("#menuBar").css("left", generatedX - 30)
        $("#menuBar").css("top", generatedY - 40)
        $("#menuBar").show();
        var zoomInDiv = $("#menuBar").children()[1];
        var zoomOutDiv = $("#menuBar").children()[2];
        $(zoomInDiv).show();
        $(zoomOutDiv).show();
        rotAngle = 0;
    }

  }

  function deleteEle() {
    $(selectedObj).remove();
    $("#menuBar").hide();
    updateSeatingCounter();
  }

  var rotAngle = 0;

  function rotateEle() {
    rotAngle += 45
    $(selectedObj).css('-webkit-transform', 'rotate(' + rotAngle + 'deg)');
  }

  function incSize() {
    var currentZoom = $(selectedObj).css("width");
    console.log(typeof (currentZoom));
    var newZoom = (parseFloat(currentZoom) + 10);
    console.log("write : " + newZoom);
    $(selectedObj).css("width", newZoom);
  }

  function decSize() {
    var currentZoom = $(selectedObj).css("width");
    console.log(typeof (currentZoom));
    var newZoom = (parseFloat(currentZoom) - 10);
    console.log("write : " + newZoom);
    $(selectedObj).css("width", newZoom);
  }


  function hideTheBar(data) {
    $("#menuBar").hide();
    selectedObj = data;
  }


  function saveProject() {
    socket.emit("saveTheData", $("#theCanvas").html(), $("#theSeatSelector").html(), seatCtr, tableCtr, currentFloor)
  }

  function loadProject() {
    socket.emit("bringData", currentFloor);
    setTimeout(function () {
        socket.emit("bringData", currentFloor);
    }, 500)

  }

  var loadProjectCounter = 1;
  socket.on("loadTheData", function (canvasData, seatData, sCtr, tCtr, curFloor) {
    loadProjectCounter++;
    if (loadProjectCounter % 2 == 0) {

    } else {
        setTimeout(function () {
            $("#theCanvas").html(canvasData);
            $("#theSeatSelector").html(seatData);
            seatCtr = sCtr;
            tableCtr = tCtr;
            currentFloor = curFloor;
            updateSeatingCounter()
            setTimeout(function () {
                $('.collapsible').collapsible();
            }, 100)
        }, 100)
    }
  })

  function enableEditing() {
    $("#addSeat").attr("onclick", "addSeat(this)");
    $("#addTable").attr("onclick", "addTable()");
    $("#addTable_L").attr("onclick", "addTable_L()");
    $("#addTable_S").attr("onclick", "addTable_S()");
    $("#addTable_C").attr("onclick", "addTable_C()");
    M.toast({
        html: 'editing enabled',
        classes: 'rounded green',
        displayLength: '500'
    });
    for (var i = 0; i < $(".cursor").length; i++) {
        var theEle = $(".cursor")[i]
        $(theEle).attr("onmousedown", "hideTheBar(this)");
        $(theEle).attr("ondblclick", "showMenu(this)");
        $(theEle).attr("ondrag", "changePos(this)");
        if ($(theEle).hasClass("aSeat")) {
            $(theEle).attr("onclick", "isAddingSeat = false");
        } else {
            $(theEle).attr("onclick", "isAddingTable = false");
        }


    }

  }

  function disableEditing() {
    $("#addSeat").removeAttr("onclick");
    $("#addTable").removeAttr("onclick");
    $("#addTable_L").removeAttr("onclick");
    $("#addTable_S").removeAttr("onclick");
    $("#addTable_C").removeAttr("onclick");
    M.toast({
        html: 'editing disabled',
        classes: 'rounded black',
        displayLength: '500'
    });
    for (var i = 0; i < $(".cursor").length; i++) {
        var theEle = $(".cursor")[i]
        $(theEle).removeAttr("onmousedown");
        $(theEle).removeAttr("ondblclick");
        $(theEle).removeAttr("ondrag");
        $(theEle).removeAttr("onclick");
        if ($(theEle).hasClass("aSeat")) {
            $(theEle).attr("onclick", "bookSeat(this)");
        }
    }
  }

  function updateSeatingCounter() {
    var vaccantSeats = 0;
    var occupiedSeats = 0;
    var hotSeats = 0;
    var allotedSeats = 0;
    var disabledSeats = 0;
    var totalSeats = 0;


    for (var i = 1; i < $(".aSeat").length; i++) {
        var ele = $(".aSeat")[i];
        if ($(ele).css("opacity") == "0.1") {
            //console.log("opacity change found : " + $(ele).attr("id"));

        } else {
            totalSeats++;
            //console.log("opacity change not found : " +  $(ele).attr("id"));
            if ($(ele).css("color") == "rgb(255, 0, 0)") { //red
                vaccantSeats++;
                $("#vaccantSeats").html(vaccantSeats);
            } else {
                $("#vaccantSeats").html(vaccantSeats);
            }

            if ($(ele).css("color") == "rgb(0, 0, 0)") { //black
                occupiedSeats++;
                $("#reservedSeats").html(occupiedSeats);
            } else {
                $("#reservedSeats").html(occupiedSeats);
            }

            if ($(ele).css("color") == "rgb(255, 165, 0)") { //orange
                hotSeats++;
                $("#hotSeats").html(hotSeats);
            } else {
                $("#hotSeats").html(hotSeats);
            }


            if ($(ele).css("color") == "rgb(0, 128, 0)") { //green
                allotedSeats++;
                $("#allotSeats").html(allotedSeats);
            } else {
                $("#allotSeats").html(allotedSeats);
            }

            if ($(ele).css("color") == "rgb(128, 128, 128)") { //grey
                disabledSeats++;
                $("#disabledSeats").html(disabledSeats);
            } else {
                $("#disabledSeats").html(disabledSeats);
            }
        }
        $("#totalSeats").html(totalSeats);
        $("#vaccantSeats").html(vaccantSeats);
        $("#reservedSeats").html(occupiedSeats);
        $("#hotSeats").html(hotSeats);
        $("#allotSeats").html(allotedSeats);
        $("#disabledSeats").html(disabledSeats);
    }


  }

  function createDropDown() {
    var teamName = [];
    for (var i = 1; i <= Object.keys(fromConfigFile)[0].length; i++) {
        teamName[i] = fromConfigFile["Teams"]["Team" + i];
        $(".selectTeam").append("<option value='" + i + "'>" + teamName[i] + "</option>");
    }

  }

  function bookSeat(data) {
    if ($(data).attr("isBooked") == "false") {
        var theSeat = $(data).attr("id");
        $("#" + theSeat).css("color", fromConfigFile.Colors.reserved);
        $(data).attr("isBooked", "true");
        setTimeout(function () {
            seatManagement(data)
        }, 100)
        setTimeout(function () {
            $("#li_" + theSeat).click();
        }, 500)

        M.toast({
            html: 'seat booked : ' + $(data).attr("id"),
            classes: 'rounded green',
            displayLength: '500'
        });
    } else {
        var theSeat = $(data).attr("id");
        setTimeout(function () {
            $("#li_" + theSeat).click();
        }, 100)
    }
    updateSeatingCounter();
  }

  function seatManagement(data) {
    var theHTML = "<li id='liParent_" + $(data).attr("id") + "' onmouseout='deHighlightSeat(this)' style='display:none' onmouseover='highlightSeat(this)'  theSeat = '" + $(data).attr("id") + "'>"
    theHTML += '<div id="li_' + $(data).attr("id") + '" class="collapsible-header"><i class="material-icons">filter_drama</i>' + $(data).attr("id") + '</div>';
    theHTML += '<div class="collapsible-body">'
    theHTML += '<select onchange="selectTeam(this)" id="sT_' + $(data).attr("id") + '" hasValue="false" class="browser-default selectTeam"><option selected disabled>Select Team</option></select>'
    theHTML += '<select isAlloted="false" onchange="selectTeamMember(this)" id="sTM_' + $(data).attr("id") + '" class="browser-default selectTeamMember"><option selected disabled>Select Team Member</option></select>'
    theHTML += '</br><div class="center">'
    theHTML += '<span id="vaccanteSeat_' + $(data).attr("id") + '" style="vertical-align:top;width:50px;display:inline-block;font-size:12px"><i class="material-icons distanctIcons red-text" onclick="vaccantSeat(' + $(data).attr("id") + ')">event_seat</i></br>Vaccate</br>Seat</span>'
    theHTML += '<span id="hotSeat_' + $(data).attr("id") + '"style="vertical-align:top;width:50px;display:inline-block;font-size:12px"><i class="material-icons distanctIcons orange-text" onclick="hotSeat(' + $(data).attr("id") + ')">event_seat</i></br>Hot</br>Seat</span>'
    theHTML += '<span id="disableSeat_' + $(data).attr("id") + '"style="vertical-align:top;width:50px;display:inline-block;font-size:12px"><i class="material-icons distanctIcons grey-text" onclick="disableSeat(' + $(data).attr("id") + ')">event_seat</i></br>Disable</br>Seat</span>'
    theHTML += '<span id="deleteSeat_' + $(data).attr("id") + '"style="vertical-align:top;width:50px;display:inline-block;font-size:12px"><i class="material-icons distanctIcons red-text" onclick="deleteSeat(' + $(data).attr("id") + ')">delete</i>Delete</br>Seat</span>'
    theHTML += '</div></div></li>'
    $("#theSeatingList").append(theHTML);
    var teamName = [];
    setTimeout(function () {
        $("#liParent_" + $(data).attr("id")).fadeIn();
        for (var i = 1; i <= Object.keys(fromConfigFile)[0].length; i++) {
            teamName[i] = fromConfigFile["Teams"]["Team" + i];
            $('#sT_' + $(data).attr("id")).append("<option value='" + i + "'>" + teamName[i] + "</option>");
        }
    }, 100)
    $('.tooltipped').tooltip();
  }

  function hotSeat(data) {
    $("#" + data.id).css("color", "orange");
    updateSeatingCounter();
  }

  function disableSeat(data) {
    $("#" + data.id).css("color", "grey");
    updateSeatingCounter();
  }

  function vaccantSeat(data) {
    if ($("#teamSelection_nav").val() == 0) { //admin
        $("#" + data.id).css("color", "red");
        $("#" + data.id).attr("isBooked", "false")
        $("#" + data.id).attr("allocatedmember", "0")
        $("#" + data.id).attr("allocatedto", "0")
        $("#li_" + data.id).parent().remove();
        $("#" + data.id).removeClass("green pulse");
        updateSeatingCounter();
    } else {
        $("#" + data.id).css("color", "black");
        $("#" + data.id).attr("isBooked", "true")
        $("#" + data.id).attr("allocatedto", $("#teamSelection_nav").val())
        $("#" + data.id).attr("allocatedmember", "0")
        $("#sT_" + data.id).val($("#teamSelection_nav").val());
        $("#sT_" + data.id).attr("disabled", "disabled");
        $("#sTM_" + data.id).val(0);
        $("#" + data.id).removeClass("green pulse");
        updateSeatingCounter();
    }

  }

  function deleteSeat(data) {
    $("#" + data.id).remove();
    $("#li_" + data.id).parent().remove();
    updateSeatingCounter()
  }

  var fromConfigFile = {};
  socket.on("fromConfigFile", function (data) {
    fromConfigFile = data;
  })

  function selectTeam(data) {
    var theID = $(data).attr("id");
    var gettingSeat = $(data).attr("id").split("sT_")[1];
    selectedOption = document.getElementById(theID)
    for (var i = 0; i < selectedOption.options.length; i++) {
        var theOption = selectedOption.options[i];
        $(theOption).removeAttr("selected");
    }
    $(selectedOption.options[selectedOption.options.selectedIndex]).attr("selected", "selected");
    var selectTeamMemberDiv = $(data).parent().children()[1];
    $(selectTeamMemberDiv).html("");
    $(selectTeamMemberDiv).append("<option value='0' selected disabled>Select Team Member</option>");
    for (var i = 1; i <= Object.keys(fromConfigFile)[$(data).val()].length; i++) {
        var teamMemberList = fromConfigFile["Team" + $(data).val()]["M" + i];
        var teamMemberName = teamMemberList.split(":")[0];
        var teamMemberNameStatus = teamMemberList.split(":")[1];
        if (teamMemberNameStatus == "A") {
            $(selectTeamMemberDiv).append("<option theMember='M" + i + "' value='" + teamMemberName + "'>" + teamMemberName + "</option>");
        } else {
            $(selectTeamMemberDiv).append("<option theMember='M" + i + "' disabled value='" + teamMemberName + "'>" + teamMemberName + "</option>");
        }
    }
    $("#" + gettingSeat).attr("allocatedTo", $("#sT_" + gettingSeat).val())

  }

  function selectTeamMember(data) {


    function alreadyBookedSeat(data) {
        $(data).val(0);
        setTimeout(function () {
            var theID = $(data).attr("id").split("sTM_")[1];
            console.log(theID);
            if ($("#teamSelection_nav").val() == 0) { //admin
                $("#" + theID).css("color", "red");
                $("#" + theID).attr("isBooked", "false")
                $("#" + theID).attr("allocatedmember", "0")
                $("#" + theID).attr("allocatedto", "0")
                $("#li_" + theID).parent().remove();
                $("#" + theID).removeClass("green pulse");
                updateSeatingCounter();
            } else {
                $("#" + theID).css("color", "black");
                $("#" + theID).attr("isBooked", "true")
                $("#" + theID).attr("allocatedto", $("#teamSelection_nav").val())
                $("#" + theID).attr("allocatedmember", "0")
                $("#sT_" + theID).val($("#teamSelection_nav").val());
                $("#sT_" + theID).attr("disabled", "disabled");
                $("#sTM_" + theID).val(0);
                $("#" + theID).removeClass("green pulse");
                updateSeatingCounter();
            }
            console.log("vaccate done")
        }, 100)
        alert("seat is already booked")
    }

    function settingSeat(data) {
        var getSeatPos = $(data).parent().parent().attr("theSeat");
        $("#" + getSeatPos).css("color", "green");
        //console.log("seat alloted to the member");
        var settingValForDD = $(data).parent().children()[0];
        $(settingValForDD).attr("hasValue", "true");
        $("#" + getSeatPos).attr("hasValue", "true");
        var theID = $(data).attr("id");
        selectedOption = document.getElementById(theID)
        for (var i = 0; i < selectedOption.options.length; i++) {
            var theOption = selectedOption.options[i];
            $(theOption).removeAttr("selected");
        }
        $(selectedOption.options[selectedOption.options.selectedIndex]).attr("selected", "selected");
        $("#" + getSeatPos).attr("allocatedmember", $(data).val());
        $(data).attr("isAlloted", "true")
        updateSeatingCounter();
    }

    var gettingLi = document.querySelectorAll("li");

    if ($(data).attr("isAlloted") == "false") {
        console.log("false mila");
        if (gettingLi.length == 1) {
            console.log("sirf one li hai");
            settingSeat(data)
        } else {
            console.log("multiple li hai");
            var gettingLi = document.querySelectorAll("li");
            var isAlreadyBookedCounter = 0;
            var isAlreadyBooked = false;
            for (var i = 0; i < gettingLi.length; i++) {
                var theEle = gettingLi[i].children[1].children[1].value;
                if (theEle == $(data).val()) {
                    isAlreadyBookedCounter++;
                }
            }
            if (isAlreadyBookedCounter == 2) {
                console.log("exisiting value");
                alreadyBookedSeat(data);
            } else {
                console.log("new value inserting value")
                settingSeat(data)
            }
        }
    } else {
        console.log("true mila");
        var gettingLi = document.querySelectorAll("li");
        var isAlreadyBookedCounter = 0;
        var isAlreadyBooked = false;
        for (var i = 0; i < gettingLi.length; i++) {
            var theEle = gettingLi[i].children[1].children[1].value;
            if (theEle == $(data).val()) {
                isAlreadyBookedCounter++;
            }
        }
        if (isAlreadyBookedCounter == 2) {
            console.log("exisiting value");
            alreadyBookedSeat(data);
        } else {
            console.log("new value inserting value")
            settingSeat(data)

        }
    }


  }

  function highlightSeat(data) {
    $("#" + $(data).attr("theSeat")).addClass("green pulse");
    $("#" + $(data).attr("theSeat")).css("border-radius", "100px");
    var coloredDiv = $(data).children()[0];
    $(coloredDiv).css("background-color", "rgba(0, 0, 0, 0.2)");

  }

  function deHighlightSeat(data) {
    $("#" + $(data).attr("theSeat")).removeClass("green pulse");
    $("#" + $(data).attr("theSeat")).css("border-radius", "0px");
    //$("#"+$(data).attr("theSeat")).css("padding", "00px");
    var coloredDiv = $(data).children()[0];
    $(coloredDiv).css("background-color", "rgba(255, 255, 255)");
  }

  $(document).ready(function () {
    $('.collapsible').collapsible();
    $('.tooltipped').tooltip();
    $('.modal').modal();
    $("#theCanvas").click(function () {
        $("#menuBar").hide();
    })
  });


  function selectTeamProfile(teamCounter) {
    var actualTeamMemberCount = 0;
    var willDisableVaccant = false;
    var readingLiAll = document.querySelectorAll("li");
    for (var i = 0; i < document.querySelectorAll("li").length; i++) {
        var readingLi = $(readingLiAll)[i];
        var theID = $(readingLi).children()[1].children[0].id;
        var selectedOption = document.getElementById(theID)
        var selectedOptionDiv = selectedOption.options[selectedOption.options.selectedIndex];
        var selectedOptionDivVal = ($(selectedOption.options[selectedOption.options.selectedIndex]).val());
        var selDivID = $(selectedOption).attr("id").split("sT_")[1];
        if (teamCounter == selectedOptionDivVal) {
            actualTeamMemberCount++;
            $("#" + selDivID).css("opacity", "1");
            $("#" + selDivID).attr("onclick", "bookSeat(this)");
            $("#li_" + selDivID).parent().show();
            $("#sT_" + selDivID).attr("disabled", "disabled");
            $("#hotSeat_" + selDivID).hide();
            $("#disableSeat_" + selDivID).hide();
            $("#deleteSeat_" + selDivID).hide();

        } else {
            if ($("#" + selDivID).css("color") == fromConfigFile.Colors.hot) {
                $("#" + selDivID).css("opacity", "0.1");
                $("#" + selDivID).removeAttr("onclick");
                $("#li_" + selDivID).parent().hide();
            } else {
                $("#" + selDivID).css("opacity", "0.1");
                $("#" + selDivID).removeAttr("onclick");
                $("#li_" + selDivID).parent().hide();
            }
        }

        if (teamCounter == 0) {
            actualTeamMemberCount++
            $("#" + selDivID).css("opacity", "1")
            $("#" + selDivID).attr("onclick", "bookSeat(this)");
            $("#li_" + selDivID).parent().show();
            $("#sT_" + selDivID).removeAttr("disabled");
            $("#hotSeat_" + selDivID).show();
            $("#disableSeat_" + selDivID).show();
            $("#deleteSeat_" + selDivID).show();
        }
    }

    if (teamCounter == 0) {
        for (var i = 0; i < $(".aSeat").length; i++) {
            var theEle = $(".aSeat")[i];
            if ($(theEle).css("color") == fromConfigFile.Colors.vaccant) {
                $(theEle).css("opacity", "1");
                $(theEle).attr("onclick", "bookSeat(this)");
            } else {

            }
        }
    } else {
        for (var i = 0; i < $(".aSeat").length; i++) {
            var theEle = $(".aSeat")[i];
            if ($(theEle).css("color") == fromConfigFile.Colors.vaccant) {
                $(theEle).css("opacity", "0.1");
                $(theEle).removeAttr("onclick");
            } else {

            }
        }
    }
    setTimeout(function () {
        updateSeatingCounter();
    }, 100)
    return actualTeamMemberCount;

  }

  function teamSelection_Nav() {
    if ($("#teamSelection_nav").attr("isFilled") == "True") {} else {
        for (var i = 1; i <= Object.keys(fromConfigFile)[0].length; i++) {
            var teamMemberList = fromConfigFile["Teams"]["Team" + i];
            $("#teamSelection_nav").append("<option value='" + i + "'>" + teamMemberList + "</option>");
        }
        $("#teamSelection_nav").attr("isFilled", "True");
    }
  }


  function floorSel_nav(data) {
    currentFloor = data;
    setTimeout(function () {
        //loadProject();
        $("#theCanvas").html("");
        $("#theSeatingList").html("");
    }, 100);
    $("#theToolBar").show()
  }


  function genRep(data) {
    $("#canvas-holder").html("");
    $("#canvas-holder").append('<canvas id="chart-area" ></canvas>');

    if (data == 0) {


        var config = {
            type: 'pie',
            data: {
                datasets: [{
                    data: [
                        $("#reservedSeats").html(),
                        $("#hotSeats").html(),
                        $("#allotSeats").html(),
                        $("#vaccantSeats").html(),
                        $("#disabledSeats").html()
                    ],
                    backgroundColor: [
                        "#000000",
                        "rgb(255, 165, 0)",
                        "rgb(0, 128, 0)",
                        "rgb(255, 0, 0)",
                        "rgb(128, 128, 128);",
                    ],
                    label: 'Dataset 1'
                }],
                labels: [
                    $("#reservedSeats").html() + ' : Reserved Seats',
                    $("#hotSeats").html() + ' : Hot Seats',
                    $("#allotSeats").html() + ' : Alloted Seats',
                    $("#vaccantSeats").html() + ' : Vaccant Seats',
                    $("#disabledSeats").html() + ' : Disabled Seats'
                ]
            },
            options: {
                responsive: true,
                legend: {
                    position: 'right',
                },
            }
        };
        var ctx = document.getElementById('chart-area').getContext('2d');
        window.myPie = new Chart(ctx, config);
        selectTeamProfile($("#teamSelection_nav").val())
    } else if (data == "-1") {
        team1Mem = selectTeamProfile(1);
        team2Mem = selectTeamProfile(2);
        team3Mem = selectTeamProfile(3);
        team4Mem = selectTeamProfile(4);
        team5Mem = selectTeamProfile(5);


        var config = {
            type: 'pie',
            data: {
                datasets: [{
                    data: [
                        team1Mem,
                        team2Mem,
                        team3Mem,
                        team4Mem,
                        team5Mem
                    ],
                    backgroundColor: [
                        "#000000",
                        "rgb(255, 165, 0)",
                        "rgb(0, 128, 0)",
                        "rgb(255, 0, 0)",
                        "rgb(128, 128, 128);",
                    ],
                    label: 'Dataset 1'
                }],
                labels: [
                    team1Mem + " : Team1 Name",
                    team2Mem + " : Team2 Name",
                    team3Mem + " : Team3 Name",
                    team4Mem + " : Team4 Name",
                    team5Mem + " : Team5 Name"
                ]
            },
            options: {
                responsive: true,
                legend: {
                    position: 'right',
                },
            }
        };

        var ctx = document.getElementById('chart-area').getContext('2d');
        window.myPie = new Chart(ctx, config);
        selectTeamProfile($("#teamSelection_nav").val())

    } else {
        selectTeamProfile($("#chartSelectOption").val())
        updateSeatingCounter()
        var config = {
            type: 'pie',
            data: {
                datasets: [{
                    data: [
                        $("#reservedSeats").html(),
                        $("#allotSeats").html()
                    ],
                    backgroundColor: [
                        "#000000",
                        "rgb(0, 128, 0)"
                    ],
                    label: 'Dataset 1'
                }],
                labels: [
                    $("#reservedSeats").html() + ' : Reserved Seats',
                    $("#allotSeats").html() + ' : Alloted Seats'
                ]
            },
            options: {
                responsive: true,
                legend: {
                    position: 'right',
                },
            }
        };
        var ctx = document.getElementById('chart-area').getContext('2d');
        window.myPie = new Chart(ctx, config);
        selectTeamProfile($("#teamSelection_nav").val())
        updateSeatingCounter()
    }


  }

  function clearReportSelect() {
    $("#chartSelectOption").html("");
    if ($("#teamSelection_nav").val() == 0) {
        $("#chartSelectOption").append('<option selected disabled>Select Team</option><option value="0">Admin</option><option value="-1">All Teams</option>');
        for (var i = 1; i <= Object.keys(fromConfigFile)[0].length; i++) {
            var teamMemberList = fromConfigFile["Teams"]["Team" + i];
            $("#chartSelectOption").append("<option value='" + i + "'>" + teamMemberList + "</option>");
        }
    } else {
        $("#chartSelectOption").append('<option selected value="' + $("#teamSelection_nav").val() + '">' + fromConfigFile["Teams"]["Team" + $("#teamSelection_nav").val()] + '</option>');
        setTimeout(function () {
            genRep($("#teamSelection_nav").val());
        }, 200)
    }
    $("#canvas-holder").html("");
    $("#canvas-holder").append('<canvas id="chart-area" ></canvas>');

  }

  function viewSideBar() {
    $("#theSeatSelector").fadeIn();
    $("#theSeatSelector").animate({
        "right": "0"
    });
  }

  function hideSideBar() {
    $("#theSeatSelector").animate({
        "right": "-350px"
    });
    $("#theSeatSelector").fadeOut();
    disableOverFlow()
  }

  function viewLegend() {
    $("#theLegend").animate({
        "top": "80px"
    });
  }

  function hideLegend() {
    $("#theLegend").animate({
        "top": "-200px"
    });
    disableOverFlow()
  }

  function disableOverFlow() {
    setTimeout(function () {}, 50);
  }

  var zoomVal = 1;

  function zoomIn(e) {
    console.log(e)
  }


  function panArea(e) {
    e.preventDefault();
    console.log(e)
    if (e.button == "1") {
        console.log("middle mouse cliked at : " + e.clientX, e.clientY);

    }
  }


  function panAreaFinal(e) {
    e.preventDefault();
    console.log(e)
    if (e.button == "1") {
        console.log("middle mouse released at : " + e.clientX, e.clientY);
        console.log($("#theCanvas").position());
    }
  }