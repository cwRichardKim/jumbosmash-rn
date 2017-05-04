package com.jumbosmash;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.ianlin.RNFirebaseCrashReport.RNFirebaseCrashReportPackage;
import com.evollu.react.fa.FIRAnalyticsPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.chirag.RNMail.*;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNFirebaseCrashReportPackage(),
            new FIRAnalyticsPackage(),
            new RNMail(),
            new ReactNativePushNotificationPackage(),
            new ImageResizerPackage(),
            new PickerPackage(),
            new RNFetchBlobPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
