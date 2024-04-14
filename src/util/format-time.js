function formatTime(time) {
    const seconds = time % 60;
    const minutes = Math.floor(time / 60);

    return minutes.toString().padStart(2, '0') + ':' + seconds.toFixed(1).padStart(4, '0');
}
