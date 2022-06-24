package demo;

import android.app.Activity;
import android.graphics.Color;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import ad.MainActivity1;
import ad.MainActivity2;
import ad.MainActivity3;
import layaair.game.browser.ConchJNI;


public class JSBridge {
    public static Handler m_Handler = new Handler(Looper.getMainLooper());
    public static Activity mMainActivity = null;

    public static MainActivity1 mMainActivity1 = null;

    public static MainActivity2 mMainActivity2 = null;

    public static MainActivity3 mMainActivity3 = null;

    public static String TAG = "JSBridge";

    public static int onJsMessageLite(String msg) {
        try {
            JSONObject json = new JSONObject(msg);
            String api = json.getString("api");
            JSONArray args = json.getJSONArray("args");
            final String arg1 = args.getString(0);
            Log.w("onJsMessageLite", api);
            Log.w("onJsMessageLite", args.get(0).toString());

            switch (api) {
                case "test": {
                    Log.d(TAG, "onJsMessageLite: 测试消息通讯");
                    break;
                }
                case "loadVideoAd": {
                    Log.d(TAG, "onJsMessageLite: 开始加载视频");
                    mMainActivity1.loadPortraitAd();
                    break;
                }
                case "playVideoAd": {
                    Log.d(TAG, "onJsMessageLite: 开始播放视屏");
                    mMainActivity1.playVideoAd();
                    break;
                }
                case "randomShowNative": {
                    Log.d(TAG, "onJsMessageLite: 加载原生1000x500");
                    mMainActivity2.randomShowNative();
                    break;
                }
                case "hideNativeBanner5": {
                    mMainActivity2.hideNativeAd();
                    break;
                }
                case "showInsertVideoAd":{
                    mMainActivity3.showInterstitialVideoAd();
                    break;
                }
                case "native_dialog":{
                    mMainActivity2.showNativeDialog();
                    break;
                }
                default:
                    break;
            }

            return 0;
        } catch (Exception e) {
            //            Log.w()
            return -1;
        }
    }


    public static void hideSplash() {
        m_Handler.post(
                new Runnable() {
                    public void run() {
                        MainActivity.mSplashDialog.dismissSplash();
                    }
                });
    }

    public static void setFontColor(final String color) {
        m_Handler.post(
                new Runnable() {
                    public void run() {
                        MainActivity.mSplashDialog.setFontColor(Color.parseColor(color));
                    }
                });
    }

    public static void setTips(final JSONArray tips) {
        m_Handler.post(
                new Runnable() {
                    public void run() {
                        try {
                            String[] tipsArray = new String[tips.length()];
                            for (int i = 0; i < tips.length(); i++) {
                                tipsArray[i] = tips.getString(i);
                            }
                            MainActivity.mSplashDialog.setTips(tipsArray);
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                });
    }

    public static void bgColor(final String color) {
        m_Handler.post(
                new Runnable() {
                    public void run() {
                        MainActivity.mSplashDialog.setBackgroundColor(Color.parseColor(color));
                    }
                });
    }

    public static void loading(final double percent) {
        m_Handler.post(
                new Runnable() {
                    public void run() {
                        MainActivity.mSplashDialog.setPercent((int) percent);
                    }
                });
    }

    public static void showTextInfo(final boolean show) {
        m_Handler.post(
                new Runnable() {
                    public void run() {
                        MainActivity.mSplashDialog.showTextInfo(show);
                    }
                });
    }

    public static void sendMessageToJs(String msg) {
        // ConchJNI.RunJS("alert('hello world')");
        ConchJNI.RunJS("window['layaTower'] ? window['layaTower'].onNativeMessage( '" + msg + "' ) : console.log('no tower');   ");
    }
}
