export class UIResource {

    private static loadedPackage: string[] = [];

    public static loadPackage(pkgNames: string[], completeHandler?: Laya.Handler) {
        return new Promise((resolve, reject) => {
            let successNum = 0;
            let check = () => {
                if (successNum == pkgNames.length) {
                    completeHandler?.run();
                    resolve(true);
                }
            }
            pkgNames.forEach(pkgName => {
                let pkgUrl = 'resources/UI/' + pkgName;
                if (UIResource.loadedPackage.indexOf(pkgName) == -1) {
                    console.log(`load package ${pkgUrl}`);
                    fgui.UIPackage.loadPackage(pkgUrl, (pkg) => {
                        UIResource.loadedPackage.push(pkgName);
                        successNum++;
                        check()
                    });
                } else {
                    successNum++;
                    check()
                }
            })
        })
    }

    public static async loadResource(urls: string[], completeHandler?: Laya.Handler) {
        await Laya.loader.load(urls)
        completeHandler?.run()
    }

}