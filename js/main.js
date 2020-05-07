// A helper function
function getFormData($form) {
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function (n, i) {
        // If the value is empty, do not add it to our indexed array. This will prevent us from adding e.g.
        // empty nameserver fields.
        if (!n['value'])
            return
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
$(document).ready(function () {
    // Make the menu toggle button work
    $('.show-hide').click(function () {
        $(this).next().toggleClass('hidden');
    });

    // Initialise our api handler to the REST API
    ApiHandler.apiUrl =  "https://api.dnshealth.eu/v1";
    ApiHandler.token = false;
    ApiHandler.captcha = false;
    ApiHandler.init();

    let checker = new DNSChecker(null);

    $("#dnscheck").submit(function (e) {
        e.preventDefault();
        const data = getFormData($(this));

        ApiHandler.captcha = data["g-recaptcha-response"];
        grecaptcha.reset();
        // If we only have one nameserver, we still want it to have in an array for the backend
        if (!Array.isArray(data["ns[]"])) {
            data["ns[]"] = [data["ns[]"]];
        }

        checker.start(data["domain"], data["ns[]"]);
    });

    // A hook on the "delegated domain" checkbox to make it hide the NS fields if checked.
    $("#delegated-domain").change(function () {
        if (this.checked) {
            $(".ns-group").hide();
        } else {
            $(".ns-group").show();
        }
    });
});

class ApiHandler {

    constructor() {}

    static init() {
        if (!this.token) {
            // If we do not have a token, we need to call the token API...
            var resp = this.request(
                "GET",
                "/auth",
                null,
                function (data) {
                    if (data != null) {
                        ApiHandler.token = data.token;
                    }
                });
        }

    }

    static request(type, path, params, callback) {
        if (this.token)
            params["token"] = this.token;
        if (this.captcha)
            params["recaptcha_response"] = this.captcha;

        $.ajax({
            method: type,
            url: this.apiUrl + path,
            dataType: 'json',
            contentType: 'application/json',
            data: (params != null) ? JSON.stringify(params) : null,
            success: function (d) {
                $("#error-block").hide();
                // If request was successful, call the function given as an argument.
                callback(d);
            },
            error: function (d) {
                // If we got an error back, print error to developer console in browser..
                console.log("Error occurred during request");
                console.log(d.responseJSON);
                // Also, print response code and a detailed message to the browser.
                $("#error-code").html(d.status);
                if (d.responseJSON.errorDesc) {
                    $("#error-message").html(d.responseJSON.errorDesc);
                } else if (d.responseJSON.detail) {
                    $("#error-message").html(d.responseJSON.detail);
                }
                $("#error-block").show();
            }
        })
    }
}
