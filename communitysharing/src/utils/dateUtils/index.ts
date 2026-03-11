export const getCurrentTime2miunte = (currentTime: number):string => {
    const totalSeconds = Math.floor(currentTime)
    const h = Math.floor(totalSeconds / 3600)
    const minute = Math.floor(totalSeconds / 60);
    const remainSeconds = totalSeconds % 60;

    /**
     * padStart: 在字符串开头补内容 => string.padStart(目标长度, 补的字符)
     */
    const m = minute.toString().padStart(2, "0")
    const s = remainSeconds.toString().padStart(2, "0")

    if (h > 0) {
        return `${h}:${m}:${s}`
    }
    return `${m}:${s}`;
}