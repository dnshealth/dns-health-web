/**
 * DNSHealth Checker class
 *
 * @author Kasper Oikarinen <kasper@kasgel.fi>
 * @version 0.0.1
 * @license MIT
 */

'use strict';

class DNSChecker {
    constructor(table) {
        // Initialise the terminal view.
        this.terminal = new Termynal(
            '#results',
            {
                startDelay: 500,
                lineData: []
            });
        this.resultsTable = table;
    }

    async start(domain, ns) {
        $("#terminal").show();
        // Print the command to terminal.
        this.terminal.addLines(
            [
                { delay: 10, type: 'input', typeDelay: 20, value: `dnshealth --domain ${domain} --ns ${ns}` }
            ]
        );
        // When the checker is started, we want to print our pending checks to the terminal and the results table.
        // First, get the checks from getChecks, and map them so that each check also contains a class and appropriate text value.
        var data = DNSChecker.getChecks().map(check => {
            check["class"] = "white";
            check["value"] = `<span class="loading">PENDING</span> - ${check["description"] || ''}`;
            return check;
        });
        // So at this point data is an array of objects like {id: 1, description: "Valid hostnames", class: "check-pending", value: "PENDING - Valid hostnames"}
        // Then we add the checks to the terminal. They will be listed like PENDING - Valid hostnames in WHITE text.
        await this.terminal.addChecks(data);
        // TODO add save stuff to table instead if terminal view is disabled...
        // Then, call an appropriate method to actually initiate the checks.
        var result = ApiHandler.request(
            "POST",
            "/check",
            {"domain": domain, "nameservers": ns},
            function(result) {
              // When the response has been received, this will run.
                DNSChecker.showResults(result.checks);
            }
            );

    }

    static showResults(results) {
        // Before showing the results, they need to first be filled in...
        /* Dummy input
        var results = [
            {"id": 0, "result": false},
            {"id": 1, "result": false},
            {"id": 2, "result": true},
            {"id": 3, "result": false},
            {"id": 4, "result": false},
            {"id": 5, "result": false},
            {"id": 6, "result": false},
            {"id": 7, "result": false},
            {"id": 8, "result": false},
            {"id": 9, "result": false},
            {"id": 10, "result": false},
            {"id": 11, "result": false}
        ];*/
        var checks = DNSChecker.getChecks();
        for (let i in results) {
            var s = document.getElementById(`c${results[i]["id"]}`);
            if (results[i]["result"]) {
                // If this particular check passed, show the check as passed.
                // Set span class to green show that it is shown as green.
                s.classList = ["green"];
                s.innerHTML = `PASS - ${checks[i]["description"] || ''}`;
            } else {
                // If this particular check failed, show the check as failed.
                // TODO Show more detailed error message too!
                s.classList = ["red"];
                s.innerHTML = `FAILED - ${checks[i]["description"] || ''}`;
            }
        }

    }

    static getChecks() {
        // This is a "storage" function where we store the checks we wish to run, their descriptions, IDs, and so on.
        return [
            {id: 0, description: "Minimum number of nameservers"},
            {id: 1, description: "Valid hostnames"},
            {id: 2, description: "Name server reachability"},
            {id: 3, description: "Answer authoritatively"},
            {id: 4, description: "Network diversity"},
            {id: 5, description: "Consistency between glue and authoritative data"},
            {id: 6, description: "Consistency between delegation and zone"},
            {id: 7, description: "Consistency between authoritative name servers"},
            {id: 8, description: "No truncation of referrals"},
            {id: 9, description: "Prohibited networks"},
            {id: 10, description: "No open recursive name service"},
            {id: 11, description: "Same source address"},
        ];
    }

}