$(document).ready(function() {
    let max_fields_limit = 4; //set limit for maximum input fields
    let counter = 1; //initialize counter for text box
    $('.add_more_button').click(function(e) { //click event on add more fields button having class add_more_button
        e.preventDefault();
        if (counter < max_fields_limit) { //check conditions
            counter++; //counter increment
            $('.input_fields_container_part').append('<div class="ns-group">' +
                '<a tabindex="-1" href="#" class="remove_field" style="float: right">&#10060;</a>' +
                '<input type="text" name="ns[]" class="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"/>' +
                '</div>'); //add input field
        } else {
            // Show Modal Logic


            //Extract IP and display it in the modal
            $.get('https://www.cloudflare.com/cdn-cgi/trace', function(data) {
                let regexp = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/gi;
                let ip_address = data.match(regexp);
                console.log(data)
                document.getElementById('ip-egg').innerHTML = "We have your IP: " + ip_address
            });
            // Shows the DON'T CLICK button (this button will toggle the easter egg modal
            $('.modal-open-egg').show();
            // Easter Egg Modal body
            $('.modal-container-egg').append('<div class="modal-close-egg absolute top-0 right-0 cursor-pointer flex flex-col items-center mt-4 mr-4 text-white text-sm z-50">' +
                '</div>' +
                '<!-- Add margin if you want to see some of the overlay behind the modal-->' +
                '<div class="modal-content-egg py-4 text-left px-6">' +
                '<!--Title-->' +
                '<div class="flex justify-between items-center pb-3">' +
                '<p class="text-2xl font-bold">OppS</p>' +
                '</div>' +
                '<!--Body-->' +
                '<p id="ip-egg"></p>' +
                '<p>We have your Browser History</p>' +
                '<p>Say Hi to The FBI</p>' +
                '<button tabindex="-1" class="modal-close-egg" style="float: right">&#10060;</button>' +
                '</div>'

            );
        }
    });

    // Removes the extra input fields that are added and changes the counter
    $('.input_fields_container_part').on("click", ".remove_field", function(e) { //user click on remove text links
        e.preventDefault();
        $(this).parent('div').remove();
        counter--;
    })
    // Closes the Easter Egg Modal
    $('.modal-container-egg').on("click", ".modal-close-egg", function(e) { //user click on remove text links

        e.preventDefault();
        let closemodalEgg = document.querySelectorAll('.modal-close-egg')
        for (var i = 0; i < closemodalEgg.length; i++) {
            closemodalEgg[i].addEventListener('click', toggleModalEgg)
        }

        document.onkeydown = function(evt) {
            evt = evt || window.event
            let isEscape = false
            if ("key" in evt) {
                isEscape = (evt.key === "Escape" || evt.key === "Esc")
            } else {
                isEscape = (evt.keyCode === 27)
            }
            if (isEscape && document.body.classList.contains('.modal-active-egg')) {
                toggleModalEgg()
            }
        };


    });

});
