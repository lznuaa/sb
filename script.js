let doLog = true;
let log = (s) => {
    if(doLog)
        console.log(s);
};

var timerHandle = null;
var timer = (seconds, onDone = () => {}) => {
    if(timerHandle != null)
        clearInterval(timerHandle);

    let toTime = (s) => {
        var minutes = Math.floor(s / 60);
        var seconds = s - (minutes * 60);

        if (minutes < 10) {
            minutes = "0"+minutes;
        }
        if (seconds < 10) {
            seconds = "0"+seconds;
        }

        return minutes+':'+seconds;
    }
    document.getElementById("time").innerText = toTime(seconds);

    var secLeft = seconds - 1;
    timerHandle = setInterval(() => {
        log(secLeft);
        if(secLeft == -1) {
            clearInterval(timerHandle);
            onDone();
        }
        else {
            document.getElementById("time").innerText = toTime(secLeft);
            secLeft--;
        }
    }, 1000);
};

var pause = () => {
    if(timerHandle != null)
        clearInterval(timerHandle);
}

window.onload = () => {
    var txt = [];
    var count = 0;
    var update = () => {
        var newStr = (count + 1) + "/" + (txt.length);
        log("setting to: " + newStr);
        document.getElementById("deez").innerText = newStr;
        document.getElementById("ans").innerText = "Answer: ???";
    };

    $.getJSON("questions.json", (data) => {
        log("got data!");
        txt = data;
        count = 0;
        update();
    });

    document.getElementById("play").addEventListener("click", () => {
        log("play pressed");
        timer(20);
        speech.text = txt[count].question;
        window.speechSynthesis.speak(speech);
    });

    document.getElementById("next").addEventListener("click", () => {
        log("next pressed");
        count++;
        if (count === txt.length) {
            window.alert("Reached end of questions!");
            count--;
        }
        update();
    });
    document.getElementById("prev").addEventListener("click", () => {
        log("prev pressed");
        count--;
        if (count < 0) {
            count = 0;
        }
        update();
    });
    document.getElementById("skip").addEventListener("click", () => {
        log("skip pressed");
        var v = parseInt(document.getElementById("n").value) - 1;

        if (v < 0) {
            count = 0;
        }
        else if (v >= txt.length){
            count = txt.lenth - 1;
        }
        else{
            count = v;
        }

        update();
    });
    document.getElementById("anwser").addEventListener("click", () => {
        log("answer pressed");
        speech.text = txt[count].answer;
        window.speechSynthesis.speak(speech);
        document.getElementById("ans").innerText = "Answer: " + txt[count].answer;
        pause();
    });
    voices = window.speechSynthesis.getVoices();
};

let speech = new SpeechSynthesisUtterance();
speech.lang = "en";