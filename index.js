let video = document.getElementsByTagName('video')[0];
let canvas = document.createElement('canvas');
let result = document.getElementById('result');
//let button = document.getElementById('video1');
let playButton = document.getElementById('play');
var interval;

const maxWidth = 90, maxHeight = 60;   

const captureImage = () => {
    let c;
    const [width, height] = clampDimensions(video.videoWidth, video.videoHeight);
    canvas.width = width;
    canvas.height = height;
    //if there is a video then
    if(canvas.width) {
        c = canvas.getContext('2d');
        
        c.clearRect(0, 0, width, height);
        c.drawImage(video, 0, 0, width, height); 
        drawAscii(
            convertToGrayScale(c, width, height),
            width
        ); //
        //result.innerText = toChars(c, canvas.width, canvas.height);
    }
    
}

const beginCapture = () => {    
    interval = setInterval(() => {
        captureImage();
    }, 50)
}

const endCapture = () => {
    if(interval) {
        clearInterval(interval);
    }
}

const play = () => {
    let file = document.getElementById('file').files[0];
    if(!file) {
        alert("please enter a file");
        return;
    }
    let url = URL.createObjectURL(file);
    //console.log(button);
    //button.setAttributes('style', 'display: block');
    //result.setAttributes('style', 'display: block');
    video.src = url;
    video.play();
}

playButton.addEventListener('click', play);
video.addEventListener('play', beginCapture);
video.addEventListener('pause', endCapture);
video.addEventListener('ended', endCapture);
video.addEventListener('playing', () => {
    beginCapture(); endCapture();
})

const toGrayScale = (r, g, b) => {
    return (0.21 * r + 0.71 * g + 0.07 * b);
}

const grayRamp = "@#$!~`.";

const rampLength = grayRamp.length;

//from 0 to 255 the character get "darker"
const getCharacterForGrayScale = (value) => {
    return grayRamp[Math.ceil(((rampLength - 1) * value ) / 255 )];
}

const convertToGrayScale = (context, width, height) => {
    //get curr image data (an array where each pixels has -> r, g, b and alpha)
    const imageData = context.getImageData(0, 0, width, height);
    const grayScales = [];
    //extract rgb components and replace each pixels a related gray scale
    for(let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        //convert rgb value to gray and put it back into the image
        const grayScale = toGrayScale(r, g, b);
        grayScales.push(grayScale);
    }
    return grayScales;
}

const drawAscii = (grayScales, width) => {
    let ascii = "";
    grayScales.forEach((grayScale, index) => {
        let nextChars = getCharacterForGrayScale(grayScale);
        if((index + 1) % width === 0) {
            nextChars += '\n';
        }
        ascii += nextChars;
    })
    result.innerHTML = ascii;
}

const clampDimensions = (width, height) => {
    const rectifiedWidth = Math.floor(fontRatio * width);

    if(height > maxHeight) {
        const reducedWidth = Math.floor((rectifiedWidth * maxHeight) / height);
        return [reducedWidth, maxHeight];
    }
    if(width > maxWidth) {
        const reducedHeight = Max.floor((height * maxWidth) / rectifiedWidth);
        return [maxWidth, reducedHeight];
    }
    
    return [rectifiedWidth, height]
}

const getFontRatio = () => {
    const pre = document.createElement("pre");
    pre.style.display = "inline";
    pre.textContent = " ";
    
    document.body.appendChild(pre);
    const {width, height} = pre.getBoundingClientRect();
    document.body.removeChild(pre);
    
    return height / width;
}

const fontRatio = getFontRatio();