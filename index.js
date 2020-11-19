/* --- --- --- --- JavaScript for Simon's Game --- --- --- --- */

/* LIST OF VARIABLES AND ARRAYS */

let p1Pat = [];
let sPat = [];
let sqId = "";
let num = "";
let player1LastScore = 0;
let player1HighScore = 0;
let currentLevel = 1;
let currentRound = 1;
let scoreHist = [];
let currentAudio = "";
let player1LimitMeter = 0;
let player1Sounds = [];
let time = 0;
let meter = 0;
let turnLength = "";
let counter = "";

/* end list of variables and arrays */

/* SOUNDS ARRAY AND PICKER */

function soundPicker() {
  if (Math.ceil(Math.random() * 3) === 1) {
    player1Sounds = starTrekSounds;
  } else if (Math.ceil(Math.random() * 3) === 2) {
    player1Sounds = arnoldSounds;
  } else {
    player1Sounds = marioSounds;
  }
}

var starTrekSounds = [
  "sounds/alert03.mp3",
  "sounds/computerbeep_4.mp3",
  "sounds/computerbeep_59.mp3",
  "sounds/computerbeep_42.mp3",
  "sounds/autodestructsequencearmed_ep.mp3",
]

var arnoldSounds = [
  "sounds/how-are-you.mp3",
  "sounds/howdy.mp3",
  "sounds/idiot.mp3",
  "sounds/sorry-2.mp3",
  "sounds/hasta.mp3",
]

var marioSounds = [
  "sounds/smb_1-up.wav",
  "sounds/smb_bump.wav",
  "sounds/smb_coin.wav",
  "sounds/smb_fireball.wav",
  "sounds/smb_gameover.wav",
]

/* end sounds */

/* SQUARE ANIMATION AND SOUND */

function squareActive() {
  $("#" + sqId + "-box").addClass("anim_sq-pulse");
  setTimeout(function () {
    $("#" + sqId + "-box").removeClass("anim_sq-pulse");
  }, 200);

  switch (sqId) {
    case "sq1":
      var sq1Sound = new Audio(player1Sounds[0]);
      currentAudio = sq1Sound;
      sq1Sound.play();
      break;

    case "sq2":
      var sq2Sound = new Audio(player1Sounds[1]);
      currentAudio = sq2Sound;
      sq2Sound.play();
      break;

    case "sq3":
      var sq3Sound = new Audio(player1Sounds[2]);
      currentAudio = sq3Sound;
      sq3Sound.play();
      break;

    case "sq4":
      var sq4Sound = new Audio(player1Sounds[3]);
      currentAudio = sq4Sound;
      sq4Sound.play();
      break;

    default:
  }
}

/* end square animation and sounds */

/* PLAYER PATTERN VERIFICATION */

function patCheck() {
  if /*Completed Round*/ (sPat[sPat.length - (sPat.length - p1Pat.length) - 1] === p1Pat[p1Pat.length - 1] && p1Pat.length === sPat.length) {
    player1LastScore = p1Pat.length;
    timerStop();
    nextTurn();
    meterFill();
  } else if (sPat[sPat.length - (sPat.length - p1Pat.length) - 1] === p1Pat[p1Pat.length - 1]) {
    currentRound++;
    message();
    hardMode();
  } else {
    currentAudio.pause();
    gameOver();
  }
}

/* end player pattern verification */

/* START GAME */

function startGame() {
  p1Pat = [];
  sPat = [];
  colorGrad($(".meter-fill-bar"));
  simonsTurn();
}

/* end start game */

/* ------ GAME STAGES ------ */

/* INVITE SCREEN */

function inviteFade() {
  $(".ps-invite-pane").addClass("is_invite-fade");
  setTimeout(function () {
    $(".ps-invite-pane").css("display", "none");
    $(".ps-invite-pane").removeClass("is_invite-fade");
  }, 4500);
}

function buttonReset() {
  $(".btn-invite").on("click", function () {
    var z = $(this);
    z.off("click");
    buttonClickMove(z);
    aaa();
  });
}

