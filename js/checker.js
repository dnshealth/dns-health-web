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
            '#terminal',
            {
                startDelay: 500,
                lineData: []
            });
        this.resultsTable = table;
    }

    async start(domain, ns) {
        if ($('input#terminal-view').is(':checked')) {
            $("#terminal").html('');
            $("#table-main").hide();
            $("#terminal").show();
            // Print the command to terminal.
            this.terminal.addLines(
                [
                    {delay: 10, type: 'input', typeDelay: 20, value: `dnshealth --domain ${domain} --ns ${ns}`}
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
                {"domain": domain,
                 "nameservers": ns,
                 "delegation": function(){

                     if($('input#delegated-domain').is(':checked')){
                         
                        return true;

                     }else

                        return false;

                    }()
                },
                function (result) {
                    // When the response has been received, this will run.
                    DNSChecker.showResults(result.checks);
                }
            );
        } else {
            $("#terminal").hide();
            $("#table-view").html('');
            $("#table-main").show();
            var result = ApiHandler.request(
                "POST",
                "/check",
                {"domain": domain,
                "nameservers": ns,
                "delegation": function(){

                    if($('input#delegated-domain').is(':checked')){

                        return true;

                    }else

                       return false;

                   }()
                },
                function (result) {
                    // When the response has been received, this will run.
                    DNSChecker.showResultsTable(result.checks);
                }
            );
        }
    }

    static showResultsTable(results){
        for (let i in results) {
            var s = document.getElementById(`c${results[i]["id"]}`);
            if (results[i]["result"]) {
                // If this particular check passed, show the check as passed.
                // Set span class to green show that it is shown as green.
                $('#table-view').append('<tr  class="bg-gray-100">' +
                    '<td class="border px-4 py-2">' + results[i]["description"] + '</td>' +
                    '<td class="border px-4 py-2" style="background: lawngreen">PASS</td>' +
                    '</tr>');

            } else {
                $('#table-view').append('<tr  class="bg-gray-100">' +
                    '<td class="border px-4 py-2">' + results[i]["description"] + '</td>' +
                    '<td class="border px-4 py-2" style="background: red">FAILED</td>' +
                    '</tr>');
            }
        }
    }


    static showResults(results) {
        for (let i in results) {
            var s = document.getElementById(`c${results[i]["id"]}`);
            if (results[i]["result"]) {
                // If this particular check passed, show the check as passed.
                // Set span class to green show that it is shown as green.
                s.classList = ["green"];
                s.innerHTML = `PASS - ${results[i]["description"] || ''}`;
            } else {
                // If this particular check failed, show the check as failed.
                // TODO Show more detailed error message too!
                s.classList = ["red"];
                s.innerHTML = `FAILED - ${results[i]["description"] || ''}`;
            }
        }
    }
}
