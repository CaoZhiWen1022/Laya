interface vec2 {
    x: number
    y: number
}

export default class VecUtil {
    /**
     * 计算两个向量的夹角（弧度）
     */
    static angle(x1, y1, x2, y2) {

        let magSqr1 = x1 * x1 + y1 * y1;
        let magSqr2 = x2 * x2 + y2 * y2;

        if (!magSqr1 || !magSqr2) return 0;

        let dot = x1 * x2 + y1 * y2;
        let theta = dot / Math.sqrt(magSqr1 * magSqr2);
        theta = Math.max(-1, Math.min(1, theta));

        return Math.acos(theta);
    }

    /**
     * 计算两个向量的夹角（弧度）
     */
    static signAngle(x1, y1, x2, y2) {
        let angle = this.angle(x1, y1, x2, y2);
        let cross = x1 * y2 - x2 * y1;
        return cross < 0 ? -angle : angle;
    }

    /**
     * 计算两个向量的夹角（弧度）
     */
    static angleV(v1: vec2, v2: vec2) {
        return this.angle(v1.x, v1.y, v2.x, v2.y);
    }

    /**
     * 计算两个向量的夹角（弧度）
     */
    static signAngleV(v1: vec2, v2: vec2) {
        return this.signAngle(v1.x, v1.y, v2.x, v2.y);
    }

    static lerp(a: number, b: number, t: number) {
        return (b - a) * t + a
    }

    /** 两个角度之间的夹角（弧度） */
    static angleR(radian1: number, radian2: number) {
        return this.angle(Math.cos(radian1), Math.sin(radian1), Math.cos(radian2), Math.sin(radian2))
    }

    /** 两个角度之间的夹角（弧度） */
    static signAngleR(radian1: number, radian2: number) {
        return this.signAngle(Math.cos(radian1), Math.sin(radian1), Math.cos(radian2), Math.sin(radian2))
    }

    /** 二阶贝塞拉 */
    static lerp2(a: number, b: number, c: number, t: number) {
        return Math.pow((1 - t), 2) * a
            + 2 * t * (1 - t) * b
            + Math.pow(t, 2) * c;
    }

    /** 三阶贝塞尔 */
    static lerp3(a: number, b: number, c: number, d: number, t: number) {
        return Math.pow((1 - t), 3) * a
            + 3 * b * t * (1 - t) * (1 - t)
            + 3 * c * t * t * (1 - t)
            + d * Math.pow(t, 3);
    }

}