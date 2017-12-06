import { TasteeCore } from "../../app/tastee-core";
import { TasteeAnalyser } from "../../app/tastee-analyser";
import { TasteeEngine } from "../../app/tastee-engine";
import { Instruction } from "app/instruction";

var fs = require("fs");

describe("Tastee Core Engine", function () {
    let core: TasteeCore;
    beforeEach(function (done) {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
        let engine = new TasteeEngine('phantomjs', './report');
        core = new TasteeCore(new TasteeAnalyser());
        core.init(engine);
        //load asynchronous analyser, then launch tests
        core.addPluginFile('./plugin/common-instructions.conf.tee', function () {
            core.addPluginFile('./src/spec/examples/test-instructions.conf.tee', function () {
                done();
            });
        });
        core.addParamFile('./src/spec/examples/my-parameters.param.tee');
    });

    afterEach(function () {
        core.stop();
    })

    it("will test a simple tastee script", function (done) {
        core.execute("go to 'https://en.wikipedia.org/wiki/Selenium'");
        let instructions = core.execute("check that '.firstHeading' is equal to 'Selenium'");
        if (instructions[0].valid) {
            done();
        }
    });



    it("will test a tastee script with parameters", function (done) {
        core.execute("go to wikipedia.Selenium");
        let instructions = core.execute("check that wikipedia.title is equal to selenium.title")
        if (instructions[0].valid) {
            done();
        }
    });

    it("will test a more complex tastee", function (done) {
        fs.readFile("./src/spec/examples/test-script.tee", "utf8", function (err, data) {
            let instructions = core.execute(data)
            if(instructions.filter(instruction => !instruction.valid).length==0){
                done();
            }
        });
    });

});
