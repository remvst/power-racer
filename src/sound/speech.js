say = (message) => {
    if (!message || !speechSynthesis) return;

    const voices = speechSynthesis.getVoices();

    const idealVoice = (
        voices.filter(x => x.lang == 'en-US')
            .concat(voices.filter((x) => x.lang.indexOf('en' == 0)))
    )[0];

    const x = new SpeechSynthesisUtterance(message);
    x.rate = 0.8;
    x.pitch = 0.01;
    if (idealVoice) x.voice = idealVoice;

    speechSynthesis.cancel();
    speechSynthesis.speak(x);
}
