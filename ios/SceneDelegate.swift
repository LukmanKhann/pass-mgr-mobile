import UIKit
import React
import React_RCTAppDelegate

@objc(SceneDelegate)
class SceneDelegate: UIResponder, UIWindowSceneDelegate {
  var window: UIWindow?

  func scene(_ scene: UIScene,
             willConnectTo session: UISceneSession,
             options connectionOptions: UIScene.ConnectionOptions) {
    guard let windowScene = scene as? UIWindowScene,
          let appDelegate = UIApplication.shared.delegate as? AppDelegate,
          let factory = appDelegate.reactNativeFactory else { return }

    let window = UIWindow(windowScene: windowScene)
    self.window = window

    // Cold-start deep link / universal link
    let initialURL = connectionOptions.urlContexts.first?.url
      ?? connectionOptions.userActivities
           .first(where: { $0.activityType == NSUserActivityTypeBrowsingWeb })?
           .webpageURL
    let launchOptions: [UIApplication.LaunchOptionsKey: Any]? =
      initialURL.map { [.url: $0] }

    factory.startReactNative(withModuleName: "PasswordManager",   // must match AppRegistry name in index.js
                             in: window,
                             launchOptions: launchOptions)
  }

  // Deep links while app is running
  func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
    guard let url = URLContexts.first?.url else { return }
    RCTLinkingManager.application(UIApplication.shared, open: url, options: [:])
  }

  func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
    RCTLinkingManager.application(UIApplication.shared,
                                  continue: userActivity,
                                  restorationHandler: { _ in })
  }
}