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
            '#terminal', {
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
                    { delay: 10, type: 'input', typeDelay: 20, value: `dnshealth --domain ${domain} --ns ${ns}` }
                ]
            );

            var result = ApiHandler.request(
                "POST",
                "/check", {
                    "domain": domain,
                    "nameservers": ns,
                    "delegation": $('input#delegated-domain').is(':checked')
                },
                function(result) {
                    // When the response has been received, this will run.
                    DNSChecker.showResults(terminal, result.checks);


                    DNSChecker.requestedNameserver(result.ns);

                }
            );
        } else {
            $("#terminal").hide();
            $("#table-view").html('');

            var result = ApiHandler.request(
                "POST",
                "/check", {
                    "domain": domain,
                    "nameservers": ns,
                    "delegation": $('input#delegated-domain').is(':checked')
                },
                function(result) {

                    DNSChecker.requestedNameserver(result.ns);
                    // When the response has been received, this will run.
                    DNSChecker.showResultsTable(result.checks);
                    $("#table-main").show();
                }
            );
        }
    }

    static requestedNameserver(ns) {
        $("#nameservers").show();
        $("#nameservers ul").html("");

        for (var i = 0; i < ns.length; i++) {
            $("#nameservers ul").append("<li>" + ns[i] + "</li>");
        }
    }

    static showResultsTable(results) {
        for (let i in results) {
            let s = document.getElementById(`c${results[i]["id"]}`);
            if (results[i]["result"]) {
                // If this particular check passed, show the check as passed.
                // Set span class to green show that it is shown as green.
                $('#table-view').append('<tr class="bg-gray-100">' +
                    '<td class="border px-4 py-2">' + results[i]["description"] + '</td>' +
                    '<td class="border px-4 py-2" style="background: lawngreen">PASS</td>' +
                    '</tr>');

            } else {
                $('#table-view').append('<tr class="bg-gray-100">' +
                    '<td class="border px-4 py-2">' + results[i]["description"] + '</td>' +
                    '<td class="border px-4 py-2" style="background: red">FAILD</td>' +
                    '</tr>'

                );
                $('#ex2').append(
                    ' <div class="px-6 py-4">' +
                    ' <div class="font-bold text-xl mb-2">' + results[i]["description"] + '</div>' +
                    ' <p class="text-gray-700 text-base">' + results[i]["details"] + ' </p>' +
                    ' </div>'
                );
            }
        }
        $('#table-main').append('<button id="failBTN" type="button" class="justify-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" data-toggle="modal" data-target="#ex2">Show me more details on what failed</button>')

        $('#ex2').on("click", ".remove_field_modal2", function (e) { //user click on remove text links
            e.preventDefault();
            $(this).parent().parent().hide()

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
