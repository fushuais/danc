import UIKit
import Capacitor

// 注册自定义视图控制器
extension CAPBridgeViewController {
    open override var prefersHomeIndicatorAutoHidden: Bool {
        return true
    }
}

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // 设置窗口背景色
        if let window = self.window {
            window.backgroundColor = UIColor(red: 1.0, green: 1.0, blue: 254/255.0, alpha: 1.0)
        }

        // 延迟设置 WebView 背景色，确保 Capacitor 已完全初始化
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
            self.setWebViewBackgroundColor()
        }

        return true
    }

    func setWebViewBackgroundColor() {
        guard let window = self.window else { return }

        let bgColor = UIColor(red: 1.0, green: 1.0, blue: 254/255.0, alpha: 1.0)

        // 递归查找并设置所有 WebView 的背景色
        func findAndSetWebViewBackgroundColor(in view: UIView) {
            view.backgroundColor = bgColor

            // 如果是 WKWebView，设置其背景色
            if let webView = view as? WKWebView {
                webView.backgroundColor = bgColor
                webView.scrollView.backgroundColor = bgColor
                webView.isOpaque = true
            }

            // 递归处理子视图
            for subview in view.subviews {
                findAndSetWebViewBackgroundColor(in: subview)
            }
        }

        if let rootViewController = window.rootViewController {
            findAndSetWebViewBackgroundColor(in: rootViewController.view)
        }
    }

    func applicationWillResignActive(_ application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
        // 应用进入后台时重新设置背景色
        setWebViewBackgroundColor()
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    }

    func applicationWillTerminate(_ application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    }

    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        // Called when the app was launched with a url. Feel free to add additional processing here,
        // but if you want the App API to support tracking app url opens, make sure to keep this call
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        // Called when the app was launched with an activity, including Universal Links.
        // Feel free to add additional processing here, but if you want the App API to support
        // tracking app url opens, make sure to keep this call
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }

}
