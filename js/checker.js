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
                    {delay: 10, type: 'input', typeDelay: 20, value: `dnshealth --domain ${domain} --ns ${ns}`}
                ]
            );

            var result = ApiHandler.request(
                "POST",
                "/check", {
                    "domain": domain,
                    "nameservers": ns,
                    "delegation": $('input#delegated-domain').is(':checked')
                },
                function (result) {
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
                function (result) {

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
                    '<td class="border px-4 py-2" style="background: red">FAILED</td>' +
                    '</tr>'
                );
                $('#ex2').append('<div class="px-6 py-4">' +
                    ' <div class="font-bold text-xl mb-2">' + results[i]["description"] + '</div>' +
                    ' <p class="text-gray-700 text-base">' + results[i]["details"] + ' </p>' +
                    ' </div>'
                );

                $('.modal-container').append('\t\t<div class="modal-close absolute top-0 right-0 cursor-pointer flex flex-col items-center mt-4 mr-4 text-white text-sm z-50">' +
                    '<svg class="fill-current text-white" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">' +
                    '<path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>' +
                    '</svg>' +
                    '<span class="text-sm">(Esc)</span>' +
                    '</div>' +

                    '<!-- Add margin if you want to see some of the overlay behind the modal-->' +
                    '<div class="modal-content py-4 text-left px-6">' +
                    '<!--Title-->' +
                    '<div class="flex justify-between items-center pb-3">' +
                    '<p class="text-2xl font-bold">' + results[i]["description"] + '</p>' +
                    '<div class="modal-close cursor-pointer z-50">' +
                    '<svg class="fill-current text-black" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">' +

                    '</svg>' +
                    '</div>' +
                    '</div>' +

                    '<!--Body-->' +
                    '<p>' + results[i]["details"] + '</p>' +

                    '<!--Footer-->' +
                    '<div class="footer-modal-close flex justify-end pt-2">' +
                    '</div>' +
                    '</div>');
            }
        }
        $('#table-main').append('<button class="modal-open bg-transparent border border-gray-500 hover:border-indigo-500 text-gray-500 hover:text-indigo-500 font-bold py-2 px-4 rounded-full">Open Modal </button>')

        $('#ex2').on("click", ".remove_field_modal2", function (e) { //user click on remove text links
            e.preventDefault();
            $(this).parent().parent().hide()

        });
        $('#table-main').on("click", ".modal-open", function (e) {
            e.preventDefault();
            var openmodal = document.querySelectorAll('.modal-open')
            for (var i = 0; i < openmodal.length; i++) {
                openmodal[i].addEventListener('click', function (event) {
                    event.preventDefault()
                    toggleModal()
                })
            }

            const overlay = document.querySelector('.modal-overlay')
            overlay.addEventListener('click', toggleModal)

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
