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
            const terminal = this.terminal;
            terminal.addLines(
                [
                    {delay: 10, type: 'input', typeDelay: 20, value: `dnshealth --domain ${domain} --ns ${ns}`}
                ]
            );

            var result = ApiHandler.request(
                "POST",
                "/check",
                {
                    "domain": domain,
                    "nameservers": ns,
                    "delegation": $('input#delegated-domain').is(':checked')
                },
                function (result) {
                    // When the response has been received, this will run.
                    DNSChecker.showResults(terminal, result.checks);
                }
            );
        } else {
            $("#terminal").hide();
            $("#table-view").html('');
            $("#table-main").show();
            var result = ApiHandler.request(
                "POST",
                "/check",
                {
                    "domain": domain,
                    "nameservers": ns,
                    "delegation": $('input#delegated-domain').is(':checked')
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
                $('#table-view').append('<tr class="bg-gray-100">' +
                    '<td class="border px-4 py-2">' + results[i]["description"] + '</td>' +
                    '<td class="border px-4 py-2" style="background: lawngreen">PASS</td>' +
                    '</tr>');
                    //console.log(results[i]["description"])
            } else {
                $('#table-view').append('<tr class="bg-gray-100">' +
                    '<td class="border px-4 py-2">' + results[i]["description"] + '</td>' +
                    '<td class="border px-4 py-2" style="background: red">' +
                    '<button id="failBTN" type="button" class="btn btn-primary" data-toggle="modal" data-target="#ex2">FAILED</button></td>' +
                    '</tr>');

                    $('#ex2').append('<div role="document">' +
                    '<div class="modal-content">' +
                    '<div class="modal-header">' +
                    '<h2 class="modal-title" id="popupModal" style="text-align: center">' + results[i]["description"] + '</h2>' +
                    '</div>' +
                    '<div class="modal-body justify-center">' +
                    '<p id="ip-egg"></p>' +
                    '<p>'+ results[i]["details"]+'</p>' +
                    '</div>' +
                    '<div class="modal-footer">' +
                    '<button tabindex="-1" class="remove_field_modal2 close" data-dismiss="modal" style="float: right">&#10060;</button>' +
                    '</div>' +
                    '</div>');
        
            }
        }
        
        $('#ex2').on("click", ".remove_field_modal2", function (e) { //user click on remove text links
            e.preventDefault();
            $(this).parent().parent().parent().parent().hide()

        });
    }

    static showResults(terminal, results) {
        var data = results.map(check => {
            if (check["result"]) {
                check["class"] = "green";
                check["value"] = `PASS - ${check["description"] || ''}`;
                return check;
            } else {
                check["class"] = "red";
                check["value"] = `FAILED - ${check["description"] || ''}`;
                return check;
            }
        });
        terminal.addChecks(data);
    }
}
