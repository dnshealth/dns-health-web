/**
 * DNSHealth Checker class
 *
 * @author Kasper Oikarinen <kasper@kasgel.fi>
 * @version 0.0.1
 * @license MIT
 */

'use strict';

class DNSChecker {
    constructor() {
        // Initialise the terminal view to the #terminal HTML DOM element.
        this.terminal = new Termynal(
            '#terminal', {
                startDelay: 500,
                lineData: []
            });
    }

    async start(domain, ns) {
        // When we start the DNS checker, we will check if terminal view is enabled on not.
        // Depending on the result, we either print the results to terminal or the table view.
        if ($('input#terminal-view').is(':checked')) {
            // When terminal view is enabled, we will first empty the terminal of any previous content, hide the table and show the terminal.
            $("#terminal").html('');
            $("#table-main").hide();
            $("#terminal").show();
            // Animate the dnschecker command typing to the terminal.
            const terminal = this.terminal;
            terminal.addLines(
                [
                    { delay: 10, type: 'input', typeDelay: 20, value: `dnshealth --domain ${domain} --ns ${ns}` }
                ]
            );

            // Make an AJAX request to the /check endpoint in the REST API.
            // Pass the domain, nameservers and value of the delegated domain checkbox to the endpoint
            const result = ApiHandler.request(
                "POST",
                "/check", {
                    "domain": domain,
                    "nameservers": ns,
                    "delegation": $('input#delegated-domain').is(':checked')
                },
                function(result) {
                    // When the response has been received, this will run. Show the results in the terminal.
                    DNSChecker.showResults(terminal, result.checks);

                    // Print the nameservers we checked towards.
                    DNSChecker.requestedNameserver(result.ns);
                }
            );
        } else {
            $("#terminal").hide();
            $("#table-view").html('');
            const result = ApiHandler.request(
                "POST",
                "/check", {
                    "domain": domain,
                    "nameservers": ns,
                    "delegation": $('input#delegated-domain').is(':checked')
                },
                function(result) {

                    // Print the nameservers we checked towards.
                    DNSChecker.requestedNameserver(result.ns);

                    // When the response has been received, this will run. Show the results in the table.
                    DNSChecker.showResultsTable(result.checks);
                    // Show the table only after we received the results :)
                    $("#table-main").show();
                }
            );
        }
    }

    static requestedNameserver(ns) {
        // Show the #nameservers DOM and empty the content in the list within.
        $("#nameservers").show();
        $("#nameservers ul").html("");

        // Append the nameservers we got back from the REST API to the list within.
        for (let i = 0; i < ns.length; i++) {
            $("#nameservers ul").append("<li>" + ns[i] + "</li>");
        }
    }

    static showResultsTable(results) {
        // for each check result we got, check if it passed or failed and append the appropriate DOM to table view.
        for (let i in results) {
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
                    '<td class="border px-4 py-2" style="background: red">FAILED</td>' +
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
        $('#table-main').append('<button id="failBTN" type="button" class="justify-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" data-toggle="modal" data-target="#ex2">Show me what failed</button>')

        $('#ex2').on("click", ".remove_field_modal2", function (e) { //user click on remove text links
            e.preventDefault();
            $(this).parent().parent().hide()

        });

    }

    static showResults(terminal, results) {
        // Create an array of check result objects with map() which we then pass to the terminal script, to print the results.
        const data = results.map(check => {
            if (check["result"]) {
                check["class"] = "green"; // This sets the DOM class to green. It is set in the CSS to have a green text color.
                check["value"] = `PASS - ${check["description"] || ''}`;
                return check;
            } else {
                check["class"] = "red"; // Red text colour.
                check["value"] = `FAILED - ${check["description"] || ''}`;
                return check;
            }
        });
        terminal.addChecks(data); // Pass the object to the terminal script, in order to print the results.
    }
}