$(".btn-invite").on("click", function () {
  var z = $(this);
  z.off("click");
  buttonClickMove(z);
  aaa();
});

function buttonClickMove(z) {
  z.css("left", "-=5");
  z.css("top", "+=5");
  setTimeout(function () {
    z.css("left", "+=5");
    z.css("top", "-=5");
  }, 100);
}


function aaa() {
  inviteFade();
  soundPicker();
  setTimeout(function () {
    levelBox();
  }, 4200);
  currentLevel = 1;
  setTimeout(function () {
    instructions(2);
  }, 4000);

  setTimeout(function () {
    startGame();
    buttonReset();
  }, 5000);
}

/* end invite screen */

/* PLAYER'S TURN */

function playerTurn() {
  timerStart();
  $(".color-square1").on("click", function () {
    num = 1;
    numAssignAction(num);
  });

  $(".color-square2").on("click", function () {
    num = 2;
    numAssignAction(num);
  });

  $(".color-square3").on("click", function () {
    num = 3;
    numAssignAction(num);
  });

  $(".color-square4").on("click", function () {
    num = 4;
    numAssignAction(num);
  });

  function numAssignAction(num) {
    sqId = ("sq" + num);
    p1Pat.push(num);
    squareActive();
    patCheck();
  }
}

function playerTurnEnd() {
  p1Pat = [];
  $(".color-square1").off("click");
  $(".color-square2").off("click");
  $(".color-square3").off("click");
  $(".color-square4").off("click");
}

/* end player's turn

/* TIMER, METER, AND LIMIT BUTTONS */

function replay() {
  let position = 0;

  function listSimonPat() {
    sqId = ("sq" + sPat[position]);
    squareActive();
    position++;
  }

  for (let i = 0; i < sPat.length; i++) {
    setTimeout(function () {
      listSimonPat();
    }, i * 1000);
  }
}

function timerStart() {
  time = 0;
  counter = setInterval(function () {
    time++;
    $(".meter-timer").text(time);
  }, 1000);
}

function timerStop() {
  turnLength = time;
  clearInterval(counter);
  $(".meter-timer").text("0");
}

function meterFill() {
  if (turnLength < currentLevel) {
    meter = meter + ((currentLevel - turnLength) - 1);
  }
  let x = (meter * 5);
  let y = "calc(" + x + "% - 20px)";
  $(".meter-fill-bar").css("height", y);
  let z = $(".is_replay-carry-over").attr("style");
  if (meter >= 20 && z == "display: block;") {
    $(".is_replay-carry-over").addClass("is_double");
    $(".is_clear-carry-over").addClass("is_double");
  }
  if (meter >= 20) {
    $(".btn-meter-clear").css("display", "block");
    $(".btn-meter-replay").css("display", "block");
    instructions(3);
  }
}

function currentGameLimitClick() {
  meter = 0;
  $(".btn-meter").css("display", "none");
  $(".meter-fill-bar").css("height", "0");
}

$(".btn-meter-clear").click(function () {
  currentGameLimitClick();
  p1Pat = [];
  time = 0;
  instructions(4);
});

$(".btn-meter-replay").click(function () {
  currentGameLimitClick();
  replay();
  instructions(5);
});

$(".is_clear-carry-over").click(function () {
  $(this).css("display", "none");
  $(".is_replay-carry-over").css("display", "none");
  $(this).removeClass("is_double");
  $(".replay-carry-over").removeClass("is_double");
  p1Pat = [];
  time = 0;
  instructions(4);
});

$(".is_replay-carry-over").click(function () {
  $(this).css("display", "none");
  $(".is_clear-carry-over").css("display", "none");
  $(this).removeClass("is_double");
  $(".is_clear-carry-over").removeClass("is_double");
  replay();
  instructions(5);
});

