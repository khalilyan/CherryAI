
const openaiIcon = document.getElementById('openaiIcon');
const microphone = document.querySelector('.fa-microphone');
const stopBtn = document.querySelector('.fa-stop');
const input = document.querySelector('#speakInput');
const video = document.querySelector('video');
const recognition = new webkitSpeechRecognition();

recognition.lang = "en-US";
recognition.interimResults = false;
let ifNotSpoke = false;

speechSynthesis.cancel()


microphone.addEventListener('mousedown', () => {
    speechSynthesis.cancel() 
    ifNotSpoke = false;
    recognition.start()
    microphone.style.animationName = 'micAnimate'
    microphone.style.animationPlayState = 'running'
});

microphone.addEventListener('mouseup', () => {
     openaiIcon.style.animationName = 'rotate'
     recognition.stop()
     video.play();
     openaiIcon.style.animationPlayState = 'running'
     openaiIcon.style.fill = 'lightblue';
     microphone.style.animationName = 'none'
     
    });

stopBtn.addEventListener('click',()=>{
     speechSynthesis.cancel();
     video.pause();
     openaiIcon.style.animationPlayState = 'paused';
     openaiIcon.style.fill = 'lightblue';
     ifNotSpoke = false;
    });

recognition.addEventListener('result',(event) => {
    const api_key = document.querySelector('.api_key').value;
    const message = event.results[event.results.length - 1][0].transcript
    input.value = message;
    ifNotSpoke = true

    fetch('/',{
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: message,
            api_key: api_key
        })
    }).then(res=>res.json())
      .then(res => {
        const { response,message,error_message } = res ;
        let utterance = new SpeechSynthesisUtterance(response||message||error_message);
        let voices = window.speechSynthesis.getVoices();
        let voice = voices.filter(voice=>voice.name === 'Microsoft Zira - English (United States)');
        utterance.voice = voice[0];

        utterance.addEventListener('start',()=>{
            openaiIcon.style.fill = 'lightgreen';
        })
        utterance.addEventListener('end',()=>{
            openaiIcon.style.fill = 'lightblue';
            openaiIcon.style.animationPlayState = 'paused'
            video.pause();
            ifNotSpoke = false;
        })
        speechSynthesis.speak(utterance); 
        })
      .catch(error=>{
        video.pause()
        openaiIcon.style.fill = 'darkred';
        openaiIcon.style.animationPlayState = 'paused'
      })
});



recognition.addEventListener('end',() => {
    if(!ifNotSpoke){
        input_empty_responses = [
        `It seems like your message is empty.`,
        `Click and hold the microphone button, then ask your question, and finally, release the click.`,
        `How can I assist you today?`,
        `Are you kidding me or what? Ask me your question.`,
        `If you have any questions or if there's a specific topic you'd like information on, feel free to let me know!`,
        `If you have a question or need assistance with something, please provide more details, and I'll do my best to help!`,
        `Click and hold the microphone button, then ask your question, and finally, release the click.`,
        `Are you kidding me or what? Ask me your question.`,
        `If you're experiencing difficulties, you might try asking your question or request again.`,
        `If you're having trouble communicating, please check if there's any issue with your input method or device.`,
        `Please provide more information, and I'll be happy to assist you!`,
        `Click and hold the microphone button, then ask your question, and finally, release the click.`,
        `Please provide more details, and I'll do my best to help!`,
        `Are you kidding me or what? Ask me your question.`,
        ]
        let index = Math.floor(Math.random() * 10)%14;
        let res = input_empty_responses[index]
        input.value = '';
        let utterance = new SpeechSynthesisUtterance(res);
        let voices = window.speechSynthesis.getVoices();
        let voice = voices.filter(voice=>voice.name === 'Microsoft Zira - English (United States)');
        utterance.voice = voice[0];

        utterance.addEventListener('start',()=>{
            openaiIcon.style.fill = 'darkred';
        })
        utterance.addEventListener('end',()=>{
            openaiIcon.style.fill = 'lightblue';
            openaiIcon.style.animationPlayState = 'paused'
            video.pause();
        })
        speechSynthesis.speak(utterance);   
    }
});

// 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