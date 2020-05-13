/**
 * DNSHealth Checker class
 *
 * @author Kasper Oikarinen <kasper@kasgel.fi>
 * @author Hristo Georgiev <h.georgiev121@gmail.com>
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
                    console.log(result.ns);

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

    //Show PASS / FAIL Results in a table view with description
    static showResultsTable(results) {
        for (let i in results) {
            let s = document.getElementById(`c${results[i]["id"]}`);
            if (results[i]["result"]) {
                // If this particular check passed, show the check as passed.
                // Set span class to green show that it is shown as green.
                // This will render the PASSED tests in the table.
                $('#table-view').append('<tr class="bg-gray-100">' +
                    '<td class="border px-4 py-2">' + results[i]["description"] + '</td>' +
                    '<td class="border px-4 py-2" style="background: lawngreen">PASS</td>' +
                    '</tr>');

            } else {
                // This will render the FAILED tests in the table.
                $('#table-view').append('<tr class="bg-gray-100">' +
                    '<td class="border px-4 py-2">' + results[i]["description"] + '</td>' +
                    '<td class="border px-4 py-2" style="background: red">FAILED</td>' +
                    '</tr>'
                );
                $('#ex2').append('<div class="px-6 py-4">' +
                    ' <div class="font-bold text-xl mb-2">' + results[i]["description"] + '</div>' +
                    ' <p class="text-gray-700 text-base">' + results[i]["details"] + ' </p>' +
                    ' </div>'
                );

                $('.modal-open').show();
                // This will render the modal with the extra information taken from the backend
                $('.modal-container').append('<div class="modal-close absolute top-0 right-0 cursor-pointer flex flex-col items-center mt-4 mr-4 text-white text-sm z-50">' +

                    '</div>' +

                    '<!-- Add margin if you want to see some of the overlay behind the modal-->' +
                    '<div class="modal-content py-4 text-left px-6">' +
                    '<!--Title-->' +
                    '<div class="flex justify-between items-center pb-3">' +
                    '<p class="text-2xl font-bold">' + results[i]["description"] + '</p>' +
                    '</div>' +

                    '<!--Body-->' +
                    '<p>' + results[i]["details"] + '</p>' +
                    '</div>');

            }

        }
        //Closing button for modal extra-info
        $('.modal-container').append('<button class="modal-close bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full">Close</button>')

        //Append Button bellow the table to trigger the Modal with the extra information

        //TODO use to close the modal if the modal logic is not working
        $('.modal-container').on("click", ".modal-close", function(e) { //user click on remove text links
            e.preventDefault();
            $(this).parent().parent().hide()

        });
        //This section takes care of opening the Modal on a button click (.modal-open)
        /*$('#table-main').on("click", ".modal-open", function (e) {
            e.preventDefault();
            var openmodal = document.querySelectorAll('.modal-open')
            for (var i = 0; i < openmodal.length; i++) {
                openmodal[i].addEventListener('click', function (event) {
                    event.preventDefault()
                    toggleModal()
                })
            }

            const overlay = document.querySelector('.modal-overlay')
            //overlay.addEventListener('click', toggleModal)

            var closemodal = document.querySelectorAll('.modal-close')
            for (var i = 0; i < closemodal.length; i++) {
                closemodal[i].addEventListener('click', toggleModal)
            }

            document.onkeydown = function (evt) {
                evt = evt || window.event
                var isEscape = false
                if ("key" in evt) {
                    isEscape = (evt.key === "Escape" || evt.key === "Esc")
                } else {
                    isEscape = (evt.keyCode === 27)
                }
                if (isEscape && document.body.classList.contains('modal-active')) {
                    toggleModal()
                }
            };


            function toggleModal() {
                const body = document.querySelector('body')
                const modal = document.querySelector('.modal')
                modal.classList.toggle('opacity-0')
                modal.classList.toggle('pointer-events-none')
                body.classList.toggle('modal-active')
            }
        });*/

    }

    //Gives results in the terminal view
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