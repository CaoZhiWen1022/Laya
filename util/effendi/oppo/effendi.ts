import EffendiConfig from "./effendi_config";
const qg = window["qg"];
export default class Effendi {
  private sdkVersion: number = 13;
  private options: any = {}
  private fileManager = qg.getFileSystemManager();
  private isSleep: boolean = false;
  private isDoing: boolean = false;
  private static _instance: Effendi;
  constructor() {
  }
  public static getInstance() {
    return this._instance || (this._instance = new this);
  }
  public init() {
    this.initBaseInfo();
    this.initConfigInfo();
    this.loggerInfo(this.options);
    this.initListener();
    this.gameStart();
    this.startUploadDemo();
    console.log('oppo sdk inited');
  }
  public setOpenId(openId): void {
    this.options.openId = openId;
    localStorage.setItem("effendi_openid", openId);
  }

  private gameStart() {
    let params: any = {};
    params.type = 1;
    if (this.options.queryParams && this.options.queryParams.effendiShareId) {
      params.shareId = this.options.queryParams.effendiShareId;
    } else {
      params.shareId = "";
    }
    this.checkParams(params);
    this.addItem(params);

  }

  private pageOpen() {
    this.options.pageCount++;
    var params: any = {};
    params.type = 2;
    this.checkParams(params);
    this.addItem(params);
  }
  private pageClose() {
    var params: any = {};
    params.type = 3;
    this.checkParams(params);
    this.addItem(params);
  }
  public sendPage(prePageId, pageId) {
    if (prePageId) {
      this.options.prePageId = prePageId;
    }
    if (pageId) {
      this.options.currentPageId = pageId;
    }
    var params: any = {};
    params.type = 10;
    params.prePageId = this.options.prePageId;
    params.pageId = this.options.currentPageId;
    params.event = "";
    params.eventParam = {};
    this.checkParams(params);
    this.addItem(params);
  }
  public sendEvent(event, eventParam) {
    var params: any = {};
    params.type = 4;
    params.event = event;
    params.eventParam = eventParam;
    this.checkParams(params);
    this.addItem(params);
  }
  public sendStage(stageId, event, eventParam) {
    var params: any = {};
    params.type = 6;
    params.pageId = stageId;
    params.event = event;
    params.eventParam = eventParam;
    this.checkParams(params);
    this.addItem(params);
  }
  public sendLevel(levelId, event, eventParam) {
    var params: any = {};
    params.type = 7;
    params.levelId = levelId;
    params.event = event;
    params.eventParam = eventParam;
    this.checkParams(params);
    this.addItem(params);
  }
  public sendPay(stageId, levelId, event, eventParam) {
    var params: any = {};
    params.type = 8;

    params.pageId = stageId;
    params.levelId = levelId;
    params.event = event;
    params.eventParam = eventParam;
    this.checkParams(params);
    this.addItem(params);
  }
  private sendHeatHeart(scene) {
    var params: any = {};
    params.type = 5;
    if (scene == 1) {
      this.options.serialNumber++;
      params.serialNumber = this.options.serialNumber;
    } else if (scene == 2) {
      params.serialNumber = -1;
    } else {
      params.serialNumber = -2;
    }
    params.pageId = this.options.currentPageId;
    this.checkParams(params);
    this.addItem(params);
  }
  private sendDuration(duration) {
    try {
      var _this = this;
      var params: any = {};
      params.type = 11;
      params.duration = duration;
      params.sdkVersion = this.sdkVersion;
      params.gameId = this.options.game_id;
      params.channelId = this.options.channel_id;
      params.requestId = this.wxuuid();
      params.sessionId = this.options.sessionId + "_" + this.options.pageCount;
      params.clientTimestamp = new Date().getTime() + Number(this.options.diffTime);
      params.userId = _this.getUserId();
      params.sourceId = _this.options.sourceId;
      params.manufacture = _this.options.manufacture;
      params.model = _this.options.model;
      params.osType = _this.options.osType;
      params.osCode = _this.options.osCode;
      if (_this.options.useOpen) {
        params.openId = _this.getLocalUserId();
      } else {
        params.openId = "";
      }
      var logArray = [params];
      this.loggerReqeust({
        itemArray: logArray,
        success: function (data) {
          _this.loggerInfo(JSON.stringify(logArray) + ";" + JSON.stringify(data));
        },
        fail: function () {
        }
      });
    } catch (e) {
      this.loggerInfo(e);
    }
  }
  private getUserId() {
    if (this.options.currentUserId) {
      return this.options.currentUserId;
    }
    if (this.options.useOpen) {
      if (!this.options.openId) {
        this.options.currentUserId = localStorage.getItem("effendi_openid");
      } else {
        this.options.currentUserId = this.options.openId;
      }
    } else {
      let userId = localStorage.getItem("effendi_userid");
      if (!userId) {
        userId = this.readUserIdFromFile();
        if (userId) {
          localStorage.setItem("effendi_userid", userId);
        }
      }
      if (!userId) {
        userId = this.wxuuid();
        localStorage.setItem("effendi_userid", userId);
        this.writeUserToIdFile(userId);
      }
      this.options.currentUserId = userId;
      if (!this.readUserIdFromFile()) {
        this.writeUserToIdFile(this.options.currentUserId);
      }
    }
    return this.options.currentUserId;

  }
  private getLocalUserId() {
    if (this.options.localUserId) {
      return this.options.localUserId;
    }
    var userId = localStorage.getItem("effendi_userid");
    if (!userId) {
      userId = this.readUserIdFromFile();
      if (userId) {
        localStorage.setItem("effendi_userid", userId);
      }
    }
    if (!userId) {
      userId = this.wxuuid();
      localStorage.setItem("effendi_userid", userId);
      this.writeUserToIdFile(userId);
    }
    this.options.localUserId = userId;
    if (!this.readUserIdFromFile()) {
      this.writeUserToIdFile(this.options.localUserId);
    }
    return this.options.localUserId;
  }
  private writeUserToIdFile(userId) {
    try {
      this.fileManager.writeFileSync(this.options.effendiDir + "effendi_user.data", userId, 'utf-8', false);
      this.loggerInfo("write userId:" + userId);
    } catch (e) {
    }
  }
  private readUserIdFromFile() {
    var userId = "";
    try {
      userId = this.fileManager.readFileSync(this.options.effendiDir + "effendi_user.data", 'utf-8');
      this.loggerInfo("read userId:" + userId);
    } catch (e) {
    }
    return userId;

  }
  private loggerInfo(obj) {
    if (this.options.useLogger) {
      console.log(obj);
    }
  }
  private initBaseInfo() {
    this.options.game_id = EffendiConfig.game_id;
    this.options.channel_id = EffendiConfig.channel_id;
    this.options.useOpen = EffendiConfig.useOpen;
    this.options.useLogger = EffendiConfig.useLogger;
    var SERVER_Url = "https://openapi.jiegames.com";
    if (!this.options.baseURL) {
      this.options.baseURL = SERVER_Url;
    }
    if (!this.options.currentDir) {
      var effendiDir = "qgfile://usr/effendi/";
      var currentDir = effendiDir + "logs/";
      try {
        this.fileManager.mkdirSync(effendiDir, "true");
      } catch (e) {
        this.loggerInfo(e);
      }
      try {
        this.fileManager.mkdirSync(currentDir, "true");
      } catch (e) {
        this.loggerInfo(e);
      }
      this.options.effendiDir = effendiDir;
      this.options.currentDir = currentDir;
    }
    this.options.sessionId = this.wxuuid();
    this.options.pageCount = 0;
    this.options.prePageId = "root";
    this.options.currentPageId = "root";
    this.options.serialNumber = 0;
    var obj = qg.getLaunchOptionsSync();
    if (obj && obj.referrerInfo && obj.referrerInfo.package) {
      this.options.sourceId = obj.referrerInfo.package;
    } else {
      this.options.sourceId = "";
    }
    this.options.queryParams = obj.query;
    let res = qg.getSystemInfoSync();
    this.options.manufacture = res.brand;
    this.options.model = res.model;
    var systemStr = res.system;
    if (systemStr.indexOf("iOS") != -1) {
      this.options.osType = 1;
      this.options.osCode = systemStr;
    } else if (systemStr.indexOf("Android") != -1) {
      this.options.osType = 0;
      this.options.osCode = systemStr;
    } else {
      this.options.osType = 2;
      this.options.osCode = systemStr;

    }
    this.options.isDeviceInfoReady = true;
  }
  private initConfigInfo() {
    var _this = this;
    let request: any = new XMLHttpRequest();
    request.setRequestHeader("content-type", "application/json");
    request.timeout = 10 * 1000;
    request.responseType = "json";
    var url = _this.options.baseURL + '/logger/getCurrentServerTimestamp';
    url += "?gameId=" + _this.options.game_id;
    url += "&channelId=" + _this.options.channel_id;
    request.open("GET", url);
    request.onreadystatechange = function () {
      if (request.readyState == 4 && request.status == 200) {
        if (request.response.code == 200) {
          _this.options.diffTime = Number(request.response.serverTimestamp) - new Date().getTime();
          localStorage.setItem('diffTime', _this.options.diffTime);
        } else {
          _this.options.diffTime = localStorage.getItem('diffTime');
        }
      }
    }
    request.send();
  }
  private initListener() {
    try {
      var showTime = new Date().getTime();
      var _this = this;
      if (qg.onShow) {
        qg.onShow(function () {
          _this.isSleep = false;
          showTime = new Date().getTime();
          _this.options.pageCount++;
          if (_this.options.pageCount > 0) {
            _this.sendHeatHeart(2);
          }

        });
      }
      if (qg.onHide) {
        qg.onHide(function () {
          _this.isSleep = true;
          var hideTime = new Date().getTime();
          var diffTime = hideTime - showTime;
          if (showTime > 0 && hideTime > 0 && diffTime > 0 && diffTime < 24 * 60 * 60 * 1000) {
            _this.sendDuration(diffTime);
          }
        });
      }
    } catch (e) {
      this.loggerInfo(e);
    }
  }
  private addItem(item) {
    try {
      item.sdkVersion = this.sdkVersion;
      item.gameId = this.options.game_id;
      item.channelId = this.options.channel_id;
      item.requestId = this.wxuuid();
      item.sessionId = this.options.sessionId + "_" + this.options.pageCount;
      if (this.options.diffTime) {
        item.clientTimestamp = new Date().getTime() + Number(this.options.diffTime);
      } else {
        item.localTime = new Date().getTime();
      }
      var path = this.options.currentDir + this.getFileName();
      this.fileManager.writeFileSync(path, JSON.stringify(item), 'utf-8', false);
    } catch (e) {
      this.loggerInfo(e);
    }

  }
  private getFileName() {
    var randomNumber = Math.floor(Math.random() * 1000);
    return "log_" + new Date().getTime() + "_" + randomNumber + ".log";
  }
  private checkParams(params) {
    if (!this.options.game_id) {
      throw "游戏ID 不可以为空"
    }
    if (!this.options.channel_id) {
      throw "渠道ID 不可以为空"
    }
    if (!params.type) {
      throw "type 不可以为空"
    }
    if (params.type == 4 || params.type == 6 || params.type == 7 || params.type == 8) {
      if (!params.event) {
        throw "event 不可以为空"
      }
      if (!params.eventParam) {
        throw "eventParam 不可以为空"
      }

    }
    if (params.type == 6 || params.type == 8) {
      if (!params.pageId) {
        throw "stageId 不可以为空"
      }
    }
    if (params.type == 7 || params.type == 8) {
      if (!params.levelId) {
        throw "levelId 不可以为空"
      }
    }
  }
  private wxuuid() {
    var prefix = "af-" + new Date().getTime() + "-";
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 18; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 16), 1);
    }
    return prefix + s.join("");
  }
  private loggerReqeust(obj): void {
    let request: any = new XMLHttpRequest();
    request.setRequestHeader("content-type", "application/json");
    request.timeout = 10 * 1000;
    request.responseType = "json";
    var url = this.options.baseURL + '/logger/uploadGameInfoInner';
    request.open("POST", url);
    request.onreadystatechange = function () {
      if (request.readyState == 4 && request.status == 200) {
        if (request.response.code == 200) {
          if (obj && obj.success) {
            obj.success(request.response);
          }
        } else {
          if (obj && obj.fail) {
            obj.fail();
          }
        }
      } else {
        if (obj && obj.fail) {
          obj.fail();
        }
      }
    }
    request.send(JSON.stringify(obj.itemArray));
  }

  private checkNeedParams(_this) {
    return new Promise(function (resolve, reject) {
      var userId = _this.getUserId();
      if (!userId) {
        reject("userId 或者openid 为空");
        return;
      }
      if (!_this.options.isDeviceInfoReady) {
        reject("设备信息未准备好");
        return;
      }
      if (!_this.options.diffTime) {
        reject("服务器间隔时间未准备好");
        return;
      }
      resolve(_this);
    });
  }
  private readFiles(_this) {
    return new Promise(function (resolve, reject) {
      _this.fileManager.readdir({
        dirPath: _this.options.currentDir,
        success: function (res) {
          resolve([_this, res]);
        },
        fail: function (err) {
          reject("read file error");
        }
      });
    });
  }
  private sendData(objArray) {
    var _this = objArray[0];
    var res = objArray[1];
    return new Promise(function (resolve, reject) {
      if (res.files.length == 0) {
        reject("no files");
        return;
      }
      var fileNameArray = [];
      var logArray = [];
      for (var i = 0; i < res.files.length; i++) {
        try {
          var fileName = res.files[i];
          fileNameArray.push(fileName);
          var content = _this.fileManager.readFileSync(_this.options.currentDir + fileName, 'utf-8');
          var logObj = JSON.parse(content);
          logObj.userId = _this.getUserId();
          logObj.sourceId = _this.options.sourceId;
          logObj.manufacture = _this.options.manufacture;
          logObj.model = _this.options.model;
          logObj.osType = _this.options.osType;
          logObj.osCode = _this.options.osCode;
          if (!logObj.clientTimestamp) {
            logObj.clientTimestamp = Number(logObj.localTime) + Number(_this.options.diffTime);
            delete (logObj.localTime);
          }
          if (_this.options.useOpen) {
            logObj.openId = _this.getLocalUserId();
          } else {
            logObj.openId = "";
          }
          logArray.push(logObj);
        } catch (e) {
          _this.loggerInfo(e);
        }

      }
      logArray.sort(function (obj1, obj2) {
        return obj1.clientTimestamp - obj2.clientTimestamp;
      })
      _this.loggerInfo(logArray);
      _this.loggerReqeust({
        itemArray: logArray,
        success: function (data) {
          for (var i = 0; i < fileNameArray.length; i++) {
            var fileName = fileNameArray[i];
            var path = _this.options.currentDir + fileName;
            try {
              _this.fileManager.unlinkSync(path);
            } catch (e) {
              _this.fileManager.unlink({
                filePath: path
              })
            }

          }
          resolve(data);
        },
        fail: function () {
          if (fileNameArray.length >= 200) {
            for (var i = 0; i < fileNameArray.length; i++) {
              var fileName = fileNameArray[i];
              var path = _this.options.currentDir + fileName;
              _this.fileManager.unlinkSync(path);
            }
          }
          reject("send error");
        }
      });
    });

  }

  private uploadDemo(): void {
    let _this = this;
    if (_this.isDoing) {
      return;
    }
    _this.isDoing = true;
    try {
      var funArray = [_this.checkNeedParams, _this.readFiles, _this.sendData];
      var sequence: any = Promise.resolve(_this);
      funArray.forEach(function (item) {
        sequence = sequence.then(item)
      });
      sequence.then(function (data) {
        _this.isDoing = false;
        _this.loggerInfo(data);
      }).catch(function (e) {
        _this.isDoing = false;
        _this.loggerInfo(e);
      })
    } catch (e) {
      _this.isDoing = false;
      _this.loggerInfo(e);
    }
  }
  private startUploadDemo() {
    var _this = this;
    var uploadHandlerArray = [];
    for (var i = 0; i < 5; i++) {
      uploadHandlerArray[i] = setTimeout(function (index) {
        _this.sendHeatHeart(1);
        _this.uploadDemo();
        clearTimeout(uploadHandlerArray[index]);
      }, (i + 1) * 1000, i);
    }
    var timeTask = setInterval(function () {
      if (!_this.isSleep) {
        _this.sendHeatHeart(1);
        _this.uploadDemo();
      }
    }, 10 * 1000);
  }


}

