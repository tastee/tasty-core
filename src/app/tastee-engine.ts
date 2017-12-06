import { Instruction } from "./instruction";
import { TasteeReporter } from "./tastee-reporter";

declare var assert: any;
var assert = require('assert');

export class TasteeEngine {

    webdriver = require('selenium-webdriver');
    reporter: TasteeReporter;

    driver: any;
    screenShotPath: string;

    constructor(browser: any, path: string) {
        if (browser) {
            this.driver = new this.webdriver.Builder().forBrowser(browser).build();
        }
        this.screenShotPath = path;
        this.reporter = new TasteeReporter();
    }

    stop(): void {
        this.driver.quit();
    }

    async execute(codeToExecute: Instruction[], tasteeFileName: string): Promise<Instruction[]> {
        var By = this.webdriver.By;
        var until = this.webdriver.until;
        var Actions = this.webdriver.Actions;
        let screenShotPath = this.screenShotPath;
        let driver = this.driver;
        let reporter = this.reporter;
        for (var idx = 0; idx < codeToExecute.length; idx++) {
            try {
                await eval(codeToExecute[idx].command);                
                await codeToExecute[idx].setValid(true);                
                await reporter.takeScreenShot(driver, screenShotPath, tasteeFileName, codeToExecute[idx]);                
            } catch (error) {
                console.log(error);
                await codeToExecute[idx].setValid(false);
                await codeToExecute[idx].setErrorMessage(error.message);
                await reporter.takeScreenShot(driver, screenShotPath, tasteeFileName, codeToExecute[idx]);
            }
        }
        return new Promise<Instruction[]>(_ => codeToExecute);
    }

}

