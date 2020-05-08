$(document).ready(function () {
    let max_fields_limit = 4; //set limit for maximum input fields
    let counter = 1; //initialize counter for text box
    $('.add_more_button').click(function (e) { //click event on add more fields button having class add_more_button
        e.preventDefault();
        if (counter < max_fields_limit) { //check conditions
            counter++; //counter increment
            $('.input_fields_container_part').append('<div class="ns-group">' +
                '<a tabindex="-1" href="#" class="remove_field" style="float: right">&#10060;</a>' +
                '<input type="text" name="ns[]" class="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"/>' +
                '</div>'); //add input field
        } else {
            // Show Modal Logic
            $('#ex1').show()

            //Extract IP and display it in the modal
            $.get('https://www.cloudflare.com/cdn-cgi/trace', function (data) {
                let regexp = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/gi;
                let ip_address = data.match(regexp);
                document.getElementById('ip-egg').innerHTML = "We have your IP: " + ip_address
            });

            // Modal Structure
            $('#ex1').append('<divd role="document">' +
                '<div class="modal-content">' +
                '<div class="modal-header">' +
                '<h2 class="modal-title" id="exampleModalLabel" style="text-align: center">OppS!</h2>' +
                '</div>' +
                '<div class="modal-body justify-center">' +
                '<p id="ip-egg"></p>' +
                '<p>We have your Browser History</p>' +
                '<p>Say Hi to The FBI</p>' +
                '</div>' +
                '<div class="modal-footer">' +
                '<button tabindex="-1" class="remove_field_modal" style="float: right">&#10060;</button>' +
                '</div>' +
                '</div>');
        }
    });


    $('.input_fields_container_part').on("click", ".remove_field", function (e) { //user click on remove text links
        e.preventDefault();
        $(this).parent('div').remove();
        counter--;
    })
    $('#ex1').on("click", ".remove_field_modal", function (e) { //user click on remove text links
        e.preventDefault();
        $(this).parent().parent().parent().parent().remove()
        counter--;
    })

});

