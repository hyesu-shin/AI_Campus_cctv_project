// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/pose

// the link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/V9pc4PwmV/";
let model, webcam, ctx, labelContainer, maxPredictions;

var start = 0
var count = 0

async function init() {
    if (start == 0){
        document.getElementById("fake_canvas").style.opacity = 0
        $("#canvas").fadeIn(500);

        count = 0

        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        // load the model and metadata
        // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
        // Note: the pose library adds a tmPose object to your window (window.tmPose)
        model = await tmPose.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        // Convenience function to setup a webcam
        const size = 1000;
        const flip = true; // whether to flip the webcam
        webcam = new tmPose.Webcam(size, size, flip); // width, height, flip
        await webcam.setup(); // request access to the webcam
        await webcam.play();
        test = window.requestAnimationFrame(loop);

        // append/get elements to the DOM
        const canvas = document.getElementById("canvas");
        canvas.width = size; canvas.height = size;
        ctx = canvas.getContext("2d");
        labelContainer = document.getElementById("label-container");
        // for (let i = 0; i < maxPredictions; i++) { // and class labels
        //     labelContainer.appendChild(document.createElement("div"));
        // }
        start = 1;
        document.getElementById("onoff").innerHTML = "OFF";
    }
    else{
        await webcam.pause();
        webcam.stop();          

        $("#canvas").fadeOut(500);
        document.getElementById("fake_canvas").style.opacity = 1
        start = 0;
        document.getElementById("onoff").innerHTML = "ON";
    }
    
}

async function pause() {
    await webcam.pause();
}

async function loop(timestamp) {
    webcam.update(); // update the webcam frame
    await predict();
    test = window.requestAnimationFrame(loop);
}

const maxNumber = Math.pow(10, 1000);
var current_time = ""
async function predict() {
    // Prediction #1: run input through posenet
    // estimatePose can take in an image, video or canvas html element
    const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
    // Prediction 2: run input through teachable machine classification model
    const prediction = await model.predict(posenetOutput);

    for (let i = 0; i < maxPredictions; i++) {
        // const classPrediction =
        //     prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        // labelContainer.childNodes[i].innerHTML = classPrediction;  
        var date = new Date();
        if (prediction[i].className == 'Class 2' && prediction[i].probability.toFixed(2) > 0.9){
            if (document.getElementById("fake_canvas").style.opacity == 0){
                count += 1
                console.log(count)
            }
        }
        else if (prediction[i].className == 'Class 2' && prediction[i].probability.toFixed(2) < 0.9){
            count = 0
            console.log(count)
        }

        if (count == 50){
            if (count < maxNumber){
                var year = date.getFullYear();
                var month = date.getMonth();
                var day = date.getDate();
                var hour = date.getHours();
                var minute = date.getMinutes();
                current_time = year + " - " + month + " - " + day + " " + hour + " : " + minute;
                await notice();
                await email();
           
                var li = document.createElement("li");
                li.setAttribute("id","notification");
                li.innerHTML = current_time +  '<br/>' + "비정상적인 접근 발생";
                labelContainer.append(li);
                count += maxNumber
            }
        }
    }

    // finally draw the poses
    drawPose(pose);
}

function drawPose(pose) {
    if (webcam.canvas) {
        ctx.drawImage(webcam.canvas, 0, 0);
        // draw the keypoints and skeleton
        if (pose) {
            const minPartConfidence = 0.5;
            tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
            tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
        }
    }
}

async function notice(){
    $.ajax({
        url:  "/notice/",
        type: 'post',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify({"time": current_time}),
        success:function(response){
            if(response['error']){
                console.log('알림 db에 넣기 성공')
            }
            else{
                console.log('알림 db에 넣기 실패')
            }
        },
        error : function(xhr, error){
            console.log(error)
        }
    });
}

async function email() {
    $.ajax({
        url : "/email/",
        type:"post",
    });
}