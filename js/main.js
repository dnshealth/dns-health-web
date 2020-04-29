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
    ApiHandler.init();
    let checker = new DNSChecker(null);

    $("#dnscheck").submit(function(e) {
        e.preventDefault();
        var data = getFormData($(this));
        checker.start(data["domain"], data["ns[]"]);
    });
});

class ApiHandler {
    static apiUrl = "https://api.dnshealth.eu/v1";
    static token = false;

    constructor() {}

    static init() {
        if (!this.token) {
            // If we do not have a token, we need to call the token API...
            var resp = this.request(
                "GET",
                "/auth",
                null,
                function(data) {
                    if (data != null) {
                        ApiHandler.token = data.token;
                    }
                });
        }
    }

    static request(type, path, params, callback) {
        if (this.token)
            params["token"] = this.token;
        console.log(type);
        $.ajax({
            method: type,
            url: this.apiUrl + path,
            dataType: 'json',
            contentType: 'application/json',
            data: (params != null) ? JSON.stringify(params) : null,
            success: function (d) {
                // If request was successful, call the function given as an argument.
                callback(d);
            },
            error: function(d) {
                // If we got an error back, print error to developer console in browser..
                console.log("Error occurred during request");
                console.log(d);
            }
        })
    }
}