$(document).ready(function() {
    let max_fields_limit      = 4; //set limit for maximum input fields
    let counter = 1; //initialize counter for text box
    $('.add_more_button').click(function(e){ //click event on add more fields button having class add_more_button
        e.preventDefault();
        if(counter < max_fields_limit){ //check conditions
            counter++; //counter increment
            $('.input_fields_container_part').append('<div>' +
                '<input type="text" name="tags" class="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"/>' +
                '<a href="#" class="remove_field" style="margin-left:10px;">Remove</a>' +
                '</div>'); //add input field
        }
    });
    $('.input_fields_container_part').on("click",".remove_field", function(e){ //user click on remove text links
        e.preventDefault(); $(this).parent('div').remove(); counter--;
    })
});
