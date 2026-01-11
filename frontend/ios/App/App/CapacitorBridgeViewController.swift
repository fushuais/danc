import UIKit
import Capacitor
import WebKit

class CapacitorBridgeViewController: CAPBridgeViewController {

    // 自动隐藏 Home Indicator（底部横条）
    override var prefersHomeIndicatorAutoHidden: Bool {
        return true
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        
        // 设置 WebView 背景色
        if let webView = self.bridge?.webView {
            webView.backgroundColor = UIColor(red: 1.0, green: 1.0, blue: 254/255.0, alpha: 1.0)
            webView.scrollView.backgroundColor = UIColor(red: 1.0, green: 1.0, blue: 254/255.0, alpha: 1.0)
            webView.isOpaque = true
        }
        
        // 设置视图背景色
        self.view.backgroundColor = UIColor(red: 1.0, green: 1.0, blue: 254/255.0, alpha: 1.0)
        
        // 确保内容延伸到屏幕底部
        self.edgesForExtendedLayout = .bottom
        self.extendedLayoutIncludesOpaqueBars = false
        self.automaticallyAdjustsScrollViewInsets = false
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        
        // 再次确保背景色设置
        if let webView = self.bridge?.webView {
            webView.backgroundColor = UIColor(red: 1.0, green: 1.0, blue: 254/255.0, alpha: 1.0)
            webView.scrollView.backgroundColor = UIColor(red: 1.0, green: 1.0, blue: 254/255.0, alpha: 1.0)
        }
    }
}
