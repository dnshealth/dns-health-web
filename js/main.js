// A helper function
function getFormData($form){
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function(n, i){
        // If key already exists, then make the key contain an array where we push the second element.
        // This will allow us to get arrays of nameservers in the ns[]
        if (indexed_array[n['name']] && !Array.isArray(indexed_array[n['name']]))
            indexed_array[n['name']] = [indexed_array[n['name']]];
        if (indexed_array[n['name']] && Array.isArray(indexed_array[n['name']]))
            indexed_array[n['name']].push(n['value']);
        else
            indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}

// This function will be called when the page has finished loading.
$(document).ready(function() {
    let checker = new DNSChecker(null);

    $("#dnscheck").submit(function(e) {
        e.preventDefault();
        var data = getFormData($(this));
        checker.start(data["domain"], data["ns[]"]);
    });
});

