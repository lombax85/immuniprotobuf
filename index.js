const args = process.argv.slice(2);

if (args.length != 1) {
    console.log(`
        Usage: "node index.php filename.bin"
    `);
    process.exit(0);
}

var protobuf = require("protobufjs");
const fs = require('fs');

protobuf.load("./immuni.proto", function(err, root) {

    var buffer = fs.readFileSync(args[0]).slice(12);


    // Obtain a message type
    var msg = root.lookupType("TemporaryExposureKeyExport");

    // Decode an Uint8Array (browser) or Buffer (node) to a message

    var errMsg = msg.verify(buffer);
    if (errMsg)
        throw Error(errMsg);

    try {
        var message = msg.decode(buffer);
    } catch (e) {
        if (e instanceof protobuf.util.ProtocolError) {
            // e.instance holds the so far decoded message with missing required fields
            console.log(e);
        } else {
            // wire format is invalid
            console.log('invalid');
        }
    }

    console.log(message);
});