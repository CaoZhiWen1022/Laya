

export const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

export const sleep_frame = (frame: number) => new Promise((resolve) => Laya.timer.frameOnce(frame, null, resolve))