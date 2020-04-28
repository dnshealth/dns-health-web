// This function will be called when the page has finished loading.
$(document).ready(function() {
    let checker = new DNSChecker(null);
    $("#test").click(function() {
        checker.start("kth.se", ["dns1.nordname.net", "dns2.nordname.net"]);
    });
});