function carryOverLimitClick() {
  let x = $(".btn-meter-clear").attr("style");
  if (x == "display: block;") {
    $(".btn-meter-clear").css("display", "none");
    $(".is_clear-carry-over").css("display", "block");
    $(".btn-meter-replay").css("display", "none");
    $(".is_replay-carry-over").css("display", "block");
  }
  meter = 0;
  $(".meter-fill-bar").css("height", "0");
}

/* end meter */

/* NEXT TURN */

function nextTurn() {
  playerTurnEnd();
  currentLevel++;
  levelBox();
  currentRound = 1;
  instructions(1);
  setTimeout(function () {
    message(1);
  }, 1000);
  setTimeout(function () {
    simonsTurn();
  }, (Math.ceil(Math.random() * 8) * 1000));
}

/* end next turn */

/* SIMON'S TURN */

function simonsTurn() {
  let newNumber = Math.ceil(Math.random() * 4);
  sPat.push(newNumber);
  console.log(sPat);
  sqId = "sq" + newNumber;
  squareActive();
  playerTurn();
}

/* end simon's turn */

/* GAME OVER */

function gameOver() {
  timerStop();
  playerTurnEnd();
  carryOverLimitClick();
  deathScreen();
  highScore();
  scorePush();
  currentRound = 1;
  p1Pat = [];
  sPat = [];
  levelBox();
}

/* end game over */

/* DEATH SCREEN */

$(".btn-death").click(function () {
  $(".ps-death-pane").css("display", "none");
  $(".ps-invite-pane").css("display", "block");
  $(".ps-death-pane").removeClass("anim_death-pane");
});

function deathScreen() {
  let gameOver = new Audio(player1Sounds[4]);
  gameOver.play();
  $(".ps-death-pane").css("display", "block");
  $(".ps-death-pane").addClass("anim_death-pane");
}

/* end death screen */

/* ------ EVENTS AND VARIABLES ------ */

/* LEVEL, BOX SCORES, SCORE PUSH */

function levelBox() {
  $(".level-num").addClass("is_level-num-change");
  setTimeout(function () {
    $(".level-num").text(currentLevel);

  }, 500);
  $(".level-num").on("animationend", function () {
    $(this).removeClass("is_level-num-change");
  });
}

function highScore() {
  if (currentLevel === 1 && currentRound === 1) {
    player1LastScore = 0;
  }
  if (player1LastScore > player1HighScore) {
    player1HighScore = player1LastScore;
  }
}

function scorePush() {
  $("#player1ScoreBox1").text("Level " + player1LastScore);
  $("#player1HighScore").text("Level " + player1HighScore);
  pastScores();
}

function pastScores() {
  scoreHist.push(player1LastScore);
  if (scoreHist.length > 1) {
    $("#player1ScoreBox2").text("Level " + scoreHist[scoreHist.length - 2]);
  }
  if (scoreHist.length > 2) {
    $("#player1ScoreBox3").text("Level " + scoreHist[scoreHist.length - 3]);
  }
  if (scoreHist.length > 3) {
    $("#player1ScoreBox4").text("Level " + scoreHist[scoreHist.length - 4]);
  }
  if (scoreHist.length > 4) {
    $("#player1ScoreBox5").text("Level " + scoreHist[scoreHist.length - 5]);
  }
}

/* end level, box scores, score push */

/* MESSAGE PANE */

function message(number) {

  switch (number) {
    case 1:
      $("#messages-pop").text("Wait for it ...");
      msgAnimate();
      break;
    default:
  }

  if (currentRound > 5) {
    if (Math.ceil(Math.random() * 10) === 1) {
      $("#messages-pop").text("Oh, sorry bout that ...");
      msgAnimate();
      colorChgRound();
    }
  }

  if (currentRound === 10) {
    $("#messages-pop").text("Round 10!");
    msgAnimate();
  }

  if (currentRound === 15) {
    $("#messages-pop").text("You're Amazing!");
    msgAnimate();
  }

  if (currentRound === 20) {
    $("#messages-pop").text("Are you psychic?");
    msgAnimate();
  }

  if (currentRound === 25) {
    $("#messages-pop").text("You really should go do something else ...");
    msgAnimate();
  }

}

