export default class CameraMoveScript extends Laya.Script3D {
    _tempVector3: Laya.Vector3;
    yawPitchRoll: Laya.Vector3;
    resultRotation: Laya.Quaternion;
    tempRotationZ: Laya.Quaternion;
    tempRotationX: Laya.Quaternion;
    tempRotationY: Laya.Quaternion;
    rotaionSpeed: number;
    camera: Laya.Camera;
    lastMouseX: number = 0;
    lastMouseY: number = 0;
    isMouseDown: boolean;
    constructor() {
        super();
        this._tempVector3 = new Laya.Vector3();
        this.yawPitchRoll = new Laya.Vector3();
        this.resultRotation = new Laya.Quaternion();
        this.tempRotationZ = new Laya.Quaternion();
        this.tempRotationX = new Laya.Quaternion();
        this.tempRotationY = new Laya.Quaternion();
        this.rotaionSpeed = 0.00006;
    }
    onAwake() {
        Laya.stage.on(Laya.Event.RIGHT_MOUSE_DOWN, this, this.mouseDown);
        Laya.stage.on(Laya.Event.RIGHT_MOUSE_UP, this, this.mouseUp);
        this.camera = this.owner as Laya.Camera;
    }
    _onDestroy() {
        //关闭监听函数
        Laya.stage.off(Laya.Event.RIGHT_MOUSE_DOWN, this, this.mouseDown);
        Laya.stage.off(Laya.Event.RIGHT_MOUSE_UP, this, this.mouseUp);
    }
    onUpdate() {
        var elapsedTime = Laya.timer.delta;
        if (!isNaN(this.lastMouseX) && !isNaN(this.lastMouseY) && this.isMouseDown) {
            var scene = this.owner.scene;
            Laya.KeyBoardManager.hasKeyDown(Laya.Keyboard.W) && this.moveForward(-0.01 * elapsedTime);//W
            Laya.KeyBoardManager.hasKeyDown(Laya.Keyboard.S) && this.moveForward(0.01 * elapsedTime);//S
            Laya.KeyBoardManager.hasKeyDown(Laya.Keyboard.A) && this.moveRight(-0.01 * elapsedTime);//A
            Laya.KeyBoardManager.hasKeyDown(Laya.Keyboard.D) && this.moveRight(0.01 * elapsedTime);//D
            Laya.KeyBoardManager.hasKeyDown(Laya.Keyboard.Q) && this.moveVertical(-0.01 * elapsedTime);//Q
            Laya.KeyBoardManager.hasKeyDown(Laya.Keyboard.E) && this.moveVertical(0.01 * elapsedTime);//E

            var offsetX = Laya.stage.mouseX - this.lastMouseX;
            var offsetY = Laya.stage.mouseY - this.lastMouseY;

            var yprElem = this.yawPitchRoll;
            yprElem.x -= offsetX * this.rotaionSpeed * elapsedTime;
            yprElem.y -= offsetY * this.rotaionSpeed * elapsedTime;
            this.updateRotation();
        }
        this.lastMouseX = Laya.stage.mouseX;
        this.lastMouseY = Laya.stage.mouseY;


    }
    mouseDown(e) {
        //获得鼠标的旋转值
        this.camera.transform.localRotation.getYawPitchRoll(this.yawPitchRoll);
        //获得鼠标的xy值
        this.lastMouseX = Laya.stage.mouseX;
        this.lastMouseY = Laya.stage.mouseY;
        //设置bool值
        this.isMouseDown = true;

    }
    mouseUp(e) {
        //设置bool值
        this.isMouseDown = false;
    }
    /**
     * 向前移动。
     */
    moveForward(distance) {
        this._tempVector3.x = 0;
        this._tempVector3.y = 0;
        this._tempVector3.z = distance;
        this.camera.transform.translate(this._tempVector3);
    }
    /**
     * 向右移动。
     */
    moveRight(distance) {
        this._tempVector3.y = 0;
        this._tempVector3.z = 0;
        this._tempVector3.x = distance;
        this.camera.transform.translate(this._tempVector3);
    }
    /**
     * 向上移动。
     */
    moveVertical(distance) {
        this._tempVector3.x = this._tempVector3.z = 0;
        this._tempVector3.y = distance;
        this.camera.transform.translate(this._tempVector3, false);
    }

    updateRotation() {
        if (Math.abs(this.yawPitchRoll.y) < 1.50) {
            Laya.Quaternion.createFromYawPitchRoll(this.yawPitchRoll.x, this.yawPitchRoll.y, this.yawPitchRoll.z, this.tempRotationZ);
            this.tempRotationZ.cloneTo(this.camera.transform.localRotation);
            this.camera.transform.localRotation = this.camera.transform.localRotation;
        }
    }
}