/* end messages */

/* INSTRUCTION PANE */

function instructions(number) {

  switch (number) {
    case 1:
      $("#instructions-pop").text("Next Level!");
      instructFade();
      break;

    case 2:
      $("#instructions-pop").text("Get Ready Milly!");
      instructFade();
      break;

    case 3:
      $("#instructions-pop").text("Choose carefully!");
      instructFade();
      break;

    case 4:
      $("#instructions-pop").text("Start again ...");
      instructFade();
      break;

    case 5:
      $("#instructions-pop").text("Follow closely ...");
      instructFade();
      break;
    default:
  }

}

/* end instructions */

$(".btn-meter-clear").mouseover(function () {
  instructions(4);
});
$(".btn-meter-replay").mouseover(function () {
  instructions(5);
});
$(".is_clear-carry-over").mouseover(function () {
  instructions(4);
});
$(".is_replay-carry-over").mouseover(function () {
  instructions(5);
});

/* CHALLENGE CONDITIONS */

function hardMode() {
  if (currentRound > 5 && Math.ceil(Math.random() * 2) === 1) {
    $(".color").on("click", function () {
      $(this).css("backgroundColor", colorGen);
    });
  } else {
    $(".color").off("click", function () {
      $(this).css("backgroundColor", colorGen);
    });
  }
}

/* end challenge conditions

/* RANDOM COLOR GENERATOR */

function colorGen() {
  let r = Math.floor(Math.random() * 256);
  let g = Math.floor(Math.random() * 256);
  let b = Math.floor(Math.random() * 256);
  let colorValue = "rgb(" + r + ", " + g + ", " + b + ")";
  return colorValue;
}

/* end random color generator */

/* COLOR CHANGING FUNCTIONS AND ASSIGNMENTS */

function colorChgRound() {
  $(".anim_color-change").css("backgroundColor", colorGen);
}

$("#scores").on("dblclick", function () {
  let temp = $(this);
  colorGrad(temp);
});

$("#options").on("dblclick", function () {
  let temp = $(this);
  colorGrad(temp);
});

$("#level").on("dblclick", function () {
  let temp = $(this);
  colorGrad(temp);
});

$("#fill-bar").on("dblclick", function () {
  let temp = $(this);
  colorGrad(temp);
});

$("#header").on("dblclick", function () {
  let temp = $(this);
  colorGrad(temp);
});

function colorGrad(temp) {
  temp.css("backgroundColor", colorGen);
  let n = setInterval(function () {
    temp.css("backgroundColor", colorGen);
  }, 8000);

  temp.on("click", function () {
    clearInterval(n);
    let x = event.currentTarget;
    let y = getComputedStyle(x, null).getPropertyValue("background-color");
    console.log(y);
    temp.css("backgroundColor", y);
  });
}

/* end color changing functions and assignments */

/* COLOR RESET */

$(".hidden-button").click(function () {
  $(".color-square1").css("backgroundColor", "red");
  $(".color-square2").css("backgroundColor", "green");
  $(".color-square3").css("backgroundColor", "yellow");
  $(".color-square4").css("backgroundColor", "blue");
  $(".item1").css("backgroundColor", "var(--pink)");
  $(".item3").css("backgroundColor", "var(--lightgrey)");
  $(".item8").css("backgroundColor", "var(--lightgrey)");
  $(".item9").css("backgroundColor", "var(--lightgrey)");
  $(".item11").css("backgroundColor", "var(--lightgrey)");
});

/* end color reset */

/* ONSCREEN TEXT ANIMATIONS */

function msgAnimate() {
  $("#messages-pop").addClass("anim_msg-pop");
  $("#messages-pop").on("animationend", function () {
    $(this).removeClass("anim_msg-pop");
  });
}

function instructFade() {
  $("#instructions-pop").addClass("anim_instruct-pop");
  $("#instructions-pop").on("animationend", function () {
    $(this).removeClass("anim_instruct-pop");
  });
}

/* end onscreen text animations */

/* end OF DOCUMENT */